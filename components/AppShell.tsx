// components/AppShell.tsx
// Componente visual del layout principal. Muestra u oculta el header y la barra inferior según la ruta actual y el tipo de usuario.

import React from 'react';
import { usePathname } from 'expo-router';

import HistoryHeader, { PathToTitle } from '@/components/NavigationHistoryHeader';
import BottomBar from '@/components/BottomBar';
import { esRutaSinHeader, esRutaSinBottomBar } from '@/constants/routeConfig';

type AppShellProps = {
  children: React.ReactNode;
  esVisitante: boolean;
};

export default function AppShell({ children, esVisitante }: AppShellProps) {
  const pathName = usePathname();

  const headerHistoryTitle = PathToTitle(pathName);
  const showHeader = !esRutaSinHeader(pathName);
  const showBottomBar = !esRutaSinBottomBar(pathName);

  return (
    <>
      {showHeader && <HistoryHeader title={headerHistoryTitle} />}

      {children}

      {showBottomBar && !esVisitante && <BottomBar />}
    </>
  );
}