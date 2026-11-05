# Mi Cell — assistência técnica e peças para celulares

Site estático em HTML, CSS e JavaScript, adaptado para a Mi Cell de Campinas (SP). Sem backend, banco de dados ou dependências de instalação.

## Dados públicos da empresa
- Nome: Mi Cell Distribuidora de Peças para Celular e Assistência Técnica
- Endereço: Av. Dr. Moraes Salles, 393, Conceição, Campinas - SP, CEP 13010-000
- Contato: (19) 98871-4759
- Horário divulgado: segunda a sexta, 09h–18h; sábado, 09h–15h.

Confirme os serviços específicos, condições de garantia e disponibilidade de peças com a empresa antes da publicação comercial.

## Executar
Abra `index.html` no navegador ou use `python3 -m http.server 3000`.

## Funcionalidades
Menu responsivo, composição visual com animações, detalhes de serviços em modais, mapa sob demanda, rota, telefone e formulário que prepara mensagem no WhatsApp. O envio depende da confirmação do visitante no WhatsApp. Nenhum dado é salvo no site.

Dados de contato e endereço: `script.js` (objeto `business`) e `index.html`. O formulário emite o evento `micell:diagnosis`.
