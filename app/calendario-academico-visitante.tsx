// app/calendario-academico-visitante.tsx

import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import CustomText from '../components/CustomText';
import { EventoAgenda } from '../data/agenda';
import { useAgenda } from '../src/context/AgendaContext';
import AgendaItem from '@/components/AgendaItem';
import { azulLogoUndav, negroAzulado } from '@/constants/Colors';
import BotonTexto from '@/components/BotonTexto';
import FondoGradiente from '@/components/FondoGradiente';

export default function Agenda() {
  const { eventosFuturos, isLoading, error } = useAgenda();

  function puedeMostrarEvento(evento: EventoAgenda): boolean {
    return !evento.esFeriado && !evento.id.startsWith('p');
  }

  function mostrarLista(lista: EventoAgenda[]) {
    const listaFiltrada = lista.filter(puedeMostrarEvento);

    if (listaFiltrada.length > 0) {
      return listaFiltrada.map((evento) => (
        <AgendaItem key={evento.id} evento={evento} />
      ));
    }

    return (
      <CustomText weight="bold" style={styles.title}>
        No hay eventos de este tipo
      </CustomText>
    );
  }

  return (
    <FondoGradiente>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={azulLogoUndav}
              style={styles.loading}
            />
          ) : error ? (
            <CustomText weight="bold" style={styles.title}>
              Error al cargar los eventos.
            </CustomText>
          ) : (
            mostrarLista(eventosFuturos)
          )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <BotonTexto
            route="/calend.-academico-resoluciones"
            label="Resoluciones Calendario Académico"
          />
        </View>
      </View>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    gap: 5,
  },
  loading: {
    marginTop: 50,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    color: negroAzulado,
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 0,
  },
});