import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { azulMedioUndav } from '@/constants/Colors';

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
    <View style={styles.container}>
      {buttons.map(({ route, Icon, IconName }) => {
        const disabled = pathname === route;
        return (
          <TouchableOpacity
            key={route}
            style={[styles.btn, disabled && { opacity: opacidadSeleccionado }]}
            onPress={() => !disabled && router.push(route)}
            disabled={disabled}
          >
            {Icon ? <Icon width={tamanioIcono} height={tamanioIcono} fill="white" /> : <Ionicons name={IconName!} size={30} color="white" />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const tamanioIcono = 32;
const opacidadSeleccionado = 0.5;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: azulMedioUndav,
    justifyContent: 'space-around',
  },
  btn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
});
