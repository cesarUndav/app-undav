import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import BotonTexto from '@/components/BotonTexto';
import FondoGradiente from '@/components/FondoGradiente';

import { negroAzulado } from '@/constants/Colors';
import LoadingWrapper from '@/components/LoadingWrapper';

import he from 'he'; // para decodificar entidades HTML

async function obtenerTablasListadornot(): Promise<{ label: string; href: string }[]> {
  const response = await fetch("https://undav.edu.ar/index.php?idcateg=323");
  const html = await response.text();

  const tablaRegex = /<table[^>]*class=["']listadornot["'][^>]*>([\s\S]*?)<\/table>/gi;
  const resultados: { label: string; href: string }[] = [];

  let matchTabla;
  while ((matchTabla = tablaRegex.exec(html)) !== null) {
    const tablaHtml = matchTabla[1];

    // Extraer los <tr> de la tabla
    const trMatches = [...tablaHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
    if (trMatches.length < 3) continue;

    const tr1 = trMatches[0][1];
    const tr3 = trMatches[2][1];

    // Label
    const labelMatch = tr1.match(/<td[^>]*class=["']titulo["'][^>]*>([\s\S]*?)<\/td>/i);
    if (!labelMatch) continue;

    let labelLimpio = labelMatch[1].replace(/<[^>]+>/g, '').trim();
    labelLimpio = he.decode(labelLimpio); // decodificar entidades HTML
    if (labelLimpio.startsWith(' - ')) {
      labelLimpio = labelLimpio.slice(3).trim();
    }

    // Link
    const hrefMatch = tr3.match(/<a[^>]*href=["']([^"']+)["']/i);
    if (!hrefMatch) continue;

    resultados.push({
      label: labelLimpio,
      href: he.decode(hrefMatch[1]), // << CORREGIDO
    });
  }

  return resultados;
}

export default function NoticiasWeb() {
  const [linksNoticias, setLinksNoticias] = useState<{ href: string; label: string }[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(false);

  const handleObtenerLinks = async () => {
    setLoadingLinks(true);
    try {
      const links = await obtenerTablasListadornot();
      setLinksNoticias(links);
    } catch (error) {
      console.error("Error al obtener links:", error);
    } finally {
      setLoadingLinks(false);
    }
  };

  useEffect(() => {
    handleObtenerLinks();
  }, []);

  return (
    <FondoGradiente>
      <LoadingWrapper loading={loadingLinks}>
        <ScrollView contentContainerStyle={styles.listaContainer}>
          {linksNoticias.length > 0 && (
            <>
              {linksNoticias.map((linkObj, i) => (
                <BotonTexto
                  key={i}
                  url={"https://undav.edu.ar/" + linkObj.href}
                  label={linkObj.label}
                  openInsideApp
                />
              ))}
            </>
          )}
          <BotonTexto styleExtra={{borderBottomRightRadius: 20}} label={'Ver todas las noticias'} url="https://undav.edu.ar/index.php?idcateg=323" openInsideApp />
        </ScrollView>
      </LoadingWrapper>
    </FondoGradiente>
  );
}

const styles = StyleSheet.create({
  listaContainer: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: negroAzulado,
    alignSelf: 'center'
  }
});
