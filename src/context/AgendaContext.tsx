// src/context/AgendaContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { EventoAgenda, cargarEventosAcademicos, listaFuturo } from '@/data/agenda';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🎯 En lugar de una constante estática, usamos una función que genera la clave basada en el ID del usuario
const obtenerStorageKey = (idUsuario: string) => `@eventos_personalizados_${idUsuario}`;

interface AgendaContextType {
    eventosFuturos: EventoAgenda[];
    isLoading: boolean;
    error: string | null;
    refetchEventos: () => Promise<void>; 
    agregarEvento: (nuevoEvento: EventoAgenda) => Promise<void>;
    editarEvento: (eventoEditado: EventoAgenda) => Promise<void>;
    eliminarEvento: (id: string) => Promise<void>;
}

const AgendaContext = createContext<AgendaContextType | undefined>(undefined);

interface AgendaProviderProps {
    children: ReactNode;
    usuarioAutenticado: boolean; 
}

export const AgendaProvider: React.FC<AgendaProviderProps> = ({ children, usuarioAutenticado }) => {
    const [eventosFuturos, setEventosFuturos] = useState<EventoAgenda[]>([]);
    const [eventosPersonalizados, setEventosPersonalizados] = useState<EventoAgenda[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 🎯 Estado para almacenar el ID o Legajo del usuario actual y saber qué clave usar
    const [idUsuarioActual, setIdUsuarioActual] = useState<string | null>(null);

    const actualizarListaCombinada = useCallback((personales: EventoAgenda[]) => {
        const academicos = listaFuturo();
        setEventosFuturos([...academicos, ...personales]);
    }, []);

    const refetchEventos = useCallback(async () => {
        if (!usuarioAutenticado) {
            setEventosFuturos([]);
            setEventosPersonalizados([]);
            setIdUsuarioActual(null);
            return;
        }

        const tokenExistente = await AsyncStorage.getItem('token');
        if (!tokenExistente) {
            console.log("⚠️ [AgendaContext] Intento de petición abortado: No se detectó token físico.");
            setEventosFuturos([]);
            setEventosPersonalizados([]);
            setIdUsuarioActual(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            console.log("📅 [AgendaContext] Credenciales validadas. Sincronizando datos...");

            // 🎯 Paso 1: Obtener el identificador único del usuario (Legajo/DNI/ID) que guardaste al hacer login
            // (Asegurate de que al loguearse guardes este dato en AsyncStorage, ej: AsyncStorage.setItem('usuario_id', '12345'))
            const idUsuario = await AsyncStorage.getItem('usuario_id') || 'generico';
            setIdUsuarioActual(idUsuario);

            // 🎯 Paso 2: Cargar eventos usando la clave específica de ESTE usuario
            const claveUsuario = obtenerStorageKey(idUsuario);
            const localesRaw = await AsyncStorage.getItem(claveUsuario);
            const localesParseados: EventoAgenda[] = localesRaw ? JSON.parse(localesRaw) : [];
            setEventosPersonalizados(localesParseados);

            // Paso 3: Cargar eventos desde la API PHP
            await cargarEventosAcademicos();
            
            // Paso 4: Fusión final
            const academicos = listaFuturo();
            setEventosFuturos([...academicos, ...localesParseados]);
            
            setIsLoading(false); 

        } catch (err: any) {
            console.error("❌ Error crítico en Context:", err?.message || err);
            setError("No se pudieron cargar los eventos.");
            if (eventosFuturos.length === 0) setEventosFuturos([]);
        } finally {
            setIsLoading(false);
        }
    }, [usuarioAutenticado, eventosFuturos.length]);

    // 📥 [CREATE] Con clave dinámica
    const agregarEvento = useCallback(async (nuevoEvento: EventoAgenda) => {
        if (!idUsuarioActual) return;
        try {
            const nuevaLista = [...eventosPersonalizados, nuevoEvento];
            setEventosPersonalizados(nuevaLista);
            
            const claveUsuario = obtenerStorageKey(idUsuarioActual);
            await AsyncStorage.setItem(claveUsuario, JSON.stringify(nuevaLista));
            actualizarListaCombinada(nuevaLista);
        } catch (e) {
            console.error("❌ Error al guardar evento:", e);
        }
    }, [eventosPersonalizados, idUsuarioActual, actualizarListaCombinada]);

    // 📝 [UPDATE] Con clave dinámica
    const editarEvento = useCallback(async (eventoEditado: EventoAgenda) => {
        if (!idUsuarioActual) return;
        try {
            const nuevaLista = eventosPersonalizados.map(ev => ev.id === eventoEditado.id ? eventoEditado : ev);
            setEventosPersonalizados(nuevaLista);
            
            const claveUsuario = obtenerStorageKey(idUsuarioActual);
            await AsyncStorage.setItem(claveUsuario, JSON.stringify(nuevaLista));
            actualizarListaCombinada(nuevaLista);
        } catch (e) {
            console.error("❌ Error al editar evento:", e);
        }
    }, [eventosPersonalizados, idUsuarioActual, actualizarListaCombinada]);

    // 🗑️ [DELETE] Con clave dinámica
    const eliminarEvento = useCallback(async (id: string) => {
        if (!idUsuarioActual) return;
        try {
            const nuevaLista = eventosPersonalizados.filter(ev => ev.id !== id);
            setEventosPersonalizados(nuevaLista);
            
            const claveUsuario = obtenerStorageKey(idUsuarioActual);
            await AsyncStorage.setItem(claveUsuario, JSON.stringify(nuevaLista));
            actualizarListaCombinada(nuevaLista);
        } catch (e) {
            console.error("❌ Error al eliminar evento:", e);
        }
    }, [eventosPersonalizados, idUsuarioActual, actualizarListaCombinada]);

    useEffect(() => {
        refetchEventos();
    }, [usuarioAutenticado, refetchEventos]); 
    
    const value = useMemo(() => ({
        eventosFuturos,
        isLoading,
        error,
        refetchEventos,
        agregarEvento,
        editarEvento,
        eliminarEvento,
    }), [eventosFuturos, isLoading, error, refetchEventos, agregarEvento, editarEvento, eliminarEvento]);

    return (
        <AgendaContext.Provider value={value}>
            {children}
        </AgendaContext.Provider>
    );
};

export const useAgenda = () => {
    const context = useContext(AgendaContext);
    if (context === undefined) throw new Error('useAgenda debe usarse dentro de un AgendaProvider');
    return context;
};