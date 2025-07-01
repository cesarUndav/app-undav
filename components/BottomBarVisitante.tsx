import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { bottomBarStyles, colorSeleccionado, opacidadSeleccionado, tamanioIcono } from './BottomBar';

const routes = [
  "/home-visitante",
  "/ajustes-visitante",
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
    { route: "/home-visitante", Icon: require('../assets/icons/home.svg').default },
    { route: "/ajustes-visitante", Icon: require('../assets/icons/settings.svg').default },
  ];

  return (
    <View style={bottomBarStyles.container}>
      {buttons.map(({ route, Icon, IconName }) => {
        const disabled = pathname === route;
        const iconColor = disabled ? colorSeleccionado : "#fff";

        return (
          <TouchableOpacity
            key={route}
            style={[bottomBarStyles.btn, disabled && { opacity: opacidadSeleccionado }]}
            onPress={() => !disabled && router.push(route)}
            disabled={disabled}
          >
            {Icon ? 
            <Icon width={tamanioIcono} height={tamanioIcono} fill={iconColor} />
            :
            <Ionicons name={IconName!} size={30} color={iconColor} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
