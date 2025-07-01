import React, { useEffect, useState } from 'react';
import {  StyleSheet, ScrollView } from 'react-native';

import CustomText from '../components/CustomText';
import BotonTextoLink from '@/components/BotonTextoLink';
import FondoGradiente from '@/components/FondoGradiente';

import { negroAzulado } from '@/constants/Colors';
import LoadingWrapper from '@/components/LoadingWrapper';

import he from 'he';  // IMPORTANTE: para decodificar entidades HTML
async function obtenerLinksYLabelsDelPrimerParrafo(): Promise<{ href: string; label: string }[]> {
  const response = await fetch("https://undav.edu.ar/index.php?idcateg=129");
  const html = await response.text();

  const contenedorMatch = html.match(/<div[^>]*id=["']contenidocentral["'][^>]*>([\s\S]*?)<\/div>/i);
  if (!contenedorMatch || !contenedorMatch[1]) return [];

  const contenidoCentral = contenedorMatch[1];

  const parrafoMatch = contenidoCentral.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!parrafoMatch || !parrafoMatch[1]) return [];

  const primerParrafoHtml = parrafoMatch[1];

  const regex = /<a[^>]*href=["']([^"']+)["'][^>]*>\s*<strong[^>]*>([\s\S]*?)<\/strong>\s*<\/a>/gi;

  const resultados: { href: string; label: string }[] = [];
  let match;
  while ((match = regex.exec(primerParrafoHtml)) !== null) {
    resultados.push({
      href: match[1],
      label: he.decode(match[2].replace(/<[^>]*>/g, '').trim()).replace(/^- /, ""), // <--- Aquí quitamos " - "
    });
  }

  return resultados;
}


export default function Calendario() {
  const [loading, setLoading] = useState(true);
  const [linksWebCal, setLinksWebCal] = useState<{ href: string; label: string }[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(false);

  const handleObtenerLinks = async () => {
    setLoadingLinks(true);
    try {
      const links = await obtenerLinksYLabelsDelPrimerParrafo();
      setLinksWebCal(links);
    } catch (error) {
      console.error("Error al obtener links:", error);
    } finally {
      setLoadingLinks(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleObtenerLinks();
  }, []);

  return (
    <FondoGradiente>
      <LoadingWrapper loading={loading}>
        <ScrollView contentContainerStyle={styles.listaContainer}>
          {linksWebCal.length > 0 && (
            <>
              <CustomText style={styles.title}>
                {`Resoluciones más recientes del Calendario Académico en formato PDF:`}
              </CustomText>
              {linksWebCal.map((linkObj, i) => (
                <BotonTextoLink
                  key={i}
                  url={"https://undav.edu.ar/" + linkObj.href}
                  label={linkObj.label}
                />
              ))}
            </>
          )}
          {loadingLinks && (
            <CustomText style={{ marginTop: 20, color: negroAzulado }}>
              Cargando links...
            </CustomText>
          )}
        </ScrollView>
      </LoadingWrapper>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  listaContainer: {
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: negroAzulado,
    alignSelf: 'center'
  }
});
