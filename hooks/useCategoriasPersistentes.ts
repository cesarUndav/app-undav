import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export type Categoria = {
  nombre: string;
  color: string;
};

const STORAGE_KEY = 'categorias_evento';

export function useCategoriasPersistentes() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) {
        try {
          const parsed: Categoria[] = JSON.parse(data);
          setCategorias(parsed);
        } catch (e) {
          console.error("Error al parsear categorías", e);
        }
      }
      setCargando(false);
    });
  }, []);

  const guardar = (nuevas: Categoria[]) => {
    setCategorias(nuevas);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevas));
  };

  const agregar = (nueva: Categoria) => {
    const sinRepetidos = categorias.filter((c) => c.nombre !== nueva.nombre);
    guardar([...sinRepetidos, nueva]);
  };

  const eliminar = (nombre: string) => {
    const filtradas = categorias.filter((c) => c.nombre !== nombre);
    guardar(filtradas);
  };

  return { categorias, agregar, eliminar, set: guardar, cargando };
}
