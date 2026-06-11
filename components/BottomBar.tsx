import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { azulClaro, grisBorde } from '@/constants/Colors';
import CustomText from './CustomText';
import { useNotificacionesGlobales, setNotificationCount } from '@/data/notificaciones';
import { getShadowStyle } from '@/constants/ShadowStyle';

const routes = ['/home-estudiante', '/planos', '/notificaciones', '/accesos-directos', '/perfil'] as const;
type Route = (typeof routes)[number];

interface BotonBarra {
  route: Route;
  iconPath?: any;
  ioniconName?: React.ComponentProps<typeof Ionicons>['name'];
}

export const tamanioIcono = 50;
export const opacidadSeleccionado = 1;
export const colorSeleccionado = azulClaro;
const colorIcono = '#999';

export default function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();
  
  // 🔔 CONSUMO DEL HOOK REACTIVO GLOBAL
  const { count } = useNotificacionesGlobales();

  const buttons: BotonBarra[] = [
    { route: '/home-estudiante', iconPath: require('../assets/icons/ico-svg/inicio.svg') },
    { route: '/planos', iconPath: require('../assets/icons/ico-svg/sedes.svg') },
    { route: '/notificaciones', iconPath: require('../assets/icons/notifications.svg') },
    { route: '/accesos-directos', iconPath: require('../assets/icons/ico-svg/enlaces.svg') },
    { route: '/perfil', iconPath: require('../assets/icons/person.svg') },
  ];

  const renderizarIcono = (btn: BotonBarra, color: string) => {
    if (btn.iconPath) {
      const ComponenteSVG = btn.iconPath.default || btn.iconPath;
      if (typeof ComponenteSVG === 'function' || typeof ComponenteSVG === 'object') {
        return <ComponenteSVG width={tamanioIcono} height={tamanioIcono} fill={color} />;
      }
    }
    return <Ionicons name={btn.ioniconName || 'alert-circle-outline'} size={tamanioIcono - 20} color={color} />;
  };

  return (
    <View style={bottomBarStyles.container}>
      {buttons.map((btn) => {
        const estaEnEstaRuta = pathname === btn.route;
        const iconColor = estaEnEstaRuta ? colorSeleccionado : colorIcono;
        const esIconoNotificaciones = btn.route === '/notificaciones';
        const deVerdadDeshabilitado = estaEnEstaRuta && (!esIconoNotificaciones || count === 0);

        return (
          <TouchableOpacity
            key={btn.route}
            style={[bottomBarStyles.btn, estaEnEstaRuta && { opacity: opacidadSeleccionado }]}
            onPress={() => !deVerdadDeshabilitado && router.push(btn.route)}
            disabled={deVerdadDeshabilitado}
          >
            {renderizarIcono(btn, iconColor)}

            {/* 🔴 Burbuja reactiva instantánea */}
            {esIconoNotificaciones && count > 0 && (
              <View style={bottomBarStyles.notificationBubble}>
                <CustomText weight="bold" style={bottomBarStyles.notificationText}>
                  {count}
                </CustomText>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export const bottomBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    height: 56,
    borderTopWidth: 1,
    borderTopColor: grisBorde,
    ...getShadowStyle(2),
  },
  btn: { alignItems: 'center', justifyContent: 'center', width: 70, position: 'relative' },
  notificationBubble: {
    backgroundColor: '#d00',
    position: 'absolute',
    top: 2,
    right: 10,
    height: 20,
    width: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  notificationText: { color: '#fff', fontSize: 11, textAlign: 'center', textAlignVertical: 'center' },
});