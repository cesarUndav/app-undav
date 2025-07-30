import React from 'react';
import { View, StyleSheet, TextStyle, ViewStyle, StyleProp } from 'react-native';
import CustomText from './CustomText';
import { EventoAgenda, eventoAgendaTituloColor } from '../data/agenda';
import { eventoAgendaProximidadColor, eventoAgendaToFechaString } from '../data/agenda';
import { getShadowStyle } from '@/constants/ShadowStyle';
import { enModoOscuro } from '@/data/DatosUsuarioGuarani';
import { azulLogoUndav } from '@/constants/Colors';

type AgendaItemProps = {
  evento: EventoAgenda;
  styleExtra?: StyleProp<ViewStyle>;
};

export default function AgendaItem({ evento, styleExtra }: AgendaItemProps) {
  return (
    <View style={[AgendaItemStyles.agendaItem, styleExtra]}>
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
    backgroundColor: enModoOscuro() ? azulLogoUndav:'#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    //borderBottomRightRadius: 16,
    ...getShadowStyle(4)
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
