# 📱 App móvil UNDAV

Aplicación móvil informativa desarrollada con **React Native + Expo**, con soporte para Android e iOS. Esta app se conecta con el sistema **SIU-Guaraní** para mostrar información académica de los estudiantes de manera clara y optimizada.

---

## 🚀 Tecnologías utilizadas

### 🛠️ Base del proyecto

- **React Native con Expo**  
  Desarrollo ágil multiplataforma.

- **TypeScript**  
  Tipado estático para mayor seguridad y mantenimiento del código.

---

## 📦 Dependencias instaladas

### 🔧 Expo y módulos integrados

| Paquete                                 | Descripción                                                    |
|----------------------------------------|----------------------------------------------------------------|
| `expo`                                  | Framework base para apps móviles con React Native              |
| `expo-router`                           | Sistema de navegación basado en rutas tipo Next.js             |
| `expo-font`                             | Carga y uso de fuentes personalizadas                          |
| `expo-linear-gradient`                  | Fondos con degradado de color                                  |
| `expo-secure-store`                     | Almacenamiento seguro de tokens y credenciales                 |

---

### 🎨 Fuentes personalizadas

| Paquete                                 | Descripción                              |
|----------------------------------------|------------------------------------------|
| `@expo-google-fonts/montserrat`         | Fuente Montserrat de Google Fonts        |

> Se cargan los estilos:  
> `Montserrat_400Regular`  
> `Montserrat_700Bold`

La fuente se aplica globalmente usando un componente personalizado: `CustomText`.

---

### 📡 Red y APIs

| Paquete   | Descripción                          |
|-----------|--------------------------------------|
| `axios`   | Cliente HTTP para consumir APIs REST |

---

### 📂 UI y componentes

| Paquete                    | Descripción                                        |
|----------------------------|----------------------------------------------------|
| `react-native-collapsible` | Acordeones dinámicos para la sección de carreras  |

---

## 🧑‍💻 Estructura del proyecto

| Archivo / Carpeta             | Propósito                                                    |
|-------------------------------|--------------------------------------------------------------|
| `/components/CustomText.tsx` | Componente global para aplicar la fuente Montserrat          |
| `/login.tsx`                 | Pantalla de inicio de sesión para estudiantes                 |
| `/sedes.tsx`                 | Información de las sedes con imágenes y enlaces a mapas       |
| `/oferta-academica.tsx`      | Menú acordeón con departamentos y carreras                    |
| `/carreras/[nombre].tsx`     | Pantallas individuales para cada carrera                      |
| `/_layout.tsx`               | Controla la navegación y redirecciona según sesión            |

---

## Próximos pasos

- [ ] Conectar el login con SIU-Guaraní vía OAuth2
- [ ] Mostrar materias y horarios desde la API
- [ ] Integrar calendario académico y eventos personalizados
- [ ] Agregar caché local para mejorar rendimiento sin base de datos

---

## 📁 Manejo de íconos SVG

Este proyecto permite importar íconos SVG como componentes de React, lo que garantiza calidad visual sin pérdida al escalar.

### 🗂️ Ubicación
Los íconos SVG están en:

---

## 🧪 Distribución beta (EAS Build) — Android e iOS (sin tiendas)

Esta guía describe cómo generar y compartir builds beta usando **Expo + EAS Build** sin pasar por Google Play ni App Store.

> Nota: si el repositorio es público, evitá incluir **links directos** a builds o información sensible. En ese caso, podés mover esta sección a `docs/beta-distribution.md`.

### ✅ Requisitos previos

- Node.js + npm instalados.
- Cuenta de Expo con acceso al proyecto.
- EAS CLI instalado y login hecho:

```bash
npm i -g eas-cli
eas login
```

Verificación rápida del proyecto:

```bash
eas whoami
eas project:info
```

### ⚙️ Configuración mínima recomendada (`eas.json`)

Asegurate de tener un perfil `preview` para distribución interna:

```json
{
  "build": {
    "preview": {
      "distribution": "internal"
    }
  }
}
```

---

## 🤖 Android (beta sin Play Store)

### 1) Generar build (APK interno)

```bash
eas build --platform android --profile preview
```

### 2) Ver estado y obtener link del APK

```bash
eas build:list -p android --limit 5
```

- Si el `Status` figura como **finished**, vas a ver el campo **Application Archive URL** (link al `.apk`).
- Compartí ese link con los testers.

### 3) Instalación (tester)

1. Abrir el link desde el teléfono.
2. Descargar el APK.
3. Si Android bloquea la instalación: habilitar **“Instalar apps desconocidas”** para el navegador/archivos y reintentar.

---

## 🍎 iOS (beta sin App Store — Internal distribution / Ad Hoc)

> Importante: para instalar en iPhone **sin App Store** normalmente necesitás **Apple Developer Program** y registrar los **UDID** de los dispositivos de los testers.
> La app solo se podrá instalar en los iPhone registrados.

### 1) Registrar dispositivos (UDID) de testers

En tu máquina:

```bash
eas device:create
```

Elegí la opción de **website/QR** y pasás el link a cada tester para que registre su iPhone.

Verificar dispositivos registrados:

```bash
eas device:list
```

### 2) Generar build iOS (internal)

```bash
eas build --platform ios --profile preview
```

Durante el proceso, EAS puede pedir credenciales de Apple para gestionar certificados/provisioning.

### 3) Instalación (tester)

- Abrir la página/link del build en **Safari** (en el iPhone registrado) e instalar.

### 4) Si agregás un iPhone nuevo luego

- Opción simple: generar un build nuevo.
- Opción avanzada: re-firmar un `.ipa` existente para incluir nuevos dispositivos (si aplica):

```bash
eas build:resign
```

---

## 🔎 Consultas rápidas

### Ver si una build terminó (aunque se haya apagado tu PC)

```bash
eas build:list -p android --limit 5
eas build:list -p ios --limit 5
```

### Rebuild con cache limpio (si falla por dependencias nativas)

```bash
eas build --platform android --profile preview --clear-cache
```
