import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { azulClaro, grisBorde } from '@/constants/Colors';
import CustomText from './CustomText';
import { getNotificationCount } from '@/data/notificaciones';
import { getShadowStyle } from '@/constants/ShadowStyle';

const routes = [
  "/home-estudiante",
  "/calendario",
  "/notificaciones",
  "/accesos-directos",
  "/perfil",
] as const;

type Route = typeof routes[number];
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type ButtonWithSVG = {
  route: Route;
  Icon: React.FC<any>;
  IconName?: never;
};
type ButtonWithIonicon = {
  route: Route;
  IconName: IoniconName;
  Icon?: never;
};
type Button = ButtonWithSVG | ButtonWithIonicon;

export default function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();

  const buttons: Button[] = [
    { route: "/home-estudiante", Icon: require('../assets/icons/ico-svg/inicio.svg').default },
    { route: "/calendario", Icon: require('../assets/icons/ico-svg/calendario.svg').default },
    { route: "/notificaciones", Icon: require('../assets/icons/notifications.svg').default },
    { route: "/accesos-directos", Icon: require('../assets/icons/ico-svg/enlaces.svg').default },
    { route: "/perfil", Icon: require('../assets/icons/person.svg').default },
  ];

  return (
    <View style={bottomBarStyles.container}>
      {buttons.map(({ route, Icon, IconName }) => {
        const disabled = pathname === route;
        const iconColor = disabled ? colorSeleccionado : colorIcono;
        const esIconoNotificaciones: boolean = route == "/notificaciones";

        return (
          <TouchableOpacity
            key={route}
            style={[bottomBarStyles.btn, disabled && { opacity: opacidadSeleccionado }]}
            onPress={() => !disabled && router.push(route)}
            disabled={disabled}
            //activeOpacity={1} // se puede usar esto para quitar animacion
          >
            {Icon ? 
            <Icon width={tamanioIcono} height={tamanioIcono} fill={iconColor} />
            :
            <Ionicons name={IconName!} size={tamanioIcono-20} color={iconColor} />}

            {esIconoNotificaciones && getNotificationCount() > 0 && (
              <View style={bottomBarStyles.notificationBubble}>
                <CustomText style={bottomBarStyles.notificationText}>
                  {getNotificationCount()}
                </CustomText>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export const tamanioIcono = 50;
export const opacidadSeleccionado = 1;
export const colorSeleccionado = azulClaro;
const colorIcono = "#999";

export const bottomBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: "#fff",
    justifyContent: 'space-around',
    height: 56,
    borderTopWidth: 1,
    borderTopColor: grisBorde,
    ...getShadowStyle(2)
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    // backgroundColor: "green"
  },
  notificationBubble: {
    backgroundColor: "#d00",
    position: "absolute",
    top: 6,
    right: 12,
    height: 22,
    width: 22,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  notificationText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    textAlign:"center",
    textAlignVertical:"center"
  }

});