// app/tramites.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import DropdownSeccion from '@/components/DropdownSeccion';
import BotonTextoMail from '@/components/BotonTextoMail';
import BotonTextoTelefono from '@/components/BotonTextoTelefono';
import BotonTexto from '@/components/BotonTexto';
import ListaItem from '@/components/ListaItem';
import LoadingWrapper from '@/components/LoadingWrapper';
import { negroAzulado } from '@/constants/Colors';
import { ObtenerTramites } from '@/data/apiAppUndav';
import BarraBusqueda, { coincideBusqueda } from '@/components/BarraBusqueda';
import FondoGradiente from '@/components/FondoGradiente';

// 🛠️ TIPADOS EXACTOS AJUSTADOS AL JSON REAL DE TU API
type ItemMail = {
  tipo: 'mail';
  label: string;
  mail: string;
  asunto?: string;
  cuerpo?: string;
};

type ItemTelefono = {
  tipo: 'telefono';
  label: string;
  tel: string;
};

type ItemMapa = {
  tipo: 'mapa';
  label: string;
  url: string;
};

type ItemTexto = {
  tipo: 'texto';
  label: string;
};

type ItemContacto = ItemMail | ItemTelefono | ItemMapa | ItemTexto;

type SeccionContacto = {
  titulo: string;
  items: ItemContacto[];
};

export default function Tramites() {
  const [secciones, setSecciones] = useState<SeccionContacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState(false);
  
  // 🎯 ESTADO PARA ALMACENAR LA BÚSQUEDA EN TIEMPO REAL
  const [busqueda, setBusqueda] = useState('');

  // 🛠️ CONTROLADOR DE CARGA ASÍNCRONO DE LA API
  useEffect(() => {
    const cargarContactos = async () => {
      try {
        setLoading(true);
        setErrorCarga(false);
        const res = await ObtenerTramites();
        
        if (Array.isArray(res)) {
          setSecciones(res);
        } else {
          setErrorCarga(true);
        }
      } catch (error) {
        console.error("❌ Error al traer los ítems de contacto desde la API:", error);
        setErrorCarga(true);
      } finally {
        setLoading(false);
      }
    };

    cargarContactos();
  }, []);

  // 🎯 FILTRADO PROACTIVO: Evaluamos las secciones y sus hijos en caliente
  const seccionesFiltradas = secciones
    .map((seccion) => {
      // Filtramos los items de cada sección usando tu helper reactivo
      const itemsFiltrados = seccion.items.filter((item) => {
        // Buscamos coincidencia tanto en el label como en los campos clave del trámite (mail, tel, etc.)
        const textoBuscar = `${item.label} ${item.tipo === 'mail' ? item.mail : ''} ${item.tipo === 'telefono' ? item.tel : ''}`;
        return coincideBusqueda(textoBuscar, busqueda);
      });

      // Retornamos la estructura de la sección pero únicamente con sus hijos válidos
      return {
        ...seccion,
        items: itemsFiltrados,
      };
    })
    // 🧹 Quitamos del mapa las secciones que se quedaron con 0 elementos coincidentes
    .filter((seccion) => seccion.items.length > 0);

  return (
    <FondoGradiente>
      
      {/* 🎯 BARRA DE BÚSQUEDA INTEGRADA EN LA PARTE SUPERIOR */}
      {!loading && !errorCarga && (
        <BarraBusqueda
          placeholder="Buscar trámites, secretarías o correos..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
      )}

      <LoadingWrapper loading={loading}>
        
        {/* Si la API falló, avisamos de manera transparente */}
        {errorCarga && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: negroAzulado, textAlign: 'center', fontSize: 16 }}>
              No se pudo conectar con el servidor. Por favor, intentá nuevamente más tarde.
            </Text>
          </View>
        )}

        {/* 🎯 FEEDBACK VISUAL SI LA BÚSQUEDA NO CONECTA CON NADA */}
        {!loading && !errorCarga && seccionesFiltradas.length === 0 && busqueda.trim() !== '' && (
          <View style={{ padding: 30, alignItems: 'center' }}>
            <Text style={{ color: 'gray', textAlign: 'center', fontSize: 14 }}>
              No se encontraron trámites o contactos que coincidan con "{busqueda}".
            </Text>
          </View>
        )}

        <ScrollView contentContainerStyle={{marginTop: 10, gap: 10}}>
        {/* Renderizado dinámico y filtrado del JSON de la API */}
        {seccionesFiltradas.map((seccion) => (
          <DropdownSeccion 
            key={seccion.titulo} 
            titulo={seccion.titulo}
            // Forzamos la apertura automática de las pestañas si el usuario está buscando activamente algo
            inicialmenteAbierto={busqueda.trim() !== ''} 
          >
            <>
              {seccion.items.map((item, index) => {
                
                // 1. Correos electrónicos
                if (item.tipo === 'mail' && item.mail) {
                  return (
                    <BotonTextoMail
                      key={`mail-${index}-${item.mail}`}
                      label={item.label}
                      mail={item.mail}
                      asunto={item.asunto || ''}
                      cuerpo={item.cuerpo || ''}
                    />
                  );
                }

                // 2. Teléfonos
                if (item.tipo === 'telefono' && item.tel) {
                  return (
                    <BotonTextoTelefono
                      key={`tel-${index}-${item.tel}`}
                      label={item.label}
                      tel={item.tel}
                    />
                  );
                }

                // 3. Mapas / Ubicaciones físicas
                if (item.tipo === 'mapa' && item.url) {
                  return (
                    <BotonTexto
                      key={`mapa-${index}-${item.url}`}
                      label={item.label}
                      url={item.url}
                    />
                  );
                }

                // 4. Casos de texto simple o tipos desconocidos que mande la API
                return (
                  <ListaItem
                    key={`texto-${index}-${item.label}`}
                    title={item.label}
                    titleColor={negroAzulado}
                  />
                );
              })}
            </>
          </DropdownSeccion>
        ))}
        </ScrollView>
      </LoadingWrapper>
    </FondoGradiente>
  );
}