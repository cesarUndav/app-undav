import { infoBaseUsuarioActual } from "@/data/DatosUsuarioGuarani";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { WebView } from "react-native-webview";
import type { WebView as WebViewType } from "react-native-webview";

const delayMs = 500;
const IdCampoUsername = "username";
const IdCampoPassword = "password";

export default function LoginWebView() {
  const webViewRef = useRef<WebViewType>(null);
  const [hasInjected, setHasInjected] = useState(false);
  const [credentials, setCredentials] = useState({ user: "", pass: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loadCredentials = async () => {
      const user = (await AsyncStorage.getItem("campusUser")) || "";
      const pass = (await AsyncStorage.getItem("campusPass")) || "";
      setCredentials({ user, pass });

      // También podemos chequear si ya estaba logueado
      const logged = (await AsyncStorage.getItem("campusIsLoggedIn")) === "true";
      setIsLoggedIn(logged);
    };

    loadCredentials();
  }, []);

  const handleLoadEnd = () => {
    if (!hasInjected && credentials.user && credentials.pass) {
      setHasInjected(true);

      const jsToInject = `
        (function() {
          const user = document.getElementById('${IdCampoUsername}');
          const pass = document.getElementById('${IdCampoPassword}');
          if (user && pass) {
            user.value = '${credentials.user}';
            pass.value = '${credentials.pass}';
            document.forms[0].submit();
          }
        })();
        true;
      `;

      setTimeout(() => {
        webViewRef.current?.injectJavaScript(jsToInject);
      }, delayMs);
    }
  };

  // Detecta cambios en la navegación para verificar si el login fue exitoso
  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    // en base a donde nos redirija el sitio:
    if (!url.includes("/login/") && !isLoggedIn) {
      setIsLoggedIn(true);
      AsyncStorage.setItem("campusIsLoggedIn", "true");
      // opcional, redirijo a Mis Aulas
      webViewRef.current?.injectJavaScript(`window.location.href = "https://ead.undav.edu.ar/my/"; true;`);
    }
  };

  return (
    <WebView
      source={{ uri: "https://ead.undav.edu.ar/login/index.php" }}
      ref={webViewRef}
      javaScriptEnabled
      domStorageEnabled
      onLoadEnd={handleLoadEnd}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
}
