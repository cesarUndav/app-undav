import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';
import CustomText from './CustomText';

const delayMs = 1200; // Aumentamos un poco el delay para dar tiempo al bypass de SSL

type Props = {
  url: string;
  tryLogin?: boolean;
  idUsername: string;
  idPassword: string;
  username: string;
  password: string;
};

export default function AutoLoginWebView({ url, tryLogin = false, idUsername, idPassword, username, password }: Props) {
    const webViewRef = useRef<WebViewType>(null);
    const hasInjectedRef = useRef(false);
    const isInjecting = useRef(false); // Guard para evitar bucles de inyección

    const injectCredentials = `
      (function() {
        console.log("Inyectando credenciales...");
        const user = document.getElementById('${idUsername}') || document.querySelector('input[name="usuario"]');
        const pass = document.getElementById('${idPassword}') || document.querySelector('input[name="password"]');
        
        if (user && pass) {
          user.value = ${JSON.stringify(username)};
          pass.value = ${JSON.stringify(password)};
          const form = user.closest('form') || document.forms[0];
          if (form) {
            console.log("Formulario encontrado, enviando...");
            form.submit();
          }
        }
      })();
      true;
    `;

    const handleLoadEnd = (syntheticEvent: any) => {
        const { nativeEvent } = syntheticEvent;
        console.log(`[WebView] Carga finalizada en: ${nativeEvent.url}`);
        
        if (tryLogin && !hasInjectedRef.current && !isInjecting.current) {
            isInjecting.current = true;
            console.log(`[WebView] Programando inyección...`);
            setTimeout(() => {
                webViewRef.current?.injectJavaScript(injectCredentials);
                hasInjectedRef.current = true; 
                isInjecting.current = false;
            }, delayMs);
        }
    };

    const WebViewAndroid = WebView as any;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebViewAndroid
        source={{ uri: url }}
        ref={webViewRef}
        
        onReceivedSslError={(syntheticEvent: any) => {
          const { nativeEvent } = syntheticEvent;
          console.warn(`[SSL Bypass] Ejecutando proceed en: ${nativeEvent.url}`);
          if (nativeEvent.handler && typeof nativeEvent.handler.proceed === 'function') {
            nativeEvent.handler.proceed();
          }
        }}

        // 1. SILENCIAMOS EL ERROR EN CONSOLA SI ES SSL
        onError={(syntheticEvent: any) => {
          const { nativeEvent } = syntheticEvent;
          if (nativeEvent.code === 3 || nativeEvent.description?.includes('SSL')) {
            console.log("[WebView] Error de SSL interceptado. Esperando bypass...");
            return;
          }
          console.error(`[Error Real] ${nativeEvent.description}`);
        }}

        // 2. EL TRUCO FINAL: EVITAR QUE LA LIBRERÍA DIBUJE LA PANTALLA DE ERROR
        // Si el código es 3 (SSL), devolvemos null para que no tape el contenido
        renderError={(errorName: string, errorCode: number, errorDesc: string) => {
          if (errorCode === 3 || errorDesc.includes('SSL')) {
            // Devolvemos un View vacío para que la WebView siga intentando cargar detrás
            return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} />;
          }
          // Para otros errores (como sin internet), podés mostrar algo:
          return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <CustomText>Error de conexión: {errorDesc}</CustomText>
            </SafeAreaView>
          );
        }}

        mixedContentMode="always" 
        incognito={false} 
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        onLoadEnd={handleLoadEnd}
        startInLoadingState={true}
      />
    </SafeAreaView>
  );
}