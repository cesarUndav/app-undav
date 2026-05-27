import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import BotonTexto from '@/components/BotonTexto';
import FondoGradiente from '@/components/FondoGradiente';
import ListaItem from '@/components/ListaItem';
import { useNotificacionesGlobales, notificacionSubtitulo, setNotificationCount } from '@/data/notificaciones';

export default function Notificaciones() {
  // 🔔 SUSCRIPCIÓN REACTIVA AL CONTENIDO GLOBAL
  const { noticias } = useNotificacionesGlobales();

  useEffect(() => {
    // Al entrar, limpia el indicador numérico de la barra inferior
    setNotificationCount(0);
  }, []);

  return (
    <FondoGradiente style={styles.fondo}>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {noticias.map((notif) => (
          <ListaItem key={notif.id} title={notif.titulo} subtitle={notificacionSubtitulo(notif)} />
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <BotonTexto label="Noticias UNDAV" url="https://undav.edu.ar/index.php?idcateg=323" styleExtra={{ borderBottomRightRadius: 20 }} />
      </View>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  fondo: { paddingBottom: 15 },
  listContainer: { gap: 4, paddingHorizontal: 15, paddingTop: 10 },
  buttonContainer: { gap: 4, paddingHorizontal: 15, paddingTop: 10 },
});