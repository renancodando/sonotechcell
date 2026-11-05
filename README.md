# SônoTechCell — front-end

Landing page estática em HTML, CSS e JavaScript, baseada na referência fornecida. Sem dependências, build ou backend. Compatível com hospedagem estática, incluindo o projeto Vercel já ligado ao repositório.

## Executar

Abra `index.html` no navegador ou execute na pasta do projeto:

```sh
python3 -m http.server 3000
```

Acesse `http://localhost:3000`.

## Interações

- Menu responsivo, navegação por âncoras e destaque dos diferenciais.
- Composição fotorealista recriada a partir da referência, com flutuação, anéis luminosos, partículas, parallax e iluminação dos cards ao mover o cursor.
- Detalhes de cada serviço e diferencial em modais acessíveis; fechamento por Escape, botão ou fundo e restauração do foco.
- Expansão de serviços adicionais e modal de localização.
- Contato com link para o WhatsApp informado na referência.
- Formulário local com validação nativa e conferência das informações. Não envia solicitações, não salva dados e não chama APIs.
- Adaptação para dispositivos móveis e respeito a `prefers-reduced-motion`.

## Conectar funcionalidades

O formulário emite o evento `sonotech:diagnosis` com os campos em `event.detail`. Substitua a conferência local ou adicione seu listener para conectar sua API:

```js
document.addEventListener('sonotech:diagnosis', (event) => {
  // event.detail: { name, brand, model, service, description }
  // Conecte aqui sua implementação de envio.
});
```

Conteúdo dos serviços e diferenciais: `script.js`. Layout e animações: `styles.css`. Estrutura, telefone e endereço: `index.html`. Ilustração do celular e favicon: `assets/`.

O telefone, endereço e horários reproduzem os dados da imagem de referência; revise os dados comerciais antes de divulgar. O celular e os anéis são uma composição fotorealista recriada a partir da imagem de referência, em PNG com transparência.
