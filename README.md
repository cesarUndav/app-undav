📱 Descripción General de la Aplicación

App UNDAV es una aplicación móvil nativa multiplataforma (Android e iOS) desarrollada sobre el framework React Native utilizando Expo (SDK 54). Su propósito principal es centralizar, optimizar y disponibilizar la información académica y los servicios esenciales para los estudiantes de la Universidad Nacional de Avellaneda.

La aplicación destaca por su capacidad de interoperabilidad, actuando como un cliente móvil avanzado que consume servicios del sistema de gestión académica SIU-Guaraní y del Campus Virtual de la institución, unificando los datos en una experiencia de usuario fluida, intuitiva y moderna.

🛠️ Resumen de Funcionalidades Principales
1. Integración Académica con SIU-Guaraní (Módulo Central)

Consumo de API / Cliente HTTP: Implementación de Axios para la comunicación directa y segura con los endpoints del sistema académico, permitiendo la extracción y procesamiento eficiente de historias académicas, inscripciones y alertas del estudiante.

Procesamiento de Datos Complejos: Uso de codificadores de texto (fast-text-encoding) y algoritmos de firmas criptográficas (js-md5) para el formateo, sanitización y validación segura de la información recibida desde los servidores universitarios.

2. Autenticación y Seguridad del Estudiante

Cifrado Local Hardware-Backed: Integración de expo-secure-store para resguardar de forma cifrada los tokens de sesión y las credenciales del Campus Virtual/SIU dentro del llavero nativo del dispositivo móvil (Keystore/Keychain).

Bypass de Login Inteligente en WebView: Contenedor robusto (react-native-webview) para el ecosistema Moodle de la UNDAV que automatiza el proceso de login e inyecta scripts para evadir advertencias de sesiones redundantes de forma transparente.

3. Utilidades Avanzadas e Interfaz Interactiva

Gestión de Fechas y Agenda: Interfaz para el control del calendario académico y asignación de alertas mediante componentes de selección nativa (@react-native-community/datetimepicker).

Geolocalización Campus: Integración de mapas nativos (react-native-maps) para la ubicación e identificación de sedes de la universidad.

Exportación y Compartido: Capacidad nativa para generar documentos aptos para impresión (expo-print) y compartirlos a través de aplicaciones externas (expo-sharing, expo-file-system), ideal para reportes de materias o comprobantes de inscripción.

Componentes Expandibles y Multimedia: Vistas interactivas colapsables (react-native-collapsible), soporte de reproducción sonora (expo-audio) y animaciones de alto rendimiento a 60 FPS mediante react-native-reanimated.

🧱 Ficha Técnica del Proyecto

Core del Framework: React Native 0.81.5 / Expo SDK 54.0.35

Entorno de Ejecución UI: React 19.1.0 (con soporte optimizado para entornos web concurrentes).

Arquitectura de Enrutamiento: Navegación basada en archivos dinámicos utilizando Expo Router v6 (expo-router/entry).

Estilos e Identidad: Fuentes cargadas dinámicamente mediante @expo-google-fonts/montserrat e iconografía vectorial de alta densidad con @expo/vector-icons.

Gráficos: Renderizado de assets vectoriales nativos con react-native-svg y preprocesamiento en bundling mediante react-native-svg-transformer.

Gestión de Entorno: Parches automáticos en post-instalación de paquetes (patch-package) para asegurar compatibilidad de dependencias críticas en Linux/macOS.

Lenguaje base: TypeScript ~5.9.2 (Tipado estricto y seguro).