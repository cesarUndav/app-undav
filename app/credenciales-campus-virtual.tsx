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
import * as SecureStore from 'expo-secure-store'; // 🔐 Importación de SecureStore
import { grisBorde, grisPlaceholder } from '@/constants/Colors';
import { scaleFont } from '@/utils/scaling';

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
  const [cargandoInicial, setCargandoInicial] = useState(true);

  // 1. Carga inicial asíncrona unificada
  useEffect(() => {
    async function cargarCredenciales() {
      try {
        const usuarioGuardado = await SecureStore.getItemAsync('campusUser');
        const passGuardada = await SecureStore.getItemAsync('campusPass');
        
        if (usuarioGuardado) setUser(usuarioGuardado);
        if (passGuardada) setPass(passGuardada);
      } catch (error) {
        console.error('Error al cargar del almacenamiento seguro:', error);
      } finally {
        setCargandoInicial(false);
      }
    }
    cargarCredenciales();
  }, []);

  // 2. Guardar Usuario (Solo si ya terminó la carga inicial)
  useEffect(() => {
    if (cargandoInicial) return;
    SecureStore.setItemAsync('campusUser', user).catch((err) => 
      console.error('Error al guardar usuario:', err)
    );
  }, [user, cargandoInicial]);

  // 3. Guardar Contraseña (Solo si ya terminó la carga inicial)
  useEffect(() => {
    if (cargandoInicial) return;
    SecureStore.setItemAsync('campusPass', pass).catch((err) => 
      console.error('Error al guardar contraseña:', err)
    );
  }, [pass, cargandoInicial]);

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
              placeholderTextColor={grisPlaceholder}
              style={styles.textInput}
              placeholder={item.label}
              value={item.value}
              onChangeText={item.setValue}
              secureTextEntry={item.hide}
              autoCapitalize="none" // Evita que ponga mayúscula al usuario/pass
              autoCorrect={false}
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
    fontSize: scaleFont(14),
    color: '#0b254a',
    fontFamily: 'Montserrat_400Regular',
  },
});