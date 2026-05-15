import React from 'react';

import BotonTexto from '../components/BotonTexto';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';

import { api } from "../data/apiFlaskClient";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import AgendaItemEditable from '@/components/AgendaItemEditable';

export default function PruebaFlask() {

  const [eventos, setEventos] = useState([]);
  const [rawData, setRawData] = useState<object | null>(null);

  useEffect(() => {
    async function cargar() {
      try {
        const data = await api.getDatosAppUndav();
        
        // Guardamos todo el JSON para mostrarlo después
        setRawData(data);

        // Si tiene eventos, los cargamos (evita errores si la API aún no los envía)
        setEventos(data.eventos ?? []);

      } catch (error:any) {
        console.log("Error cargando datos:", error.message);
        setRawData({ error: error.message });
      }
    }

    cargar();
  }, []);
  
  return (
    <FondoScrollGradiente gap={4}>

      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
        Datos recibidos
      </Text>

      {eventos.length === 0 ? (
        <Text>No hay Datos cargados.</Text>
      ) : (
        eventos.map((ev, i) => (
//      <AgendaItemEditable key={evento.id} evento={evento} onPressEdit={()=>router.push("/agenda")}/>
          <View key={i} style={{ marginVertical: 8, padding: 10, backgroundColor: "#ffffff20", borderRadius: 10 }}>
            {
              Object.entries(ev).map(([k, v]) => (
                <Text key={k} style={{ fontSize: 14 }}>
                  <Text style={{ fontWeight: "bold" }}>{k}:</Text> {String(v)}
                </Text>
              ))
            }
          </View>
        ))
      )}

      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 40 }}>
        JSON completo recibido
      </Text>

      <View style={{ padding: 10, backgroundColor: "#00000030", borderRadius: 12, marginBottom: 40 }}>
        <Text selectable style={{ fontFamily: "monospace", fontSize: 12 }}>
          {JSON.stringify(rawData, null, 2)}
        </Text>
      </View>

      <BotonTexto 
        label="Boton 1" 
        color="#0e76a8" 
        styleExtra={{ borderBottomRightRadius: 20 }}
        verticalPadding={10}
        fontSize={16}
      />

    </FondoScrollGradiente>
  );
}
