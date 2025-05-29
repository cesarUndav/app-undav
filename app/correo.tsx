// En tu componente React Native
import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';

const ip:string = "172.16.3.143";
const port:number = 3000;
const url:string = `http://${ip}:${port}/enviar-correo`;

// es necesario que el server esté corriendo.
// ejecutar archivo /backend-correo/server.js, con comando: node server.js

type EnviarCorreoBotonProps = {
  direccion: string;
};

export default function EnviarCorreoBoton({direccion}:EnviarCorreoBotonProps) {
  console.log(url);
    const enviarCorreo = async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: direccion,
          subject: 'APP UNDAV - Verificación',
          body: 'Verifica tu cuenta con este link: x',
        }),
      });

      const json = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', json.message);
      } else {
        Alert.alert('Error', json.error || 'No se pudo enviar el correo');
      }
    } catch (err) {
      Alert.alert('Error', 'Error de conexión');
    }
  };

  return (
    <TouchableOpacity style={styles.boton} onPress={enviarCorreo}>
      <Text style={styles.texto}>{"Enviar a "+direccion}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  texto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
