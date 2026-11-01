# Verificación de la presentación

- TypeScript: correcto (`npm run typecheck`).
- ESLint: correcto, sin advertencias (`npm run lint`).
- Pruebas de las reglas de navegación: 3 correctas (`npm test`).
- Compilación de producción: correcta (`npm run build`, Next.js con Webpack).
- Dependencias de producción: `npm audit --omit=dev` sin vulnerabilidades reportadas al comprobarlas.

## Pruebas en Chrome

Comprobadas las zonas con clic y toque simulado, las 17 diapositivas, la escena final, los controles y la recarga sin conexión. Las pruebas funcionales usan 1920 × 1080 y un teléfono de 390 × 664 píxeles CSS; las comprobaciones de encuadre incluyen además 1366 × 768, 1024 × 768 y 844 × 390. La emulación de teléfono se ejecuta en Chromium, no en Safari.

| Requisito | Resultado |
| --- | --- |
| Diapositiva 1 → clic en zona derecha → 2 | Correcto |
| Diapositiva 2 → clic en zona izquierda → 1 | Correcto |
| Diapositiva 10 → zona izquierda → 9 | Correcto |
| Diapositiva 17 → zona derecha → cierre | Correcto |
| Cierre → zona izquierda → 17 | Correcto |
| Cierre → zona derecha → 1 | Correcto |
| Reinicio del progreso | Correcto |
| Bloqueo de cinco clics rápidos | Correcto, un solo avance |
| Controles del presentador y línea temporal | No activan las zonas por accidente |
| Flechas, espacio, PageUp y PageDown | Correcto |
| Repetición al mantener una tecla | Bloqueada |
| F y Escape | Activan y desactivan pantalla completa |
| Reinicio en pantalla completa | Conserva pantalla completa |
| Contador oculto en el cierre | Correcto |
| Cierre sin reinicio automático | Permanece hasta la siguiente acción |
| Movimiento reducido | Animaciones y retrasos eliminados |
| Textos y recursos visuales locales | Sin desbordamientos detectados ni imágenes rotas |
| Recarga sin conexión y recorrido completo | Correcto en producción, con caché preparada |

Se revisaron capturas de portada, comparación de desigualdades, retratos, reflexiones y cierre. El hardware de proyección y un teléfono físico no se han probado. La disponibilidad de pantalla completa en teléfonos depende de su navegador; la presentación sigue funcionando sin ella.

Las pruebas completas están en `tests/browser/presentation.spec.ts` y la configuración en `playwright.config.ts`. El PDF de la lectura no fue adjuntado: el contenido y su alcance se verificaron contra el prompt proporcionado, no contra la paginación del PDF.
