// src/context/AgendaContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { EventoAgenda, cargarEventosAcademicos, listaFuturo, cargarDatosSiuGuarani } from '@/data/agenda';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🛠️ IMPORTANTE: Necesitamos chequear el disco

// 1. Definir el tipo para el valor del contexto
interface AgendaContextType {
    eventosFuturos: EventoAgenda[];
    isLoading: boolean;
    error: string | null;
    refetchEventos: () => Promise<void>; 
}

// 2. Crear el Contexto
const AgendaContext = createContext<AgendaContextType | undefined>(undefined);

interface AgendaProviderProps {
    children: ReactNode;
}

export const AgendaProvider: React.FC<AgendaProviderProps> = ({ children }) => {
    const [eventosFuturos, setEventosFuturos] = useState<EventoAgenda[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refetchEventos = useCallback(async () => {
        // 🛠️ FILTRO DE SEGURIDAD GLOBAL DE LA AGENDA
        // Si no hay token guardado, bloqueamos las llamadas HTTP para evitar los 4 errores en el login
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            console.log("⚠️ [AgendaContext] Inicialización pospuesta: No hay token activo (Usuario en Login o Visitante).");
            setEventosFuturos([]);
            return; // 🛑 Frenamos la ejecución acá
        }

        setIsLoading(true);
        setError(null);
        try {
            // 🏛️ 1. Actualiza eventos estáticos locales
            await cargarEventosAcademicos();
            
            // 🎓 2. Peticiones HTTP al SIU Guarani (Ya viajan seguras porque sabemos que hay token)
            await cargarDatosSiuGuarani();
            
            // 📊 3. Setea la lista integrada
            setEventosFuturos(listaFuturo()); 
        } catch (err: any) {
            console.error("Error al obtener eventos integrados:", err?.message || err);
            setError("No se pudieron cargar los eventos. Por favor, inténtelo más tarde.");
            setEventosFuturos([]);
        } finally {
            setIsLoading(false);
        }
    }, []); 

    // Carga inicial de datos cuando el Provider se monta
    useEffect(() => {
        refetchEventos();
    }, [refetchEventos]); 
    
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

export const useAgenda = () => {
    const context = useContext(AgendaContext);
    if (context === undefined) {
        throw new Error('useAgenda debe usarse dentro de un AgendaProvider');
    }
    return context;
};