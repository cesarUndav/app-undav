// hooks/useBloquearBotonAtras.ts
import { useEffect } from "react";
import { BackHandler } from "react-native";

export function useBloquearBotonAtras(bloquear: boolean = true) {
  useEffect(() => {
    if (!bloquear) return;

    const handler = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => handler.remove();
  }, [bloquear]);
}
