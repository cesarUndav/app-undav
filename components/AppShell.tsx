// components/AppShell.tsx
// Componente visual del layout principal. Muestra u oculta el header y la barra inferior según la ruta actual y el tipo de usuario.

import React from 'react';
import { usePathname } from 'expo-router';

import HistoryHeader, { PathToTitle } from '@/components/NavigationHistoryHeader';
import BottomBar from '@/components/BottomBar';
import { esRutaSinHeader, esRutaSinBottomBar } from '@/constants/routeConfig';
// 🔄 ADICIONADO: Importamos la variable global real de la API
import { visitante as visitanteGlobal } from '@/data/apiAppUndav'; 

type AppShellProps = {
  children: React.ReactNode;
  esVisitante: boolean; // La mantenemos por compatibilidad de tipo si se requiere externa
};

export default function AppShell({ children, esVisitante }: AppShellProps) {
  const pathName = usePathname();

  const headerHistoryTitle = PathToTitle(pathName);
  const showHeader = !esRutaSinHeader(pathName);
  const showBottomBar = !esRutaSinBottomBar(pathName);

  // 🎯 SOLUCCIÓN: Usamos una evaluación combinada. 
  // Si la propiedad local dice que no es visitante, O la variable global de la API (ya hidratada síncronamente) 
  // confirma que no es visitante, entonces asumimos que es un alumno logueado.
  const elUsuarioEstaLogueado = !esVisitante || !visitanteGlobal;

  return (
    <>
      {showHeader && <HistoryHeader title={headerHistoryTitle} />}

      {children}

      {/* 🔄 CAMBIADO: Ahora la condición es sólida y no depende del retraso del useEffect del layout */}
      {showBottomBar && elUsuarioEstaLogueado && <BottomBar />}
    </>
  );
}