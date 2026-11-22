# Primera prueba con una ARMY Bomb Ver. 4

Esta guía requiere tu dispositivo físico. Las pruebas automatizadas del repositorio no sustituyen estos resultados.

## Preparar

1. En Windows, abre `http://127.0.0.1:5173/` en Chrome o Edge, con el equipo ejecutando `npm run dev`. Si el panel integrado de otra app bloquea Bluetooth, abre una pestaña del navegador normal.
2. Activa Bluetooth del equipo. Cierra Weverse, la app oficial, Bora Waves y cualquier otra app/pestaña conectada a la ARMY Bomb.
3. Con la Ver. 4 apagada, mantén los dos botones unos dos segundos hasta que parpadee azul.
4. Pulsa **Conectar Ver. 4**, luego **Buscar ARMY Bomb**, y selecciona `BTS_V4 LS` o el nombre que empieza por `BBOMB-`.

## Verificar

- [ ] El panel muestra conexión, inicialmente sin confirmación visual.
- [ ] **Probar rojo**, **Probar verde**, **Probar azul** producen los colores correctos.
- [ ] El brillo cambia perceptiblemente y brillo 0 deja la luz apagada.
- [ ] **Probar apagado** apaga la luz sin romper la sesión.
- [ ] La paleta y una demo cambian la luz física (no hay sincronización de audio todavía).
- [ ] Cambiar claro/oscuro no altera el color de la luz.
- [ ] Al apagar o alejar la ARMY Bomb, el panel avisa la desconexión y detiene la demo.
- [ ] **Apagar**, luego **Desconectar**, libera el enlace sin reintentos automáticos.

Si el enlace se establece pero sigue parpadeando azul, usa **Sigue azul: preparar control** una vez. Espera la reconexión y repite RGB/apagado. Si no responde, apaga la ARMY Bomb, vuelve a activar Bluetooth y realiza una nueva selección. No repitas preparaciones continuamente.

Cuando hayas visto los resultados correctos, pulsa **Sí, los colores funcionan**. La confirmación sólo pertenece a la sesión actual.

## Compartir resultados sin datos personales

Anota SO y versión, navegador y versión, modelo real, firmware si lo conoces, pruebas que pasaron, mensaje de error y si hizo falta preparar el control. No publiques direcciones Bluetooth, grabaciones privadas ni datos de otras personas.

## Teléfonos y modo offline

En Android puede utilizarse Chrome con HTTPS. Abrir la IP de tu PC por HTTP en el teléfono no ofrece el mismo contexto seguro que localhost. La PWA puede usar Bluetooth sin internet después de prepararse, pero Bluetooth y los permisos deben seguir disponibles. Safari en iPhone no ofrece esta conexión estándar; el empaquetado nativo sigue pendiente.
