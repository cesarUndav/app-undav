// components/BottomBar.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

// Íconos SVG como componentes
import HomeIcon from '../assets/icons/home.svg';
import CalendarIcon from '../assets/icons/calendar.svg';
import CommunityIcon from '../assets/icons/community.svg';
import LinksIcon from '../assets/icons/links.svg';
import SettingsIcon from '../assets/icons/settings.svg';

export default function BottomBar() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/home-estudiante')}>
        <HomeIcon width={iconSize} height={iconSize} fill="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/calendario')}>
        <CalendarIcon width={iconSize} height={iconSize} fill="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/comunidad')}>
        <CommunityIcon width={iconSize} height={iconSize} fill="white" />
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => router.push('/vinculos')}>
        <LinksIcon width={iconSize} height={iconSize} fill="white" />
      </TouchableOpacity> */}
      <TouchableOpacity onPress={() => router.push('/ajustes')}>
        <SettingsIcon width={iconSize} height={iconSize} fill="white" />
      </TouchableOpacity>
    </View>
  );
}

const iconSize = 30;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#173c68',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
});
