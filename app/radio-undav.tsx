// app/radio-undav.tsx

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import CustomText from '@/components/CustomText';

import {
  azulLogoUndav,
  azulMedioUndav,
  azulClaro,
  grisTexto,
} from '@/constants/Colors';

const RADIO_STREAM_URL = 'https://radiostream.undav.edu.ar/radioundav';
const RADIO_WEB_URL = 'https://radio.undav.edu.ar/';

export default function RadioUndav() {
  const player = useAudioPlayer(RADIO_STREAM_URL);
  const status = useAudioPlayerStatus(player);

  const estaReproduciendo = status.playing;
  const estaCargando = status.isBuffering || !status.isLoaded;

  const animacionPulso = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let loopAnimacion: Animated.CompositeAnimation | null = null;

    if (estaReproduciendo) {
      animacionPulso.setValue(0);

      loopAnimacion = Animated.loop(
        Animated.sequence([
          Animated.timing(animacionPulso, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animacionPulso, {
            toValue: 0,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      loopAnimacion.start();
    } else {
      animacionPulso.stopAnimation();
      animacionPulso.setValue(0);
    }

    return () => {
      if (loopAnimacion) {
        loopAnimacion.stop();
      }
    };
  }, [estaReproduciendo, animacionPulso]);

  const alternarReproduccion = () => {
    if (estaReproduciendo) {
      player.pause();
      return;
    }

    player.play();
  };

  const abrirSitioRadio = () => {
    Linking.openURL(RADIO_WEB_URL);
  };

  const haloScale = animacionPulso.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.8],
  });

  const haloOpacity = animacionPulso.interpolate({
    inputRange: [0, 1],
    outputRange: [0.18, 0.45],
  });

  const textoEstadoPrincipal = estaReproduciendo ? 'AL AIRE' : 'PAUSADA';

  const textoEstadoSecundario = estaReproduciendo
    ? 'Señal online en vivo'
    : estaCargando
      ? 'Tocá reproducir para escuchar la transmisión'
      : 'Transmisión detenida';

  return (
    <FondoScrollGradiente gap={10}>
      <View style={styles.playerCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconoPrincipal}>
            <Ionicons name="radio-outline" size={34} color="white" />
          </View>

          <View style={styles.headerTextContainer}>
            <CustomText weight="bold" style={styles.playerTitulo}>
              Radio UNDAV
            </CustomText>

            <CustomText style={styles.playerDescripcion}>
              Radio pública de la Universidad Nacional de Avellaneda
            </CustomText>
          </View>
        </View>

        <View style={styles.estadoCard}>
          <View style={styles.estadoFila}>
            <View style={styles.estadoIndicadorWrapper}>
              {estaReproduciendo && (
                <Animated.View
                  style={[
                    styles.estadoHalo,
                    {
                      opacity: haloOpacity,
                      transform: [{ scale: haloScale }],
                    },
                  ]}
                />
              )}

              <View
                style={[
                  styles.estadoIndicador,
                  estaReproduciendo
                    ? styles.estadoIndicadorActivo
                    : styles.estadoIndicadorInactivo,
                ]}
              />
            </View>

            <CustomText weight="bold" style={styles.estadoPrincipal}>
              {textoEstadoPrincipal}
            </CustomText>
          </View>

          <CustomText style={styles.estadoSecundario}>
            {textoEstadoSecundario}
          </CustomText>
        </View>

        <TouchableOpacity
          style={[
            styles.botonPlay,
            estaReproduciendo && styles.botonPlayActivo,
          ]}
          onPress={alternarReproduccion}
          activeOpacity={0.85}
        >
          <Ionicons
            name={estaReproduciendo ? 'pause' : 'play'}
            size={24}
            color="white"
          />

          <CustomText weight="bold" style={styles.botonPlayTexto}>
            {estaReproduciendo ? 'Pausar radio' : 'Escuchar en vivo'}
          </CustomText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.webCard}
        onPress={abrirSitioRadio}
        activeOpacity={0.85}
      >
        <View style={styles.webIconContainer}>
          <Ionicons name="globe-outline" size={22} color="white" />
        </View>

        <View style={styles.webTextContainer}>
          <CustomText weight="bold" style={styles.webTitulo}>
            Sitio web de Radio UNDAV
          </CustomText>

          <CustomText style={styles.webDescripcion}>
            Programación, contenidos y más información.
          </CustomText>
        </View>

        <Ionicons name="open-outline" size={20} color={azulLogoUndav} />
      </TouchableOpacity>
    </FondoScrollGradiente>
  );
}

const styles = StyleSheet.create({
  playerCard: {
    backgroundColor: 'white',
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 28,
  },
  cardHeader: {
    backgroundColor: azulLogoUndav,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 24,
  },
  iconoPrincipal: {
    width: 58,
    height: 58,
    backgroundColor: azulClaro,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 18,
  },
  headerTextContainer: {
    flex: 1,
  },
  playerTitulo: {
    fontSize: 24,
    color: 'white',
    marginBottom: 2,
  },
  playerDescripcion: {
    fontSize: 14,
    lineHeight: 19,
    color: 'white',
  },
  estadoCard: {
    marginTop: 14,
    marginBottom: 12,
    backgroundColor: '#f4f4f4',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 18,
  },
  estadoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  estadoIndicadorWrapper: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  estadoHalo: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#22c55e',
  },
  estadoIndicador: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  estadoIndicadorActivo: {
    backgroundColor: '#22c55e',
  },
  estadoIndicadorInactivo: {
    backgroundColor: '#ef4444',
  },
  estadoPrincipal: {
    fontSize: 16,
    color: azulLogoUndav,
    letterSpacing: 0.8,
  },
  estadoSecundario: {
    fontSize: 13,
    lineHeight: 18,
    color: grisTexto,
    marginLeft: 30,
  },
  botonPlay: {
    backgroundColor: azulClaro,
    paddingVertical: 14,
    paddingHorizontal: 18,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 24,
  },
  botonPlayActivo: {
    backgroundColor: azulMedioUndav,
  },
  botonPlayTexto: {
    fontSize: 16,
    color: 'white',
    marginLeft: 10,
  },
  webCard: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 22,
  },
  webIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: azulMedioUndav,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 12,
  },
  webTextContainer: {
    flex: 1,
  },
  webTitulo: {
    fontSize: 15,
    color: azulLogoUndav,
    marginBottom: 1,
  },
  webDescripcion: {
    fontSize: 12,
    lineHeight: 16,
    color: grisTexto,
  },
});