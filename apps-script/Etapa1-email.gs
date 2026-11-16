/**
 * Envio das solicitações de contato do site da Dra. Debora de Almeida.
 * ETAPA 1: apenas e-mail (HTML com botões de resposta rápida). Não usa planilha.
 *
 * Se alterar o script depois: Implantar > Gerenciar implantações > editar > Nova versão.
 */

const EMAIL_DESTINO = 'contato@deboradealmeida.adv.br';
const EMAIL_TESTE = 'aalvesstos@gmail.com'; // usado só pela função autorizar()
// Ícones dos botões embutidos no e-mail (cid), para o Outlook não bloquear
const ICON_WA = 'iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAAGFBMVEX///////////////8AAAD////////////kTvUTAAAACHRSTlNgzCyPAPsEr7T9AqcAAAH9SURBVHjaLZDPS1RhGIWf+95bIqLO3FJIp9vn1+CiEMehVcU0wrQywqJVEEjQ/9MfIOGqFpGkJvQDbLClpOgus+vHxUgSnFGIaObOe1uM24dzOIfHqwHG7T04YP3oaaKAVwPRL/cB+PRIYvAtEn2dBoCr73pNE4Fo7wbyert/w3C3nIBXEyadbhtAGia9gAswnpMtawBNjVsuEYjmj3/YKAbEbgzdGlJhz7VDIwCaFN8Gm4j5yYGJYwBUKhQS0dm0rIV1C4AbM57xc63sdz4cOcwAsty/1qvAw57uDhHhAJJOmBPLMmOw0P3PFSqykFY1gFC6A0FdpSQOoOq6KW32SLVDksBidNak5X+P2rT65FKjC3InwwLoeF1jAwaAQOYAzXEqSHLGAJJRptUqiXGQSh2DFp2GcbKy5sCd948mDjPCkb/Nj2Pj1z/cwesXo8bgMsPMJnovEdeR27wAZYOgCgG71fOyTyjgijsAsekhlnFuOtDk8jJoWddo+lPfBtsZZGbw4su2d1KS3gC6DpyNa2K848yIuA7WArG1xg2wqP7gtWB4v2Eb0MjHSU+70AiiP9HOZx8LxIU8B+U4+DWQbj1MVwEKq9V2qHjPmgCMPmeqSLoy5/DOzcJ65czoUlVBSqy9meirA6RLlQjwn8w/zsvJ8PuZ/vl00u4D/wFKo820G9vq7QAAAABJRU5ErkJggg==';
const ICON_MAIL = 'iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAAGFBMVEUICAgHBwcJCQkJCQkAAAAREREJCQkICAixJ0FXAAAACHRSTlNfLar7AQ7SjYDNqjwAAAC+SURBVHjatdKxCoMwFIXhPzF7W+cuklmQ4CxCfe2CdK4iOEuXzuoDROygtmpdWtps+bgkuedGJKyX5HekgMNs34ACc55RWCFx5sI1QGKXJ6VIoHyBP94Yxc/L7ggksM+DQZxKjFWZUw2UB9lIbqpuAHVsven1pjAl+LrTz4Y6TRSrO6Z49WiPZBmXFACR9C1Arck9ALmbknBT663DMfotr674NOj9txNql9BvV6klxEi601zCApFsjZbmf5/pATVYLRjXn0wYAAAAAElFTkSuQmCC';

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
      htmlBody: montarHtml(nome, telefone, email, assunto, quando, linkWa, linkEmail, linkTel),
      inlineImages: {
        wa: Utilities.newBlob(Utilities.base64Decode(ICON_WA), 'image/png', 'wa.png'),
        mail: Utilities.newBlob(Utilities.base64Decode(ICON_MAIL), 'image/png', 'mail.png')
      }
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
  // Botão compatível com Outlook: ícone embutido (cid) + texto, altura fixa, cor do texto fixada
  const botao = (href, txt, cor, txtCor, icone) =>
    '<td width="49%" height="46" bgcolor="' + cor + '" align="center" valign="middle" style="background-color:' + cor + ';border:1px solid ' + cor + ';height:46px;padding:0 10px;' + F + 'font-size:14px;font-weight:bold">' +
    '<table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0"><tr>' +
    '<td valign="middle" style="padding-right:8px"><a href="' + href + '"><img src="cid:' + icone + '" width="18" height="18" border="0" alt="" style="display:block;border:0"></a></td>' +
    '<td valign="middle" style="' + F + 'font-size:14px;font-weight:bold;line-height:20px"><a href="' + href + '" style="color:' + txtCor + ';text-decoration:none;' + F + 'font-size:14px;font-weight:bold"><font color="' + txtCor + '"><span style="color:' + txtCor + ';text-decoration:none">' + txt + '</span></font></a></td>' +
    '</tr></table></td>';

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
