import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import CustomText from './CustomText';
import { EventoAgenda, listaCompleta, listaFuturo } from '../data/agenda';
import AgendaItem from './AgendaItem';
import { azulClaro, azulLogoUndav, azulMedioUndav, grisBorde } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';

import { Ionicons } from '@expo/vector-icons';
import AgendaItemEditable from './AgendaItemEditable';
import { enModoOscuro } from '@/data/DatosUsuarioGuarani';


export default function AgendaPreview() {
  const router = useRouter();
  //const primerosEventos = listaFuturo.slice(0, 3); // los primeros N elementos
  //const primerosEventos = listaFuturo; 
  const [separada, setSeparada] = useState(false);
  const [listaEventos, setListaEventos] = useState<EventoAgenda[]>([]);

  useFocusEffect(
    // This runs every time the screen is focused (entered)
    useCallback(() => {
      setListaEventos(listaFuturo);
    }, [])
  );

  return (
    <View style={styles.agendaContainer}>
      {!separada ?
      (<>

        <CustomText style ={styles.agendaTitle}>{"AGENDA ACADÉMICA COMPLETA"}</CustomText>
        <View style={styles.listaScrollParentBorder}>
            <ScrollView contentContainerStyle={styles.listaScrollContainer}>
            {listaEventos.map((evento) => (
              evento.id.startsWith("p") ?
              <AgendaItemEditable key={evento.id} evento={evento} onPressEdit={()=>router.push("/agenda")}/>
              :
              <AgendaItem key={evento.id} evento={evento} />
            ))}
            </ScrollView>
        </View>

      </>)
      :
      (<>
      <View style={{ flex: 1 }}>
        <CustomText style={styles.agendaTitle}>{"AGENDA ACADÉMICA"}</CustomText>
        <View style={styles.listaScrollParentBorder}>
          <ScrollView contentContainerStyle={styles.listaScrollContainer}>
            {listaEventos.map((evento) => (
              !evento.id.startsWith("p") && !evento.esFeriado && (
                <AgendaItem key={evento.id} evento={evento} />
              )
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={{ flex: 0.8 }}>
        <CustomText style={styles.agendaTitle}>AGENDA PERSONAL</CustomText>
        <View style={styles.listaScrollParentBorder}>
          <ScrollView contentContainerStyle={styles.listaScrollContainer}>
            {listaCompleta().map((evento) => (
              evento.id.startsWith("p") && (
                <AgendaItem key={evento.id} evento={evento} />
              )
            ))}
          </ScrollView>
        </View>
      </View>
      </>)
      }

      <View style={styles.agendaBtnContainer}>

        <TouchableOpacity onPress={() => router.push('/agenda')} style={[styles.agendaBtn, {flex: 6.5, borderBottomRightRadius: 0 }]}>
          <CustomText style={styles.agendaBtnText}>DETALLES</CustomText>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setSeparada(!separada)}style={[styles.agendaBtn, { backgroundColor: "#fff" }]}>
          <Ionicons name={separada ? 'eye' : 'eye-off'} size={26} color={azulClaro} style={styles.eyeIcon}/>
          {/* <CustomText style={styles.agendaBtnText}>{"VISTA"}</CustomText> */}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listaScrollParentBorder: {
    flex: 1,
    borderWidth: 1,
    borderColor:  grisBorde,
    borderRadius: 0
  },
  listaScrollContainer: {
    gap: 2,
    paddingTop: 0,
    backgroundColor: "#fff"
  },
  agendaContainer: {
    // height: "calc(60vh - 120px)"
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    
    marginVertical: 0,
    borderBottomRightRadius: 24,
    ...getShadowStyle(3),
    borderWidth: 0.5,
    borderColor: grisBorde
  },
  agendaTitle: {
    color: azulClaro,
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingBottom: 8,
    paddingTop: 10
  },
  agendaBtnContainer: {
    paddingTop: 10,
    paddingBottom: 15,
    gap: 10,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  agendaBtn: {
    flex: 1,
    height: "100%",
    textAlign: "center",
    alignItems: "center",
    backgroundColor: azulClaro,
    borderRadius: 0,
    borderBottomRightRadius: 16,
    ...getShadowStyle( 2)
  },
  agendaBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    paddingVertical: 8,
    textAlign: "center"
  },
    eyeIcon: {
    transform: [{ translateY: 6 }]
  }
});
