// components/CalendarioMensual.tsx

import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from '@/components/CustomText';
import {
  azulLogoUndav,
  azulMedioUndav,
  celesteSIU,
  negroAzulado,
} from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';

interface CalendarioMensualProps {
  actividadesPorDia: { [fecha: string]: number };
  diaSeleccionadoActualmente: Date;
  diaHoy: Date;
  onSelectDay: (fecha: Date) => void;
  onSelectMonthChange?: (mes: number, anio: number) => void;
}

function DateToISOStringNoTime(fecha: Date): string {
  return fecha.toISOString().split('T')[0];
}

function getDiasDelMes(mes: number, anio: number): Date[] {
  const dias: Date[] = [];
  const fecha = new Date(anio, mes, 1);

  while (fecha.getMonth() === mes) {
    dias.push(new Date(fecha));
    fecha.setDate(fecha.getDate() + 1);
  }

  return dias;
}

function obtenerPrimerDiaSemana(mes: number, anio: number): number {
  return new Date(anio, mes, 1).getDay();
}

const diasSemana = ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'];

const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const nombreMes = (mes: number) => meses[mes];

const blanco = '#fff';
const colorSeleccionado = celesteSIU;
const colorTextoSeleccionado = blanco;
const colorHoy = azulLogoUndav;
const actividadesColor = azulMedioUndav;

const CalendarioMensual: React.FC<CalendarioMensualProps> = ({
  actividadesPorDia,
  diaSeleccionadoActualmente,
  diaHoy,
  onSelectDay,
  onSelectMonthChange,
}) => {
  const [mesActual, setMesActual] = useState(diaHoy.getMonth());
  const [anioActual, setAnioActual] = useState(diaHoy.getFullYear());

  useEffect(() => {
    onSelectMonthChange?.(mesActual, anioActual);
  }, [mesActual, anioActual]);

  const diasDelMes = getDiasDelMes(mesActual, anioActual);
  const primerDiaSemana = obtenerPrimerDiaSemana(mesActual, anioActual);

  const celdasVacias = Array.from({ length: primerDiaSemana }, (_, i) => (
    <View key={`empty-${i}`} style={styles.diaCelda} />
  ));

  const cambiarMes = (delta: number) => {
    let nuevoMes = mesActual + delta;
    let nuevoAnio = anioActual;

    if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAnio -= 1;
    } else if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAnio += 1;
    }

    setMesActual(nuevoMes);
    setAnioActual(nuevoAnio);
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezadoMes}>
        <TouchableOpacity onPress={() => cambiarMes(-1)}>
          <CustomText style={styles.flecha}>
            ←
          </CustomText>
        </TouchableOpacity>

        <CustomText weight="bold" style={styles.textoMes}>
          {`${nombreMes(mesActual)} ${anioActual}`}
        </CustomText>

        <TouchableOpacity onPress={() => cambiarMes(1)}>
          <CustomText style={styles.flecha}>
            →
          </CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.filaDiasSemana}>
        {diasSemana.map((dia, index) => (
          <CustomText
            key={index}
            weight="bold"
            style={styles.textoDiaSemana}
          >
            {dia}
          </CustomText>
        ))}
      </View>

      <View style={styles.gridDias}>
        {celdasVacias}

        {diasDelMes.map((fecha, idx) => {
          const fechaStr = DateToISOStringNoTime(fecha);
          const cantidadActividades = actividadesPorDia[fechaStr] ?? 0;

          const esHoy =
            DateToISOStringNoTime(fecha) === DateToISOStringNoTime(diaHoy);

          const esSeleccionado =
            DateToISOStringNoTime(fecha) ===
            DateToISOStringNoTime(diaSeleccionadoActualmente);

          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.diaCelda,
                esHoy && styles.hoy,
                esSeleccionado && styles.seleccionado,
              ]}
              onPress={() => onSelectDay(fecha)}
            >
              <View style={styles.diaContenido}>
                <CustomText
                  weight="bold"
                  style={[
                    styles.textoDiaNumero,
                    (esSeleccionado || esHoy) && styles.textoDiaSeleccionado,
                  ]}
                >
                  {fecha.getDate()}
                </CustomText>

                {cantidadActividades > 0 && (
                  <View style={styles.indicador}>
                    <CustomText weight="bold" style={styles.textoIndicador}>
                      {cantidadActividades}
                    </CustomText>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    borderRadius: 10,
    backgroundColor: blanco,
    ...getShadowStyle(4),
  },
  encabezadoMes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: azulMedioUndav,
    padding: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textoMes: {
    fontSize: 16,
    color: blanco,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  flecha: {
    fontSize: 20,
    color: blanco,
    paddingHorizontal: 10,
  },
  filaDiasSemana: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 6,
    backgroundColor: azulMedioUndav,
  },
  textoDiaSemana: {
    flex: 1,
    textAlign: 'center',
    color: blanco,
  },
  gridDias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 4,
  },
  diaCelda: {
    marginVertical: 0,
    width: `${100 / 7 - 0.01}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  diaContenido: {
    padding: 14,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  textoDiaNumero: {
    fontSize: 16,
    color: negroAzulado,
  },
  textoDiaSeleccionado: {
    color: colorTextoSeleccionado,
  },
  hoy: {
    backgroundColor: colorHoy,
    borderRadius: 999,
  },
  seleccionado: {
    backgroundColor: colorSeleccionado,
    borderRadius: 999,
    borderWidth: 3,
    marginVertical: -3,
    height: 0,
    transform: [{ translateY: 3 }],
    borderColor: azulLogoUndav,
    zIndex: 2,
  },
  indicador: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: actividadesColor,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  textoIndicador: {
    color: blanco,
    fontSize: 11,
  },
});

export default CalendarioMensual;