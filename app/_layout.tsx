import { Stack, Slot } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
console.log("layout - Métodos disponibles en SecureStore:", SecureStore);


import { useRouter } from "expo-router";
import React from "react";

export default function Layout() {

  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {

    const checkAuth = async () => {
      try {
        console.log("Iniciando checkAuth...");
        console.log("SecureStore antes de obtener token:", SecureStore);
        console.log("¿getItemAsync existe?", typeof SecureStore.getItemAsync === "function");
        const token = await SecureStore.getItemAsync("sessionToken");
        console.log("Token recuperado:", token);
        
        try {
          const testToken = await SecureStore.getItemAsync("sessionToken");
          console.log("Prueba manual - Token recuperado:", testToken);
        } catch (testError) {
          console.error("Prueba manual - Error al recuperar el token:", testError);
        }
        
        
        // Verificar si SecureStore está disponible
        if (!SecureStore.getItemAsync) {
          throw new Error("SecureStore.getItemAsync no está disponible");
        }
    
    
        if (token) {
          router.replace("/");
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error en checkAuth:", error);
      } finally {
        setIsReady(true);
      }
    };
    

    checkAuth();
  }, []);

  if (!isReady) {
    return null; // 🔴 Evita renderizar si aún no está listo
  }

  return (
    <Stack>
      <Slot /> {/* 🔥 Asegúrate de que esto está presente */}
    </Stack>
  );
}

