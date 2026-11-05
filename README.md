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
- Expansão de serviços adicionais e localização com mapa carregado sob demanda, rota no Google Maps e cópia do endereço.
- WhatsApp com mensagem inicial, ligação direta, cópia do telefone e dúvidas frequentes.
- Indicação do horário de atendimento calculada no fuso `America/Sao_Paulo`, independente do fuso do visitante.
- Formulário com validação de campos obrigatórios, inclusive espaços em branco, e abertura do WhatsApp com mensagem preenchida. O visitante confirma o envio na conversa. Link alternativo e cópia da mensagem disponíveis se a abertura for bloqueada.
- Nenhum dado de formulário é salvo no navegador, no servidor ou em banco de dados. O Google Maps é carregado somente ao abrir a localização; WhatsApp e Maps são serviços externos.
- Adaptação para dispositivos móveis e respeito a `prefers-reduced-motion`.

## Configuração e integração

A constante `business` no início de `script.js` centraliza o telefone, o endereço usado para copiar, a consulta do Maps e o fuso. Os horários regulares são segunda a sexta, 08h–18h, e sábado, 08h–12h; feriados devem ser confirmados com a equipe. Atualize também os textos correspondentes em `index.html` se os dados comerciais mudarem.

O formulário emite `sonotech:diagnosis` com os campos em `event.detail` quando prepara a mensagem. O evento não confirma entrega pelo WhatsApp. Continua disponível para integrações futuras:

```js
document.addEventListener('sonotech:diagnosis', (event) => {
  // event.detail: { name, brand, model, service, description }
  // Conecte aqui sua implementação de envio.
});
```

Conteúdo dos serviços e diferenciais: `script.js`. Layout e animações: `styles.css`. Estrutura, telefone e endereço: `index.html`. Ilustração do celular e favicon: `assets/`.

Endereço fornecido pelo proprietário: Alameda das Dálias, 393, Casa 12, Jardim Simus, Sorocaba – SP, CEP 18055-195, Brasil. O número de WhatsApp e os horários seguem os dados já utilizados no site. O celular e os anéis são uma composição fotorealista recriada a partir da imagem de referência, em PNG com transparência.
