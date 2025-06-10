// components/AgendaItemEditable.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from './CustomText';
import { EventoAgenda, eventoAgendaProximidadColor, eventoAgendaToFechaString } from '../data/agenda';
import SettingsIcon from '../assets/icons/settings.svg';
import { azulLogoUndav } from '@/constants/Colors';

type AgendaItemEditableProps = {
  evento: EventoAgenda;
  onPressEdit: (id: string) => void;
};

export default function AgendaItemEditable({ evento, onPressEdit }: AgendaItemEditableProps) {
  return (
    <View style={styles.agendaItem}>
      <View style={styles.itemParent}>
        <View style={styles.itemChildLeft}>
          <CustomText style={[styles.eventTitle, { color: '#000' }]}>
            {evento.titulo}
          </CustomText>
          <CustomText style={[styles.eventDate, { color: eventoAgendaProximidadColor(evento) }]}>
            {eventoAgendaToFechaString(evento)}
          </CustomText>
        </View>

        <TouchableOpacity
          style={styles.itemChildRight}
          onPress={() => onPressEdit(evento.id)}
          accessible
          accessibilityLabel="Editar Evento"
        >
          <SettingsIcon width={30} height={30} fill={azulLogoUndav} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  agendaItem: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomRightRadius: 16,
    elevation: 4, // Android sombra
    shadowColor: '#000' // IOS sombra
  },
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
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
  },
});
