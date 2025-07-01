import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import CustomText from '../components/CustomText';
import {
  ObtenerMateriasConPlan,
  Plan,
  Materia
} from '@/data/DatosUsuarioGuarani';
import ListaItem from '@/components/ListaItem';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import LoadingWrapper from '@/components/LoadingWrapper';
import { negroAzulado } from '@/constants/Colors';
import BarraBusqueda, { coincideBusqueda } from '@/components/BarraBusqueda';
import FondoGradiente from '@/components/FondoGradiente';

function codPeriodoToNumber(cod:number):number {
  switch(cod){
    case 102: return 1;
    case 103: return 2;
    default: return 0;
  }
}
function numToOrdinalString(num:number):string {
  switch(num){
    case 1: return "primer";
    case 2: return "segundo";
    case 3: return "tercer";
    case 4: return "cuarto";
    case 5: return "quinto";
    case 6: return "sexto";
    case 7: return "séptimo";
    case 8: return "octavo";
    case 9: return "noveno";
    case 10: return "décimo";
    default: return ""; 
  }
}
function SNToString(letra:string) {
  if (letra == "S") return "Si";
  else return "No";
}
function materiaEsOpcional(m:Materia):boolean {return m.anio_de_cursada == null;}
function MateriaToString(m:Materia):string {
  let str:string = "";
  materiaEsOpcional(m) ? str += "Materia Electiva" :
  str += `Año ${m.anio_de_cursada} Cuatrimestre ${codPeriodoToNumber(m.periodo_de_cursada)}`
  
  str += `\nhoras semanales: ${Number(m.horas_semanales)} (${Number(m.horas_totales)} horas totales)
Promocionable: ${SNToString(m.permite_promocion)} / Permite rendir libre: ${SNToString(m.permite_rendir_libre)}`;
  return str;
}

export default function MateriasPlan() {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [cantidadOpcionales, setCantidadOpcionales] = useState(-1);
  const [mostrarAprobadas, setMostrarAprobadas] = useState(true);

  // BARRA DE BÚSQUEDA
  const [search, setSearch] = useState('');
  const materiasMostradas = plan?.materias.filter((materia) =>
    coincideBusqueda(materia.nombre, search)
  );

  function mostrarListaMaterias() {
    if (!materiasMostradas) return;
    return materiasMostradas.map((m) => (
      <ListaItem
        key={m.nombre_abreviado}
        title={m.nombre}
        subtitle={MateriaToString(m)}
      />
    ))
  }
  //
  function PlanInfoString(plan:Plan | null):string {
  return plan ?
    `Versión del plan: ${plan.nombre}
Duración teórica: ${plan.duracion_teorica} (${plan.duracion_en_anios} años)
Cantidad de materias: ${plan.cnt_materias} (${cantidadOpcionales} electivas)`
    : "No hay plan de estudio.";
}

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const planObtenido = await ObtenerMateriasConPlan();
        setPlan(planObtenido);
        if (planObtenido != null) setCantidadOpcionales(planObtenido.materias.filter(m => materiaEsOpcional(m) == true).length);
      }
      catch (error) {
        console.error('Error al obtener plan de estudio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  return (
    <FondoGradiente>
      <LoadingWrapper loading={loading}>

        <CustomText style={[styles.estadisticas, {paddingBottom: 10}]}>
          {PlanInfoString(plan)}
        </CustomText>

        <ScrollView contentContainerStyle={{gap: 8}}>
          {mostrarListaMaterias()}
        </ScrollView>


        <View style={{paddingTop: 10}}>
          <BarraBusqueda value={search} onChangeText={setSearch} />
        </View>
      </LoadingWrapper>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: negroAzulado,
    alignSelf: 'center',
    marginVertical: 0,
    marginBottom: 10
  },
  estadisticas: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 'bold',
    color: negroAzulado,
    marginVertical: 0,
    marginHorizontal: 15
  }
});
