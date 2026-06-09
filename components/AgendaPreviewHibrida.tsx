// components/AgendaPreviewHibrida.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from './CustomText';
import { EventoAgenda, listaCompleta } from '../data/agenda';
import AgendaItem from './AgendaItem';
import { azulClaro, grisBorde, azulMedioUndav } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';
import { Ionicons } from '@expo/vector-icons';
import AgendaItemEditable from './AgendaItemEditable';

// 🎯 IMPORTAMOS EL HOOK DEL CONTEXTO GLOBAL
import { useAgenda } from '@/src/context/AgendaContext';

export default function AgendaPreview() {
  const router = useRouter();
  
  // 🎯 EXTRAEMOS LOS EVENTOS Y EL ESTADO DE CARGA REACTIVOS DEL CONTEXTO
  const { eventosFuturos, isLoading } = useAgenda();

  const [separada, setSeparada] = useState(false);
  const [listaEventos, setListaEventos] = useState<EventoAgenda[]>([]);

  // 🎯 Sincronizamos el estado local inmediatamente cuando los eventos del contexto muten o terminen de cargar
  useEffect(() => {
    setListaEventos(eventosFuturos);
  }, [eventosFuturos]);

  return (
    <View style={styles.agendaContainer}>
      {isLoading ? (
        // 🌀 Feedback visual limpio si la API todavía está descargando el SIU
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={azulMedioUndav} />
          <CustomText style={styles.loadingText}>Sincronizando agenda...</CustomText>
        </View>
      ) : !separada ? (
        <>
          <CustomText weight="bold" style={styles.agendaTitle}>
            AGENDA ACADÉMICA COMPLETA
          </CustomText>

          <View style={styles.listaScrollParentBorder}>
            <ScrollView contentContainerStyle={styles.listaScrollContainer}>
              {listaEventos.length === 0 ? (
                <CustomText style={styles.noEventsText}>No hay eventos próximos registrados.</CustomText>
              ) : (
                listaEventos.map((evento) =>
                  evento.id.startsWith('p') ? (
                    <AgendaItemEditable
                      key={evento.id}
                      evento={evento}
                      // 🎯 MODIFICADO: Enviamos el ID como parámetro en la URL
                      onPressEdit={() => router.push({
                        pathname: '/agenda',
                        params: { editId: evento.id }
                      })}
                    />
                  ) : (
                    <AgendaItem key={evento.id} evento={evento} />
                  )
                )
              )}
            </ScrollView>
          </View>
        </>
      ) : (
        <>
          <View style={styles.agendaAcademicaContainer}>
            <CustomText weight="bold" style={styles.agendaTitle}>
              AGENDA ACADÉMICA
            </CustomText>

            <View style={styles.listaScrollParentBorder}>
              <ScrollView contentContainerStyle={styles.listaScrollContainer}>
                {listaEventos.filter(e => !e.id.startsWith('p') && !e.esFeriado).length === 0 ? (
                  <CustomText style={styles.noEventsText}>Sin eventos académicos.</CustomText>
                ) : (
                  listaEventos.map(
                    (evento) =>
                      !evento.id.startsWith('p') &&
                      !evento.esFeriado && (
                        <AgendaItem key={evento.id} evento={evento} />
                      )
                  )
                )}
              </ScrollView>
            </View>
          </View>

          <View style={styles.agendaPersonalContainer}>
            <CustomText weight="bold" style={styles.agendaTitle}>
              AGENDA PERSONAL
            </CustomText>

            <View style={styles.listaScrollParentBorder}>
              <ScrollView contentContainerStyle={styles.listaScrollContainer}>
                {listaCompleta().filter(e => e.id.startsWith('p')).length === 0 ? (
                  <CustomText style={styles.noEventsText}>Sin eventos personales.</CustomText>
                ) : (
                  listaCompleta().map(
                    (evento) =>
                      evento.id.startsWith('p') && (
                        <AgendaItem key={evento.id} evento={evento} />
                      )
                  )
                )}
              </ScrollView>
            </View>
          </View>
        </>
      )}

      <View style={styles.agendaBtnContainer}>
        <TouchableOpacity
          onPress={() => router.push('/agenda')}
          style={[styles.agendaBtn, styles.detallesBtn]}
        >
          <CustomText weight="bold" style={styles.agendaBtnText}>
            DETALLES
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSeparada(!separada)}
          style={[styles.agendaBtn, styles.vistaBtn]}
        >
          <Ionicons
            name={separada ? 'eye' : 'eye-off'}
            size={26}
            color={azulClaro}
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listaScrollParentBorder: {
    flex: 1,
    borderWidth: 1,
    borderColor: grisBorde,
    borderRadius: 0,
  },
  listaScrollContainer: {
    gap: 2,
    paddingTop: 0,
    backgroundColor: '#fff',
  },
  agendaContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    marginVertical: 0,
    borderBottomRightRadius: 24,
    ...getShadowStyle(3),
    borderWidth: 0.5,
    borderColor: grisBorde,
  },
  agendaAcademicaContainer: {
    flex: 1,
  },
  agendaPersonalContainer: {
    flex: 0.8,
  },
  agendaTitle: {
    color: azulClaro,
    fontSize: 15,
    alignSelf: 'center',
    paddingBottom: 8,
    paddingTop: 10,
  },
  agendaBtnContainer: {
    paddingTop: 10,
    paddingBottom: 15,
    gap: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  agendaBtn: {
    flex: 1,
    height: '100%',
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: azulClaro,
    borderRadius: 0,
    borderBottomRightRadius: 16,
    ...getShadowStyle(2),
  },
  detallesBtn: {
    flex: 6.5,
    borderBottomRightRadius: 0,
  },
  vistaBtn: {
    backgroundColor: '#fff',
  },
  agendaBtnText: {
    color: '#fff',
    fontSize: 15,
    paddingVertical: 8,
    textAlign: 'center',
  },
  eyeIcon: {
    transform: [{ translateY: 6 }],
  },
  // 🎯 ESTILOS NUEVOS PARA MEJORAR LA EXPERIENCIA DE CARGA
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: azulClaro,
    fontSize: 14,
  },
  noEventsText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 13,
    paddingVertical: 20,
  }
});