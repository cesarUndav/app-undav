import React from "react";
import FondoScrollGradiente from "@/components/FondoScrollGradiente";
import BotonTexto from "@/components/BotonTexto";
import BotonTextoMail from "@/components/BotonTextoMail";

export default function Configuracion() {
  return (
    <FondoScrollGradiente gap={4}>
      <BotonTexto label="Bienestar" route="/bienestar"/>
      <BotonTexto label="Oferta Académica" route="/oferta-academica"/>
      <BotonTexto label="Contacto" route="/contacto"/>
      <BotonTexto label="Preguntas frecuentes" route="preguntas-frecuentes"/>
      <BotonTexto label="Sedes" route="/sedes"/>
      <BotonTexto label="Comunidad" route="/comunidad"/>
      <BotonTextoMail label="Envianos tus sugerencias" mail="app-sugerencias@undav.edu.ar"/>
      <BotonTextoMail label="Reportá errores en la app" mail="app-errores@undav.edu.ar" styleExtra={{borderBottomRightRadius: 20}}/>
    </FondoScrollGradiente>
  );
}