// app/notificaciones.tsx

import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import BotonTexto from '@/components/BotonTexto';
import FondoGradiente from '@/components/FondoGradiente';
import ListaItem from '@/components/ListaItem';
import LoadingWrapper from '@/components/LoadingWrapper';
import {
  cargarNoticias,
  Notificacion,
  notificacionToFechaString,
  setNotificationCount,
  todasLasNotificaciones,
} from '@/data/notificaciones';

function mostrarLista(lista: Notificacion[]) {
  return lista.map((notif) => (
    <ListaItem
      key={notif.id}
      title={notif.titulo}
      subtitle={notificacionToFechaString(notif)}
    />
  ));
}

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      console.log('🔍 Cargando noticias desde API...');
      setLoading(true);

      try {
        await cargarNoticias();

        const todas = todasLasNotificaciones();

        console.log('✅ Noticias cargadas:', todas.length);
        console.log('📋 Primeras 3 noticias:', todas.slice(0, 3));

        setNotificaciones(todas);
      } catch (error) {
        console.error('❌ Error al cargar noticias:', error);
        setNotificaciones(todasLasNotificaciones());
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
    setNotificationCount(0);
  }, []);

  return (
    <FondoGradiente style={styles.fondo}>
      <LoadingWrapper loading={loading}>
        <ScrollView contentContainerStyle={styles.listContainer}>
          {mostrarLista(notificaciones)}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <BotonTexto
            label="Noticias UNDAV"
            route="noticias-web-undav"
            styleExtra={{ borderBottomRightRadius: 20 }}
          />
        </View>
      </LoadingWrapper>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  fondo: {
    paddingBottom: 15,
  },
  listContainer: {
    gap: 4,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  buttonContainer: {
    gap: 4,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
});