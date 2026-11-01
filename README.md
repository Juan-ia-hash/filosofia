# Rousseau · El origen de la desigualdad

Presentación web con **17 diapositivas académicas**, notas para cinco integrantes y una escena cinematográfica final independiente. Next.js App Router, TypeScript, Tailwind CSS y animaciones CSS. Sin base de datos ni servicios de pago.

Se utiliza Webpack en desarrollo y producción para evitar un fallo de creación de procesos de Turbopack observado en este entorno Windows.

## Ejecutar

Requiere Node.js 20.9 o superior y npm.

```sh
npm install
npm run dev
```

Abrir http://localhost:3000. Para exponer y disponer de la caché sin conexión, usar producción:

```sh
npm run build
npm start
```

Mantener el servidor activo. Desde un teléfono conectado a la misma red puede abrirse `http://IP-DEL-EQUIPO:3000`; permitir el acceso en el firewall si el sistema lo solicita. El service worker requiere HTTPS o localhost, por lo que la caché sin conexión en un teléfono debe usarse con un despliegue HTTPS, como Vercel.

## Navegación

| Acción | Control |
| --- | --- |
| Anterior | Toque/clic primario en la mitad izquierda, ← o PageUp |
| Siguiente | Toque/clic primario en la mitad derecha, →, Espacio o PageDown |
| Pantalla completa | F o botón de pantalla completa |
| Salir de pantalla completa | Escape o botón |
| Notas del presentador | P o botón de presentador |

Las mitades son zonas lógicas invisibles: no hay capas transparentes que tapen el contenido. Los botones, enlaces, formularios y el panel de notas tienen prioridad. «Clic derecho» en las instrucciones significa clic en la mitad derecha con el botón primario; el botón secundario conserva el menú del navegador.

Las entradas repetidas se bloquean durante los 650 ms de transición. La tecla mantenida no salta diapositivas. En portada, retroceder no cambia nada. Las animaciones se reproducen en cada entrada, también al retroceder. Las preferencias de movimiento reducido eliminan desplazamientos y retrasos; el bloqueo se reduce a 100 ms.

Después de la diapositiva 17 aparece el cierre: oscurecimiento, pregunta editorial, «La pregunta sigue abierta», agradecimiento e indicación de reinicio. No se reinicia por tiempo. Izquierda regresa a la 17; derecha vuelve a portada, reinicia el progreso y las animaciones, manteniendo la pantalla completa. El cierre no tiene contador académico.

## Presentadores

El panel muestra sección, integrante, duración orientativa, notas, próxima pantalla y navegación. Las duraciones suman 25 minutos de exposición y 5 minutos de reflexiones. Las notas se muestran **en la misma pantalla**; ocultarlas con P antes de proyectar. No se abre una segunda ventana ni se sincronizan pantallas. El foco queda dentro del panel mientras está abierto; P o Escape lo cierran.

## Uso sin conexión

No hay recursos de Google Fonts, CDNs ni APIs durante la presentación. En producción, el service worker guarda portada, recursos visuales y archivos cargados de Next.js. Abrir el panel de presentador y esperar «Recursos guardados para usar sin conexión» antes de desconectarse. La caché permite recargar y recorrer las 17 diapositivas y el cierre. La primera carga y la instalación de dependencias requieren conexión. `next dev` no registra caché para evitar servir código antiguo durante la edición.

Tras publicar cambios, volver a cargar con conexión y esperar a que se preparen los recursos. Si se cambia el formato de los recursos, incrementar la versión de `CACHE` en `public/sw.js`.

## Contenido y recursos

- `src/data/slides.ts`: los 17 títulos, conceptos, secciones, tiempos y notas.
- `src/components/SlideArt.tsx`: composiciones específicas, comparación, línea temporal y conexiones.
- `src/components/Presentation.tsx`: controles, transiciones y modo presentador.
- `src/lib/navigation.mjs`: reglas de navegación compartidas con las pruebas.
- `src/components/Finale.tsx`: cierre editorial, ajeno al contador de 17 diapositivas.
- `src/app/globals.css`: dirección visual, adaptación a pantallas y movimiento reducido.
- `public/images`: retratos locales, SVG originales y `CREDITS.md` con fuentes y licencias.
- `scripts/create-art.mjs`: regenera las cinco ilustraciones SVG.

Los títulos, fechas y conceptos proceden del prompt maestro y conservan su orden. No se ha incorporado investigación académica adicional ni estadísticas. Las notas solo reorganizan lo proporcionado. Las tres definiciones breves que aparecen en la diapositiva 10 utilizan supervivencia, libertad y perfectibilidad ya descritas en el prompt; los otros conceptos se mantienen sin definiciones inventadas. Las frases del cierre se identifican como síntesis editorial, no citas de Rousseau. No se suministró el PDF: el límite de página se ha respetado siguiendo el alcance y el contenido establecidos en el prompt, sin verificar una paginación externa.

Para cambiar imágenes, reemplazar los archivos locales, conservar sus rutas o actualizar `SlideArt.tsx`, `globals.css` y la lista de recursos del service worker. Registrar siempre las licencias en `CREDITS.md`.

## Comprobaciones

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

Las pruebas de navegador usan Chrome instalado en Windows. Para otro equipo, establecer `BROWSER_PATH` con la ruta de Chrome/Chromium o modificar `playwright.config.ts` para usar un navegador instalado por Playwright. Las pruebas comprueban tamaños de proyector y teléfono, navegación bidireccional, cierre, reinicio, clics rápidos, aislamiento del panel, atajos, desbordamientos y recarga sin conexión. No sustituyen la comprobación física del proyector o del navegador concreto del teléfono.

## Desplegar en Vercel

1. Subir este directorio a un repositorio Git.
2. Importarlo en Vercel y seleccionar el framework Next.js.
3. Mantener `npm run build` como comando de construcción y el directorio de salida predeterminado.
4. Publicar. No se requieren variables de entorno.
5. Abrir el enlace HTTPS con conexión, esperar a que se guarden los recursos y probar el dispositivo de exposición.

Este proyecto está preparado para desplegar; no se ha publicado automáticamente.
