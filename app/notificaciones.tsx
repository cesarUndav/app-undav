import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import ListaItem from '@/components/ListaItem';
import { negroAzulado } from '@/constants/Colors';
import { historialNotificaciones, Notificacion, notificacionToFechaString, setNotificationCount } from '@/data/notificaciones';
import React from 'react';
import { StyleSheet } from 'react-native';

  function mostrarLista(lista:Notificacion[]) {
    return lista.map((notif) => (
    <ListaItem key={notif.id} title={notif.titulo} subtitle={notificacionToFechaString(notif)} />
    ))
  }

export default function Notificaciones() {
  setNotificationCount(0); // LIMPIA GLOBO de notificaciones al CARGAR esta página
  return (
    <FondoScrollGradiente>
        {mostrarLista(historialNotificaciones)}
    </FondoScrollGradiente>
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
});
