// components/BottomBar.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

// Íconos SVG como componentes
import HomeIcon from '../assets/icons/home.svg';
import CalendarIcon from '../assets/icons/calendar.svg';
import CommunityIcon from '../assets/icons/community.svg';
import LinksIcon from '../assets/icons/links.svg';
import SettingsIcon from '../assets/icons/settings.svg';
import { useRouter, usePathname } from 'expo-router';

const routes = [
  "/home-visitante",
  "/calendario",
  "/comunidad",
  "/ajustes-visitante",
] as const;  // <-- "as const" to make these literal types

type Route = typeof routes[number];  // Union of route string literals

export default function BottomBarVisitante() {
  const router = useRouter();
  const pathname = usePathname();

  const buttons: { route: Route; Icon: React.FC<any> }[] = [
    { route: "/home-visitante", Icon: HomeIcon },
    { route: "/calendario", Icon: CalendarIcon },
    { route: "/comunidad", Icon: CommunityIcon },
    { route: "/ajustes-visitante", Icon: SettingsIcon },
  ];

  return (
    <View style={styles.container}>
      {buttons.map(({ route, Icon }) => {
        const disabled = pathname === route;
        return (
          <TouchableOpacity
            key={route}
            style={[styles.btn, disabled && { opacity: 0.5 }]}
            onPress={() => !disabled && router.push(route)}
            disabled={disabled}
          >
            <Icon width={iconSize} height={iconSize} fill="white" />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


const iconSize = 30;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#173c68',
    justifyContent: 'space-around'
  },
  btn: {
    //flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    //backgroundColor: "green",
  },
  icon: {
    
  },
});
