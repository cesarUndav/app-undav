import { infoBaseUsuarioActual } from '@/data/DatosUsuarioGuarani';
import React, { useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';

const delayMs = 600;
const IdCampoUsername = "usuario";
const IdCampoPassword = "password";

export default function LoginWebView() {
  const webViewRef = useRef<WebViewType>(null);
  const [hasInjected, setHasInjected] = useState(false);

  console.log("CREDENCIALES AUTO LOGIN:",infoBaseUsuarioActual.usuario.toString(),"/",infoBaseUsuarioActual.password);

  const injectCredentials = `
    (function() {
      const user = document.getElementById('${IdCampoUsername}');
      const pass = document.getElementById('${IdCampoPassword}');
      if (user && pass) {
        user.value = '${infoBaseUsuarioActual.usuario}';
        pass.value = '${infoBaseUsuarioActual.password}';
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
      }, delayMs); // espera antes de inyectar
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
