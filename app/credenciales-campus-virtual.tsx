// app/credenciales-campus-virtual.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  TextInput,
} from 'react-native';
import FondoGradiente from '@/components/FondoGradiente';
import { getShadowStyle } from '@/constants/ShadowStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { grisBorde } from '@/constants/Colors';

type InputItem = {
  type: 'input';
  label: string;
  value: string;
  setValue: (val: string) => void;
  hide: boolean;
};

type ConfigItem = InputItem;

interface ConfigSection {
  data: ConfigItem[];
}

export default function AjustesCredencialesCampus() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('campusUser').then((val) => {
      if (val) setUser(val);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('campusUser', user);
  }, [user]);

  useEffect(() => {
    AsyncStorage.getItem('campusPass').then((val) => {
      if (val) setPass(val);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('campusPass', pass);
  }, [pass]);

  const sections: ConfigSection[] = [
    {
      data: [
        {
          type: 'input',
          label: 'Usuario',
          value: user,
          setValue: setUser,
          hide: false,
        },
        {
          type: 'input',
          label: 'Contraseña',
          value: pass,
          setValue: setPass,
          hide: true,
        },
      ],
    },
  ];

  return (
    <FondoGradiente>
      <View style={styles.card}>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          renderItem={({ item }) => (
            <TextInput
              style={styles.textInput}
              placeholder={item.label}
              value={item.value}
              onChangeText={item.setValue}
              secureTextEntry={item.hide}
            />
          )}
          contentContainerStyle={styles.list}
        />
      </View>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  card: {
    borderBottomRightRadius: 40,
    paddingHorizontal: 16,
    paddingVertical: 6,
    paddingBottom: 12,
    backgroundColor: '#fff',
    ...getShadowStyle(6),
  },
  list: {},
  textInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: grisBorde,
    fontSize: 16,
    color: '#0b254a',
    fontFamily: 'Montserrat_400Regular',
  },
});