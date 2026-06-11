// hooks/useNotificationPolling.ts
// Hook global para sincronizar notificaciones. Consulta periódicamente el servidor mientras hay un estudiante autenticado.

import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { usePathname, useRouter } from 'expo-router';

import {
  cargarNoticias,
  todasLasNotificaciones,
  setNotificationCount,
} from '@/data/notificaciones';

const TIEMPO_POLLING_NOTIFICACIONES = 120000;

type UseNotificationPollingParams = {
  sesionVerificada: boolean;
  esVisitante: boolean;
  usuarioAutenticado: boolean;
};

export default function useNotificationPolling({
  sesionVerificada,
  esVisitante,
  usuarioAutenticado,
}: UseNotificationPollingParams) {
  const pathName = usePathname();
  const router = useRouter();

  const refCantidadPrevia = useRef<number>(-1);

  // Variable de control externa al ciclo de renderizado para evitar parpadeos.
  const refControlLectura = useRef<{ leido: boolean; cantidadAlLeer: number }>({
    leido: false,
    cantidadAlLeer: 0,
  });

  useEffect(() => {
    if (!sesionVerificada || esVisitante || !usuarioAutenticado) {
      refCantidadPrevia.current = -1;
      refControlLectura.current = { leido: false, cantidadAlLeer: 0 };
      return;
    }

    const ejecutarSincronizacion = async () => {
      try {
        console.log('🔄 [Polling] Consultando novedades en el servidor Flask...');

        // 1. Descargamos la realidad actual del servidor.
        const noticiasServidor = await cargarNoticias();
        const cantidadServidor = noticiasServidor.length;

        // 2. Si está en la pantalla de notificaciones, asimilamos la lectura y matamos globos.
        if (pathName === '/notificaciones') {
          refCantidadPrevia.current = cantidadServidor;
          refControlLectura.current = { leido: true, cantidadAlLeer: cantidadServidor };
          setNotificationCount(0);
          return;
        }

        /**
         * Detección de borrados:
         * Si el servidor tiene menos o igual cantidad de notas que antes,
         * pero el usuario no entró a leer, significa que se limpió o sincronizó el backend.
         */
        if (refCantidadPrevia.current !== -1 && cantidadServidor <= refCantidadPrevia.current) {
          console.log(
            `🧹 [Polling] Se detectó limpieza o consistencia en el servidor (${cantidadServidor}). Actualizando referencias.`
          );

          refCantidadPrevia.current = cantidadServidor;

          if (
            refControlLectura.current.leido &&
            cantidadServidor <= refControlLectura.current.cantidadAlLeer
          ) {
            setNotificationCount(0);
            refControlLectura.current.cantidadAlLeer = cantidadServidor;
          }

          return;
        }

        // 3. Carga inicial completa.
        if (refCantidadPrevia.current === -1) {
          refCantidadPrevia.current = cantidadServidor;

          if (cantidadServidor > 0 && !refControlLectura.current.leido) {
            setNotificationCount(cantidadServidor);

            setTimeout(() => {
              const listaTotal = todasLasNotificaciones();
              const ultimaNoticia = listaTotal[0];

              Alert.alert(
                '🔔 Notificaciones Pendientes',
                `${ultimaNoticia && ultimaNoticia.titulo ? ultimaNoticia.titulo : 'Tienes novedades en tu cartelera.'}\n\nHay ${cantidadServidor} avisos académicos esperando tu lectura.`,
                [
                  { text: 'Ignorar', style: 'cancel' },
                  { text: 'Ver', onPress: () => router.push('/notificaciones') },
                ]
              );
            }, 500);
          }

          return;
        }

        // 4. Control antifantasma después de lectura.
        if (refControlLectura.current.leido) {
          if (cantidadServidor > refControlLectura.current.cantidadAlLeer) {
            const nuevasReales = cantidadServidor - refControlLectura.current.cantidadAlLeer;
            setNotificationCount(nuevasReales);
          } else {
            setNotificationCount(0);
          }

          refCantidadPrevia.current = cantidadServidor;
          return;
        }

        // 5. Nuevas publicaciones en tiempo real.
        if (cantidadServidor > refCantidadPrevia.current) {
          const diferencia = cantidadServidor - refCantidadPrevia.current;
          setNotificationCount(diferencia);

          setTimeout(() => {
            const listaTotal = todasLasNotificaciones();
            const ultimaNoticia = listaTotal[0];

            Alert.alert(
              '🔔 Nueva Notificación',
              `${ultimaNoticia && ultimaNoticia.titulo ? ultimaNoticia.titulo : 'Se ha publicado un nuevo aviso.'}\n\nTienes novedades académicas pendientes de revisión.`,
              [
                { text: 'Ignorar', style: 'cancel' },
                { text: 'Ver', onPress: () => router.push('/notificaciones') },
              ]
            );
          }, 300);
        }

        refCantidadPrevia.current = cantidadServidor;
      } catch (e) {
        console.error('❌ [Polling] Error en el ciclo:', e);
      }
    };

    if (pathName === '/notificaciones') {
      ejecutarSincronizacion();
    }

    const timeoutInicial = setTimeout(ejecutarSincronizacion, 1000);
    const idIntervalo = setInterval(ejecutarSincronizacion, TIEMPO_POLLING_NOTIFICACIONES);

    return () => {
      clearTimeout(timeoutInicial);
      clearInterval(idIntervalo);
    };
  }, [sesionVerificada, esVisitante, usuarioAutenticado, pathName, router]);
}