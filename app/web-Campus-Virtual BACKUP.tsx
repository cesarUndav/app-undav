import React from 'react';
import { WebView } from 'react-native-webview';
export default function LoginWebView() {
  
  return (
    <WebView
      source={{ uri: 'https://ead.undav.edu.ar/login/index.php' }}
      javaScriptEnabled
      domStorageEnabled
    />
  );
}
