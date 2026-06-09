// src/context/AgendaContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { EventoAgenda, cargarEventosAcademicos, listaFuturo, cargarDatosSiuGuarani } from '@/data/agenda';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🎯 Importamos para el doble blindaje en caliente

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
        // 🛡️ FILTRO DE SEGURIDAD ABSOLUTO (Paso 1): Control por estado del Layout
        if (!usuarioAutenticado) {
            setEventosFuturos([]);
            return;
        }

        // 🛡️ FILTRO DE SEGURIDAD ABSOLUTO (Paso 2): Doble verificación física en disco.
        // Si el estado dio un falso positivo pero el disco está vacío (caso Post-Cache Clear), abortamos.
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
            
            // 🏛️ 1. Carga eventos desde la API PHP (Ahora viaja 100% seguro con Token existente)
            await cargarEventosAcademicos();
            
            // 🎓 2. Consulta remota al SIU Guaraní
            await cargarDatosSiuGuarani();
            
            // 📊 3. Consolidación de datos
            setEventosFuturos(listaFuturo()); 
        } catch (err: any) {
            console.error("❌ Error al obtener eventos integrados en Context:", err?.message || err);
            setError("No se pudieron cargar los eventos académicos.");
            setEventosFuturos([]);
        } finally {
            setIsLoading(false);
        }
    }, [usuarioAutenticado]); // El hook vigila los cambios de estado del login

    // Este efecto reacciona al instante cuando el usuario inicia sesión
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