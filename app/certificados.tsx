import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import BotonTexto from '../components/BotonTexto';
import ListaItem from '@/components/ListaItem';
import FondoScrollGradiente from '@/components/FondoScrollGradiente';
import { negroAzulado } from '@/constants/Colors';
import BotonTextoSIU from '@/components/BotonTextoSIU';
import DropdownSeccion from '@/components/DropdownSeccion';
import BotonTextoMail from '@/components/BotonTextoMail';
import BotonTextoTelefono from '@/components/BotonTextoTelefono';
import he from 'he';

export default function Certificados() {
const [linkSelloInstitucional, setLinkSelloInstitucional] = useState<string | null>(null);

useEffect(() => {
const obtenerLinkFormularioSello = async () => {
try {
  const response = await fetch("https://undav.edu.ar/index.php?idcateg=68");
  const html = await response.text();
    const contenedorMatch = html.match(
      /<div[^>]*id=["']contenidocentral["'][^>]*>([\s\S]*?)<\/div>/i
    );
    if (!contenedorMatch || !contenedorMatch[1]) return;

    const contenido = contenedorMatch[1];

    // Encontrar todos los <a ...>...</a> dentro de párrafos
    const enlaces = [...contenido.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>\s*<strong[^>]*>(.*?)<\/strong>\s*<\/a>/gi)];

    // Buscar el que contiene "Sello Institucional" o "Acceder aquí"
    const enlaceDeseado = enlaces.find(([, , texto]) =>
      /sello|acceder/i.test(texto)
    );

    if (enlaceDeseado && enlaceDeseado[1]) {
      setLinkSelloInstitucional(enlaceDeseado[1]);
    }
  } catch (e) {
    console.error("Error al obtener link de sello institucional:", e);
  }
};

obtenerLinkFormularioSello();
}, []);

return (
<FondoScrollGradiente>
<DropdownSeccion titulo="Autogestión">
<>
<BotonTexto label="Certificado de Exámen" url="https://docs.google.com/document/d/13UR2aI0F-2viHtZ1qHCPw-UZnlQvcLbl/edit?usp=sharing&ouid=105277120237883468075&rtpof=true&sd=true" />
{linkSelloInstitucional && (
<BotonTexto label="Solicitud de Sello Institucional" url={linkSelloInstitucional} />
)}
<BotonTextoSIU label="Certificado de Alumno Regular" url="https://academica.undav.edu.ar/g3w/solicitudes" />
<BotonTextoSIU label="Certificado de Actividades Aprobadas" url="https://academica.undav.edu.ar/g3w/solicitudes" />
<BotonTextoSIU
styleExtra={{ borderBottomRightRadius: 20 }}
label="Boleto Estudiantil"
url="https://academica.undav.edu.ar/g3w/boleto_estudiantil"
/>
</>
</DropdownSeccion>
  <DropdownSeccion titulo="Atención al Estudiante">
    <>
      <BotonTextoMail label="eMail: Consultas Generales" mail="tramitesestudiantes@undav.edu.ar" />
      <BotonTextoMail label="eMail: Prórrogas de Cursadas Vencidas" mail="finales@undav.edu.ar" />
      <BotonTextoTelefono
        styleExtra={{ borderBottomRightRadius: 20 }}
        label="Teléfono: 5436-7521"
        tel="54367521"
      />
    </>
  </DropdownSeccion>

  <DropdownSeccion titulo="Atención Presencial">
    <>
      <ListaItem title={`Lunes a viernes, 8 a 20 hs.`} titleColor={negroAzulado} />
      <BotonTexto
        label={`Oficina Sede Piñeyro (Mario Bravo 1460).`}
        styleExtra={{ borderBottomRightRadius: 20 }}
        url="https://maps.app.goo.gl/4mJxbwrwD9WPGrjx6"
      />
    </>
  </DropdownSeccion>
</FondoScrollGradiente>
);
}

const styles = StyleSheet.create({
title: {
fontSize: 16,
fontWeight: 'bold',
color: negroAzulado,
alignSelf: 'center',
marginVertical: 0,
},
});