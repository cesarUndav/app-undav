// src/context/AgendaContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { EventoAgenda, cargarEventosAcademicos, listaFuturo } from '@/data/agenda';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AgendaContextType {
    eventosFuturos: EventoAgenda[];
    isLoading: boolean;
    error: string | null;
    refetchEventos: () => Promise<void>; 
}

const AgendaContext = createContext<AgendaContextType | undefined>(undefined);

interface AgendaProviderProps {
    children: ReactNode;
    usuarioAutenticado: boolean; 
}

export const AgendaProvider: React.FC<AgendaProviderProps> = ({ children, usuarioAutenticado }) => {
    const [eventosFuturos, setEventosFuturos] = useState<EventoAgenda[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refetchEventos = useCallback(async () => {
        if (!usuarioAutenticado) {
            setEventosFuturos([]);
            return;
        }

        const tokenExistente = await AsyncStorage.getItem('token');
        if (!tokenExistente) {
            console.log("⚠️ [AgendaContext] Intento de petición abortado: No se detectó token físico en el dispositivo.");
            setEventosFuturos([]);
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            console.log("📅 [AgendaContext] Credenciales validadas con éxito. Iniciando sincronización de API...");
            
            // 🏛️ Paso 1: Carga eventos desde la API PHP (Es instantáneo)
            await cargarEventosAcademicos();
            
            // ⚡ Actualización inmediata: Renderizamos los eventos PHP rápido para que la pantalla no se quede en blanco
            setEventosFuturos(listaFuturo());
            
            // Si ya renderizamos lo básico, podemos quitar el loader principal para que el usuario navegue
            setIsLoading(false); 

        } catch (err: any) {
            console.error("❌ Error crítico al obtener eventos integrados en Context:", err?.message || err);
            setError("No se pudieron cargar los eventos académicos.");
            // Solo vaciamos si falló la carga base inicial (PHP)
            if (eventosFuturos.length === 0) {
                setEventosFuturos([]);
            }
        } finally {
            setIsLoading(false);
        }
    }, [usuarioAutenticado]);

    useEffect(() => {
        refetchEventos();
    }, [usuarioAutenticado, refetchEventos]); 
    
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