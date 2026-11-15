import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { foto1, foto3, logo, padrao, mock1, bg2 } from './images'

gsap.registerPlugin(ScrollTrigger)

/* ====== HERO — duas versões guardadas. Para voltar à anterior, troque HERO_VERSAO para 'anterior' ====== */
const HERO_VERSAO: 'atual' | 'anterior' = 'atual'
const HERO = {
  atual: {
    eyebrow: 'Advogada | Direito Civil e Imobiliário',
    nome: ['Debora', 'de Almeida'],
    paragrafos: [
      'Advogada graduada em Direito pela Universidade de Araraquara (UNIARA), em 2005, e pós-graduada em Direito Civil e Direito Processual Civil.',
      'Com experiência na advocacia cível, desenvolve sua atuação especialmente nas áreas Cível e Imobiliário, prestando assessoria jurídica tanto na prevenção de litígios quanto na condução de demandas judiciais e extrajudiciais.',
    ],
  },
  anterior: {
    eyebrow: 'Direito imobiliário · Direito civil',
    nome: ['Debora', 'de Almeida'],
    paragrafos: [
      'Advogada especialista em direito imobiliário e direito civil. Proteção patrimonial, estruturação jurídica de operações imobiliárias e resolução de disputas complexas com precisão técnica.',
    ],
  },
}
const H = HERO[HERO_VERSAO]

/* ====== TRAJETÓRIA (SOBRE MIM) — duas versões guardadas. Para voltar à anterior, troque SOBRE_VERSAO para 'anterior' ====== */
const SOBRE_VERSAO: 'atual' | 'anterior' | 'intermediaria' = 'atual'
const SOBRE = {
  atual: [
    'Seja muito bem-vindo(a)!',
    'Minha atuação profissional é dedicada à assessoria jurídica preventiva e contenciosa nas áreas cível e imobiliária, com foco na proteção dos direitos e interesses dos clientes, na segurança das relações jurídicas e na prevenção e resolução de conflitos.',
    'O exercício da advocacia é pautado pelo conhecimento técnico, pela análise criteriosa de cada situação e pelo atendimento individualizado, buscando soluções jurídicas adequadas às particularidades de cada demanda, com transparência, responsabilidade profissional e compromisso com a segurança jurídica.',
  ],
  intermediaria: [
    'Seja muito bem-vindo(a).',
    'Minha atuação abrange a análise e a elaboração de contratos, as negociações imobiliárias, as locações, a responsabilidade civil e a resolução de conflitos que envolvem relações patrimoniais e contratuais.',
    'Meu exercício profissional é pautado pelo atendimento individualizado: analiso cada situação com critério e atenção, em busca de soluções jurídicas adequadas às necessidades de cada cliente, com prioridade para a segurança jurídica, a transparência e a responsabilidade profissional.',
  ],
  anterior: [
    'Seja muito bem-vindo(a).',
    'Minha trajetória é marcada por anos de atuação estratégica no direito imobiliário e civil, assessorando clientes em decisões de alto impacto, operações complexas e disputas que exigem precisão, técnica e visão de longo prazo.',
  ],
}

/* ====== CONTEÚDO EDITÁVEL — tudo do site vem daqui ====== */
const C = {
  cta: 'Agende uma conversa',
  anos: 20, // CONFIRMAR: anos de atuação
  sobre: SOBRE[SOBRE_VERSAO],
  // [título, resumo (cartão), texto completo (aparece ao passar o mouse/focar). **negrito** destaca trechos]
  habilidades: [
    ['Elaboração e Análise de Contratos',
     'Elaboração, análise e revisão de contratos civis e imobiliários, com foco na segurança jurídica.',
     'Assessoria jurídica na elaboração, análise e revisão de contratos civis e imobiliários, com foco na **segurança jurídica, prevenção de riscos e proteção dos interesses contratuais**, proporcionando maior clareza e segurança às negociações.'],
    ['Análise de Compra e Venda de Imóveis',
     'Negociações de compra e venda, com análise documental e verificação da regularidade do imóvel e das partes.',
     'Assessoria jurídica em negociações de compra e venda de imóveis, com análise documental, verificação da regularidade jurídica do imóvel e das partes envolvidas, identificação de riscos e acompanhamento contratual, visando à **segurança jurídica e à proteção dos interesses de compradores e vendedores**.'],
    ['Regularização Documental de Imóveis',
     'Regularização de imóveis, com análise documental e medidas judiciais e extrajudiciais cabíveis.',
     'Atuação jurídica na regularização de imóveis, abrangendo a análise documental, a identificação de irregularidades e a adoção das medidas judiciais e extrajudiciais cabíveis, com foco na **proteção patrimonial, segurança jurídica e regularidade da propriedade imobiliária**.'],
    ['Direito Condominial',
     'Assessoria preventiva, recuperação de créditos e demandas judiciais e extrajudiciais do condomínio.',
     'Atuação jurídica em questões condominiais, compreendendo a assessoria preventiva, análise de normas internas, recuperação de créditos condominiais e condução de demandas judiciais e extrajudiciais, visando à **regularidade da gestão condominial, prevenção de conflitos e defesa dos interesses do condomínio**.'],
    ['Inventário e Partilha de Bens',
     'Inventários judiciais e extrajudiciais, partilha de bens e regularização sucessória.',
     'Atuação jurídica em inventários judiciais e extrajudiciais, partilha de bens e regularização sucessória, com foco na **segurança jurídica e resolução de conflitos**.'],
    ['Locações',
     'Locações residenciais e comerciais: contratos, cobranças, despejo e resolução de conflitos.',
     'Assessoria jurídica em locações residenciais e comerciais, abrangendo a elaboração, análise e revisão de contratos, cobrança de débitos locatícios, ações de despejo e resolução de conflitos entre locadores e locatários, com foco na **segurança jurídica, prevenção de riscos e proteção dos direitos e interesses envolvidos nas relações locatícias**.'],
    ['Usucapião',
     'Usucapião judicial e extrajudicial, com análise dos requisitos legais e da documentação.',
     'Atuação jurídica em usucapião judicial e extrajudicial, com análise dos requisitos legais, documentação e procedimentos necessários ao reconhecimento da propriedade, visando à **regularização patrimonial**.'],
    ['Contencioso Cível e Imobiliário',
     'Demandas judiciais em Direito Civil e Imobiliário, com foco na defesa dos interesses do cliente.',
     'Atuação em demandas judiciais nas áreas do Direito Civil e Imobiliário, envolvendo conflitos contratuais, responsabilidade civil, direitos patrimoniais e questões imobiliárias, com foco na **defesa dos interesses dos clientes e resolução de litígios**.'],
    ['Extinção de Condomínio (Copropriedade)',
     'Extinção de copropriedade sobre imóveis e viabilização da venda, com resolução de conflitos.',
     'Assessoria jurídica na extinção de copropriedade sobre bens imóveis, abrangendo a análise da situação patrimonial e a adoção das medidas judiciais e extrajudiciais cabíveis, com foco na **viabilização da venda do imóvel e na resolução de conflitos entre coproprietários**.'],
    ['Transmissão de Bens Imóveis, Doações e Usufruto',
     'Transmissão de imóveis, doações e usufruto, com acompanhamento dos procedimentos legais e registrais.',
     'Assessoria jurídica na transmissão de bens imóveis, abrangendo doações, instituição e extinção de usufruto e demais operações de transferência patrimonial, com análise documental e acompanhamento dos procedimentos legais e registrais, visando à **segurança jurídica e proteção patrimonial**.'],
  ],
  ajuda: [
    ['Consultoria preventiva em direito imobiliário', 'Redução de riscos e proteção jurídica antes de qualquer operação.'],
    ['Estruturação jurídica de contratos e negociações', 'Segurança jurídica em acordos de alto valor.'],
    ['Representação em ações cíveis e imobiliárias', 'Defesa estratégica em litígios complexos.'],
  ],
  contato: {
    whatsapp: ['', ''], // PREENCHER: ['(12) 9XXXX-XXXX', 'https://wa.me/55DDDNUMERO']
    email: ['contato@deboradealmeida.adv.br', 'mailto:contato@deboradealmeida.adv.br'],
    instagram: ['@debora_almeida_adv', 'https://instagram.com/debora_almeida_adv'],
    endereco: [
      'Edifício Atrium\nRua Professora Francisca Maria de Jesus, 347, sala 106, Floradas de São José/Satélite, São José dos Campos/SP',
      'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Edifício Atrium, Rua Professora Francisca Maria de Jesus, 347, Floradas de São José, São José dos Campos, SP'),
    ],
  },
}

/* ====== POLÍTICA DE PRIVACIDADE (MODELO) — itens [entre colchetes] devem ser confirmados pela Dra. Debora ====== */
const DPO = {
  nome: 'Debora de Almeida', // CONFIRMAR: nome completo ou razão social
  oab: 'OAB/SP 258.681',
  email: 'contato@deboradealmeida.adv.br', // CONFIRMAR: e-mail do encarregado de dados
  atualizacao: 'outubro de 2026',
}
const POLITICA: [string, string[]][] = [
  ['1. Quem é o responsável pelos dados', [
    `O controlador dos dados pessoais coletados neste site é ${DPO.nome}, advogada (${DPO.oab}), com escritório no {{mapa}}.`,
    `Contato do encarregado de proteção de dados: ${DPO.email}.`,
  ]],
  ['2. Quais dados coletamos', [
    'Pelo formulário "Solicitar contato" coletamos: nome, telefone, e-mail e a descrição do assunto que você informar. Não pedimos documentos, dados bancários nem dados sensíveis. Pedimos que não inclua informações desse tipo no campo de assunto.',
  ]],
  ['3. Para que usamos os dados', [
    'Usamos os dados exclusivamente para responder à sua solicitação, entrar em contato, avaliar a possibilidade de atendimento e, se houver contratação, dar início ao relacionamento profissional. Não vendemos nem compartilhamos seus dados para fins de publicidade.',
  ]],
  ['4. Base legal', [
    'O tratamento ocorre com base no seu consentimento (art. 7º, I, da Lei nº 13.709/2018, a LGPD), manifestado ao marcar a caixa de aceite do formulário, e, quando você solicitar atendimento, na execução de procedimentos preliminares relacionados a contrato (art. 7º, V).',
  ]],
  ['5. Seus direitos', [
    'Nos termos do art. 18 da LGPD, você pode solicitar a qualquer momento: confirmação de que tratamos seus dados, acesso, correção, anonimização, bloqueio ou eliminação, portabilidade, informação sobre compartilhamento e a revogação do consentimento. Basta escrever para o e-mail do encarregado indicado acima.',
  ]],
  ['6. Segurança', [
    'Adotamos medidas técnicas e administrativas para proteger seus dados contra acessos não autorizados, perda ou uso indevido.',
  ]],
  ['7. Cookies e acesso ao site', [
    'Este site não utiliza cookies de rastreamento nem ferramentas de análise de acesso.',
  ]],
  ['8. Alterações desta política', [
    `Esta política pode ser atualizada. Última atualização: ${DPO.atualizacao}.`,
  ]],
]

const I = {
  contrato: <svg viewBox="0 0 48 48"><path d="M12 4h18l8 8v32H12V4Z"/><path d="M30 4v8h8M18 22h14M18 29h8"/><path d="m27 38 10-10 3 3-10 10-4 1 1-4Z"/></svg>,
  regulariza: <svg viewBox="0 0 48 48"><path d="M12 4h18l8 8v32H12V4Z"/><path d="M30 4v8h8"/><path d="m18 28 5 5 9-10"/></svg>,
  predio: <svg viewBox="0 0 48 48"><path d="M10 44V8h20v36M30 20h8v24M6 44h36"/><path d="M16 15h8M16 22h8M16 29h8M16 36h8"/></svg>,
  pessoas: <svg viewBox="0 0 48 48"><circle cx="24" cy="15" r="6"/><path d="M12 40c0-7 5-12 12-12s12 5 12 12"/><circle cx="9" cy="21" r="4"/><circle cx="39" cy="21" r="4"/><path d="M2 38c0-5 3-9 7-9M46 38c0-5-3-9-7-9"/></svg>,
  chave2: <svg viewBox="0 0 48 48"><circle cx="16" cy="24" r="9"/><path d="M25 24h19M38 24v8M32 24v6"/></svg>,
  martelo: <svg viewBox="0 0 48 48"><path d="m26 8 10 10M22 12l10 10M18 16l-6 6 10 10 6-6M26 28 8 44M4 44h14"/></svg>,
  duasCasas: <svg viewBox="0 0 48 48"><path d="M2 17h6v16H2zM40 17h6v16h-6z"/><path d="M8 19l9-4h7l-6 5a3 3 0 0 0 4 4l5-4 6 5 6-2V19M8 31l7 2 6 7a3 3 0 0 0 5-3m0 0 2 2a3 3 0 0 0 5-3l-2-3m0 0 3 3a3 3 0 0 0 5-3l-3-4"/></svg>,
  transmite: <svg viewBox="0 0 48 48"><path d="M4 22 16 10l12 12v16H4V22Z"/><path d="M10 38V28h12v10M32 24h12m-4-5 5 5-5 5"/></svg>,
  chave: <svg viewBox="0 0 48 48"><path d="M6 42V18l18-12 18 12v24M6 42h36M18 42V28h12v14M24 6v4"/></svg>,
  escudo: <svg viewBox="0 0 48 48"><path d="M24 4 8 10v12c0 11 7 18 16 22 9-4 16-11 16-22V10L24 4Z"/><path d="m17 24 5 5 9-10"/></svg>,
  balanca: <svg viewBox="0 0 48 48"><path d="M24 6v36M14 42h20M8 14h32M8 14 2 28a6 6 0 0 0 12 0L8 14Zm32 0-6 14a6 6 0 0 0 12 0l-6-14Z"/></svg>,
  lupa: <svg viewBox="0 0 48 48"><circle cx="21" cy="21" r="13"/><path d="m31 31 12 12M15 21h12M21 15v12"/></svg>,
  doc: <svg viewBox="0 0 48 48"><path d="M12 4h18l8 8v32H12V4Z"/><path d="M30 4v8h8M18 22h14M18 29h14M18 36h8"/></svg>,
  pena: <svg viewBox="0 0 48 48"><path d="M40 6C24 6 14 16 12 32l-4 10 10-4c16-2 26-12 22-32ZM12 32l16-16"/></svg>,
}
const L = {
  wa: <svg viewBox="0 0 24 24"><path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8L4 20Z"/><path d="M9 9c0 3 3 6 6 6l1.2-1.4-2-1-.9.6c-.8-.3-1.7-1.2-2-2l.6-.9-1-2L9 9Z"/></svg>,
  mail: <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14"/><path d="m3 6 9 7 9-7"/></svg>,
  ig: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/></svg>,
  pin: <svg viewBox="0 0 24 24"><path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>,
}

// URL do Google Apps Script (implantado como app da web). Enquanto vazio, o site funciona em modo demonstração.
const ENDPOINT = ''

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  const [motion] = useState(
    typeof window !== 'undefined' ? !window.matchMedia('(prefers-reduced-motion: reduce)').matches : true,
  )
  const [form, setForm] = useState({ nome: '', telefone: '', email: '', assunto: '' })
  const [erros, setErros] = useState<Record<string, string>>({})
  const [pronto, setPronto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [falhou, setFalhou] = useState(false)
  const [isca, setIsca] = useState('')
  const [aceite, setAceite] = useState(false)
  const [privacidade, setPrivacidade] = useState(false)

  useEffect(() => {
    if (!privacidade) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setPrivacidade(false) }
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [privacidade])

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErros((e) => ({ ...e, [k]: '' }))
  }
  const validar = () => {
    const e: Record<string, string> = {}
    if (form.nome.trim().length < 3) e.nome = 'Informe seu nome completo.'
    if (form.telefone.replace(/\D/g, '').length < 10) e.telefone = 'Informe um telefone com DDD.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Informe um e-mail válido.'
    if (form.assunto.trim().length < 5) e.assunto = 'Conte brevemente o assunto.'
    if (!aceite) e.aceite = 'Para enviar, é necessário aceitar a Política de Privacidade.'
    setErros(e)
    return Object.keys(e).length === 0
  }
  const mask = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11)
    if (d.length <= 2) return d
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  }
  // Dentro de uma moldura (ex.: prévia/artefato) o navegador bloqueia a troca de página: abre em nova aba.
  let emMoldura = false
  try { emMoldura = typeof window !== 'undefined' && window.self !== window.top } catch { emMoldura = true }
  const enviar = async () => {
    if (enviando || !validar()) return
    setFalhou(false)
    if (isca) { setPronto(true); return } // robô: finge sucesso
    if (!ENDPOINT) { setPronto(true); return } // modo demonstração
    setEnviando(true)
    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...form, aceite: true, origem: window.location.href, enviadoEm: new Date().toISOString() }),
      })
      setPronto(true)
    } catch {
      setFalhou(true)
    } finally {
      setEnviando(false)
    }
  }

  useEffect(() => {
    if (!motion) return
    const ctx = gsap.context(() => {
      const E = 'expo.out'
      const tl = gsap.timeline({ defaults: { ease: E } })
      tl.from('.nav', { y: -40, opacity: 0, duration: 1 })
        .from('.hero .eyebrow', { opacity: 0, y: 14, duration: 0.8 }, 0.2)
        .from('.hero h1 span', { yPercent: 100, opacity: 0, duration: 1.3, stagger: 0.15 }, 0.3)
        .fromTo('.hero .sweep', { backgroundPosition: '100% 0' }, { backgroundPosition: '0% 0', duration: 2.2, ease: 'power2.out' }, 0.9)
        .from('.hero .lead, .hero .btn', { opacity: 0, y: 24, duration: 1, stagger: 0.12 }, 0.9)
        .fromTo('.portrait .ph', { clipPath: 'polygon(0 0,0 0,0 100%,0 100%)' }, { clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)', duration: 1.8, ease: 'power4.inOut' }, 0.4)
        .from('.portrait .ring', { scale: 0.85, opacity: 0, duration: 1.6, stagger: 0.15 }, 0.6)

      gsap.to('.hero-bg', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })

      gsap.fromTo('.draw line', { attr: { x2: 0 } }, { attr: { x2: 140 }, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: '.draw', start: 'top 85%' } })
      gsap.from('.about .fade', { y: 40, opacity: 0, duration: 1.1, ease: E, stagger: 0.14, scrollTrigger: { trigger: '.about', start: 'top 65%' } })
      gsap.from('.about .photo', { x: -50, opacity: 0, duration: 1.4, ease: E, scrollTrigger: { trigger: '.about', start: 'top 70%' } })
      const num = { v: 0 }
      gsap.to(num, {
        v: C.anos, duration: 2.4, ease: 'power2.out', snap: { v: 1 },
        scrollTrigger: { trigger: '.stat', start: 'top 85%' },
        onUpdate: () => { const el = document.querySelector('.stat b span'); if (el) el.textContent = String(num.v) },
      })

      gsap.from('.skills-head > *', { y: 40, opacity: 0, duration: 1, ease: E, stagger: 0.12, scrollTrigger: { trigger: '.skills-head', start: 'top 85%' } })
      gsap.from('.card', { y: 40, opacity: 0, duration: 1, ease: E, stagger: 0.12, clearProps: 'transform,opacity', scrollTrigger: { trigger: '.cards', start: 'top 82%' } })

      gsap.from('.help .head > *', { y: 36, opacity: 0, duration: 1, ease: E, stagger: 0.12, scrollTrigger: { trigger: '.help', start: 'top 70%' } })
      gsap.from('.box', { scale: 1.06, opacity: 0, duration: 1.2, ease: E, stagger: 0.15, clearProps: 'transform,opacity', scrollTrigger: { trigger: '.help-grid', start: 'top 82%' } })

      gsap.from('.contact .head > *', { y: 36, opacity: 0, duration: 1, ease: E, stagger: 0.12, scrollTrigger: { trigger: '.contact', start: 'top 70%' } })
      gsap.from('.contact li', { opacity: 0, x: -30, duration: 0.9, ease: E, stagger: 0.14, scrollTrigger: { trigger: '.contact ul', start: 'top 85%' } })
      gsap.from('.contact .side', { opacity: 0, y: 50, duration: 1.3, ease: E, scrollTrigger: { trigger: '.contact', start: 'top 65%' } })
    }, root)
    return () => ctx.revert()
  }, [motion])

  const ct = C.contato
  const temWa = !!ct.whatsapp[1]
  const contatos: [JSX.Element, string, string, string][] = [
    [L.wa, 'WhatsApp', ct.whatsapp[0], ct.whatsapp[1]],
    [L.mail, 'E-mail', ct.email[0], `${ct.email[1]}?subject=${encodeURIComponent('Contato pelo site')}`],
    [L.ig, 'Instagram', ct.instagram[0], ct.instagram[1]],
    [L.pin, 'Escritório', ct.endereco[0], ct.endereco[1]],
  ]

  return (
    <div ref={root} className={motion ? '' : 'nomotion'} style={{ ['--pattern' as string]: `url(${padrao})`, ['--mock' as string]: `url(${mock1})`, ['--mock2' as string]: `url(${bg2})` }}>
      <header className="nav">
        <div className="wrap">
          <a href="#topo"><img src={logo} alt="Debora de Almeida Advogada" /></a>
          <nav>
            <ul>
              <li><a href="#sobre">Sobre Mim</a></li>
              <li><a href="#competencias">Áreas de atuação</a></li>
              <li><a href="#solucoes">Soluções</a></li>
              <li><a href="#contato">Contato</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="hero" id="topo">
        <div className="hero-bg" />
        <div className="wrap">
          <div>
            <div className="eyebrow">{H.eyebrow}</div>
            <h1>
              <span className="sweep">{H.nome[0]}</span>
              <span className="l2">{H.nome[1]}</span>
            </h1>
            <div className="lead">{H.paragrafos.map((p) => <p key={p}>{p}</p>)}</div>
            <a className="btn" href={temWa ? ct.whatsapp[1] : '#contato'}>{C.cta} <span>→</span></a>
          </div>
          <div className="portrait">
            <div className="ring two" /><div className="ring" />
            <div className="ph"><img src={foto3} alt="Debora de Almeida" /></div>
          </div>
        </div>
        <div className="scroll-hint"><i />Role</div>
      </section>

      <section className="about" id="sobre">
        <div className="wrap">
          <div className="photo"><img src={foto1} alt="Debora de Almeida em seu escritório" /></div>
          <div>
            <div className="eyebrow fade">Sobre Mim</div>
            <h2 className="h2 fade">Precisão Técnica,<br /><em className="gold-text">Visão de Longo Prazo.</em></h2>
            <svg className="draw" width="140" height="2"><line x1="0" y1="1" x2="140" y2="1" /></svg>
            {C.sobre.map((t) => <p className="fade" key={t}>{t}</p>)}
            <div className="stat fade">
              <b className="gold-text"><span>{C.anos}</span>+</b>
              <span>anos de atuação em direito imobiliário e civil</span>
            </div>
          </div>
        </div>
      </section>

      <section className="skills" id="competencias">
        <div className="wrap">
          <div className="skills-head">
            <div>
              <div className="eyebrow">Áreas de atuação</div>
              <h2 className="h2" style={{ marginTop: 16 }}>Principais <em className="gold-text">Habilidades</em></h2>
            </div>
            <p>Atuação focada em proteger o patrimônio e dar segurança a cada decisão.</p>
          </div>
          <div className="cards">
            {C.habilidades.map(([t, r, f], i) => {
              const num = String(i + 1).padStart(2, '0')
              const icone = [I.contrato, I.chave, I.regulariza, I.predio, I.pessoas, I.chave2, I.martelo, I.balanca, I.duasCasas, I.transmite][i]
              return (
                <article className="card" key={t} tabIndex={0}>
                  <div className="head">{icone}<div><span className="n">{num}</span><h3>{t}</h3></div></div>
                  <p className="resumo" aria-hidden="true">{r}</p>
                  <div className="full">
                    <div className="head" aria-hidden="true">{icone}<div><span className="n">{num}</span><h3>{t}</h3></div></div>
                    <p>{f.split('**').map((s, k) => (k % 2 ? <strong key={k}>{s}</strong> : s))}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="help" id="solucoes">
        <div className="wrap">
          <div className="head">
            <div className="eyebrow">Como posso ajudar você</div>
            <h2 className="h2">Soluções Jurídicas<br /><em className="gold-text">Exclusivas</em></h2>
          </div>
          <div className="help-grid">
            {C.ajuda.map(([t, d], i) => (
              <article className="box" key={t}>
                {[I.escudo, I.doc, I.pena][i]}
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact" id="contato">
        <div className="wrap">
          <div className="head">
            <div className="eyebrow">Contato</div>
            <h2 className="h2">Conecte-se com<br /><em className="gold-text">Meu Escritório</em></h2>
            <ul>
              {contatos.map(([ic, lb, tx, href]) => (
                <li key={lb}>
                  {ic}
                  {href ? (
                    <a href={href} target={href.startsWith('http') || (emMoldura && href.startsWith('mailto')) ? '_blank' : undefined} rel="noreferrer">
                      <small>{lb}</small><span>{tx}</span>
                    </a>
                  ) : (
                    <div><small>{lb}</small><span>{tx || '\u00A0'}</span></div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="side">
            {!pronto ? (
              <form className="cform" noValidate onSubmit={(e) => { e.preventDefault(); enviar() }} onKeyDown={(e) => { if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') { e.preventDefault(); enviar() } }}>
                <div className="eyebrow">Solicitar contato</div>
                <p className="fhint">Preencha os dados e entraremos em contato o quanto antes.</p>
                {([
                  ['nome', 'Nome', 'text', 'name', 'Seu nome completo'],
                  ['telefone', 'Telefone', 'tel', 'tel', '(12) 99999-9999'],
                  ['email', 'E-mail', 'email', 'email', 'voce@email.com'],
                ] as const).map(([k, lb, tp, ac, ph]) => (
                  <div className={`field ${erros[k] ? 'bad' : ''}`} key={k}>
                    <label htmlFor={`f-${k}`}>{lb}</label>
                    <input id={`f-${k}`} type={tp} autoComplete={ac} placeholder={ph} value={form[k]}
                      onChange={(e) => set(k, k === 'telefone' ? mask(e.target.value) : e.target.value)} />
                    {erros[k] && <em>{erros[k]}</em>}
                  </div>
                ))}
                <div className={`field ${erros.assunto ? 'bad' : ''}`}>
                  <label htmlFor="f-assunto">Assunto</label>
                  <textarea id="f-assunto" rows={3} placeholder="Ex.: dúvida sobre contrato de compra e venda de imóvel" value={form.assunto}
                    onChange={(e) => set('assunto', e.target.value)} />
                  {erros.assunto && <em>{erros.assunto}</em>}
                </div>
                <div className={`consent ${erros.aceite ? 'bad' : ''}`}>
                  <label htmlFor="f-aceite">
                    <input id="f-aceite" type="checkbox" checked={aceite}
                      onChange={(e) => { setAceite(e.target.checked); setErros((x) => ({ ...x, aceite: '' })) }} />
                    <span>
                      Li e concordo com a{' '}
                      <button type="button" className="linkbtn" onClick={() => setPrivacidade(true)}>Política de Privacidade</button>
                      {' '}e autorizo o uso dos meus dados para que o escritório entre em contato comigo.
                    </span>
                  </label>
                  {erros.aceite && <em>{erros.aceite}</em>}
                </div>
                <input type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" value={isca} onChange={(e) => setIsca(e.target.value)} style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
                {falhou && <p className="fhint" role="alert" style={{ color: '#e6a0a0' }}>Não foi possível enviar agora. Tente novamente em instantes ou escreva para <a href={ct.email[1]}>{ct.email[0]}</a>.</p>}
                <button type="button" className="btn submit" onClick={enviar} disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar solicitação'} {!enviando && <span>→</span>}</button>
              </form>
            ) : (
              <div className="cform done">
                <div className="eyebrow">Solicitação enviada</div>
                <h3 className="serif">Obrigada, {form.nome.split(' ')[0]}.</h3>
                <p className="fhint">Recebemos a sua solicitação e a Dra. Debora entrará em contato pelo telefone ou e-mail informados o quanto antes.</p>
                {!ENDPOINT && <p className="fhint" style={{ opacity: 0.7 }}>Modo demonstração: o envio real será ativado na publicação do site.</p>}
                <button type="button" className="back" onClick={() => { setPronto(false); setForm({ nome: '', telefone: '', email: '', assunto: '' }); setAceite(false) }}>← Enviar outra solicitação</button>
              </div>
            )}
          </div>
        </div>
        <footer>
          <span>© {new Date().getFullYear()} Debora de Almeida · Advogada · São José dos Campos</span>
          <button type="button" className="linkbtn foot" onClick={() => setPrivacidade(true)}>Política de Privacidade</button>
        </footer>
      </section>

      {privacidade && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="pp-t" onClick={() => setPrivacidade(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-x" aria-label="Fechar" onClick={() => setPrivacidade(false)}>×</button>
            <div className="eyebrow">Lei Geral de Proteção de Dados</div>
            <h2 id="pp-t" className="serif">Política de Privacidade</h2>
            <div className="modal-body">
              {POLITICA.map(([t, ps]) => (
                <section key={t}>
                  <h3>{t}</h3>
                  {ps.map((p) => (
                    <p key={p}>
                      {p.split('{{mapa}}').flatMap((s, k, arr) => (k < arr.length - 1
                        ? [s, <a key={k} className="maplink" href={C.contato.endereco[1]} target="_blank" rel="noreferrer">{C.contato.endereco[0].replace('\n', ', ')}</a>]
                        : [s]))}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
