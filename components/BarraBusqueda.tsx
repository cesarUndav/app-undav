import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { negroAzulado } from '@/constants/Colors';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function BarraBusqueda({ value, onChangeText, placeholder = "Buscar..." }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const equivalenciasRomanos: Record<string, string> = {
  "i": "1",
  "ii": "2",
  "iii": "3",
  "iv": "4",
  "v": "5",
  "vi": "6",
  "vii": "7",
  "viii": "8",
  "ix": "9",
  "x": "10"
};
const equivalenciasArabigos: Record<string, string> = Object.fromEntries(
  Object.entries(equivalenciasRomanos).map(([romano, ar]) => [ar, romano])
);
function expandirVariantesNumericas(texto: string): string[] {
  const palabras = texto.split(/\s+/);
  const variantes: string[] = [];

  palabras.forEach(palabra => {
    const base = palabra.toLowerCase();
    variantes.push(base);

    // Si es número romano, agregar su versión arábiga
    if (equivalenciasRomanos[base]) {
      variantes.push(equivalenciasRomanos[base]);
    }

    // Si es número arábigo, agregar su versión romana
    if (equivalenciasArabigos[base]) {
      variantes.push(equivalenciasArabigos[base]);
    }
  });
  return variantes;
}
function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD") // separa tildes
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes
    .toLowerCase()
    .trim();
}
export function coincideBusqueda(titulo: string, busqueda: string): boolean {
  const tituloNorm = normalizarTexto(titulo);
  const tituloExpandido = expandirVariantesNumericas(tituloNorm).join(" ");

  const palabrasBusqueda = expandirVariantesNumericas(normalizarTexto(busqueda));

  return palabrasBusqueda.every(palabra =>
    tituloExpandido.includes(palabra)
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    paddingTop: 4
  },
  input: {
    height: 40,
    color: negroAzulado,
    fontSize: 16,
    paddingLeft: 10
  },
});
