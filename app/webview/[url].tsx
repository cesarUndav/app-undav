// app/webview/[url].tsx

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AutoLoginWebView from '@/components/WebViewAutoLogin';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; // 🔄 ADICIONADO
import { azulMedioUndav } from '@/constants/Colors';

export default function WebViewScreen() {
  const { url, tryLogin } = useLocalSearchParams();

  // 🎯 Estados locales para recuperar las credenciales encriptadas
  const [credenciales, setCredenciales] = useState<{ user: string; pass: string } | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const recuperarCredenciales = async () => {
      // Solo nos gastamos en leer SecureStore si el parámetro tryLogin viene en 'true'
      if (tryLogin === 'true') {
        try {
          const user = await SecureStore.getItemAsync('username') || '';
          const pass = await SecureStore.getItemAsync('password') || '';
          setCredenciales({ user, pass });
        } catch (error) {
          console.error("❌ Error recuperando credenciales en WebViewScreen:", error);
        } finally {
          setCargando(false);
        }
      } else {
        setCargando(false);
      }
    };

    recuperarCredenciales();
  }, [tryLogin]);

  // Pantalla de carga mientras se lee el almacenamiento encriptado del sistema operativo
  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color={azulMedioUndav} />
      </View>
    );
  }

  return (
    <AutoLoginWebView
      url={decodeURIComponent(url as string)}
      tryLogin={tryLogin === 'true'}
      idUsername={'usuario'}
      idPassword={'password'}
      // 🔄 CAMBIADO: Ahora le pasamos las credenciales seguras recuperadas localmente
      username={credenciales?.user || ''}
      password={credenciales?.pass || ''}    
    />
  );
}