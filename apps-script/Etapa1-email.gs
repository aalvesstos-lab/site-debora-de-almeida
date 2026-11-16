/**
 * Envio das solicitações de contato do site da Dra. Debora de Almeida.
 * ETAPA 1: apenas e-mail (HTML com botões de resposta rápida). Não usa planilha.
 *
 * Se alterar o script depois: Implantar > Gerenciar implantações > editar > Nova versão.
 */

const EMAIL_DESTINO = 'contato@deboradealmeida.adv.br';
const EMAIL_TESTE = 'aalvesstos@gmail.com'; // usado só pela função autorizar()
const ICONES = 'https://aalvesstos-lab.github.io/site-debora-de-almeida/email/'; // ícones dos botões

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
    const textoWa = 'Olá, ' + primeiro + '! Aqui é a Dra. Debora de Almeida. Recebi o seu contato pelo site. Como posso te ajudar?';
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

    return resposta({ ok: true });
  } catch (err) {
    return resposta({ ok: false, erro: String(err) });
  }
}

function montarHtml(nome, telefone, email, assunto, quando, linkWa, linkEmail, linkTel) {
  // Layout em tabelas (compatível com Outlook desktop/Word, Outlook.com e Gmail)
  const h = esc;
  const F = 'font-family:Arial,Helvetica,sans-serif;';
  const linha = (rot, val) =>
    '<tr><td width="110" valign="top" style="padding:10px 0;border-bottom:1px solid #eadfce;color:#9b7243;font-size:12px;' + F + 'text-transform:uppercase;letter-spacing:1px">' + rot +
    '</td><td valign="top" style="padding:10px 0;border-bottom:1px solid #eadfce;color:#141413;font-size:15px;' + F + '">' + val + '</td></tr>';
  const botao = (href, txt, cor, txtCor, icone) =>
    '<td width="49%" bgcolor="' + cor + '" align="center" style="background-color:' + cor + ';border:1px solid ' + cor + ';padding:11px 18px;' + F + 'font-size:14px;font-weight:bold">' +
    '<a href="' + href + '" style="color:' + txtCor + ';text-decoration:none;' + F + 'font-size:14px;font-weight:bold">' +
    '<img src="' + ICONES + icone + '.png" width="18" height="18" alt="" border="0" style="vertical-align:middle;border:0">&nbsp;' +
    txt + '</a></td>';

  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#efe8dc" style="background-color:#efe8dc"><tr><td align="center" style="padding:24px 12px">' +
    '<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:560px;background-color:#ffffff;border:1px solid #c9a06b">' +
    '<tr><td bgcolor="#0a0a0a" style="background-color:#0a0a0a;padding:22px 24px;border-bottom:3px solid #c9a06b">' +
    '<div style="color:#c9a06b;font-size:12px;letter-spacing:2px;text-transform:uppercase;' + F + '">Novo contato pelo site</div>' +
    '<div style="color:#ecc99a;font-family:Georgia,\'Times New Roman\',serif;font-size:24px;padding-top:6px">' + h(nome) + '</div></td></tr>' +
    '<tr><td style="padding:20px 24px">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' +
    linha('Telefone', h(telefone)) +
    linha('E-mail', '<a href="mailto:' + h(email) + '" style="color:#141413">' + h(email) + '</a>') +
    linha('Assunto', h(assunto).replace(/\n/g, '<br>')) +
    linha('Recebido', h(quando)) +
    '</table>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:22px"><tr>' +
    botao(linkWa, 'Chamar no WhatsApp', '#25d366', '#ffffff', 'wa') +
    '<td width="2%" style="font-size:0;line-height:0">&nbsp;</td>' +
    botao(linkEmail, 'Responder por e-mail', '#c9a06b', '#0a0a0a', 'mail') +
    '</tr></table>' +
    '<p style="margin:18px 0 0;color:#9b7243;font-size:12px;' + F + '">Aceite da Política de Privacidade: sim. Ao usar "Responder", a resposta vai direto para o e-mail do contato.</p>' +
    '</td></tr></table></td></tr></table>';
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
