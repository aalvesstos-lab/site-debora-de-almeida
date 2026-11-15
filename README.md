# Site institucional — Debora de Almeida Advogada

Site de uma página (React + Vite + Tailwind) da advogada Debora de Almeida — Direito Civil e Imobiliário, São José dos Campos/SP.

## Desenvolvimento

```bash
pnpm install
pnpm dev        # servidor local
pnpm build      # gera a pasta dist/
```

## Publicação (GitHub Pages)

Todo push na branch `main` executa `.github/workflows/deploy.yml`, que compila o site e publica no GitHub Pages.

### Domínio próprio
1. Em *Settings > Pages > Custom domain*, informe o domínio e marque *Enforce HTTPS*.
2. No DNS do domínio, aponte para o GitHub Pages (registros A `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` para o domínio raiz e CNAME `www` para `<usuario>.github.io`). Mantenha os registros de e-mail (MX) existentes.

## Formulário de contato

O envio é feito por um Google Apps Script (pasta `apps-script/`). Depois de implantar o script, cole a URL `/exec` na constante `ENDPOINT` em `src/App.tsx`.
**Enquanto `ENDPOINT` estiver vazio, o formulário apenas simula o envio (modo demonstração): não publique no domínio definitivo sem preenchê-la.**

- `apps-script/Etapa1-email.gs`: envia as solicitações por e-mail.
- `apps-script/Etapa2-Leads.gs`: grava na aba "Leads" do CRM e exibe no painel (etapa futura).

## Conteúdo
Textos, áreas de atuação e dados de contato ficam no topo de `src/App.tsx` (objeto `C`).
