import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import ApplyRadiusToLastChild from '@/components/ApplyRadiusToLastChild';
import BotonTexto from '@/components/BotonTexto';
import DropdownSeccion from '@/components/DropdownSeccion';
import FondoGradiente from '@/components/FondoGradiente';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import ListaItem from '@/components/ListaItem';
import LoadingWrapper from '@/components/LoadingWrapper';
import { negroAzulado } from '@/constants/Colors';
import { 
  cargarNoticias, 
  historialNotificaciones, 
  Notificacion, 
  notificacionToFechaString, 
  setNotificationCount, 
  todasLasNotificaciones
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
      
      // CAMBIA ESTO - usar todasLasNotificaciones() en lugar de historialNotificaciones()
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
    <FondoGradiente style={{ paddingBottom: 15 }}>
      <LoadingWrapper loading={loading}>
        <ScrollView contentContainerStyle={styles.listContainer}>
          {mostrarLista(notificaciones)}
        </ScrollView>
        <View style={[{ paddingTop: 10 }, styles.listContainer]}>
          <BotonTexto 
            label={'Noticias UNDAV'} 
            route='noticias-web-undav' 
            styleExtra={{ borderBottomRightRadius: 20 }}
          />
        </View>
      </LoadingWrapper>
    </FondoGradiente>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: negroAzulado,
    alignSelf: 'center',
    textAlign: "center",
    marginVertical: 0
  },
  listContainer: {
    gap: 4,
    paddingHorizontal: 15,
    paddingTop: 10
  }
});