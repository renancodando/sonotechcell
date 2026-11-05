'use strict';

// Static site: contact and location work without a backend or database.
const business = {
  whatsapp: '5515981337498',
  phone: '(15) 98133-7498',
  address: 'Alameda das Dálias, 393, Casa 12, Jardim Simus, Sorocaba - SP, 18055-195, Brasil',
  mapAddress: 'Alameda das Dálias, 393, Jardim Simus, Sorocaba - SP, 18055-195, Brasil',
  timeZone: 'America/Sao_Paulo'
};
const mapsQuery = encodeURIComponent(business.mapAddress);
document.querySelectorAll('[data-map-route]').forEach(link => {
  link.href = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;
});
document.querySelector('.contact-number').href = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent('Olá, SônoTechCell! Gostaria de informações sobre os serviços.')}`;

function updateBusinessHours(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: business.timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(now).map(part => [part.type, part.value]));
  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  const closing = parts.weekday === 'Sat' ? 12 * 60 : 18 * 60;
  const open = parts.weekday !== 'Sun' && minutes >= 8 * 60 && minutes < closing;
  document.querySelectorAll('[data-business-status]').forEach(status => {
    status.classList.toggle('is-open', open);
    status.textContent = open ? `Dentro do horário de atendimento · até ${closing / 60}h` : 'Fora do horário de atendimento';
  });
}
updateBusinessHours();
setInterval(updateBusinessHours, 60_000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateBusinessHours(); });

async function copyText(text, scope) {
  const feedback = scope.querySelector('[data-copy-feedback]');
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else throw new Error('Clipboard unavailable');
    feedback.textContent = 'Copiado!';
  } catch {
    // A selectable fallback also works when clipboard permissions are denied.
    const field = document.createElement('textarea');
    field.className = 'manual-copy';
    field.value = text;
    field.readOnly = true;
    field.setAttribute('aria-label', 'Texto para copiar manualmente');
    scope.querySelector('.manual-copy')?.remove();
    feedback.textContent = 'Selecione o texto abaixo e copie:';
    feedback.after(field);
    field.focus();
    field.select();
  }
}
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', () => {
  const text = button.dataset.copy === 'address' ? business.address : business.phone;
  copyText(text, button.closest('dialog'));
}));

const services = {
  screen: { title: 'Troca de Tela', icon: 'screen', description: 'Tela quebrada, manchas ou toque que não responde? O cuidado com seu celular começa por uma avaliação do display e do touch.' },
  battery: { title: 'Troca de Bateria', icon: 'battery', description: 'Mais autonomia para o seu dia. Avaliamos a saúde da bateria e os sinais de desgaste para identificar o que seu aparelho precisa.' },
  cleaning: { title: 'Limpeza Interna', icon: 'drop', description: 'Remoção de sujeiras e oxidação, com atenção aos componentes internos e ao funcionamento do seu aparelho.' },
  board: { title: 'Reparo de Placa', icon: 'chip', description: 'Diagnóstico e conserto avançado para falhas na placa. Cada aparelho recebe uma avaliação técnica individual.' },
  other: { title: 'Outros Serviços', icon: 'gear', description: 'Botões, câmeras, conectores e muito mais. Conte o que está acontecendo para encontrarmos o cuidado certo para seu celular.' },
  connector: { title: 'Conector de carga', icon: 'bolt', description: 'Seu aparelho não carrega ou o cabo fica solto? Uma avaliação ajuda a identificar falhas no conector e no circuito de carregamento.' },
  camera: { title: 'Câmeras e áudio', icon: 'gear', description: 'Problemas no foco, na câmera, no microfone ou no alto-falante? Conte quais sinais você percebe no seu aparelho.' },
  buttons: { title: 'Botões e sensores', icon: 'chip', description: 'Avaliação de botões, sensores e outros componentes que fazem parte da experiência de uso do seu celular.' }
};
const benefits = {
  speed: { title: 'Reparo rápido', icon: 'bolt', description: 'Seu aparelho de volta no menor tempo. Após a avaliação, a equipe poderá informar as etapas do reparo e o prazo para o seu caso.' },
  warranty: { title: 'Garantia', icon: 'shield', description: 'Segurança em cada serviço. Consulte com a equipe as condições de garantia aplicáveis ao reparo do seu aparelho.' },
  support: { title: 'Atendimento personalizado', icon: 'support', description: 'Suporte direto e ágil. Cada aparelho tem uma história e cada atendimento recebe atenção para entender o que você precisa.' }
};

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const dialogs = [...document.querySelectorAll('dialog')];
let returnFocus = null;
let selectedService = '';

function closeMenu() {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Abrir menu');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});
window.matchMedia('(min-width: 641px)').addEventListener('change', closeMenu);

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.querySelectorAll('a').forEach(item => {
    item.classList.toggle('active', item === link);
    if (item === link) item.setAttribute('aria-current', 'location');
    else item.removeAttribute('aria-current');
  });
  closeMenu();
  if (link.hash === '#diferenciais') {
    const list = document.querySelector('.benefits');
    list.classList.remove('highlight');
    requestAnimationFrame(() => requestAnimationFrame(() => list.classList.add('highlight')));
  }
}));

function openDialog(id, trigger) {
  // Preserve the original trigger when moving between dialogs.
  if (!dialogs.some(dialog => dialog.open)) returnFocus = trigger;
  dialogs.forEach(dialog => { if (dialog.open) dialog.close(); });
  closeMenu();
  const dialog = document.getElementById(id);
  document.body.classList.add('modal-open');
  dialog.showModal();
}
function closeDialog(dialog) { dialog.close(); }
dialogs.forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => closeDialog(dialog));
  let backdropPointerDown = false;
  dialog.addEventListener('pointerdown', event => {
    const rect = dialog.getBoundingClientRect();
    backdropPointerDown = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  });
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (backdropPointerDown && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeDialog(dialog);
    backdropPointerDown = false;
  });
  dialog.addEventListener('close', () => {
    if (!dialogs.some(item => item.open)) {
      document.body.classList.remove('modal-open');
      returnFocus?.focus({ preventScroll: true });
    }
  });
});

function showDetail(data, trigger, location = false) {
  document.querySelector('#detail-title').textContent = data.title;
  document.querySelector('#detail-description').textContent = data.description;
  document.querySelector('#detail-dialog .dialog-symbol use').setAttribute('href', '#i-' + data.icon);
  document.querySelector('#location-details').hidden = !location;
  document.querySelector('#detail-eyebrow').textContent = location ? 'ESTAMOS ESPERANDO POR VOCÊ' : 'ASSISTÊNCIA ESPECIALIZADA';
  if (location) {
    const map = document.querySelector('.location-map');
    if (!map.hasAttribute('src')) map.src = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
    updateBusinessHours();
  }
  openDialog('detail-dialog', trigger);
}
document.querySelectorAll('[data-service]').forEach(button => {
  button.addEventListener('click', () => {
    const data = services[button.dataset.service];
    selectedService = data.title;
    showDetail(data, button);
  });
});
document.querySelectorAll('[data-benefit]').forEach(button => button.addEventListener('click', () => {
  selectedService = '';
  showDetail(benefits[button.dataset.benefit], button);
}));
document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', event => {
  event.preventDefault();
  const action = button.dataset.open;
  if (action === 'location') {
    selectedService = '';
    showDetail({ title: 'Visite nossa loja', description: 'Tecnologia, confiança e um atendimento perto de você.', icon: 'pin' }, button, true);
    return;
  }
  if (action === 'diagnosis') {
    if (!button.closest('#detail-dialog')) selectedService = '';
    document.querySelector('#service').value = selectedService;
    document.querySelector('.form-feedback').hidden = true;
  }
  openDialog(action === 'diagnosis' ? 'diagnosis-dialog' : 'contact-dialog', button);
}));

const allServices = document.querySelector('.all-services');
allServices.addEventListener('click', () => {
  const expanded = allServices.getAttribute('aria-expanded') !== 'true';
  allServices.setAttribute('aria-expanded', String(expanded));
  document.querySelector('#extra-services').hidden = !expanded;
  allServices.firstChild.textContent = expanded ? 'Mostrar menos' : 'Ver todos os serviços';
});

// WhatsApp handles delivery; no contact data is persisted by this site.
const form = document.querySelector('#diagnosis-form');
let preparedMessage = '';
form.addEventListener('submit', event => {
  event.preventDefault();
  // Reject whitespace-only fields as well as empty native required fields.
  for (const field of form.querySelectorAll('input[required], textarea[required]')) {
    field.setCustomValidity(field.value.trim() ? '' : 'Preencha este campo.');
  }
  if (!form.reportValidity()) return;
  const data = Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, value.trim()]));
  preparedMessage = [
    'Olá, SônoTechCell! Gostaria de solicitar um diagnóstico.', '',
    `Nome: ${data.name}`, `Marca: ${data.brand}`, `Modelo: ${data.model}`,
    `Serviço: ${data.service || 'Preciso de uma avaliação'}`, '',
    `Problema: ${data.description}`, '',
    'Podem me informar sobre o orçamento e o prazo de atendimento?'
  ].join('\n');
  const url = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(preparedMessage)}`;
  const feedback = document.querySelector('.form-feedback');
  feedback.querySelector('.message-status').textContent = 'Mensagem preparada. Confirme o envio no WhatsApp. Se a conversa não abriu, use o link abaixo.';
  feedback.querySelector('.message-link').href = url;
  feedback.querySelector('[data-copy-feedback]').textContent = '';
  feedback.querySelector('.manual-copy')?.remove();
  feedback.hidden = false;
  window.open(url, '_blank', 'noopener,noreferrer');
  form.dispatchEvent(new CustomEvent('sonotech:diagnosis', { bubbles: true, detail: data }));
  feedback.scrollIntoView({ block: 'nearest', behavior: 'auto' });
});
form.addEventListener('input', event => {
  event.target.setCustomValidity?.('');
  document.querySelector('.form-feedback').hidden = true;
});
form.addEventListener('change', () => { document.querySelector('.form-feedback').hidden = true; });
document.querySelector('#copy-message').addEventListener('click', () => {
  if (preparedMessage) copyText(preparedMessage, document.querySelector('.form-feedback'));
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');
const hero = document.querySelector('.hero');
hero.addEventListener('pointermove', event => {
  if (reducedMotion.matches || !finePointer.matches) return;
  const box = hero.getBoundingClientRect();
  hero.style.setProperty('--art-x', `${(event.clientX - box.left - box.width / 2) * .009}px`);
  hero.style.setProperty('--art-y', `${(event.clientY - box.top - box.height / 2) * .015}px`);
});
hero.addEventListener('pointerleave', () => {
  hero.style.setProperty('--art-x', '0px');
  hero.style.setProperty('--art-y', '0px');
});
document.querySelectorAll('.service-card').forEach(card => card.addEventListener('pointermove', event => {
  if (reducedMotion.matches || !finePointer.matches) return;
  const box = card.getBoundingClientRect();
  card.style.setProperty('--mouse-x', `${event.clientX - box.left}px`);
  card.style.setProperty('--mouse-y', `${event.clientY - box.top}px`);
}));
