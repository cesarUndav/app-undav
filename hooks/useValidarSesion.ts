//hooks/useValidarSesion.ts

import { useState, useEffect } from 'react';
// 🔄 CAMBIADO: Reemplazamos AsyncStorage por SecureStore
import * as SecureStore from 'expo-secure-store'; 

export function useValidarSesion() {
  const [estaCargandoSesion, setEstaCargandoSesion] = useState(true);
  const [tieneSesion, setTieneSesion] = useState(false);

  useEffect(() => {
    const chequearToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        // Si el token existe y no está vacío, la sesión es válida
        setTieneSesion(!!token); 
      } catch (error) {
        console.error("Error al validar el token en el hook (SecureStore):", error);
        setTieneSesion(false);
      } finally {
        setEstaCargandoSesion(false);
      }
    };

    chequearToken();
  }, []);

  return { tieneSesion, estaCargandoSesion };
}