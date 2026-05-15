import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import CustomText from '../components/CustomText';
import { EventoAgenda } from '../data/agenda';
import { useAgenda } from '../src/context/AgendaContext'; 
import AgendaItem from '@/components/AgendaItem';
import { azulLogoUndav,  negroAzulado } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';
import BotonTexto from '@/components/BotonTexto';
import FondoGradiente from '@/components/FondoGradiente';

const filterBtnColor = azulLogoUndav

export default function Agenda() {
    
    // 1. OBTENER ESTADO REACTIVO DEL CONTEXTO
    // Estos valores se actualizan automáticamente cuando AgendaProvider termina de cargar.
    const { eventosFuturos, isLoading, error, refetchEventos } = useAgenda(); 
    
    // Mantenemos el estado de la UI que no depende de la carga de datos
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    // Mantenemos la lógica de filtrado específica de la UI
    function puedeMostrarEvento(evento: EventoAgenda): Boolean {
        return !evento.esFeriado && !evento.id.startsWith("p");
    }

    function mostrarLista(lista: EventoAgenda[]) {
        // La lista ya viene combinada y ordenada del contexto
        const listaFiltrada = lista.filter(puedeMostrarEvento);

        if (listaFiltrada.length > 0) return listaFiltrada.map((evento) => ( 
            <AgendaItem key={evento.id} evento={evento} />
        ));
        else return <CustomText style={styles.title}>No hay eventos de este tipo</CustomText>;
    }
    
    return (
        <>
        <FondoGradiente style={{}}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <ScrollView contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 5, gap: 5}}>
                {
                    // 2. Usar isLoading y error del hook para manejar el estado
                    isLoading ? (
                        // Muestra un indicador de carga
                        <ActivityIndicator size="large" color={azulLogoUndav} style={{marginTop: 50}} />
                    ) : error ? (
                        // Muestra un error si la carga falló
                        <CustomText style={styles.title}>
                            Error al cargar los eventos.
                            {/* Opcional: Agregar un botón para recargar */}
                            {/* <BotonTexto label="Reintentar" onPress={refetchEventos} /> */}
                        </CustomText>
                    ) : (
                        // Muestra la lista reactiva
                        mostrarLista(eventosFuturos) 
                    )
                }
                </ScrollView>
                <View style={{paddingHorizontal: 15, paddingBottom: 15, marginTop: 10}}>
                    <BotonTexto route='/calend.-academico-resoluciones' label={"Resoluciones Calendario Académico"} />
                </View>
            </View>
        </FondoGradiente>
        </>
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
  agendaBtnContainer: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  floatingBox: {
    position: 'absolute',
    bottom: 15 + 70,
    right: 15,
    zIndex: 10, // encima de otras Views
    flexDirection: "column",
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  filterOptionsParent: {
    backgroundColor: "#fff",
    padding: 8,
    marginBottom: 10,
    gap:4,
    borderBottomRightRadius: 16,
    flex: 1,
    ...getShadowStyle(4)
  },
  filterOption: {
    flex: 1,
    height: "100%",
    alignItems: "flex-start",
    backgroundColor: filterBtnColor,
    borderRadius: 0,
    borderBottomRightRadius: 0,
    ...getShadowStyle(2)
  },
  filterOptionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  openBtn: {
    backgroundColor: azulLogoUndav,
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...getShadowStyle(4)
  },
  closeBtn: {
    backgroundColor: "lightgray",
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...getShadowStyle(4)
  },
  closeBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c91800', // #333
    paddingBottom: 4,
    //paddingHorizontal: 8,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
