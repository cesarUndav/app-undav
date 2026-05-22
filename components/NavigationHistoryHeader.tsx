// components/NavigationHistoryHeader.tsx

import React, { ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { enModoOscuro } from '@/data/DatosUsuarioGuarani';
import { azulLogoUndav } from '@/constants/Colors';
import CustomText from './CustomText';

type HeaderProps = {
  title: string;
  children?: ReactNode;
};

export function PathToTitle(path: string) {
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || 'Home';

  return lastSegment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

const HistoryHeader: React.FC<HeaderProps> = ({ title, children }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.side}>
        <TouchableOpacity onPress={() => (router.canGoBack() ? router.back() : {})}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={enModoOscuro() ? '#fff' : '#1a2b50'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <CustomText weight="bold" style={styles.title}>
          {title}
        </CustomText>
      </View>

      <View style={styles.side}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: enModoOscuro() ? azulLogoUndav : '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 8,
  },
  side: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  title: {
    fontSize: 18,
    color: enModoOscuro() ? '#fff' : '#1a2b50',
  },
});

export default HistoryHeader;