# 📱 App móvil UNDAV

Aplicación móvil informativa desarrollada con **React Native**, **Expo**, **TypeScript** y **Expo Router**, orientada a estudiantes de la Universidad Nacional de Avellaneda.

El objetivo del proyecto es centralizar información útil para estudiantes, como sedes, oferta académica, agenda, calendario académico, planos interactivos y, progresivamente, información académica integrada con sistemas institucionales.

---

## 🚀 Tecnologías principales

- **React Native**
- **Expo**
- **Expo Router**
- **TypeScript**
- **React Native SVG**
- **React Native Gesture Handler**
- **React Native Reanimated**
- **Expo Dev Client**
- **AsyncStorage**
- **Expo Secure Store**
- **Montserrat como fuente global**

---

## 📦 Instalación del proyecto

Clonar el repositorio:

```bash
git clone https://github.com/cesarUndav/app-undav.git
cd app-undav
```

Instalar dependencias:

```bash
npm install
```

Levantar el proyecto en modo desarrollo:

```bash
npx expo start
```

---

## ▶️ Modos de ejecución

### Expo Go

Para pruebas rápidas en iOS o Android usando Expo Go:

```bash
npx expo start -c --go
```

Este modo es útil para validar pantallas generales, navegación y cambios de interfaz que no dependen de código nativo personalizado.

---

### Development Build / Dev Client

Para probar funcionalidades que dependen de módulos nativos o comportamiento específico de Android/iOS:

```bash
npx expo start -c --dev-client
```

Este modo requiere tener instalada una **Development Build** generada con EAS.

En este proyecto, el módulo de **Planos interactivos** se prueba especialmente con Dev Client en Android, porque utiliza gestos, renderizado SVG/PNG y optimizaciones específicas de rendimiento.

---

## 🏗️ Generar build de desarrollo para Android

Para generar una build de desarrollo:

```bash
npx eas-cli build -p android --profile development --clear-cache
```

Si `eas` está instalado globalmente, también puede usarse:

```bash
eas build -p android --profile development --clear-cache
```

Consultar builds recientes:

```bash
npx eas-cli build:list
```

Una vez finalizada la build, descargar el APK desde Expo, instalarlo en el dispositivo Android y levantar Metro con:

```bash
npx expo start -c --dev-client
```

---

## 🧭 Módulo de Planos interactivos

La sección de **Planos** permite visualizar sedes, pisos, aulas, rutas y conexiones internas mediante un sistema interactivo de pan, zoom y selección de zonas.

### Arquitectura general

El módulo está compuesto por:

- pantalla principal de planos;
- configuración de edificios y pisos;
- imágenes base de planos;
- archivos JSON con coordenadas;
- overlays SVG para zonas, rutas y conexiones;
- lógica de zoom, pan y pinch;
- detección de aulas mediante hit-test;
- buscador de aulas;
- controles flotantes;
- estilos separados por responsabilidad.

Documentación visual:

```text
docs/planos-arquitectura.md
```

---

## 🗺️ Formato de los planos

Los planos base se renderizan como imágenes **PNG** para mejorar el rendimiento, especialmente en Android.

La interactividad no depende del PNG, sino de archivos JSON asociados a cada plano.

Cada plano se compone de:

```text
PNG base        → imagen visual del plano
JSON            → coordenadas de aulas, rutas y puntos
SVG conexiones  → conexiones simples entre edificios/pisos
Overlay SVG     → polígonos interactivos dibujados sobre el plano
```

Ejemplo:

```text
assets/maps/Espana/espana0.png
assets/maps/Espana/espana0.json
```

Para que las coordenadas funcionen correctamente, cada PNG debe mantener:

- el mismo canvas que el SVG original;
- la misma proporción;
- sin márgenes agregados;
- resolución suficiente para verse bien con zoom.

Actualmente se recomienda exportar los PNG a **2x / 192 ppi**.

---

## 📁 Estructura principal del módulo de Planos

```text
app/
  planos.tsx

components/
  PlanArea.tsx
  MapViewer.tsx

components/plan-area/
  ControlledPanZoom.tsx
  ControlledPanZoomReanimated.tsx
  InteractiveOverlay.tsx
  MapViewerContent.tsx
  PlanAreaControls.tsx
  mapViewerTypes.ts
  panZoomConstants.ts
  panZoomTypes.ts
  planAreaTypes.ts
  usePlanAreaHandlers.ts

components/gestures/
  usePanGesture.ts
  usePinchGesture.ts
  useTapGesture.ts

hooks/
  usePlanZoom.ts
  usePlanAreaEffects.ts
  usePlanAreaAnimation.ts
  useTooltip.ts

hooks/planos/
  usePlanosDerived.ts
  usePlanosTutorial.ts

lib/maps/
  index.ts
  types.ts
  basePlans.ts
  createPngPlanComponent.ts
  coordsMap.ts
  connectionOverlays.ts
  mapRegistry.ts

lib/
  mapsConfig.ts
  hitTest.ts
  zoomMath.ts
  floors.ts

assets/maps/
  Espana/
  Arenales/
  PineyroA/
  PineyroB/
  PineyroC/
```

---

## 🧩 Configuración de mapas

La configuración de mapas está modularizada en:

```text
lib/maps/basePlans.ts
```

Registra los PNG base.

```text
lib/maps/coordsMap.ts
```

Registra los JSON con coordenadas.

```text
lib/maps/mapRegistry.ts
```

Define edificios y pisos disponibles.

```text
lib/maps/connectionOverlays.ts
```

Registra los SVG de conexiones.

```text
lib/maps/types.ts
```

Define los tipos principales del módulo.

```text
lib/mapsConfig.ts
```

Archivo puente para mantener compatibilidad con imports existentes.

---

## 📌 Agregar un nuevo plano

Para agregar un nuevo plano al sistema:

1. Exportar el plano base como PNG.
2. Guardarlo en `assets/maps/<Sede>/`.
3. Crear o actualizar el JSON de coordenadas.
4. Registrar el PNG en:

```text
lib/maps/basePlans.ts
```

5. Registrar el JSON en:

```text
lib/maps/coordsMap.ts
```

6. Registrar el piso en:

```text
lib/maps/mapRegistry.ts
```

7. Si corresponde, agregar conexiones SVG en:

```text
lib/maps/connectionOverlays.ts
```

8. Probar en iOS y Android.

---

## 🎨 Estilos

Los estilos del módulo de Planos fueron separados por responsabilidad.

```text
theme/mapStyles.ts
```

Archivo orquestador de estilos.

```text
theme/mapTokens.ts
theme/mapOverlayStyles.ts
theme/mapButtonStyles.ts
theme/tooltipStyles.ts
theme/selectorStyles.ts
theme/floorBadgeStyles.ts
theme/searchModalStyles.ts
theme/planAreaStyles.ts
theme/panZoomStyles.ts
theme/planHeaderStyles.ts
```

---

## 🔐 Autenticación e integración futura

La app está pensada para integrarse progresivamente con el sistema **SIU-Guaraní**.

El objetivo es que los estudiantes puedan iniciar sesión y consultar información académica relevante, como materias, horarios, datos personales y calendario.

Actualmente existen avances en la integración con backend, API y administración, pero la app mantiene una arquitectura flexible para continuar incorporando servicios.

---

## 📂 Estructura general del proyecto

```text
app/
  _layout.tsx
  planos.tsx
  sedes.tsx
  oferta-academica.tsx
  carreras/

components/
  PlanArea.tsx
  MapViewer.tsx
  SearchModal.tsx
  BottomBar.tsx
  NavigationHistoryHeader.tsx

components/plan-area/
  Componentes específicos del módulo de planos

hooks/
  Hooks generales y hooks del módulo de planos

lib/
  Utilidades, configuración de mapas, geometría y helpers

theme/
  Estilos y tokens visuales

assets/
  Imágenes, íconos, fuentes, documentos y mapas
```

---

## 🧪 Comandos útiles

Levantar con Expo Go:

```bash
npx expo start -c --go
```

Levantar con Dev Client:

```bash
npx expo start -c --dev-client
```

Generar Android Development Build:

```bash
npx eas-cli build -p android --profile development --clear-cache
```

Ver builds recientes:

```bash
npx eas-cli build:list
```

Ver estado de Git:

```bash
git status
```

---

## 📚 Documentación complementaria

- `docs/planos-arquitectura.md`: diagrama de arquitectura del módulo de Planos.
- `README.md`: documentación general del proyecto.

---

## ✅ Estado actual del módulo de Planos

El módulo de Planos cuenta actualmente con:

- planos base en PNG;
- coordenadas en JSON;
- overlays SVG para zonas y conexiones;
- soporte para múltiples sedes y pisos;
- pan y pinch zoom;
- selección de aulas mediante hit-test;
- buscador de aulas;
- controles de piso;
- botón de vista general;
- punto guía;
- soporte para Expo Go y Dev Client;
- rendimiento optimizado en Android mediante rasterización de planos base.

