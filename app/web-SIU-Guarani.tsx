import React, { useRef, useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';
import * as SecureStore from 'expo-secure-store'; // 🔄 ADICIONADO
import { azulMedioUndav } from '@/constants/Colors';

const delayMs = 600;
const IdCampoUsername = "usuario";
const IdCampoPassword = "password";

export default function LoginWebView() {
  const webViewRef = useRef<WebViewType>(null);
  const [hasInjected, setHasInjected] = useState(false);
  
  // 🎯 Estados locales para aislar las credenciales en este componente
  const [credenciales, setCredenciales] = useState<{ user: string; pass: string } | null>(null);
  const [cargandoCredenciales, setCargandoCredenciales] = useState(true);

  // 🔒 Cargamos las credenciales desde el almacenamiento encriptado al montar el componente
  useEffect(() => {
    const cargarCredencialesSeguras = async () => {
      try {
        const user = await SecureStore.getItemAsync('username') || '';
        const pass = await SecureStore.getItemAsync('password') || '';
        setCredenciales({ user, pass });
      } catch (error) {
        console.error("❌ Error al leer credenciales para el WebView:", error);
      } finally {
        setCargandoCredenciales(false);
      }
    };

    cargarCredencialesSeguras();
  }, []);

  const handleLoadEnd = () => {
    // Si no han cargado las credenciales o ya se inyectaron, no hacemos nada
    if (cargandoCredenciales || !credenciales || hasInjected) return;

    // Código JavaScript dinámico utilizando el estado seguro local
    const injectCredentials = `
      (function() {
        const user = document.getElementById('${IdCampoUsername}');
        const pass = document.getElementById('${IdCampoPassword}');
        if (user && pass) {
          user.value = '${credenciales.user}';
          pass.value = '${credenciales.pass}';
          
          // Desencadena eventos nativos de input por si la web usa frameworks modernos
          user.dispatchEvent(new Event('input', { bubbles: true }));
          pass.dispatchEvent(new Event('input', { bubbles: true }));

          // Enviar el formulario
          const form = document.forms[0];
          if (form) form.submit();
        }
      })();
      true;
    `;

    setHasInjected(true);
    setTimeout(() => {
      webViewRef.current?.injectJavaScript(injectCredentials);
    }, delayMs);
  };

  // Spinner de protección mientras lee del llavero seguro nativo
  if (cargandoCredenciales) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color={azulMedioUndav} />
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: 'https://academica.undav.edu.ar/g3w/inicio_alumno' }}
      ref={webViewRef}
      javaScriptEnabled
      domStorageEnabled
      onLoadEnd={handleLoadEnd}
    />
  );
}