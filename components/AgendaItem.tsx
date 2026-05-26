// components/AgendaItem.tsx

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import CustomText from './CustomText';
import { EventoAgenda } from '../data/agenda';
import {
  eventoAgendaTituloColor,
  eventoAgendaProximidadColor,
  eventoAgendaToFechaString,
} from '../data/agenda';
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
      <CustomText
        weight="bold"
        style={[
          AgendaItemStyles.eventTitle,
          { color: eventoAgendaTituloColor(evento) },
        ]}
      >
        {evento.titulo}
      </CustomText>

      <CustomText
        weight="bold"
        style={[
          AgendaItemStyles.eventDate,
          { color: eventoAgendaProximidadColor(evento) },
        ]}
      >
        {eventoAgendaToFechaString(evento)}
      </CustomText>
    </View>
  );
}

export const AgendaItemStyles = StyleSheet.create({
  agendaItem: {
    backgroundColor: enModoOscuro() ? azulLogoUndav : '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    ...getShadowStyle(4),
  },
  eventTitle: {
    fontSize: 16,
  },
  eventDate: {
    fontSize: 13,
    marginTop: 2,
  },
});