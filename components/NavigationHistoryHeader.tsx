import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type HeaderProps = {
  title: string;
  children?: ReactNode;
};

export function PathToTitle(path: string) {
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || 'Home';
  return lastSegment
    .replace(/-/g, ' ')           // guiones a espacios
    .replace(/\b\w/g, l => l.toUpperCase()); // Mayúscula cada palabra
}

const HistoryHeader: React.FC<HeaderProps> = ({ title, children }) => {
  //const navigation = useNavigation();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : {}}>
          <Ionicons name="arrow-back" size={24} color="#1a2b50" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
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
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 8,
    elevation: 4, // Android sombra
    shadowColor: '#000', // IOS sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    fontWeight: 'bold',
    color: '#1a2b50',
  },
});

export default HistoryHeader;
