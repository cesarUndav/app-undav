// theme/carrerasStyles.ts

import { StyleSheet } from 'react-native';

type CarreraStylesProps = {
    colorBoton: string;
    colorContenido: string;
};

export function crearCarreraStyles({
    colorBoton,
    colorContenido,
}: CarreraStylesProps) {
    return StyleSheet.create({
        wrapper: {
            flex: 1,
        },
        modalContainer: {
            flex: 1,
            backgroundColor: '#fff',
        },
        webview: {
            flex: 1,
        },
        webviewLoading: {
            flex: 1,
        },
        fabContainer: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
        fab: {
            position: 'absolute',
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: 'rgba(0,0,0,0.3)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        fabText: {
            fontSize: 32,
            lineHeight: 32,
            color: '#fff',
        },
        container: {
            flex: 1,
            padding: 15,
            gap: 8,
        },
        seccion: {
            elevation: 4,
        },
        boton: {
            backgroundColor: colorBoton,
            padding: 16,
            height: 64,
            borderBottomRightRadius: 20,
        },
        botonExpandido: {
            borderBottomRightRadius: 0,
        },
        titulo: {
            color: 'white',
            fontSize: 16,
        },
        contenido: {
            backgroundColor: colorContenido,
            padding: 16,
            borderBottomRightRadius: 20,
            borderTopWidth: 1,
            borderTopColor: 'white',
        },
        oracion: {
            marginBottom: 8,
            color: '#ffffff',
        },
        link: {
            color: '#ffffff',
            textDecorationLine: 'underline',
            marginBottom: 8,
        },
    });
}