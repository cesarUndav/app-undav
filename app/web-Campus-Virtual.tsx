import React, { useEffect, useRef, useState } from "react";
import { WebView } from "react-native-webview";
import type { WebView as WebViewType } from "react-native-webview";
import * as SecureStore from 'expo-secure-store';

const delayMs = 200;
const IdCampoUsername = "username";
const IdCampoPassword = "password";

export default function LoginWebView() {
  const webViewRef = useRef<WebViewType>(null);
  const [hasInjected, setHasInjected] = useState(false);
  const [credentials, setCredentials] = useState({ user: "", pass: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const user = (await SecureStore.getItemAsync("campusUser")) || "";
        const pass = (await SecureStore.getItemAsync("campusPass")) || "";
        setCredentials({ user, pass });
      } catch (e) {
        console.error("Error cargando llaves seguras", e);
      }
    };

    loadCredentials();
  }, []);

  const handleLoadEnd = () => {
    // Nos aseguramos de tener las credenciales cargadas desde el almacenamiento seguro antes de actuar
    if (!hasInjected && credentials.user && credentials.pass) {
      setHasInjected(true);

      const jsToInject = `
        (function() {
          const userField = document.getElementById('${IdCampoUsername}');
          const passField = document.getElementById('${IdCampoPassword}');
          
          // 📝 ESCENARIO A: Si existen los campos, completamos el formulario normal
          if (userField && passField) {
            userField.value = '${credentials.user}';
            passField.value = '${credentials.pass}';
            const form = document.querySelector('form') || document.forms[0];
            if (form) form.submit();
            return;
          }

          // 🔐 ESCENARIO B: Ya hay sesión (Aviso: "Actualmente ha iniciado sesión como...")
          // Intentamos cazar el botón Cancelar nativo de Moodle por estructura o texto
          let btnCancelar = document.querySelector('a[href*="cancel=1"]') || 
                            document.querySelector('.singlebutton form input[type="submit"]');

          if (!btnCancelar) {
            // Intento por descarte buscando la palabra exacta en elementos interactivos
            btnCancelar = Array.from(document.querySelectorAll('a, input, button')).find(el => {
              const texto = el.textContent || el.value || '';
              return texto.toLowerCase().includes('cancelar');
            });
          }

          // Si encontramos el botón físico de cancelar, lo clickeamos de inmediato
          if (btnCancelar) {
            btnCancelar.click();
          } else {
            // Salvavidas: si Moodle cambió drásticamente el HTML, redirigimos por código al Home
            window.location.href = "https://ead.undav.edu.ar/my/";
          }
        })();
        true;
      `;

      setTimeout(() => {
        webViewRef.current?.injectJavaScript(jsToInject);
      }, delayMs);
    }
  };

  // Detecta cambios en la navegación para verificar si el login fue exitoso o ya existía
  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    
    // Si la URL no incluye "/login/" y pertenece a la UNDAV, estamos en zona segura de alumnos
    if (!url.includes("/login/") && url.includes("ead.undav.edu.ar") && !isLoggedIn) {
      setIsLoggedIn(true);
      SecureStore.setItemAsync("campusIsLoggedIn", "true").catch(err => 
        console.error("Error guardando estado de sesión", err)
      );
      
      // Aseguramos redirección directa hacia "Mis Aulas" (el home de materias)
      webViewRef.current?.injectJavaScript(`window.location.href = "https://ead.undav.edu.ar/my/"; true;`);
    }
  };

  return (
    <WebView
      source={{ uri: "https://ead.undav.edu.ar/login/index.php" }}
      ref={webViewRef}
      javaScriptEnabled
      domStorageEnabled // Obligatorio para guardar las cookies de sesión que evitan volver a pedir login
      onLoadEnd={handleLoadEnd}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
}