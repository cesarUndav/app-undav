import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { azulMedioUndav, celesteSIU } from '@/constants/Colors';
import CustomText from './CustomText';
import { getNotificationCount } from '@/data/notificaciones';
import { getShadowStyle } from '@/constants/ShadowStyle';

const routes = [
  "/home-estudiante",
  "/calendario",
  "/notificaciones",
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
    { route: "/home-estudiante", Icon: require('../assets/icons/home.svg').default },
    { route: "/calendario", Icon: require('../assets/icons/calendar.svg').default },
    { route: "/notificaciones", IconName: "notifications-outline" },
    { route: "/perfil", IconName: "person-outline" },
  ];

  return (
    <View style={bottomBarStyles.container}>
      {buttons.map(({ route, Icon, IconName }) => {
        const disabled = pathname === route;
        const iconColor = disabled ? colorSeleccionado : "#fff";
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
            <Ionicons name={IconName!} size={tamanioIcono-2} color={iconColor} />}

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

export const tamanioIcono = 32;
export const opacidadSeleccionado = 1;
export const colorSeleccionado = celesteSIU;

export const bottomBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: azulMedioUndav,
    justifyContent: 'space-around',
    height: 56,
    ...getShadowStyle(3)
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  notificationBubble: {
    backgroundColor: "red",
    position: "absolute",
    top: 4,
    right: 10,
    height: 22,
    width: 22,
    borderRadius: "100%",
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
