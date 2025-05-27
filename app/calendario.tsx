import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomText from '../components/CustomText';
import { Ionicons } from '@expo/vector-icons';

import {
  JsonStringAObjeto,
  ObtenerJsonString,
  UrlObtenerAgenda,
  usuarioActual
} from '@/data/DatosUsuarioGuarani';
import ListaItem from '@/components/ListaItem';
import BotonTextoLink from '@/components/BotonTextoLink';
import BarraSemanal from './BarraSemanal';

export function DateToISOStringNoTime(fecha: Date): string {
  return fecha.toISOString().split('T')[0];
}
function hoyMasDias(dias: number) {
  return new Date(Date.now() + 86400000 * dias);
}

export type Actividad = {
  id: number,
  title: string,
  body: string
};

export function IndexToDiaString(index: number): string {
  switch (index) {
    case 0: return "domingo";
    case 1: return "lunes";
    case 2: return "martes";
    case 3: return "miércoles";
    case 4: return "jueves";
    case 5: return "viernes";
    case 6: return "sábado";
    default: return "Día inválido.";
  }
}

export default function Calendario() {
  const [loading, setLoading] = useState(true);
  const [listaActividadesUnDia, setListaActividadesUnDia] = useState<Actividad[]>([]);
  const [tituloPagina, setTituloPagina] = useState("");
  const [numDias, setNumDias] = useState(0);
  const [actividadesPorDia, setActividadesPorDia] = useState<number[]>();

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        setLoading(true);

        let auxActividadesPorDia:number[] = [1,1,1,1,1,2,0];
        const hoy = hoyMasDias(0);
        const fecha = hoyMasDias(numDias);

        const primerDiaDeEstaSemana = 7 - hoyMasDias(0).getDay();

        // hacer esto para cada dia de la semana actual
        const url = UrlObtenerAgenda(usuarioActual.idPersona, DateToISOStringNoTime(fecha));
        const json = JsonStringAObjeto(await ObtenerJsonString(url));
        const diaNombreString = IndexToDiaString(fecha.getDay());
        const diaMensajeString = diaNombreString + " "+ fecha.getDate();

        const listaActividad: Actividad[] = [];
        if (json.error != null) {
          setTituloPagina("No hay actividades " + (numDias === 0 ? `hoy, ${diaMensajeString}` : `el ${diaMensajeString}`) );
          setListaActividadesUnDia([]);
        } else {
          const esHoy = fecha.toDateString() === hoy.toDateString();
          setTituloPagina("Actividades " + (esHoy ? "de hoy, " : "del ") + diaMensajeString);
          json.forEach((elem: any, index: number) => {
            const nuevaActividad: Actividad = {
              id: index,
              title: `${elem.tipo_actividad} de ${elem.actividad}`,
              body: `${elem.horario} hs`
            };
            listaActividad.push(nuevaActividad);
          });
          setListaActividadesUnDia(listaActividad);
          setActividadesPorDia(auxActividadesPorDia);
        }
      }
      catch (error) {
        console.error('Error al obtener agenda:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgenda();
  }, [numDias]);

  return (
    <LinearGradient colors={['#ffffff', '#91c9f7']} style={styles.container}>
      
      <BarraSemanal actividadesPorDia={actividadesPorDia ?? [0, 0, 0, 0, 0, 0, 0]} />
      
      <View style={styles.headerButtons}>
        <TouchableOpacity onPress={() => setNumDias(numDias - 1)} style={styles.navButton}>
          <Ionicons name="arrow-back" size={24} color="#1a2b50" />
        </TouchableOpacity>

        <CustomText style={styles.title}>
          {loading ? "Cargando..." : tituloPagina}
        </CustomText>

        <TouchableOpacity onPress={() => setNumDias(numDias + 1)} style={styles.navButton}>
          <Ionicons name="arrow-forward" size={24} color="#1a2b50" />
        </TouchableOpacity>
      </View>
      
      {listaActividadesUnDia.map((evento) => (
        <ListaItem
          key={evento.id}
          title={evento.title}
          subtitle={evento.body}
        />
      ))}

      <View style={{flex: 1, justifyContent: "flex-end"}}>
        <BotonTextoLink label={'Calendario Académico'} url={'https://undav.edu.ar/index.php?idcateg=129'}></BotonTextoLink>
      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
    gap: 8
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0b254a',
    marginHorizontal: 10,
    textAlign: 'center',
    flex: 1
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  navButton: {
    padding: 10
  },
  navText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0b254a'
  },
    bloque: {
    //backgroundColor: '#e3f0fb',
    backgroundColor: '#173c68',
    borderBottomRightRadius: 20,
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 15,
    elevation: 6
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
    //color: '#0b5085',
  }
});
