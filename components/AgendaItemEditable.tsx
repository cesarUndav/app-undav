// components/AgendaItemEditable.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import CustomText from './CustomText';
import { EventoAgenda, eventoAgendaProximidadColor, eventoAgendaToFechaString } from '../data/agenda';
import SettingsIcon from '../assets/icons/settings.svg';
import { azulClaro, azulLogoUndav, azulMedioUndav } from '@/constants/Colors';
import { AgendaItemStyles } from './AgendaItem';
import { useCategoriasPersistentes } from '@/hooks/useCategoriasPersistentes';
import { Categoria } from './DropdownCategoria';
import { enModoOscuro } from '@/data/DatosUsuarioGuarani';

type AgendaItemEditableProps = {
  evento: EventoAgenda;
  onPressEdit: (id: string) => void;
  styleExtra?: StyleProp<ViewStyle>;
};

export default function AgendaItemEditable({ evento, onPressEdit, styleExtra }: AgendaItemEditableProps) {
  useCategoriasPersistentes();

  return (
    <View style={[AgendaItemStyles.agendaItem, styleExtra]}>
        <TouchableOpacity style={styles.itemParent} onPress={() => onPressEdit(evento.id)} accessible accessibilityLabel="Editar Evento" >
          <View style={styles.itemChildLeft}>
            <CustomText style={[AgendaItemStyles.eventTitle, { 
              //</View>color: evento.categoria ? categorias[evento.categoria]
              color: enModoOscuro() ? "#fff":'#000' }]}>
              {evento.titulo}
            </CustomText>
            <CustomText style={[AgendaItemStyles.eventDate, { color: eventoAgendaProximidadColor(evento) }]}>
              {eventoAgendaToFechaString(evento)}
            </CustomText>
          </View>
          <View style={styles.itemChildRight}>
            <SettingsIcon width={30} height={30} fill={enModoOscuro()? "#fff":azulClaro} />
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