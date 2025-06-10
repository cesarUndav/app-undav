import React from 'react';
import { View, StyleSheet, TextStyle } from 'react-native';
import CustomText from './CustomText';
import { EventoAgenda, eventoAgendaTituloColor } from '../data/agenda';
import { eventoAgendaProximidadColor, eventoAgendaToFechaString } from '../data/agenda';

type AgendaItemProps = {
  evento: EventoAgenda;
};

export default function AgendaItem({ evento }: AgendaItemProps) {
  return (
    <View style={AgendaItemStyles.agendaItem}>
      <CustomText style={[AgendaItemStyles.eventTitle, { color: eventoAgendaTituloColor(evento) }]}>
        {evento.titulo}
      </CustomText>
      <CustomText style={[AgendaItemStyles.eventDate, { color: eventoAgendaProximidadColor(evento) }]}>
        {eventoAgendaToFechaString(evento)}
      </CustomText>
    </View>
  );
}

export const AgendaItemStyles = StyleSheet.create({
  agendaItem: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomRightRadius: 16,
    elevation: 4, // Android sombra
    shadowColor: '#000' // IOS sombra
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2
  }
});
