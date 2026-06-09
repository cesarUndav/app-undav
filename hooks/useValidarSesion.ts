import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useValidarSesion() {
  const [estaCargandoSesion, setEstaCargandoSesion] = useState(true);
  const [tieneSesion, setTieneSesion] = useState(false);

  useEffect(() => {
    const chequearToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        // Si el token existe y no está vacío, la sesión es válida
        setTieneSesion(!!token); 
      } catch (error) {
        console.error("Error al validar el token en el hook:", error);
        setTieneSesion(false);
      } finally {
        setEstaCargandoSesion(false);
      }
    };

    chequearToken();
  }, []);

  return { tieneSesion, estaCargandoSesion };
}