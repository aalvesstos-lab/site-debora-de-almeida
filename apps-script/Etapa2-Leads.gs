/**
 * ============================================================================
 *  LEADS DO SITE — Débora de Almeida Advocacia
 *  Arquivo NOVO do projeto Apps Script (Arquivo > + > Script, nome: Leads).
 *  Não altera nada do Codigo.gs: reaproveita CONFIG.SHEET_ID, normHead(),
 *  isBlank() e text() que já existem lá.
 *
 *  1. doPost(e)             recebe a solicitação do formulário do site,
 *                           grava na aba "Leads" e avisa por e-mail.
 *  2. getLeads()            devolve os leads para a aba "Leads" do painel.
 *  3. updateLeadStatus()    muda o status de um lead direto pelo painel.
 * ============================================================================
 */

var LEADS = {
  SHEET_NAME: 'Leads',
  EMAIL_DESTINO: 'contato@deboradealmeida.adv.br',
  STATUS: ['Novo', 'Em contato', 'Agendado', 'Cliente', 'Sem interesse'],
  HEADERS: ['Data/hora', 'Nome', 'Telefone', 'E-mail', 'Assunto', 'Aceite LGPD', 'Origem', 'Status']
};

/* ------------------------------------------------------- RECEBER DO SITE */

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);

    var nome = leadLimpar_(d.nome, 120);
    var telefone = leadLimpar_(d.telefone, 30);
    var email = leadLimpar_(d.email, 120);
    var assunto = leadLimpar_(d.assunto, 2000);
    if (nome.length < 3 || telefone.replace(/\D/g, '').length < 10 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || assunto.length < 5 || d.aceite !== true) {
      return jsonResponse({ ok: false, erro: 'dados inválidos' });
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(15000);
    var agora = new Date();
    try {
      var sheet = leadsSheet_(true);
      sheet.appendRow([agora, nome, telefone, email, assunto, 'Sim', leadLimpar_(d.origem, 300), 'Novo']);
      sheet.getRange(sheet.getLastRow(), 1).setNumberFormat('dd/MM/yyyy HH:mm');
    } finally {
      lock.releaseLock();
    }

    // O lead já está salvo; se o e-mail falhar, ele não se perde.
    try {
      var quando = Utilities.formatDate(agora, CONFIG.TIMEZONE, 'dd/MM/yyyy HH:mm');
      MailApp.sendEmail({
        to: LEADS.EMAIL_DESTINO,
        replyTo: email,
        subject: 'Nova solicitação de contato pelo site — ' + nome,
        body:
          'Nova solicitação recebida pelo site.\n\n' +
          'Nome: ' + nome + '\n' +
          'Telefone: ' + telefone + '\n' +
          'E-mail: ' + email + '\n' +
          'Assunto: ' + assunto + '\n\n' +
          'Recebida em: ' + quando + '\n' +
          'Aceite da Política de Privacidade: sim\n\n' +
          'O lead também está na aba "Leads" do painel. Para responder por e-mail, use "Responder".'
      });
    } catch (errMail) {
      Logger.log('Lead salvo, mas o e-mail falhou: ' + errMail);
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, erro: String(err) });
  }
}

/* --------------------------------------------------------- LER PARA O PAINEL */

function getLeads() {
  try {
    var sheet = leadsSheet_(false);
    if (!sheet || sheet.getLastRow() < 2) return { ok: true, data: [] };

    var values = sheet.getDataRange().getValues();
    var map = leadsMap_(values[0]);
    var out = [];
    for (var r = 1; r < values.length; r++) {
      var row = values[r];
      var nome = text(leadCell_(row, map.nome));
      var email = text(leadCell_(row, map.email));
      if (!nome && !email) continue;
      out.push({
        rowId: r + 1,
        date: leadIso_(leadCell_(row, map.date)),
        nome: nome,
        telefone: text(leadCell_(row, map.telefone)),
        email: email,
        assunto: text(leadCell_(row, map.assunto)),
        origem: text(leadCell_(row, map.origem)),
        status: text(leadCell_(row, map.status)) || 'Novo'
      });
    }
    return { ok: true, data: out, statuses: LEADS.STATUS };
  } catch (err) {
    return { ok: false, error: 'Erro ao ler os leads: ' + (err && err.message ? err.message : err), data: [] };
  }
}

/* ------------------------------------------------------- ALTERAR O STATUS */

function updateLeadStatus(rowId, expectEmail, status) {
  if (LEADS.STATUS.indexOf(status) === -1) throw new Error('Status inválido.');
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var sheet = leadsSheet_(false);
    if (!sheet) throw new Error('STALE_ROW');
    var header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var map = leadsMap_(header);
    if (map.status === -1) throw new Error('A aba "Leads" não tem a coluna "Status".');
    if (!rowId || rowId < 2 || rowId > sheet.getLastRow()) throw new Error('STALE_ROW');
    if (!isBlank(expectEmail) && map.email !== -1) {
      var atual = text(sheet.getRange(rowId, map.email + 1).getValue());
      if ((atual || '') !== String(expectEmail).trim()) throw new Error('STALE_ROW');
    }
    var cell = sheet.getRange(rowId, map.status + 1);
    cell.setDataValidation(null);
    cell.setValue(status);
    SpreadsheetApp.flush();
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

/* ----------------------------------------------------------------- INTERNOS */

/** Abre a aba "Leads" da mesma planilha do painel. Com create=true, cria se faltar. */
function leadsSheet_(create) {
  var ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  var sheet = ss.getSheetByName(LEADS.SHEET_NAME);
  if (!sheet && create) {
    sheet = ss.insertSheet(LEADS.SHEET_NAME);
    sheet.appendRow(LEADS.HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, LEADS.HEADERS.length).setFontWeight('bold');
    sheet.getRange(2, 8, 998, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(LEADS.STATUS, true).setAllowInvalid(true).build()
    );
  }
  return sheet;
}

function leadsMap_(headerRow) {
  var norm = headerRow.map(normHead);
  function achar(opcoes) {
    for (var i = 0; i < opcoes.length; i++) {
      var idx = norm.indexOf(opcoes[i]);
      if (idx !== -1) return idx;
    }
    return -1;
  }
  return {
    date: achar(['data/hora', 'data', 'data e hora']),
    nome: achar(['nome', 'nome do cliente', 'cliente']),
    telefone: achar(['telefone', 'celular', 'whatsapp']),
    email: achar(['e-mail', 'email']),
    assunto: achar(['assunto', 'mensagem']),
    origem: achar(['origem']),
    status: achar(['status'])
  };
}

function leadCell_(row, idx) {
  return (idx === -1 || idx >= row.length) ? null : row[idx];
}

/** Data/hora como ISO com fuso. Aceita Date ou texto dd/mm/aaaa hh:mm(:ss). */
function leadIso_(v) {
  if (v instanceof Date && !isNaN(v.getTime())) {
    return Utilities.formatDate(v, CONFIG.TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX");
  }
  if (typeof v === 'string') {
    var m = v.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
    if (m) {
      var d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4] || 0), Number(m[5] || 0), Number(m[6] || 0));
      return Utilities.formatDate(d, CONFIG.TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX");
    }
  }
  return null;
}

/** Limita o tamanho e impede que o texto vire fórmula na planilha. */
function leadLimpar_(v, max) {
  var t = String(v == null ? '' : v).trim().slice(0, max);
  if (/^[=+\-@]/.test(t)) t = "'" + t;
  return t;
}
