/**
 * Envio das solicitações de contato do site da Dra. Debora de Almeida.
 * ETAPA 1: apenas e-mail (HTML com botões de resposta rápida). Não usa planilha.
 *
 * Se alterar o script depois: Implantar > Gerenciar implantações > editar > Nova versão.
 */

const EMAIL_DESTINO = 'contato@deboradealmeida.adv.br';
const EMAIL_TESTE = 'aalvesstos@gmail.com'; // usado só pela função autorizar()

// Aviso no WhatsApp via CallMeBot (gratuito). Só funciona depois que o número ativar o serviço e
// receber a apikey (callmebot.com/blog/free-api-whatsapp-messages). Enquanto ativo=false, nada é enviado.
// Formato do telefone: 55DDDNUMERO. No repositório público fica vazio; o valor real só no Apps Script.
const WHATSAPP_AVISO = { ativo: false, telefone: '', apikey: '' };

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

    const quando = Utilities.formatDate(new Date(), 'America/Sao_Paulo', "dd/MM/yyyy 'às' HH:mm");
    const primeiro = nome.split(/\s+/)[0];
    const fone = telefone.replace(/\D/g, '');
    const foneWa = (fone.length <= 11 ? '55' : '') + fone;
    const textoWa = 'Olá, ' + primeiro + '! Aqui é a Dra. Debora de Almeida. Recebi o seu contato pelo site e vou ajudá-lo(a).';
    const linkWa = 'https://wa.me/' + foneWa + '?text=' + encodeURIComponent(textoWa);
    const linkEmail = 'mailto:' + email + '?subject=' + encodeURIComponent('Retorno do seu contato — Debora de Almeida Advocacia');
    const linkTel = 'tel:+' + foneWa;

    const texto =
      'Novo contato pelo site\n\n' +
      'Nome: ' + nome + '\nTelefone: ' + telefone + '\nE-mail: ' + email + '\n\n' +
      'Assunto:\n' + assunto + '\n\n' +
      'WhatsApp: ' + linkWa + '\nRecebido em: ' + quando;

    MailApp.sendEmail({
      to: EMAIL_DESTINO,
      replyTo: email,
      name: 'Site Debora de Almeida',
      subject: 'Novo contato pelo site — ' + nome,
      body: texto,
      htmlBody: montarHtml(nome, telefone, email, assunto, quando, linkWa, linkEmail, linkTel)
    });

    try { avisoWhatsApp_(nome, telefone); } catch (errWa) { Logger.log('Aviso WhatsApp falhou: ' + errWa); }

    return resposta({ ok: true });
  } catch (err) {
    return resposta({ ok: false, erro: String(err) });
  }
}

function montarHtml(nome, telefone, email, assunto, quando, linkWa, linkEmail, linkTel) {
  const h = esc;
  const linha = (rot, val) =>
    '<tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#8a7a5a;font-size:12px;text-transform:uppercase;letter-spacing:.08em;width:110px;vertical-align:top">' + rot +
    '</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#1f1f1f;font-size:15px">' + val + '</td></tr>';
  const botao = (href, txt, cor) =>
    '<a href="' + href + '" style="display:inline-block;margin:4px 6px 4px 0;padding:11px 18px;background:' + cor +
    ';color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:bold">' + txt + '</a>';

  return '<div style="background:#f4f1ea;padding:24px 12px;font-family:Arial,Helvetica,sans-serif">' +
    '<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e6dfcf">' +
    '<div style="background:#1b2a3a;padding:20px 24px"><div style="color:#c9a961;font-size:12px;letter-spacing:.14em;text-transform:uppercase">Novo contato pelo site</div>' +
    '<div style="color:#ffffff;font-size:20px;margin-top:6px">' + h(nome) + '</div></div>' +
    '<div style="padding:20px 24px">' +
    '<table role="presentation" style="width:100%;border-collapse:collapse">' +
    linha('Telefone', '<a href="' + linkTel + '" style="color:#1b2a3a;text-decoration:none">' + h(telefone) + '</a>') +
    linha('E-mail', '<a href="mailto:' + h(email) + '" style="color:#1b2a3a">' + h(email) + '</a>') +
    linha('Assunto', h(assunto).replace(/\n/g, '<br>')) +
    linha('Recebido', h(quando)) +
    '</table>' +
    '<div style="margin-top:20px">' +
    botao(linkWa, 'Chamar no WhatsApp', '#25a244') +
    botao(linkEmail, 'Responder por e-mail', '#1b2a3a') +
    botao(linkTel, 'Ligar', '#8a6d2b') +
    '</div>' +
    '<p style="margin:18px 0 0;color:#8a7a5a;font-size:12px">Aceite da Política de Privacidade: sim. Ao usar "Responder", a resposta vai direto para o e-mail do contato.</p>' +
    '</div></div></div>';
}

function avisoWhatsApp_(nome, telefone) {
  if (!WHATSAPP_AVISO.ativo || !WHATSAPP_AVISO.telefone || !WHATSAPP_AVISO.apikey) return;
  const msg = 'Novo contato pelo site: ' + nome + ' - ' + telefone + '. Os detalhes estão no seu e-mail.';
  UrlFetchApp.fetch('https://api.callmebot.com/whatsapp.php?phone=' + encodeURIComponent(WHATSAPP_AVISO.telefone) +
    '&text=' + encodeURIComponent(msg) + '&apikey=' + encodeURIComponent(WHATSAPP_AVISO.apikey), { muteHttpExceptions: true });
}

// Rode uma vez no editor para autorizar e conferir o e-mail de teste.
function autorizar() {
  MailApp.sendEmail({
    to: EMAIL_TESTE,
    subject: 'Teste do formulário do site',
    body: 'Se você recebeu esta mensagem, o envio de e-mail do site está autorizado.'
  });
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function limpar(v, max) {
  return String(v == null ? '' : v).trim().slice(0, max);
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
