flowchart TD
    %% Entrada y control de sesión
    Index["index.tsx"] --> Login["loginAutenticado.tsx"]
    Index --> HomeVisitante["home-visitante.tsx"]

    Layout["_layout.tsx"] --> HomeEstudiante["home-estudiante.tsx"]
    Layout --> Login
    Layout --> Notificaciones["notificaciones.tsx"]

    NotFound["+not-found.tsx"] --> Index

    %% Login
    Login --> HomeEstudiante
    Login --> RecuperarClave["webview/[url].tsx<br/>Recuperar acceso SIU"]

    %% Home visitante
    HomeVisitante --> Oferta["oferta-academica.tsx"]
    HomeVisitante --> Redes["redes.tsx"]
    HomeVisitante --> Sedes["sedes.tsx"]
    HomeVisitante --> Planos["planos.tsx"]
    HomeVisitante --> Preinscripcion["preinscripcion.tsx"]
    HomeVisitante --> CalendarioVisitante["calendario-academico-visitante.tsx"]
    HomeVisitante --> Notificaciones
    HomeVisitante --> Oficios["escuela-de-oficios.tsx"]
    HomeVisitante --> Preguntas["preguntas-frecuentes.tsx"]
    HomeVisitante --> Contacto["contacto.tsx"]

    %% Home estudiante
    HomeEstudiante --> Tramites["tramites.tsx"]
    HomeEstudiante --> Autogestion["autogestion.tsx"]
    HomeEstudiante --> PlanEstudio["plan-de-estudio.tsx"]
    HomeEstudiante -. desactivado .-> Trayectoria["trayectoria-academica.tsx"]
    HomeEstudiante --> Redes
    HomeEstudiante --> WebSIU["web-SIU-Guarani.tsx"]
    HomeEstudiante --> WebCampus["web-Campus-Virtual.tsx"]

    %% Perfil y ajustes
    Perfil["perfil.tsx"] --> Index
    Perfil --> PlanEstudio
    Perfil --> Ajustes["ajustes.tsx"]
    Ajustes --> CredencialesCampus["credenciales-campus-virtual.tsx"]

    %% Oferta académica
    Oferta --> Carreras["carreras/[ruta].tsx"]
    Carreras --> CarreraDetalle["Pantallas de carreras específicas"]

    %% Sedes y mapas
    Sedes --> SedeMapa["sede-mapa.tsx"]

    %% Preinscripción
    Preinscripcion --> CalendarioVisitante

    %% Rutas dinámicas desde secciones
    Preguntas --> RutasFAQ["Rutas internas según pregunta"]
    Redes --> RutasRedes["Rutas internas / externas según canal"]

    %% WebViews institucionales
    WebSIU --> SIU["academica.undav.edu.ar/g3w"]
    WebCampus --> EAD["ead.undav.edu.ar"]
    RecuperarClave --> SIURecuperar["academica.undav.edu.ar/g3w/acceso/recuperar"]

    %% Observaciones
    CalendarioVisitante --> Resoluciones["calend.-academico-resoluciones.tsx"]
    Resoluciones["calend.-academico-resoluciones.tsx"] --> PdfViewer["pdf-viewr.tsx"]