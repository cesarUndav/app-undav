import ApplyRadiusToLastChild from '@/components/ApplyRadiusToLastChild';
import BotonTexto from '@/components/BotonTexto';
import FondoGradiente from '@/components/FondoGradiente';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import ListaItem from '@/components/ListaItem';
import { negroAzulado } from '@/constants/Colors';
import { historialNotificaciones, Notificacion, notificacionToFechaString, setNotificationCount } from '@/data/notificaciones';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

  function mostrarLista(lista:Notificacion[]) {
    return lista.map((notif) => (
    <ListaItem key={notif.id} title={notif.titulo} subtitle={notificacionToFechaString(notif)} />
    ))
  }

export default function Notificaciones() {
  setNotificationCount(0); // LIMPIA GLOBO de notificaciones al CARGAR esta página
  return (
    <FondoGradiente style={{paddingBottom: 15}}>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {mostrarLista(historialNotificaciones())}
      </ScrollView>
      <View style={[{paddingTop: 10},styles.listContainer]}>
        <BotonTexto label={'Noticias UNDAV'} route='noticias-web-undav' styleExtra={{borderBottomRightRadius: 20}}/>
      </View>
      </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: negroAzulado,
    alignSelf: 'center',
    textAlign:"center",
    marginVertical: 0
  },
  listContainer: {
    gap: 4,
    paddingHorizontal: 15,
    paddingTop: 10
  }
});
