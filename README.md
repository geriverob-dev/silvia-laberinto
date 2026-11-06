# Un ratito contigo, Silvia

Una invitación artesanal que se recorre por pantallas, con cinco caminos y diez sorpresas animadas. Conserva la textura de papel, los tonos terracota, las flores y los dibujos originales. Funciona como un sitio estático: no necesita ChatGPT, cuentas de visitantes, servidor de aplicación, instalación ni compilación.

## Abrirla

Abre `index.html` directamente en el navegador o, para probarla mediante HTTP:

```powershell
python -m http.server 5032 --bind 127.0.0.1
```

Visita `http://127.0.0.1:5032`.

## Publicarla en GitHub Pages

Sube el contenido de esta carpeta a un repositorio. `index.html`, `app.js`, `style.css`, `.nojekyll` y `assets/` deben quedar en la raíz.

En **Settings → Pages → Build and deployment**, selecciona **Deploy from a branch**, rama **main**, carpeta **/ (root)** y guarda. GitHub mostrará el enlace del sitio cuando termine la publicación. Las rutas de los recursos son relativas y funcionan también en una dirección de proyecto como `https://usuario.github.io/silvia-laberinto/`.

Guía oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Qué incluye

- Dos comienzos: abrir la carta o seguir las flores, más un atajo secreto opcional.
- Cinco planes: café, parque, museo, caminata y feria.
- Dos elecciones por plan: diez escenas con animaciones diferentes.
- Carta final que se desdobla, invitación, disponibilidad opcional y respuesta para compartir o copiar.
- Boletito de recuerdo descargable como SVG.
- Navegación hacia atrás, soporte de teclado y pausa de animaciones. Respeta la preferencia de movimiento reducido y permite activarlo expresamente.

Las elecciones del recorrido son preferencias; la respuesta a la invitación se elige al final. “Lo platicamos con calma” produce su propio cierre cariñoso y no confirma una cita.

## Personalizarla

`app.js` contiene los textos y las dos variantes de cada plan en `plans`. `style.css` contiene la presentación y los estilos para celular. `assets/scenes.js` contiene los dibujos SVG animables; `assets/animations.css` contiene sus movimientos y transiciones. No se utilizan bibliotecas externas.

Las respuestas y la disponibilidad permanecen en el historial de esta pestaña. No se envían a un servidor ni se guardan en una base de datos. El botón de compartir abre el menú del dispositivo; si no existe, copia el mensaje, y si no hay permiso para el portapapeles lo selecciona para copiarlo manualmente.

Las fuentes Caveat, DM Sans y Playfair Display se sirven localmente. Sus licencias OFL están incluidas en `assets/`.
