'use strict';

// All interactions are local. Connect the diagnosis event to your own backend.
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
document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => {
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

// Integration point: listen for `sonotech:diagnosis` and implement submission.
// No requests, persistence or messages are sent by this front end.
const form = document.querySelector('#diagnosis-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const feedback = document.querySelector('.form-feedback');
  feedback.replaceChildren();
  const title = document.createElement('strong');
  title.textContent = 'Informações conferidas.';
  const text = document.createElement('p');
  text.textContent = `${data.name.trim()} · ${data.brand} ${data.model.trim()} · ${data.service || 'Avaliação geral'}`;
  const note = document.createElement('span');
  note.textContent = 'Prévia do atendimento. Nenhuma solicitação foi enviada.';
  feedback.append(title, text, note);
  feedback.hidden = false;
  form.dispatchEvent(new CustomEvent('sonotech:diagnosis', { bubbles: true, detail: data }));
  feedback.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
});
form.addEventListener('input', () => { document.querySelector('.form-feedback').hidden = true; });

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
