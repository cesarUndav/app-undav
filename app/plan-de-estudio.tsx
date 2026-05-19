// app/plan-de-estudio.tsx

import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import CustomText from '../components/CustomText';
import {
  ObtenerMateriasConPlan,
  Plan,
  Materia,
  infoBaseUsuarioActual,
} from '@/data/DatosUsuarioGuarani';
import ListaItem from '@/components/ListaItem';
import LoadingWrapper from '@/components/LoadingWrapper';
import { negroAzulado } from '@/constants/Colors';
import BarraBusqueda, { coincideBusqueda } from '@/components/BarraBusqueda';
import FondoGradiente from '@/components/FondoGradiente';
import BotonTextoSIU from '@/components/BotonTextoSIU';
import DropdownPropuestas from '@/components/DropdownPropuestas';

function codPeriodoToNumber(cod: number): number {
  switch (cod) {
    case 102:
      return 1;
    case 103:
      return 2;
    default:
      return 0;
  }
}

function SNToString(letra: string) {
  if (letra === 'S') return 'Sí';
  return 'No';
}

function materiaEsOpcional(m: Materia): boolean {
  return m.anio_de_cursada == null;
}

function MateriaToString(m: Materia): string {
  let str = '';

  if (materiaEsOpcional(m)) {
    str += 'Materia Electiva';
  } else {
    str += `Año ${m.anio_de_cursada} Cuatrimestre ${codPeriodoToNumber(
      m.periodo_de_cursada
    )}`;
  }

  str += `\nHoras semanales: ${Number(m.horas_semanales)} (${Number(
    m.horas_totales
  )} horas totales)
Promocionable: ${SNToString(m.permite_promocion)} / Permite rendir libre: ${SNToString(
    m.permite_rendir_libre
  )}`;

  return str;
}

function PlanInfoString(
  plan: Plan | null,
  cantidadOpcionales: number
): string {
  return plan
    ? `Versión del plan: ${plan.nombre}
Duración teórica: ${plan.duracion_teorica} (${plan.duracion_en_anios} años)
Cantidad de materias: ${plan.cnt_materias} (${cantidadOpcionales} electivas)`
    : 'No hay plan de estudio.';
}

export default function MateriasPlan() {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [cantidadOpcionales, setCantidadOpcionales] = useState(-1);
  const [recargar, setRecargar] = useState(0);
  const [search, setSearch] = useState('');

  const materiasMostradas = plan?.materias.filter((materia) =>
    coincideBusqueda(materia.nombre, search)
  );

  function mostrarListaMaterias() {
    if (!materiasMostradas) return null;

    return materiasMostradas.map((m) => (
      <ListaItem
        key={m.nombre_abreviado}
        title={m.nombre}
        subtitle={MateriaToString(m)}
      />
    ));
  }

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const planObtenido = await ObtenerMateriasConPlan();
        setPlan(planObtenido);

        if (planObtenido != null) {
          setCantidadOpcionales(
            planObtenido.materias.filter((m) => materiaEsOpcional(m)).length
          );
        }
      } catch (error) {
        console.error('Error al obtener plan de estudio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [recargar]);

  return (
    <FondoGradiente>
      <LoadingWrapper loading={loading}>
        <DropdownPropuestas
          propuestas={infoBaseUsuarioActual.propuestas}
          indiceSeleccionado={infoBaseUsuarioActual.indicePropuestaSeleccionada}
          onSeleccionar={(nuevoIdx) => {
            infoBaseUsuarioActual.indicePropuestaSeleccionada = nuevoIdx;
            setRecargar((r) => r + 1);
          }}
        />

        <CustomText weight="bold" style={styles.estadisticas}>
          {PlanInfoString(plan, cantidadOpcionales)}
        </CustomText>

        <ScrollView contentContainerStyle={styles.listaContainer}>
          {mostrarListaMaterias()}
        </ScrollView>

        <View style={styles.footerContainer}>
          <BarraBusqueda value={search} onChangeText={setSearch} />

          <BotonTextoSIU
            label="Ver en el SIU Guaraní"
            url="https://academica.undav.edu.ar/g3w/plan_estudio"
          />
        </View>
      </LoadingWrapper>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  listaContainer: {
    gap: 8,
  },
  footerContainer: {
    paddingTop: 10,
    gap: 10,
  },
  estadisticas: {
    fontSize: 16,
    lineHeight: 22,
    color: negroAzulado,
    marginVertical: 0,
    marginHorizontal: 15,
    paddingBottom: 10,
  },
});