/**
 * Envio das solicitações de contato do site da Dra. Debora de Almeida.
 * ETAPA 1: apenas e-mail. Não usa planilha e não depende do painel (CRM).
 *
 * COMO USAR
 * 1. Entre com a conta Google que vai enviar os e-mails e acesse https://script.new
 * 2. Apague o conteúdo e cole este arquivo. Dê o nome "Site - Contato" ao projeto.
 * 3. Confira EMAIL_DESTINO abaixo (por enquanto é o e-mail de teste).
 * 4. Selecione a função "autorizar" no topo e clique em Executar. Aceite as permissões
 *    (envio de e-mail). Chegará um e-mail de teste na caixa de destino.
 * 5. Implantar > Nova implantação > tipo "App da Web"
 *      Executar como: Eu
 *      Quem tem acesso: Qualquer pessoa
 * 6. Copie a URL que termina em /exec. Ela vai na constante ENDPOINT do site.
 *
 * Se alterar o script depois, use Implantar > Gerenciar implantações > editar > Nova versão.
 * Assim a URL continua a mesma.
 */

const EMAIL_DESTINO = 'aalvesstos@gmail.com'; // TESTE: trocar por contato@deboradealmeida.adv.br depois de validar

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);

    const nome = limpar(d.nome, 120);
    const telefone = limpar(d.telefone, 30);
    const email = limpar(d.email, 120);
    const assunto = limpar(d.assunto, 2000);
    if (nome.length < 3 || telefone.replace(/\D/g, '').length < 10 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || assunto.length < 5 || d.aceite !== true) {
      return resposta({ ok: false, erro: 'dados inválidos' });
    }

    const quando = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm');
    MailApp.sendEmail({
      to: EMAIL_DESTINO,
      replyTo: email,
      name: 'Site Debora de Almeida',
      subject: 'Nova solicitação de contato pelo site — ' + nome,
      body:
        'Nova solicitação recebida pelo site.\n\n' +
        'Nome: ' + nome + '\n' +
        'Telefone: ' + telefone + '\n' +
        'E-mail: ' + email + '\n' +
        'Assunto: ' + assunto + '\n\n' +
        'Recebida em: ' + quando + '\n' +
        'Aceite da Política de Privacidade: sim\n\n' +
        'Para responder, use "Responder": a resposta vai direto para o e-mail do contato.'
    });

    return resposta({ ok: true });
  } catch (err) {
    return resposta({ ok: false, erro: String(err) });
  }
}

// Rode uma vez no editor para autorizar o envio e conferir se o e-mail chega.
function autorizar() {
  MailApp.sendEmail({
    to: EMAIL_DESTINO,
    subject: 'Teste do formulário do site',
    body: 'Se você recebeu esta mensagem, o envio de e-mail do site está autorizado.'
  });
}

function limpar(v, max) {
  return String(v == null ? '' : v).trim().slice(0, max);
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
