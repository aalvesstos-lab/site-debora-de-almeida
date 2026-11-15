# Site institucional — Debora de Almeida Advogada

Site de uma página em um único arquivo HTML (`index.html`), publicado direto pelo GitHub Pages, sem etapa de compilação.

## Publicação
*Settings > Pages > Build and deployment*: **Source = Deploy from a branch**, **Branch = main**, pasta **/ (root)**.

### Domínio próprio
1. Em *Settings > Pages > Custom domain*, informe o domínio e marque *Enforce HTTPS*.
2. No DNS do domínio, aponte para o GitHub Pages: registros A `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (domínio raiz) e CNAME `www` para `aalvesstos-lab.github.io`. Mantenha os registros de e-mail (MX).

## Formulário de contato
O envio é feito por um Google Apps Script (`apps-script/`). Depois de implantá-lo, coloque a URL `/exec` na constante `ENDPOINT` (procure por `ENDPOINT` no `index.html`).
**Enquanto `ENDPOINT` estiver vazio, o formulário apenas simula o envio (modo demonstração).**

## Código-fonte
A pasta `fonte/` tem o projeto React + Vite que gera o `index.html` (`pnpm install && pnpm build`). O arquivo da raiz é o resultado final já empacotado.
