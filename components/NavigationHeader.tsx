// components/Header.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from './CustomText';

interface HeaderProps {
  title: string;
  onBackPress: () => void;
  backgroundColor?: string;
}

const Header: React.FC<HeaderProps> = ({ title, onBackPress, backgroundColor = '#fff' }) => {
  return (
    <View style={[headerStyles.container, { backgroundColor }]}>
      <View style={headerStyles.side}>
        <TouchableOpacity onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color="#1a2b50" />
        </TouchableOpacity>
      </View>

      <View style={headerStyles.titleContainer}>
        <CustomText style={headerStyles.title}>{title}</CustomText>
      </View>
    </View>
  );
};

export default Header;

const headerStyles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  } as ViewStyle,
  side: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  } as ViewStyle,
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a2b50',
  },
});
