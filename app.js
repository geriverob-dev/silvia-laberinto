(() => {
  'use strict';
  const heart = '<svg viewBox="0 0 34 34" aria-hidden="true"><path d="M17 28S2 19 3 10c1-8 11-7 14-1 4-7 14-6 14 2 0 8-14 17-14 17Z"/></svg>';
  const plans = {
    coffee: { title: 'Un cafecito', asset: 'cafe', response: 'ir por un cafecito contigo', headline: 'Un cafecito.<br><em>Y cero prisa.</em>', intro: 'De esos que empiezan con un «¿cómo estás?» y se alargan sin darnos cuenta.', question: '¿Cómo se te antoja nuestro cafecito?', annotation: 'aquí la plática se sirve sin prisa', effect: 'hearts', choices: [
      { key: 'warm', label: 'Calientito, para la plática', title: 'Se nos escapó<br><em>un corazoncito.</em>', text: 'Salió del café. Creo que también tenía muchas ganas de verte.', note: 'una tacita llena de ganas', effect: 'hearts' },
      { key: 'cold', label: 'Frío, con hielitos', title: 'Hielitos, risas<br><em>y maripositas.</em>', text: 'El café bien frío, las manitas un poquito nerviosas y muchas cosas que contarte.', note: 'agítese con una buena plática', effect: 'ice' }
    ] },
    park: { title: 'Al parque', asset: 'parque', response: 'ir al parque contigo', headline: 'Donde se respire<br><em>un poquito bonito.</em>', intro: 'Una banquita, el aire fresco y tiempo para contarnos cómo nos ha ido.', question: '¿Dónde guardamos este ratito?', annotation: 'se aparta un lugar a tu ladito', effect: 'leaves', choices: [
      { key: 'shade', label: 'Bajo un arbolito', title: 'Te guardé<br><em>un pedacito de sombra.</em>', text: 'Una banquita debajo del árbol, una tarde tranquila y tu compañía. Así se me antoja.', note: 'reservado para dos', effect: 'leaves' },
      { key: 'flowers', label: 'Entre las flores', title: 'El camino<br><em>también floreció.</em>', text: 'Cada flor traía una palabrita escondida: qué bonito coincidir contigo.', note: 'qué / bonito / coincidir / contigo', effect: 'petals' }
    ] },
    museum: { title: 'Al museo', asset: 'museo', response: 'visitar un museo contigo', headline: 'Una sala llena<br><em>de cosas bonitas.</em>', intro: 'Buscamos un museo que se acomode al bolsillo y nos inventamos nuestras propias explicaciones.', question: '¿Qué sala abrimos primero?', annotation: 'se permite mirarnos y sonreír', effect: 'paper', choices: [
      { key: 'art', label: 'La de los cuadros', title: 'Creo que encontré<br><em>mi obra favorita.</em>', text: 'Un día cualquiera, compartido contigo. De esos que uno quisiera poner en un cuadrito.', note: 'título de la obra: un ratito contigo', effect: 'hearts' },
      { key: 'curiosities', label: 'La de las curiosidades', title: 'Una colección<br><em>de pequeñas ilusiones.</em>', text: 'Una taza, una flor, un boleto… todas mis ideas para salir terminan contigo.', note: 'objetos con mucho cariño dentro', effect: 'stars' }
    ] },
    walk: { title: 'A caminar', asset: 'caminar', response: 'salir a caminar contigo', headline: 'Sin rumbo fijo.<br><em>Contigo, sí.</em>', intro: 'Este plan cuesta cero y me ilusiona muchísimo. Llevamos tenis cómodos y algo que contarnos.', question: '¿Por dónde nos perdemos tantito?', annotation: 'pasito a pasito, sin ver el reloj', effect: 'footprints', choices: [
      { key: 'sun', label: 'Donde dé el sol', title: 'Un paso, una historia.<br><em>Luego, otra risa.</em>', text: 'Hay tardes que se arreglan con caminar un ratito junto a alguien que quieres mucho.', note: 'el camino se dibuja al andar', effect: 'sun' },
      { key: 'night', label: 'Por las lucecitas', title: 'Se encendieron<br><em>las lucecitas.</em>', text: 'Y en algún punto del camino seguro se me sale una sonrisa nomás de verte a mi lado.', note: 'un paseo de esos que se quedan', effect: 'stars' }
    ] },
    fair: { title: 'A la feria', asset: 'feria', response: 'darnos una vuelta por la feria', headline: 'Una vuelta entre<br><em>luces y risas.</em>', intro: 'Hacemos cuentas, elegimos algo sencillito y nos damos una vuelta. Con verte ya llevo ilusión de sobra.', question: '¿Qué se te antoja ver primero?', annotation: 'dos boletitos para un recuerdo', effect: 'tickets', choices: [
      { key: 'wheel', label: 'La rueda gigante', title: 'Una vuelta más.<br><em>Te adoro otra vez.</em>', text: 'El boleto incluye una vista bonita y a alguien muy emocionado por compartirla contigo.', note: 'válido por un recuerdo bonito', effect: 'stars' },
      { key: 'stalls', label: 'Todos los puestecitos', title: 'Lucecitas, antojitos<br><em>y una sonrisota.</em>', text: 'Vamos despacito, miramos de todo y elegimos lo que se acomode. Me emociona ir contigo.', note: 'se vale reírse por cualquier cosa', effect: 'tickets' }
    ] }
  };
  const stage = document.querySelector('#stage');
  const back = document.querySelector('#back-button');
  const steps = [...document.querySelectorAll('#journey-steps li')];
  const feedback = document.querySelector('#feedback');
  const particles = document.querySelector('#particles');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const initial = { screen: 'cover', opening: 'letter', route: null, detail: null, opened: false, accepted: false, availability: '', index: 0 };
  let state = { ...initial };
  let motionPaused = reduced.matches;
  let particleTimer;
  let feedbackTimer;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const button = (text, action, kind = 'primary', data = '') => `<button type="button" class="button ${kind}" data-action="${action}" ${data}>${text}<span aria-hidden="true">${kind === 'primary' ? '↗' : '→'}</span></button>`;
  const artwork = (key, extra = '') => `<div class="scene-drawing ${extra}">${window.SILVIA_SCENES?.[key] || `<img src="assets/${plans[key]?.asset || 'picnic-letter'}.svg" alt="" width="500" height="330">`}</div>`;
  const eyebrow = text => `<p class="eyebrow"><span aria-hidden="true">✳</span> ${text}</p>`;
  const plan = () => plans[state.route] || plans.coffee;
  const detail = () => plan().choices.find(c => c.key === state.detail) || plan().choices[0];
  const routeData = key => `data-route="${key}"`;
  const heading = html => `<h1 tabindex="-1">${html}</h1>`;
  const annotation = text => `<p class="art-annotation handwritten">${text}</p>`;

  function cover() {
    return `<section class="screen cover-screen"><div class="screen-copy">${eyebrow('UNA PEQUEÑA SORPRESA PARA TI')}${heading('Silvia,<br>te guardé<br><em>un ratito.</em>')}<p class="description">Hice un caminito de cosas bonitas.<br>Y, al final, hay algo que quiero preguntarte.</p><div class="choice-stack">${button('Abrir mi cartita', 'open-letter')}${button('Seguir las florecitas', 'follow-flowers', 'text-button')}</div><p class="handwritten cover-footnote">tú elige por dónde empezamos ${heart}</p></div><div class="cover-art"><span class="art-label handwritten">Para: Silvia<br><small>De: alguien que te adora</small></span><img class="floating-letter" src="assets/picnic-letter.svg" width="620" height="550" alt="Un sobre con corazón, flores, un cafecito y dos boletitos."><div class="sticky-note handwritten">P. D. Todo esto<br>lo hice para ti. ♡</div><span class="spark spark-one" aria-hidden="true">✧</span><span class="spark spark-two" aria-hidden="true">✧</span></div></section>`;
  }
  function opening() {
    const flowers = state.opening === 'garden';
    return `<section class="screen opening-screen ${flowers ? 'garden-opening' : 'letter-opening'}"><div class="screen-copy">${eyebrow(flowers ? 'EL CAMINITO DE LAS FLORES' : 'UNA CARTITA HECHA CON CARIÑO')}${heading(flowers ? 'Te traje flores.<br><em>Y un camino bonito.</em>' : 'Hay cosas que<br>merecen<br><em>una cartita.</em>')}<p class="description">${flowers ? 'Seguiste las florecitas y mira lo que pasó: hasta este rinconcito se puso contento de verte.' : 'Silvia, tengo muchas ganas de verte. De platicar, de reírnos y de hacer bonito un día cualquiera.'}</p><p class="handwritten personal-line">${flowers ? 'Si una flor te guiña el ojo, síguela…' : 'Te adoro. Así, sin letras chiquitas.'}</p><div class="choice-stack">${button('Ver qué caminos hay', 'paths')}${button(flowers ? 'Esa florecita esconde algo…' : 'Hay un corazoncito escondido…', 'secret', 'text-button')}</div></div><div class="art-board ${flowers ? 'garden-board' : 'letter-board'}">${artwork(flowers ? 'garden' : 'letter')}${annotation(flowers ? 'mira: floreció porque llegaste' : 'hay palabras que se sienten como un abrazo')}<span class="board-stamp" aria-hidden="true">hecho<br>para ti ${heart}</span></div></section>`;
  }
  function secret() {
    return `<section class="screen secret-screen"><div class="screen-copy">${eyebrow('ENCONTRASTE UN ATAJO SECRETO')}${heading('Una florecita.<br><em>Un recordatorio.</em>')}<p class="description">Si en algún punto te preguntas para qué hice tanto caminito, la respuesta es bien sencilla:</p><p class="secret-quote handwritten">porque me haces ilusión, Silvia.</p><div class="choice-stack">${button('Me llevo la florecita', 'paths')}${button('También quiero ver los demás caminos', 'paths', 'text-button', 'data-effect="stars"')}</div></div><div class="art-board secret-board">${artwork('garden', 'secret-garden')}<div class="little-note handwritten">Este detallito<br>ya es tuyo. ♡</div>${annotation('guárdala en tu bolsillo imaginario')}</div></section>`;
  }
  function paths() {
    const cards = Object.entries(plans).map(([key, item], i) => `<button type="button" class="route-card route-${key}" data-action="choose-plan" ${routeData(key)}><span class="route-number">0${i + 1}</span><img src="assets/${item.asset}.svg" width="240" height="180" alt=""><span class="route-title">${item.title}</span><span class="route-caption">${['Una plática sin prisa', 'Un ratito al aire libre', 'Algo bonito que descubrir', 'Pasitos y muchas historias', 'Lucecitas y risas'][i]}</span><span class="route-link">Por aquí <span aria-hidden="true">↗</span></span></button>`).join('');
    return `<section class="screen paths-screen"><div class="map-heading">${eyebrow('CINCO CAMINOS, CINCO SORPRESAS')}${heading('¿Por dónde<br class="mobile-only"> <em>nos perdemos?</em>')}<p class="description">No hay caminos equivocados. Pica el que más se te antoje.</p></div><div class="map-area"><svg class="map-trail" viewBox="0 0 1100 180" preserveAspectRatio="none" aria-hidden="true"><path d="M30 100C130-65 255 200 340 90S515-20 575 90 755 195 820 80 1000 0 1070 90"/></svg><div class="route-grid">${cards}</div></div><p class="handwritten map-postscript">El presupuesto es chiquito. La ilusión es de las grandes. ♡</p></section>`;
  }
  function scene() {
    const p = plan();
    return `<section class="screen plan-screen" data-plan="${state.route}"><div class="screen-copy">${eyebrow('ELEGISTE UN CAMINITO BONITO')}${heading(p.headline)}<p class="description">${p.intro}</p><p class="choice-question">${p.question}</p><div class="choice-stack">${p.choices.map((c, i) => button(c.label, 'choose-detail', i ? 'secondary' : 'primary', `data-detail="${c.key}"`)).join('')}</div><button class="quiet-link" type="button" data-action="paths">Me asomo a otro camino</button></div><div class="art-board plan-board">${artwork(state.route)}${annotation(p.annotation)}<span class="route-doodle" aria-hidden="true">✧</span></div></section>`;
  }
  function detailDecor() {
    const key = state.detail;
    if (key === 'warm') return `<div class="steam-love" aria-hidden="true">${[0, 1, 2, 3].map(i => `<span style="--i:${i}">${heart}</span>`).join('')}</div>`;
    if (key === 'cold') return `<div class="ice-party" aria-hidden="true">${[0, 1, 2, 3, 4, 5].map(i => `<span style="--i:${i}"></span>`).join('')}</div>`;
    if (key === 'shade') return `<div class="leaf-party" aria-hidden="true">${[0, 1, 2, 3, 4, 5, 6].map(i => `<span style="--i:${i}"><svg viewBox="0 0 40 60"><path d="M5 53C-2 20 15 2 35 3c4 25-5 47-30 50ZM6 52 31 10"/></svg></span>`).join('')}</div>`;
    if (key === 'flowers') return `<div class="bloom-words" aria-hidden="true">${['qué', 'bonito', 'coincidir', 'contigo'].map((w, i) => `<span style="--i:${i}">${w}</span>`).join('')}</div>`;
    if (key === 'art') return `<div class="heart-gallery" aria-hidden="true">${[0, 1, 2].map(i => `<span style="--i:${i}">${heart}</span>`).join('')}</div>`;
    if (key === 'curiosities') return `<div class="curiosity-party" aria-hidden="true">${['cafe', 'parque', 'feria'].map((a, i) => `<img src="assets/${a}.svg" alt="" width="90" height="70" style="--i:${i}">`).join('')}</div>`;
    if (key === 'sun') return '<div class="sun-doodle" aria-hidden="true"><svg viewBox="0 0 150 150"><circle cx="75" cy="75" r="30"/><path d="M75 8v18M75 124v18M8 75h18M124 75h18M28 28l13 13M109 109l13 13M28 122l13-13M109 41l13-13"/></svg></div>';
    if (key === 'night') return `<div class="night-stars" aria-hidden="true">${[0, 1, 2, 3, 4, 5].map(i => `<span style="--i:${i}">✧</span>`).join('')}<div class="lantern"></div></div>`;
    if (key === 'wheel') return `<div class="wheel-hearts" aria-hidden="true">${[0, 1, 2].map(i => `<span style="--i:${i}">${heart}</span>`).join('')}</div>`;
    return '<div class="fair-bunting" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="mini-ticket handwritten" aria-hidden="true">vale por<br>una sonrisota ♡</div>';
  }
  function surprise() {
    const d = detail();
    const drawing = state.detail === 'flowers' ? 'garden' : state.detail === 'stalls' ? 'fair' : state.route;
    return `<section class="screen surprise-screen" data-variant="${state.detail}"><div class="screen-copy">${eyebrow('UN DETALLITO DENTRO DEL CAMINO')}${heading(d.title)}<p class="description">${d.text}</p><div class="choice-stack">${button('¿Y la última sorpresa?', 'reveal')}${button('Quiero explorar otro camino', 'paths', 'text-button')}</div><p class="handwritten personal-line">todavía tengo algo que decirte…</p></div><div class="art-board surprise-board">${artwork(drawing)}${detailDecor()}${annotation(d.note)}</div></section>`;
  }
  function reveal() {
    return `<section class="screen reveal-screen ${state.opened ? 'letter-is-open' : ''}"><div class="screen-copy">${eyebrow('ENCONTRASTE LA ÚLTIMA SORPRESA')}${heading(state.opened ? 'Todo esto era<br><em>para decirte…</em>' : 'Detrás del plan<br><em>hay una cosita.</em>')}<p class="description">${state.opened ? 'Me daba un poquito de nervios decirlo.<br>Por eso lo envolví en flores y caminitos.' : 'Todas estas vueltas tenían un destino: una cartita que me daba un poquito de nervios hacerte.'}</p>${state.opened ? `<div class="choice-stack">${button('A ver esa invitación', 'invite')}${button('Dar otra vueltecita', 'paths', 'text-button')}</div>` : `<div class="choice-stack">${button('Desdoblar la cartita', 'flip-letter')}<p class="handwritten small-note">con cuidadito, lleva cariño dentro ♡</p></div>`}</div><div class="reveal-art">${state.opened ? `<article class="personal-letter"><span class="paper-tape" aria-hidden="true"></span><p class="handwritten letter-salutation">Silvia,</p><p>Hice todos estos caminitos para llegar a lo que quería decirte desde el principio: <strong>tengo muchas ganas de verte.</strong></p><p>Mi presupuesto anda chiquito, jaja, y mis ganas de compartir un ratito contigo están enormes. Elegimos algo que nos acomode y lo hacemos bonito.</p><p class="letter-emphasis">Te adoro. Y me encantaría un ratito de tu compañía.</p><p class="handwritten letter-signature">Con cariño y un poquito de nervios. ♡</p></article>` : `<div class="sealed-envelope">${artwork('letter')}<span class="envelope-tag handwritten">Para ti, Silvia.<br>Con todo mi cariño.</span></div>`}</div></section>`;
  }
  function invite() {
    return `<section class="screen invite-screen"><div class="screen-copy">${eyebrow('AHORA SÍ, LA PREGUNTITA')}${heading('Silvia,<br>¿salimos<br><em>un ratito?</em>')}<p class="description">Me haría muy feliz pasar tiempo contigo.<br>Un plan sencillo, sin prisas, cuando te venga bien.</p><p class="handwritten personal-line">Te adoro. Eso ya te lo dije,<br>pero te lo puedo decir otra vez. ♡</p></div><div class="invitation-ticket"><div class="ticket-top"><span>VALE POR UN RATITO JUNTOS</span>${heart}</div><div class="ticket-plan"><img src="assets/${plan().asset}.svg" width="150" height="110" alt=""><div><span class="ticket-small">El caminito que elegiste</span><h2>${plan().title}</h2><p class="handwritten">${detail().label}</p></div></div><button type="button" class="quiet-link change-route" data-action="paths">Podemos cambiar de plan ↗</button><label for="availability">¿Cuándo te gustaría? <small>(si ya sabes)</small></label><input id="availability" type="text" maxlength="120" placeholder="Por ejemplo, el sábado por la tarde" autocomplete="off" value="${esc(state.availability)}"><div class="choice-stack">${button('Sí, me encantaría ♡', 'accept')}${button('Lo platicamos con calma', 'later', 'text-button')}</div><span class="ticket-bottom handwritten">El día y los detalles los decidimos juntos.</span></div></section>`;
  }
  function replyMessage() {
    if (!state.accepted) return `Me gustó la idea de ${plan().response}. Lo platicamos con calma para ver si se nos acomoda. ♡`;
    return `¡Sí, salgamos! Me encantaría ${plan().response}.${state.availability.trim() ? ` Me viene bien: ${state.availability.trim()}.` : ''} Nos ponemos de acuerdo para el día y la hora. ♡`;
  }
  function finish() {
    return `<section class="screen finish-screen ${state.accepted ? 'accepted' : 'take-your-time'}"><div class="screen-copy">${eyebrow(state.accepted ? 'QUÉ BONITO QUE COINCIDAMOS' : 'CON CALMA Y CON CARIÑO')}${heading(state.accepted ? 'Tenemos un<br><em>ratito pendiente.</em>' : 'Te guardo<br><em>esta invitación.</em>')}<p class="description">${state.accepted ? 'Ahora toca ponernos de acuerdo.<br>Te dejo tu respuesta lista para compartirla.' : 'Cuando te venga bien lo platicamos.<br>Gracias por recorrer mi cartita, Silvia.'}</p><div class="response-box"><label for="response-message">${state.accepted ? 'Tu respuesta, con ilusión' : 'Si quieres contármelo'}</label><textarea id="response-message" readonly rows="4">${esc(replyMessage())}</textarea></div><div class="finish-actions">${button(typeof navigator.share === 'function' ? 'Compartir mi respuesta' : 'Copiar mi respuesta', 'share')}<button class="quiet-link" type="button" data-action="save-ticket">Guardar mi boletito ↓</button></div><button class="quiet-link restart-link" type="button" data-action="restart">Recorrer otro caminito ↺</button></div><div class="art-board finish-board">${artwork(state.accepted ? state.route : 'garden')}<div class="souvenir-ticket"><span class="ticket-star" aria-hidden="true">✳</span><span class="ticket-small">ESTA INVITACIÓN ES PARA</span><p class="handwritten">Silvia</p><span class="souvenir-plan">${plan().title}</span><div class="ticket-perforation"></div><span class="handwritten souvenir-sign">poquito presupuesto,<br>muchísimo cariño ♡</span></div>${annotation(state.accepted ? 'me emociona mucho verte' : 'a tu ritmo, siempre')}</div></section>`;
  }
  const renderers = { cover, opening, secret, paths, scene, surprise, reveal, invite, finish };

  function render(focus = true) {
    stage.innerHTML = renderers[state.screen]();
    stage.dataset.screen = state.screen;
    back.hidden = state.index === 0;
    const progress = ({ cover: 0, opening: 0, secret: 0, paths: 1, scene: 2, surprise: 2, reveal: 3, invite: 4, finish: 4 })[state.screen];
    steps.forEach((el, i) => {
      el.classList.toggle('active', i === progress);
      el.classList.toggle('done', i < progress);
      if (i === progress) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
    });
    document.querySelector('#journey-caption').textContent = ['Cada camino guarda algo bonito.', 'Tú eliges por dónde seguimos.', 'Este ratito ya tiene un poquito de ti.', 'Ya casi llegamos a la preguntita.', 'Los mejores planes se platican juntos.'][progress];
    if (focus) {
      stage.querySelector('h1')?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    document.title = state.screen === 'finish' ? 'Un ratito contigo, Silvia ♡' : 'Silvia, te guardé una sorpresa ♡';
  }
  function go(screen, extras = {}, effect = 'petals') {
    state = { ...state, ...extras, screen, index: state.index + 1 };
    history.pushState({ silvia: state }, '', `#${screen === 'scene' ? `camino-${state.route}` : screen}`);
    render();
    burst(effect);
  }
  function burst(effect) {
    clearTimeout(particleTimer);
    particles.replaceChildren();
    if (motionPaused) return;
    particles.dataset.effect = effect;
    const count = innerWidth < 600 ? 16 : 25;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('i');
      el.style.setProperty('--x', `${Math.random() * 100}%`);
      el.style.setProperty('--delay', `${Math.random() * .6}s`);
      el.style.setProperty('--duration', `${2 + Math.random() * 1.5}s`);
      el.style.setProperty('--rotate', `${Math.random() * 360}deg`);
      el.style.setProperty('--drift', `${Math.random() * 200 - 100}px`);
      el.style.setProperty('--size', `${12 + Math.random() * 14}px`);
      if (effect === 'hearts') el.innerHTML = heart;
      else if (effect === 'stars' || effect === 'sun') el.textContent = i % 2 ? '✧' : '✦';
      else if (effect === 'footprints') el.innerHTML = '<svg viewBox="0 0 20 34"><ellipse cx="10" cy="11" rx="6" ry="10"/><ellipse cx="10" cy="27" rx="5" ry="4"/></svg>';
      else if (effect === 'tickets') el.textContent = '♡';
      particles.append(el);
    }
    particleTimer = setTimeout(() => particles.replaceChildren(), 4400);
  }
  function announce(text) {
    clearTimeout(feedbackTimer);
    feedback.textContent = text;
    feedback.classList.add('visible');
    feedbackTimer = setTimeout(() => feedback.classList.remove('visible'), 5500);
  }
  async function copyResponse() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(replyMessage());
      announce('Mensaje copiado. Ya puedes pegarlo en tu conversación.');
    } catch {
      const text = document.querySelector('#response-message');
      text.focus(); text.select(); text.setSelectionRange(0, text.value.length);
      announce('El mensaje está seleccionado. Mantén pulsado o usa Ctrl+C para copiarlo.');
    }
  }
  async function shareResponse() {
    if (typeof navigator.share !== 'function') return copyResponse();
    try { await navigator.share({ text: replyMessage() }); }
    catch (err) { if (err.name !== 'AbortError') { await copyResponse(); } }
  }
  function saveTicket() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="560" viewBox="0 0 900 560"><rect width="900" height="560" rx="18" fill="#f6f0e5"/><rect x="27" y="27" width="846" height="506" rx="8" fill="#fffaf0" stroke="#cbb99d" stroke-width="2" stroke-dasharray="7 8"/><path d="M450 130s-49-30-45-55c4-22 35-20 45-3 12-20 42-17 44 4 2 22-44 54-44 54Z" fill="none" stroke="#a34e3e" stroke-width="3"/><text x="450" y="185" text-anchor="middle" fill="#717753" font-family="Georgia,serif" font-size="16" letter-spacing="4">VALE POR UN RATITO JUNTOS</text><text x="450" y="260" text-anchor="middle" fill="#462d2c" font-family="Georgia,serif" font-size="54" font-style="italic">Para ti, Silvia.</text><path d="M165 291q285-15 570 0" fill="none" stroke="#d9cdbb" stroke-width="2"/><text x="450" y="344" text-anchor="middle" fill="#a34e3e" font-family="Georgia,serif" font-size="34">${esc(plan().title)}</text><text x="450" y="391" text-anchor="middle" fill="#7b6760" font-family="Georgia,serif" font-size="18">${esc(state.accepted ? 'El día y los detalles los decidimos juntos.' : 'Una invitación para cuando tú quieras.')}</text><text x="450" y="466" text-anchor="middle" fill="#717753" font-family="Georgia,serif" font-style="italic" font-size="23">Poquito presupuesto, muchísimo cariño.</text><text x="450" y="504" text-anchor="middle" fill="#a34e3e" font-family="Georgia,serif" font-size="18">Te adoro.</text></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'Un-ratito-con-Silvia.svg'; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    announce('Tu boletito está listo para guardar. ♡');
  }

  stage.addEventListener('click', event => {
    const target = event.target.closest('[data-action]');
    if (!target || !stage.contains(target)) return;
    const action = target.dataset.action;
    if (action === 'open-letter') go('opening', { opening: 'letter' }, 'paper');
    else if (action === 'follow-flowers') go('opening', { opening: 'garden' }, 'petals');
    else if (action === 'secret') go('secret', {}, 'petals');
    else if (action === 'paths') go('paths', {}, target.dataset.effect || 'leaves');
    else if (action === 'choose-plan' && plans[target.dataset.route]) go('scene', { route: target.dataset.route, detail: null, opened: false }, plans[target.dataset.route].effect);
    else if (action === 'choose-detail') {
      const selected = plan().choices.find(c => c.key === target.dataset.detail);
      if (selected) go('surprise', { detail: selected.key }, selected.effect);
    }
    else if (action === 'reveal') go('reveal', { opened: false }, 'paper');
    else if (action === 'flip-letter') {
      state.opened = true;
      history.replaceState({ silvia: state }, '', location.hash);
      render(); burst('hearts');
    }
    else if (action === 'invite') go('invite', {}, 'hearts');
    else if (action === 'accept') go('finish', { accepted: true }, 'tickets');
    else if (action === 'later') go('finish', { accepted: false }, 'petals');
    else if (action === 'share') shareResponse();
    else if (action === 'save-ticket') saveTicket();
    else if (action === 'restart') go('paths', { accepted: false, opened: false }, 'stars');
  });
  stage.addEventListener('input', event => {
    if (event.target.id === 'availability') {
      state.availability = event.target.value.slice(0, 120);
      history.replaceState({ silvia: state }, '', location.hash);
    }
  });
  back.addEventListener('click', () => { if (state.index > 0) history.back(); });
  document.querySelector('#home-button').addEventListener('click', () => { if (state.screen !== 'cover') go('cover', { ...initial, index: state.index }, 'petals'); });
  window.addEventListener('popstate', event => {
    if (event.state?.silvia && renderers[event.state.silvia.screen]) { state = event.state.silvia; render(); particles.replaceChildren(); }
  });
  function updateMotion() {
    document.documentElement.classList.toggle('motion-paused', motionPaused);
    document.documentElement.classList.toggle('motion-active', !motionPaused);
    const control = document.querySelector('#motion-button');
    control.setAttribute('aria-pressed', String(motionPaused));
    control.setAttribute('aria-label', motionPaused ? 'Activar las animaciones' : 'Pausar las animaciones');
    document.querySelector('#motion-label').textContent = motionPaused ? 'Activar movimiento' : 'Pausar movimiento';
    control.querySelector('path').setAttribute('d', motionPaused ? 'M8 5l11 7-11 7Z' : 'M9 7v10M15 7v10');
    if (motionPaused) particles.replaceChildren();
  }
  document.querySelector('#motion-button').addEventListener('click', () => { motionPaused = !motionPaused; updateMotion(); });
  reduced.addEventListener('change', event => { motionPaused = event.matches; updateMotion(); });
  if (history.state?.silvia && renderers[history.state.silvia.screen]) state = history.state.silvia;
  history.replaceState({ silvia: state }, '', state.screen === 'cover' ? '#inicio' : location.hash);
  updateMotion(); render(false);
})();
