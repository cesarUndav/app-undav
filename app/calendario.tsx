// calendario.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CustomText from '../components/CustomText';
import ListaItem from '@/components/ListaItem';
import FondoGradiente from '@/components/FondoGradiente';

import LoadingWrapper from '@/components/LoadingWrapper';
import { negroAzulado, azulLogoUndav, azulMedioUndav, celesteSIU } from '@/constants/Colors';
import { getShadowStyle } from '@/constants/ShadowStyle';
import { eventoAgendaToFechaString, listaCompleta, cargarEventosAcademicos } from '@/data/agenda';
import { router } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

export type Actividad = {
  id: string;
  body: string;
  title: string;
  esFeriado?: boolean;
};

interface CalendarioMensualProps {
  actividadesPorDia: { 
    [fecha: string]: { cantidad: number; color: 'azul' | 'rojo' } 
  };
  diaSeleccionadoActualmente: Date;
  diaHoy: Date;
  onSelectDay: (fecha: Date) => void;
  onSelectMonthChange?: (mes: number, anio: number) => void;
}

function fechaSumarDias(diasASumar: number, fechaOpcional?: Date): Date {
  const base = fechaOpcional ? fechaOpcional.getTime() : Date.now();
  return new Date(base + diasASumar * 86400000);
}

function DateToISOStringNoTime(fecha: Date): string {
  if (!fecha || !(fecha instanceof Date)) fecha = new Date();
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

function IndexToDiaString(index: number): string {
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  return dias[index] || '';
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
const nombreMes = (mes: number) =>
  ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][mes];


// 🌟 SUB-COMPONENTE: CALENDARIO MENSUAL 🌟
const CalendarioMensual: React.FC<CalendarioMensualProps> = ({
  actividadesPorDia,
  diaSeleccionadoActualmente,
  diaHoy,
  onSelectDay,
  onSelectMonthChange,
}) => {
  const fechaSegura = diaSeleccionadoActualmente instanceof Date ? diaSeleccionadoActualmente : (diaHoy || new Date());
  
  const mesActual = fechaSegura.getMonth();
  const anioActual = fechaSegura.getFullYear();

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
    
    onSelectMonthChange?.(nuevoMes, nuevoAnio);
  };

  return (
    <View style={styles.contenedorCalendario}>
      <View style={styles.encabezadoMes}>
        <TouchableOpacity onPress={() => cambiarMes(-1)}>
          <Text style={styles.flecha}>{'←'}</Text>
        </TouchableOpacity>

        <Text style={styles.textoMes}>{`${nombreMes(mesActual)} ${anioActual}`}</Text>

        <TouchableOpacity onPress={() => cambiarMes(1)}>
          <Text style={styles.flecha}>{'→'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filaDiasSemana}>
        {diasSemana.map((dia, index) => (
          <Text key={index} style={styles.textoDiaSemana}>
            {dia}
          </Text>
        ))}
      </View>

      <View style={styles.gridDias}>
        {celdasVacias}

        {diasDelMes.map((fecha, idx) => {
          const fechaStr = DateToISOStringNoTime(fecha);
          const datosDia = actividadesPorDia[fechaStr];
          const cantidadActividades = datosDia ? datosDia.cantidad : 0;
          const tipoColor = datosDia ? datosDia.color : 'azul';

          const esHoy = DateToISOStringNoTime(fecha) === DateToISOStringNoTime(diaHoy);
          const esSeleccionado = DateToISOStringNoTime(fecha) === DateToISOStringNoTime(diaSeleccionadoActualmente);

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
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', aspectRatio: 1, position: 'relative' }}>
                <Text style={[styles.textoDiaNumero, (esSeleccionado || esHoy) && { color: colorTextoSeleccionado }]}>
                  {fecha.getDate()}
                </Text>
                
                {cantidadActividades > 0 && (
                  <View style={[
                    styles.indicador, 
                    { backgroundColor: tipoColor === 'azul' ? azulMedioUndav : colorRojoAlerta }
                  ]}>
                    <Text style={styles.textoIndicador}>{cantidadActividades}</Text>
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


// 🌟 COMPONENTE PRINCIPAL DE LA PANTALLA 🌟
export default function Calendario() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);

  const diaHoy = new Date();
  const hoyStr = DateToISOStringNoTime(diaHoy);

  const [actividadesPorFecha, setActividadesPorFecha] = useState<{ [fecha: string]: Actividad[] }>({});
  const [cantidadActividadesPorFecha, setCantidadActividadesPorFecha] = useState<{ 
    [fecha: string]: { cantidad: number; color: 'azul' | 'rojo' } 
  }>({});
  const [listaActividadesDiaSeleccionado, setListaActividadesDiaSeleccionado] = useState<Actividad[]>([]);
  const [tituloPagina, setTituloPagina] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(diaHoy);

  const [mesAnioActual, setMesAnioActual] = useState({ 
    mes: diaHoy.getMonth(), 
    anio: diaHoy.getFullYear() 
  });

  const [ocultarCursadas, setOcultarCursadas] = useState(false);

  // Efecto 1: Carga masiva conectada al Apache de Docker
  useEffect(() => {
    const cargarTodoElMes = async () => {
      setLoading(true);
      console.log(`🏃‍♂️ [Calendario] Iniciando carga de datos para el mes ${mesAnioActual.mes + 1}/${mesAnioActual.anio}`);
      
      try {
        // 1. Carga inicial paralela de los eventos académicos fijos (PHP base)
        await cargarEventosAcademicos();

        // 2. Calculamos dinámicamente el primer y último día del mes actual para la Query del endpoint
        const todosLosEventos = listaCompleta();
        const actividadesTemp: { [fecha: string]: Actividad[] } = {};

        // 4. Mapeamos los eventos con fecha puntual (Feriados y Exámenes puntuales)
        todosLosEventos.forEach((evento, idx) => {
          if (!evento.fechaInicio || !evento.fechaFin) return;

          const fechaIniStr = DateToISOStringNoTime(new Date(evento.fechaInicio));
          const fechaFinStr = DateToISOStringNoTime(new Date(evento.fechaFin));

          if (fechaIniStr === fechaFinStr) {
            if (!actividadesTemp[fechaIniStr]) actividadesTemp[fechaIniStr] = [];
            actividadesTemp[fechaIniStr].push({
              id: `e-${idx}`,
              title: evento.titulo,
              body: eventoAgendaToFechaString(evento),
              esFeriado: evento.esFeriado,
            });
          } else {
            if (!actividadesTemp[fechaIniStr]) actividadesTemp[fechaIniStr] = [];
            actividadesTemp[fechaIniStr].push({
              id: `e-${idx}-ini`,
              title: `[Inicio] ${evento.titulo}`,
              body: eventoAgendaToFechaString(evento),
              esFeriado: evento.esFeriado,
            });

            if (!actividadesTemp[fechaFinStr]) actividadesTemp[fechaFinStr] = [];
            actividadesTemp[fechaFinStr].push({
              id: `e-${idx}-fin`,
              title: `[Fin] ${evento.titulo}`,
              body: eventoAgendaToFechaString(evento),
              esFeriado: evento.esFeriado,
            });
          }
        });

        // 6. Impactamos el estado unificado de renderizado
        setActividadesPorFecha(actividadesTemp);

      } catch (err) {
        console.error("❌ Error catastrófico en la estructura del calendario:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarTodoElMes();
  }, [mesAnioActual.mes, mesAnioActual.anio]);

  // 🔄 RECALCULAR CONTADORES: Escucha los cambios de 'actividadesPorFecha' Y 'ocultarCursadas'
  useEffect(() => {
    const nuevasCantidades: { [fecha: string]: { cantidad: number; color: 'azul' | 'rojo' } } = {};
    
    for (const f in actividadesPorFecha) {
      let listaDelDia = actividadesPorFecha[f] || [];
      
      if (ocultarCursadas) {
        listaDelDia = listaDelDia.filter(act => 
          !act.id.includes('cursada') && !act.title.toLowerCase().includes('cursada')
        );
      }

      if (listaDelDia.length > 0) {
        const soloTieneCursadas = listaDelDia.every(act => 
          act.id.includes('cursada') || act.title.toLowerCase().includes('cursada')
        );
        nuevasCantidades[f] = {
          cantidad: listaDelDia.length,
          color: soloTieneCursadas ? 'azul' : 'rojo'
        };
      }
    }
    setCantidadActividadesPorFecha(nuevasCantidades);
  }, [actividadesPorFecha, ocultarCursadas]);


  // Efecto 2: Gestión de selección de días, textos y filtrado dinámico en lista inferior
  useEffect(() => {
    const fSeleccionadaSegura = fechaSeleccionada instanceof Date ? fechaSeleccionada : new Date();
    const fechaStr = DateToISOStringNoTime(fSeleccionadaSegura);

    let actividadesDelDia = actividadesPorFecha[fechaStr] ?? [];

    if (ocultarCursadas) {
      actividadesDelDia = actividadesDelDia.filter(act => 
        !act.id.includes('cursada') && !act.title.toLowerCase().includes('cursada')
      );
    }

    const nombreDia = IndexToDiaString(fSeleccionadaSegura.getDay());
    const mensajeDia = `${nombreDia} ${fSeleccionadaSegura.getDate()}`;

    let tituloPaginaDia = '';

    if (actividadesDelDia.length === 0) {
      tituloPaginaDia = `No hay actividades ${
        fechaStr === hoyStr ? `hoy, ${mensajeDia}` : `el ${mensajeDia}`
      }`;
    } else {
      if (fechaStr === hoyStr) {
        tituloPaginaDia = 'hoy, ';
      } else {
        const fechaAyer = DateToISOStringNoTime(fechaSumarDias(-1));
        const fechaManiana = DateToISOStringNoTime(fechaSumarDias(1));
        if (fechaStr === fechaManiana) tituloPaginaDia = "mañana, ";
        else if (fechaStr === fechaAyer) tituloPaginaDia = "ayer, ";
      }

      tituloPaginaDia += mensajeDia;
    }

    setTituloPagina(tituloPaginaDia);
    setListaActividadesDiaSeleccionado(actividadesDelDia);
  }, [fechaSeleccionada, actividadesPorFecha, mesAnioActual.mes, mesAnioActual.anio, ocultarCursadas]);

  const manejarToggleCursadas = () => {
    setOcultarCursadas(prev => !prev);
  };

  return (
    <>
    <FondoGradiente>
      <LoadingWrapper loading={loading}>
        <CalendarioMensual
          actividadesPorDia={cantidadActividadesPorFecha}
          diaSeleccionadoActualmente={fechaSeleccionada}
          diaHoy={diaHoy}
          onSelectDay={setFechaSeleccionada}
          onSelectMonthChange={(nuevoMes, nuevoAnio) => {
            setMesAnioActual({ mes: nuevoMes, anio: nuevoAnio });
            setFechaSeleccionada(new Date(nuevoAnio, nuevoMes, 1));
          }} 
        />

        <View style={styles.titleContainer}>
          <CustomText weight="bold" style={styles.title}>
            {tituloPagina}
          </CustomText>
        </View>
      </LoadingWrapper>

      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.listaContainer}>
          {listaActividadesDiaSeleccionado.map((actividad, index) => {
            const esUltimo = index === listaActividadesDiaSeleccionado.length - 1;
            const estiloExtra = esUltimo ? { borderBottomRightRadius: 20 } : undefined;
            const colorTitulo = actividad.esFeriado ? "#6CACE4" : undefined;
            
            return (
              <ListaItem
                key={actividad.id}
                title={actividad.title}
                subtitle={actividad.body}
                styleExtra={estiloExtra}
                titleColor={colorTitulo}
              />
            );
          })}
        </ScrollView>
        


      </View>
    </FondoGradiente>
    <View style={[ stylesFlotante.floatingBox, { bottom: insets.bottom + 60 + 16 }]}>
          <View style={stylesFlotante.botonesColumna}>
            <TouchableOpacity
            onPress={() => router.push('/agenda')}
              style={[stylesFlotante.openBtn, {backgroundColor: azulLogoUndav}]}
            >
              <Ionicons name="list" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
      </View>
    </>
  );
}

const stylesFlotante = StyleSheet.create({
  floatingBox: {
    position: 'absolute',
    right: 16,   
    zIndex: 10,
    flexDirection: 'row',        
    alignItems: 'flex-end',      
    justifyContent: 'flex-end',
  },
  botonesColumna: {
    flexDirection: 'column',     
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  filterOptionsParent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,             
    width: 200, 
    gap: 6,
    ...getShadowStyle(6), 
  },
  openBtn: {
    backgroundColor: azulLogoUndav,
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...getShadowStyle(4),
  },
});

const blanco = "#fff";
const colorTextoSeleccionado = blanco;
const colorRojoAlerta = "#c31700"; 

const styles = StyleSheet.create({
  contenedorCalendario: {
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
    fontWeight: 'bold',
    color: blanco,
    textAlign: "center",
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
    fontWeight: 'bold',
  },
  gridDias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 4
  },
  diaCelda: {
    width: `${(100 / 7)-0.01}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoDiaNumero: {
    fontSize: 16,
    fontWeight:"bold",
    color: negroAzulado,
  },
  hoy: {
    backgroundColor: azulLogoUndav,
    borderRadius: 999,
  },
  seleccionado: {
    backgroundColor: celesteSIU,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: azulLogoUndav,
    zIndex: 2,
  },
  indicador: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  textoIndicador: {
    color: blanco,
    fontSize: 11,
    fontWeight: 'bold',
  },
  listaContainer: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    color: negroAzulado,
    marginHorizontal: 10,
    textAlign: 'center',
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
  }
});