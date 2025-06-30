// components/AgendaItemEditable.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from './CustomText';
import { EventoAgenda, eventoAgendaProximidadColor, eventoAgendaToFechaString } from '../data/agenda';
import SettingsIcon from '../assets/icons/settings.svg';
import { azulLogoUndav } from '@/constants/Colors';
import { AgendaItemStyles } from './AgendaItem';

type AgendaItemEditableProps = {
  evento: EventoAgenda;
  onPressEdit: (id: string) => void;
};

export default function AgendaItemEditable({ evento, onPressEdit }: AgendaItemEditableProps) {
  return (
    <View style={AgendaItemStyles.agendaItem}>
        <TouchableOpacity style={styles.itemParent} onPress={() => onPressEdit(evento.id)} accessible accessibilityLabel="Editar Evento" >
          <View style={styles.itemChildLeft}>
            <CustomText style={[AgendaItemStyles.eventTitle, { color: '#000' }]}>
              {evento.titulo}
            </CustomText>
            <CustomText style={[AgendaItemStyles.eventDate, { color: eventoAgendaProximidadColor(evento) }]}>
              {eventoAgendaToFechaString(evento)}
            </CustomText>
          </View>
          <View style={styles.itemChildRight}>
            <SettingsIcon width={30} height={30} fill={azulLogoUndav} />
          </View>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  itemParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemChildLeft: {
    flex: 1,
  },
  itemChildRight: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
