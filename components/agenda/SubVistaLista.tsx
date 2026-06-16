import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import DropdownSeccion from '@/components/DropdownSeccion';
import AgendaItem from '@/components/AgendaItem';
import AgendaItemEditable from '@/components/AgendaItemEditable';
import { azulLogoUndav, negroAzulado } from '@/constants/Colors';
import { EventoAgenda, listaEnCurso, listaFuturo, listaPasado } from '@/data/agenda';
import CustomText from '@/components/CustomText';

interface SubVistaListaProps {
  isLoading: boolean;
  error: string | null;
  puedeMostrarEvento: (evento: EventoAgenda) => boolean;
  onAbrirEditar: (id: string) => void;
}

export default function SubVistaLista({ isLoading, error, puedeMostrarEvento, onAbrirEditar }: SubVistaListaProps) {
  
  function renderizarLista(lista: EventoAgenda[]) {
    const listaFiltrada = lista.filter(puedeMostrarEvento);

    if (listaFiltrada.length === 0) {
      return <CustomText weight="bold" style={styles.titleNoEvents}>No hay eventos de este tipo</CustomText>;
    }

    return listaFiltrada.map((evento, index) => {
      const esUltimo = index === listaFiltrada.length - 1;
      const extraStyle = esUltimo ? { borderBottomRightRadius: 20 } : undefined;

      if (evento.id.startsWith('p')) {
        return (
          <AgendaItemEditable
            key={evento.id}
            evento={evento}
            onPressEdit={onAbrirEditar}
            styleExtra={extraStyle}
          />
        );
      }
      return <AgendaItem key={evento.id} evento={evento} styleExtra={extraStyle} />;
    });
  }

  if (isLoading) return <ActivityIndicator size="large" color={azulLogoUndav} style={styles.loading} />;
  if (error) return <CustomText weight="bold" style={styles.title}>Error al cargar los eventos: {error}</CustomText>;

  return (
    <FondoScrollGradiente>
      <DropdownSeccion titulo="EN CURSO" styleContenido={styles.dropdownContenido} inicialmenteAbierto>
        {renderizarLista(listaEnCurso())}
      </DropdownSeccion>

      <DropdownSeccion titulo="PRÓXIMO" styleContenido={styles.dropdownContenido} inicialmenteAbierto>
        {renderizarLista(listaFuturo().filter((e) => !listaEnCurso().includes(e)))}
      </DropdownSeccion>

      <DropdownSeccion titulo="FINALIZADO" styleContenido={styles.dropdownContenido} inicialmenteAbierto={false}>
        {renderizarLista(listaPasado())}
      </DropdownSeccion>
    </FondoScrollGradiente>
  );
}

const styles = StyleSheet.create({
  loading: { marginTop: 50 },
  title: { fontSize: 16, color: negroAzulado, alignSelf: 'center', textAlign: 'center' },
  titleNoEvents: { fontSize: 14, color: '#8e8e93', padding: 12, textAlign: 'center' },
  dropdownContenido: { gap: 4 },
});