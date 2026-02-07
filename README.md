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
