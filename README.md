# AV·STUDIO — Plataforma Comercial de Diseño y Desarrollo Web

**Eslogan:** Ideas que toman forma.  
**Responsable:** Anderson Vallejo  
**Ubicación:** Ecuador (referencia comercial en Cuenca, Azuay)  
**WhatsApp:** +593 979 290 747 (`https://wa.me/593979290747`)  
**Correo:** `andersonvallejo021@gmail.com`

---

## Stack Tecnológico

Este proyecto se construye exclusivamente con tecnologías web estándar, sin frameworks de frontend ni dependencias de compilación en el cliente:

- **HTML5** semántico y accesible.
- **CSS3** modular (`main.css`, `components.css`, `responsive.css`).
- **JavaScript puro (ES Modules)** sin librerías externas.

Compatible con alojamiento estático en **GitHub Pages** y **Netlify** utilizando rutas relativas.

---

## Estructura del Proyecto

```text
AV-STUDIO/
├── index.html
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   ├── components.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── main.js
│   │   ├── navigation.js
│   │   ├── interactions.js
│   │   ├── contact.js
│   │   ├── studio-logic.js
│   │   └── studio-logic.test.mjs
│   ├── images/
│   │   ├── brand/
│   │   ├── categories/       # Fotografías WebP + JPG optimizadas para los 16 sectores
│   │   └── shared/
│   └── icons/
│       └── favicon.svg
├── demos/                    # 16 sitios web demostrativos independientes (Cuenca, Ecuador)
│   ├── demos-logic.test.mjs  # Pruebas unitarias de lógica pura en los 16 sectores
│   └── <sector>/             # index.html, css/style.css, js/(logic|app).js, images/(.webp + .jpg)
└── README.md
```

---

## Estado del Proyecto

- **Página principal AV·STUDIO (`index.html`):** Directorio filtrable de 16 sectores con modal informativo de alcance, vitrina destacada, personalización interactiva en vivo, FAQ, formulario validado con preparación de mensaje hacia WhatsApp/correo y datos estructurados SEO (`JSON-LD`).
- **16 Demostraciones Independientes (`/demos/<sector>/`):** Sitios estáticos completos en HTML5, CSS3 y JavaScript puro (`restaurante`, `pizzeria`, `cafeteria`, `pasteleria`, `odontologia`, `consultorio`, `juridico`, `barberia`, `belleza`, `inmobiliaria`, `automotriz`, `hotel`, `tienda`, `gimnasio`, `academia`, `eventos`), con precios referenciales en USD, horarios 24h y enlace de retorno a AV·STUDIO.
- **Imágenes optimizadas:** Todas las fotografías utilizan `<picture>` con entrega prioritaria en formato **WebP** y respaldo **JPEG** comprimido, más carga diferida (`loading="lazy"`) bajo el pliegue inicial.
- **Pruebas unitarias (`node --test`):** `node --test assets/js/studio-logic.test.mjs demos/demos-logic.test.mjs`.

---

## Integración futura de backend (opcional)

Actualmente los formularios validan los datos en el navegador y generan mensajes estructurados listos para enviarse mediante `https://wa.me/593979290747` o `mailto:andersonvallejo021@gmail.com`, sin almacenar datos en servidores externos. Si en el futuro se desea persistencia en servidor o envío automático de correos, puede conectarse el evento `submit` en `assets/js/contact.js` hacia un endpoint propio o servicio de formularios.
