import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { EventoAgenda, cargarEventosAcademicos, listaFuturo } from '@/data/agenda';

// 1. Definir el tipo para el valor del contexto
interface AgendaContextType {
    eventosFuturos: EventoAgenda[];
    isLoading: boolean;
    error: string | null;
    refetchEventos: () => Promise<void>; // Función para recargar datos
}

// 2. Crear el Contexto con un valor inicial nulo/predeterminado
const AgendaContext = createContext<AgendaContextType | undefined>(undefined);

// 3. Crear el Proveedor (Provider) para envolver la app
interface AgendaProviderProps {
    children: ReactNode;
}

export const AgendaProvider: React.FC<AgendaProviderProps> = ({ children }) => {
    const [eventosFuturos, setEventosFuturos] = useState<EventoAgenda[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Usamos useCallback para que la función refetchEventos sea la misma en cada renderizado
    const refetchEventos = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Llama a la función que actualiza la variable global en agenda.ts
            await cargarEventosAcademicos();
            // Obtiene la lista combinada y ordenada
            setEventosFuturos(listaFuturo()); 
        } catch (err: any) {
            // Asegúrate de manejar el error de la API
            console.error("Error al obtener eventos:", err.message);
            setError("No se pudieron cargar los eventos. Por favor, inténtelo más tarde.");
            setEventosFuturos([]);
        } finally {
            setIsLoading(false);
        }
    }, []); // La dependencia es un array vacío porque no depende de nada externo

    // Carga inicial de datos cuando el Provider se monta
    useEffect(() => {
        refetchEventos();
    }, [refetchEventos]); // Incluimos refetchEventos como dependencia (es estable por useCallback)
    
    // Usamos useMemo para que el objeto 'value' solo se re-cree si alguna de sus propiedades cambia
    const value = useMemo(() => ({
        eventosFuturos,
        isLoading,
        error,
        refetchEventos,
    }), [eventosFuturos, isLoading, error, refetchEventos]);

    return (
        <AgendaContext.Provider value={value}>
            {children}
        </AgendaContext.Provider>
    );
};

// 4. Crear un Hook personalizado para el fácil acceso
export const useAgenda = () => {
    const context = useContext(AgendaContext);
    if (context === undefined) {
        throw new Error('useAgenda debe usarse dentro de un AgendaProvider');
    }
    return context;
};