import React, { useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';

const username = "43877860";
const password = "abc123";

const IdCampoUsername = "usuario";
const IdCampoPassword = "password";

export default function LoginWebView() {
  const webViewRef = useRef<WebViewType>(null);
  const [hasInjected, setHasInjected] = useState(false);

  const injectCredentials = `
    (function() {
      const user = document.getElementById('${IdCampoUsername}');
      const pass = document.getElementById('${IdCampoPassword}');
      if (user && pass) {
        user.value = '${username}';
        pass.value = '${password}';
        document.forms[0].submit();
      }
    })();
    true;
  `;

  const handleLoadEnd = () => {
    if (!hasInjected) {
      setHasInjected(true);
      setTimeout(() => {
        webViewRef.current?.injectJavaScript(injectCredentials);
      }, 1000); // espera 1 segundo antes de inyectar
    }
  };

  return (
    <WebView
      //source={{ uri: 'http://172.16.1.43/g3w/acceso' }}
      source={{ uri: 'https://academica.undav.edu.ar/g3w/inicio_alumno' }}
      ref={webViewRef}
      javaScriptEnabled
      domStorageEnabled
      onLoadEnd={handleLoadEnd}
    />
  );
}
