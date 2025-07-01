import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';


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
    const [hasInjected, setHasInjected] = useState(false);

    const injectCredentials = `
    (function() {
      const user = document.getElementById('${idUsername}');
      const pass = document.getElementById('${idPassword}');
      if (user && ${username}) {
        user.value = '${username}';
      }
        if (pass && ${password}) {
        user.value = '${password}';
      }
        document.forms[0].submit();
    })();
    true;
  `;

    const handleLoadEnd = () => {
        if (!hasInjected) {
        setHasInjected(true);
        setTimeout(() => {
          if (tryLogin) webViewRef.current?.injectJavaScript(injectCredentials);
        }, 800); // espera X milisegundos antes de inyectar
        }
    };
    

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        ref={webViewRef}
        javaScriptEnabled
        domStorageEnabled
        onLoadEnd={handleLoadEnd}
      />
    </SafeAreaView>
  );
}
