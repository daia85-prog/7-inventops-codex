import { useCallback, useEffect, useRef, useState } from "react";
import {
  House, Sparkle, Factory, SquaresFour, Warning, ClipboardText, GearSix,
  CalendarBlank, Play, ArrowRight, TrendUp, CheckCircle, Info, Cpu,
  Barcode, ShieldCheck, BellRinging, Database, SlidersHorizontal, Lightning,
  UsersThree, ChartLineUp, GitCommit, TestTube, Wrench, Timer,
  ArrowCounterClockwise, XCircle, CloudCheck, LinkSimple, CheckSquare,
  Circuitry, Radio, Package, Eye, CaretDown, MagnifyingGlass, FolderOpen,
  Funnel, ArrowLeft, MapPin, User, Target, Plus, Rows, FlagCheckered, SignOut, LockKey,
  HandWaving, UploadSimple
} from "@phosphor-icons/react";
import {
  Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from "recharts";
import {
  AccessDenied, ActionCenter, AdminGovernance, AnalyticsPage, AreasPage,
  ExecutiveDashboard, ExecutiveOnePager, LifecyclePage, LoginScreen,
  ManagementPage, PresentationPage, RaidPage, StatusReportModal
} from "./FoundationModules";
import { ProjectControlModal } from "./ProjectControlModal";
import { DepartmentCockpit } from "./DepartmentCockpit";
import { PmControlTower } from "./PmControlTower";

const assetPath = (name) => `${import.meta.env.BASE_URL}assets/${name}`;

/* E1.5 — F1 SharePoint: link vivo por projeto (padrão proj-<código> do P5).
   ⚠️ Base a confirmar com a Daiana antes da apresentação — trocar SÓ esta linha. */
const SHAREPOINT_BASE = "https://inventsmart.sharepoint.com/sites/ProjetosInvent/SitePages";
const sharePointUrl = (code) => `${SHAREPOINT_BASE}/proj-${String(code||"").toLowerCase().replace(/\s+/g,"")}.aspx`;

const capacityData = [
  { d: "14 jul", base: 48, scenario: 32 }, { d: "21 jul", base: 55, scenario: 48 },
  { d: "28 jul", base: 62, scenario: 60 }, { d: "04 ago", base: 66, scenario: 76 },
  { d: "11 ago", base: 64, scenario: 82 }, { d: "18 ago", base: 72, scenario: 88 },
  { d: "25 ago", base: 76, scenario: 98 }, { d: "01 set", base: 80, scenario: 128 },
  { d: "08 set", base: 82, scenario: 146 }, { d: "15 set", base: 78, scenario: 140 },
  { d: "22 set", base: 74, scenario: 124 }, { d: "29 set", base: 60, scenario: 106 },
];

const telemetryData = [
  { t: "10:19", v: 18 }, { t: "10:20", v: 19 }, { t: "10:21", v: 18 },
  { t: "10:22", v: 17 }, { t: "10:23", v: 4 }, { t: "10:24", v: 0 },
];

const phaseNames = ["Kickoff","Levantamento","Provisionamento","Implantação","Homologação","Go Live","Encerramento"];

const portfolioData = [
  {name:"TITANO",code:"I25.8049",client:"Stellantis",location:"Betim · MG",owner:"Daiana Costa",pm:"Alex",status:"Em andamento",risk:"Médio",phase:4,progress:73,next:"Go Live operacional",date:"20 jul 2026",health:78,blocker:"Sem bloqueio crítico. Servidor SaaS AWS em provisionamento.",nextAction:"Agendar VPN site-to-site e consolidar evidências de segurança.",milestones:["Servidor SaaS aprovado · 23/06","Go Live operacional · 20/07","OAuth2 · D+20 após Go Live"]},
  {name:"QUELUZ",code:"I25.3505",client:"D. Müller",location:"Itajaí · SC",owner:"Daiana Costa",pm:"Fabio",status:"Em andamento",risk:"Médio",phase:4,progress:68,next:"GL1 · Conferência",date:"30 jul 2026",health:72,blocker:"SSH porta 9844 e VPN do time de Dados aguardando confirmação do cliente.",nextAction:"Garantir ambiente HML liberado antes do GL1.",milestones:["GL1 Conferência · 30/07","GL2 Sorter · 30/09","GL3 IA · 30/11","GL4 PBL · 25/01/27"]},
  {name:"MARKET PERU",code:"I25.115",client:"Tottus / Falabella",location:"Lima · Peru",owner:"Daiana Costa",pm:"Giovanni",status:"Bloqueado",risk:"Alto",phase:3,progress:42,next:"Infra de testes",date:"28 jul 2026",health:41,blocker:"VPN site-to-site, range IP /24 e emulador WCS ainda pendentes.",nextAction:"Escalar definições de rede e homologar arquitetura HA/DR.",milestones:["Servidores IA entregues · 05/06","Infra de testes · 28/07","Equipamentos export · out/26"]},
  {name:"NAVEPARK",code:"I25.4066",client:"Vedamotors",location:"Navegantes · SC",owner:"Daiana Costa",pm:"Anderson",status:"Bloqueado",risk:"Alto",phase:3,progress:51,next:"Ambiente HML",date:"14 ago 2026",health:48,blocker:"VMs Oracle KVM e desenho de arquitetura de rede pendentes.",nextAction:"Cobrar retorno do cliente e fechar topologia das VMs.",milestones:["VPN IPSec recebida","Ambiente HML · 14/08","Go Live · 07/09"]},
  {name:"BP",code:"I24.215",client:"Baspan",location:"São Paulo · SP",owner:"Daiana Costa",pm:"Giovanni",status:"Em andamento",risk:"Baixo",phase:5,progress:84,next:"Go Live",date:"03 ago 2026",health:86,blocker:"Sem bloqueio crítico; acompanhar disponibilidade do fornecedor PTL.",nextAction:"Concluir homologação e confirmar equipe de campo.",milestones:["REV14 aprovada · 01/06","Homologação · 25/07","Go Live · 03/08"]},
  {name:"MARKET CHILE",code:"I24.222",client:"Falabella / Tottus",location:"La Farfana · Chile",owner:"Daiana Costa",pm:"Giovanni",status:"Em andamento",risk:"Baixo",phase:2,progress:36,next:"1º embarque",date:"set 2026",health:81,blocker:"Sem bloqueio; diagrama de rede e VPN em configuração.",nextAction:"Fechar diagrama de rede e concluir VPN site-to-site.",milestones:["Especificação enviada · 24/06","1º embarque · set/26","Go Live · jan/27"]},
];

const baseActivities = [
  {id:1,name:"Validar arquitetura do ambiente",phase:"Levantamento",owner:"Daiana",due:"15 jul",status:"Concluído",evidence:"Documento REV4"},
  {id:2,name:"Provisionar servidores e acessos",phase:"Provisionamento",owner:"Ivan",due:"18 jul",status:"Em andamento",evidence:"Checklist 4/5"},
  {id:3,name:"Configurar VPN site-to-site",phase:"Provisionamento",owner:"Jonathan",due:"19 jul",status:"Aguardando",evidence:"Ticket #3278268"},
  {id:4,name:"Executar testes de integração",phase:"Homologação",owner:"Matheus",due:"24 jul",status:"Não iniciado",evidence:"0/12 testes"},
  {id:5,name:"Preparar plano de Go Live",phase:"Go Live",owner:"Fabio",due:"26 jul",status:"Não iniciado",evidence:"Modelo pendente"},
];

const initialAlert = {
  id: "P0-2026-0711-01", project: "TITANO", priority: "P0", title: "Falha crítica no Sensor X",
  description: "Leitura 0,00 mA detectada durante o comissionamento da Linha de Expedição 01.",
  owner: "Rodrigo Baruco", source: "IoT / CLP", detected: "11/07/2026 10:23:56", status: "Em triagem"
};

/* E1.4 — contrato Nexus: seção do kickoff → departamento dono (campos 'tbd' viram pendências) */
const SEC2DEPT = { ge:"PM", la:"EMC", cu:"WCS", in:"WCS", os:"WCS", pb:"EMC", ct:"EMC", fc:"EMC", pk:"EMC", so:"EMC", pt:"EMC", es:"WCS", et:"ESP", if:"INF" };
const IF_LABELS = {
  if_resp_infra:"Definir responsável de infra do projeto", if_resp_srv:"Servidor: cliente × Invent",
  if_ambiente:"Ambiente: nuvem × on-premise", if_s:"Especificação técnica de servidores",
  if_ambientes:"Ambientes PRD / HML", if1:"VPN site-to-site", if2:"Range de IPs",
  if3:"Acessos remotos", if4:"Domínio / DNS", if6:"Backup e monitoramento"
};

const navGroups = [
  { label: "EXECUTIVO", items: [
    { id: "home", label: "Dashboard Executivo", icon: House, mobile: true },
    { id: "action", label: "Minha Operação", icon: CheckSquare, mobile: true },
    { id: "management", label: "Gerencial", icon: TrendUp },
    { id: "analytics", label: "Análise / BI", icon: ChartLineUp },
    { id: "executive", label: "Relatório Executivo", icon: ClipboardText },
  ]},
  { label: "OPERAÇÃO", items: [
    { id: "portfolio", label: "Projetos", icon: FolderOpen, mobile: true },
    { id: "pm", label: "Central PM", icon: BellRinging, mobile: true },
    { id: "cockpit", label: "Operação Assistida", icon: HandWaving, mobile: true },
    { id: "areas", label: "Áreas Técnicas", icon: UsersThree },
    { id: "alerts", label: "Smart Triage", icon: Warning },
    { id: "raid", label: "Matriz RAID", icon: ShieldCheck },
  ]},
  { label: "INTELIGÊNCIA", items: [
    { id: "simulator", label: "Simulador de Impacto", icon: Sparkle, mobile: true },
    { id: "commissioning", label: "Comissionamento", icon: Factory },
    { id: "decision", label: "Sala de Decisão", icon: SquaresFour },
    { id: "evidence", label: "Evidências", icon: ClipboardText },
  ]},
  { label: "GOVERNANÇA", items: [
    { id: "admin", label: "Administração", icon: ShieldCheck, adminOnly: true },
    { id: "presentation", label: "Apresentação por Perfil", icon: Play },
    { id: "lifecycle", label: "Releases & Roadmap", icon: FlagCheckered },
    { id: "settings", label: "Configurações", icon: GearSix, adminOnly: true },
  ]},
];

const pageMeta = {
  home: ["Dashboard Executivo", "A carteira inteira traduzida em decisões para hoje."],
  action: ["Minha Operação", "Trabalho diário priorizado por impacto, dependência e evidência."],
  management: ["Visão Gerencial", "Tendência, capacidade e gargalos ativos."],
  analytics: ["Análise / BI", "Indicadores avançados e engajamento técnico."],
  executive: ["Relatório Executivo", "O portfólio consolidado em uma página."],
  portfolio: ["Controle de Projetos", "Planeje, acompanhe e cobre entregas em uma visão operacional."],
  pm: ["Central PM", "A carteira inteira organizada por decisões, dependências e handoffs."],
  cockpit: ["Operação Assistida", "A esteira real de cada área: entregas, esperas e handoffs com carimbo de hora."],
  project: ["Central do Projeto", "Fases, atividades, marcos, riscos e evidências em um único lugar."],
  simulator: ["Simulador de Impacto", "Antecipe riscos. Decida com confiança."],
  commissioning: ["Comissionamento em Tempo Real", "Telemetria da operação conectada à governança."],
  decision: ["Sala de Decisão", "Conecte evidências operacionais a impactos futuros."],
  areas: ["Áreas Técnicas", "Capacidade e progresso nas 14 áreas da operação."],
  alerts: ["Smart Triage", "Incidentes P0, P1 e P2, responsáveis e SLA em uma fila única."],
  raid: ["Matriz RAID", "Riscos, premissas, impedimentos e dependências priorizados."],
  evidence: ["Evidências", "Progresso explicado por entregas técnicas verificáveis."],
  admin: ["Administração", "Perfis, permissões, validações e auditoria."],
  presentation: ["Apresentação por Perfil", "Finalidade do InventOps para Analista, Gestor e Diretor."],
  lifecycle: ["Releases & Roadmap", "Ciclo de vida e visão de futuro do InventOps."],
  settings: ["Configurações", "Regras de simulação, telemetria e governança."],
};

const pageMetaIntl = {
  es: {
    home: ["Dashboard Ejecutivo", "Toda la cartera traducida en decisiones para hoy."],
    action: ["Mi Operación", "Trabajo diario priorizado por impacto, dependencia y evidencia."],
    management: ["Visión Gerencial", "Tendencia, capacidad y cuellos de botella activos."],
    analytics: ["Análisis / BI", "Indicadores avanzados y compromiso técnico."],
    executive: ["Informe Ejecutivo", "La cartera consolidada en una sola página."],
    portfolio: ["Control de Proyectos", "Planifica, acompaña y cobra entregas en una visión operativa."],
    pm: ["Central PM", "La cartera entera organizada por decisiones, dependencias y handoffs."],
    cockpit: ["Operación Asistida", "La cinta real de cada área: entregas, esperas y handoffs con hora."],
    project: ["Central del Proyecto", "Fases, actividades, hitos, riesgos y evidencias en un solo lugar."],
    simulator: ["Simulador de Impacto", "Anticipa riesgos. Decide con confianza."],
    commissioning: ["Comisionamiento en Tiempo Real", "Telemetría de la operación conectada a la gobernanza."],
    decision: ["Sala de Decisión", "Conecta evidencias operativas a impactos futuros."],
    areas: ["Áreas Técnicas", "Capacidad y progreso en las 14 áreas de la operación."],
    alerts: ["Smart Triage", "Incidentes P0, P1 y P2, responsables y SLA en una sola fila."],
    raid: ["Matriz RAID", "Riesgos, premisas, impedimentos y dependencias priorizados."],
    evidence: ["Evidencias", "Progreso explicado por entregas técnicas verificables."],
    admin: ["Administración", "Perfiles, permisos, validaciones y auditoría."],
    presentation: ["Presentación por Perfil", "Propósito de InventOps para Analista, Gestor y Director."],
    lifecycle: ["Releases & Roadmap", "Ciclo de vida y visión de futuro de InventOps."],
    settings: ["Configuración", "Reglas de simulación, telemetría y gobernanza."],
  },
  en: {
    home: ["Executive Dashboard", "The full portfolio translated into decisions for today."],
    action: ["My Operation", "Daily work prioritized by impact, dependency and evidence."],
    management: ["Management View", "Trend, capacity and active bottlenecks."],
    analytics: ["Analytics / BI", "Advanced indicators and technical engagement."],
    executive: ["Executive Report", "The portfolio consolidated into a single page."],
    portfolio: ["Project Control", "Plan, track, and drive deliveries in one operational view."],
    pm: ["Central PM", "The whole portfolio organized by decisions, dependencies and handoffs."],
    cockpit: ["Assisted Operation", "Each area's real pipeline: deliveries, waits and time-stamped handoffs."],
    project: ["Project Hub", "Phases, activities, milestones, risks and evidence in one place."],
    simulator: ["Impact Simulator", "Anticipate risks. Decide with confidence."],
    commissioning: ["Real-Time Commissioning", "Operational telemetry connected to governance."],
    decision: ["Decision Room", "Connect operational evidence to future impacts."],
    areas: ["Technical Areas", "Capacity and progress across the operation's 14 areas."],
    alerts: ["Smart Triage", "P0, P1 and P2 incidents, owners and SLA in a single queue."],
    raid: ["RAID Matrix", "Risks, assumptions, impediments and dependencies prioritized."],
    evidence: ["Evidence", "Progress explained by verifiable technical deliveries."],
    admin: ["Administration", "Profiles, permissions, validations and audit."],
    presentation: ["Presentation by Profile", "InventOps' purpose for Analyst, Manager and Director."],
    lifecycle: ["Releases & Roadmap", "InventOps' lifecycle and vision of the future."],
    settings: ["Settings", "Simulation, telemetry and governance rules."],
  }
};

const NAV_I18N = {
  es: {
    groups: { "EXECUTIVO":"EJECUTIVO", "OPERAÇÃO":"OPERACIÓN", "INTELIGÊNCIA":"INTELIGENCIA", "GOVERNANÇA":"GOBERNANZA" },
    items: { home:"Dashboard Ejecutivo", action:"Mi Operación", management:"Gerencial", analytics:"Análisis / BI", executive:"Informe Ejecutivo",
      portfolio:"Proyectos", pm:"Central PM", cockpit:"Operación Asistida", areas:"Áreas Técnicas", alerts:"Smart Triage", raid:"Matriz RAID",
      simulator:"Simulador de Impacto", commissioning:"Comisionamiento", decision:"Sala de Decisión", evidence:"Evidencias",
      admin:"Administración", presentation:"Presentación por Perfil", lifecycle:"Releases & Roadmap", settings:"Configuración" },
    profile:"Perfil", logout:"Salir con seguridad", developedBy:"Desarrollado por",
  },
  en: {
    groups: { "EXECUTIVO":"EXECUTIVE", "OPERAÇÃO":"OPERATIONS", "INTELIGÊNCIA":"INTELLIGENCE", "GOVERNANÇA":"GOVERNANCE" },
    items: { home:"Executive Dashboard", action:"My Operation", management:"Management", analytics:"Analytics / BI", executive:"Executive Report",
      portfolio:"Projects", pm:"Central PM", cockpit:"Assisted Operation", areas:"Technical Areas", alerts:"Smart Triage", raid:"RAID Matrix",
      simulator:"Impact Simulator", commissioning:"Commissioning", decision:"Decision Room", evidence:"Evidence",
      admin:"Administration", presentation:"Presentation by Profile", lifecycle:"Releases & Roadmap", settings:"Settings" },
    profile:"Profile", logout:"Sign out securely", developedBy:"Developed by",
  },
};

const productJourney = [
  { id: "home", label: "Home", helper: "Entrada executiva" },
  { id: "portfolio", label: "Projetos", helper: "Carteira ativa" },
  { id: "project", label: "Projeto", helper: "Controle ponta a ponta" },
  { id: "pm", label: "PM", helper: "Cobrança e priorização" },
  { id: "executive", label: "Executivo", helper: "Síntese para decisão" },
];

const PRODUCT_JOURNEY_I18N = {
  es: {
    home: { label: "Home", helper: "Entrada ejecutiva" },
    portfolio: { label: "Proyectos", helper: "Cartera activa" },
    project: { label: "Proyecto", helper: "Control de punta a punta" },
    pm: { label: "PM", helper: "Reclamos y priorización" },
    executive: { label: "Ejecutivo", helper: "Síntesis para decisión" },
  },
  en: {
    home: { label: "Home", helper: "Executive entry point" },
    portfolio: { label: "Projects", helper: "Active portfolio" },
    project: { label: "Project", helper: "End-to-end control" },
    pm: { label: "PM", helper: "Follow-up and prioritization" },
    executive: { label: "Executive", helper: "Synthesis for decision" },
  },
};

const initialAlerts = [
  initialAlert,
  {id:"P1-2026-0711-04",project:"MARKET PERU",priority:"P1",title:"Conectividade sem confirmação do cliente",description:"VPN site-to-site e range IP /24 ainda sem data firme.",owner:"Ivan",source:"Governança",detected:"10/07/2026 15:10:00",status:"Em ação"},
  {id:"P1-2026-0711-05",project:"NAVEPARK",priority:"P1",title:"Ambiente HML em risco",description:"Topologia das VMs Oracle KVM aguarda decisão técnica.",owner:"Daiana Costa",source:"PM",detected:"09/07/2026 09:30:00",status:"Em triagem"},
  {id:"P2-2026-0711-08",project:"QUELUZ",priority:"P2",title:"Evidências incompletas para GL1",description:"Dez testes de comissionamento ainda aguardam aprovação.",owner:"Matheus",source:"Evidências",detected:"11/07/2026 08:12:00",status:"Em triagem"}
];

function Logo() {
  return <div className="brand"><img src={assetPath("icon.svg")} alt="InventOps"/><div><strong>Invent<span>Ops</span></strong><small>ENTERPRISE</small></div></div>;
}

const VISION_PAGES = ["simulator", "commissioning"];

function LangSwitch({ lang, setLang, notify }) {
  return <span className="lang-switch" role="group" aria-label="Idioma">
    {[
      { id: "pt", label: "PT" },
      { id: "es", label: "ES" },
      { id: "en", label: "EN" }
    ].map(option => (
      <button
        key={option.id}
        className={lang===option.id?"active":""}
        aria-pressed={lang===option.id}
        onClick={()=>{
          setLang(option.id);
          notify(option.id==="pt"?"Idioma alterado para português.":option.id==="es"?"Idioma alterado para espanhol.":"Language switched to English.");
        }}
      >
        {option.label}
      </button>
    ))}
  </span>;
}

const DEFAULT_USER = { name: "Admin", initials: "A", role: "Admin", dept: "ADM", email: "admin@invent-corp.com" };
const SESSION_PROFILES = [
  { match: "daniel", name: "Daniel", initials: "DA", role: "Gestor", dept: "IMP", email: "daniel.almeida@invent-corp.com" },
  { match: "thomas", name: "Thomas", initials: "TH", role: "Analista", dept: "ESP", email: "thomas.santos@invent-corp.com" },
  { match: "admin", ...DEFAULT_USER }
];
function resolveSessionProfile(email = "") {
  const normalized = email.trim().toLowerCase();
  const profile = SESSION_PROFILES.find(item => normalized.includes(item.match));
  return profile ? { ...DEFAULT_USER, ...profile, email: normalized || profile.email } : { ...DEFAULT_USER, email: normalized || DEFAULT_USER.email };
}

const ROUTE_ALIASES = {
  "": { active: "home" },
  home: { active: "home" },
  inicio: { active: "home" },
  administracao: { active: "admin" },
  admin: { active: "admin" },
  operacao: { active: "cockpit", dept: "IMP" },
  cockpit: { active: "cockpit", dept: "IMP" },
  "operacao-implantacao": { active: "cockpit", dept: "IMP" },
  "implantacao": { active: "cockpit", dept: "IMP" },
  "daniel": { active: "cockpit", dept: "IMP" },
  "operacao-devops": { active: "cockpit", dept: "ESP" },
  "devops": { active: "cockpit", dept: "ESP" },
  "especificacao": { active: "cockpit", dept: "ESP" },
  "thomas": { active: "cockpit", dept: "ESP" },
  "operacao-infra": { active: "cockpit", dept: "INF" },
  "infra": { active: "cockpit", dept: "INF" },
  pm: { active: "pm" },
  projetos: { active: "portfolio" },
  evidencias: { active: "evidence" },
  roadmap: { active: "presentation" },
};

function readRouteFromHash() {
  if (typeof window === "undefined") return { active: "home" };
  const token = window.location.hash.replace(/^#\/?/, "").trim().toLowerCase();
  return ROUTE_ALIASES[token] || { active: pageMeta[token] ? token : "home" };
}

function routeTokenFor(active, dept) {
  if (active === "cockpit") {
    if (dept === "ESP") return "operacao-devops";
    if (dept === "INF") return "operacao-infra";
    return "operacao-implantacao";
  }
  if (active === "admin") return "administracao";
  if (active === "portfolio") return "projetos";
  if (active === "evidence") return "evidencias";
  if (active === "presentation") return "roadmap";
  return active || "home";
}

function SidebarEnhanced({ active, setActive, alertCount, notify, role, currentUser, onLogout, lang="pt" }) {
  const [openGroups,setOpenGroups]=useState({
    "EXECUTIVO":true,
    "OPERAÇÃO":true,
    "INTELIGÊNCIA":false,
    "GOVERNANÇA":false,
  });
  const navT=NAV_I18N[lang];

  return <aside className="sidebar">
    <Logo/>
    <nav>
      {navGroups.map(group=><div className={`nav-group ${openGroups[group.label]?"open":"collapsed"}`} key={group.label}>
        <button type="button" className="nav-group-toggle" aria-expanded={!!openGroups[group.label]} onClick={()=>setOpenGroups(current=>({...current,[group.label]:!current[group.label]}))}>
          <small>{navT?.groups[group.label]||group.label}</small>
          <CaretDown size={12} className={openGroups[group.label]?"open":""}/>
        </button>
        <div className="nav-group-items">
          {group.items.map(({id,label,icon:Icon,mobile,adminOnly}) => {
            const isActive=active===id||(active==="project"&&id==="portfolio");
            const restricted=adminOnly&&role!=="Admin";
            const displayLabel=navT?.items[id]||label;
            return <button data-mobile={mobile?"true":"false"} key={id} aria-label={displayLabel} className={`${isActive?"active":""} ${restricted?"restricted":""}`} onClick={()=>restricted?notify("Acesso restrito ao perfil Admin."):setActive(id)}>
              <Icon size={19} weight={isActive?"fill":"regular"}/>
              <span>{displayLabel}</span>
              {restricted?<LockKey size={12}/>:null}
              {id==="alerts"&&alertCount>0?<b>{alertCount}</b>:null}
            </button>
          })}
        </div>
      </div>)}
    </nav>
    <div className="sidebar-bottom">
      <button className="profile" onClick={()=>{setActive("admin");notify("Administração aberta para controlar perfil, tema e acessos.")}}><span className="avatar">{currentUser.initials}</span><span><strong>{currentUser.name}</strong><small>{role==="Diretoria"?"Diretoria · DIREX":role}</small></span><CaretDown size={15}/></button>
      <button className="logout-button" onClick={onLogout}><SignOut/><span>{navT?.logout||"Sair com segurança"}</span></button>
      <div className="credit"><Sparkle size={15} weight="fill"/><span>{navT?.developedBy||"Desenvolvido por"} <b>Daiana Costa</b></span></div>
    </div>
  </aside>;
}

function Topbar({ active, role, currentUser, onLogout, notify, lang, setLang }) {
  const localizedMeta = pageMetaIntl[lang]?.[active] || pageMeta[active];
  const roadmapTitle = {
    pt: "Este módulo pertence à expansão do produto e mostra a próxima camada operacional que será incorporada ao InventOps.",
    es: "Este módulo pertenece a la expansión del producto y muestra la siguiente capa operacional que se incorporará al InventOps.",
    en: "This module belongs to the product expansion and shows the next operational layer that will be incorporated into InventOps."
  };
  return <header className="topbar"><div><div className="title-line"><h1>{localizedMeta[0]}</h1>{VISION_PAGES.includes(active) ? <span className="vision-badge" title={roadmapTitle[lang]}>↗ VISÃO · ROADMAP</span> : null}</div><p>{localizedMeta[1]}</p></div><div className="top-actions">
    <LangSwitch lang={lang} setLang={setLang} notify={notify} /><span className="date"><CalendarBlank size={18} />11 jul 2026</span><span className="avatar">{currentUser.initials}</span><span className="top-user">{currentUser.name}<small>{role==="Diretoria"?"Diretoria · DIREX":role}</small></span><button className="top-logout" onClick={onLogout} aria-label="Sair"><SignOut /></button>
  </div></header>;
}

function ProductJourneyRail({ active, setActive, lang }) {
  const currentIndex = productJourney.findIndex(step => step.id === active);
  if (currentIndex === -1) return null;
  const nextStep = productJourney[currentIndex + 1];
  const copy = {
    pt: { title: "JORNADA OPERACIONAL", progress: "concluído na jornada do produto", next: "Próxima etapa", current: "Etapa atual", done: "Jornada operacional completa" },
    es: { title: "TRAYECTO OPERATIVO", progress: "completado en el trayecto del producto", next: "Próxima etapa", current: "Etapa actual", done: "Trayecto operativo completo" },
    en: { title: "OPERATIONAL JOURNEY", progress: "completed in the product journey", next: "Next stage", current: "Current stage", done: "Operational journey complete" }
  }[lang];
  const stepText = (step) => PRODUCT_JOURNEY_I18N[lang]?.[step.id] || { label: step.label, helper: step.helper };

  return (
    <section className="product-journey-rail" aria-label={copy.title}>
      <div className="product-journey-head">
        <small>{copy.title}</small>
        <div className="product-journey-meta">
          <b>{currentIndex + 1}/{productJourney.length} {copy.progress}</b>
          {nextStep ? <button className="ghost" onClick={() => setActive(nextStep.id)}>{copy.next}: {stepText(nextStep).label}</button> : <span className="product-journey-done">{copy.done}</span>}
        </div>
      </div>
      <div className="product-journey-track">
        {productJourney.map((step, index) => {
          const state = index < currentIndex ? "done" : index == currentIndex ? "current" : "future";
          return (
            <div key={step.id} className={`product-journey-step ${state}`}>
              <i>{state === "done" ? <CheckCircle weight="fill" /> : index + 1}</i>
              <span>
                <b>{stepText(step).label}</b>
                <small>{state === "current" ? copy.current : stepText(step).helper}</small>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CustomTooltip({active,payload,label}) {
  if(!active||!payload?.length) return null;
  return <div className="chart-tooltip"><b>{label}</b>{payload.map(p=><span key={p.dataKey} style={{color:p.color}}>{p.name}: {p.value}%</span>)}</div>;
}

function CapacityChart({compact=false}) {
  return <div className={compact?"chart compact":"chart"}><ResponsiveContainer width="100%" height="100%">
    <LineChart data={capacityData} margin={{top:10,right:8,left:-20,bottom:0}}>
      <CartesianGrid stroke="#172338" vertical={false}/><XAxis dataKey="d" stroke="#65728a" tick={{fontSize:10}} tickLine={false}/>
      <YAxis domain={[0,160]} stroke="#65728a" tick={{fontSize:10}} tickLine={false} tickFormatter={v=>`${v}%`}/>
      <Tooltip content={<CustomTooltip/>}/><Line name="Plano base" type="monotone" dataKey="base" stroke="#77839a" strokeDasharray="5 5" dot={false} strokeWidth={2} isAnimationActive={false}/>
      <Line name="Cenário simulado" type="monotone" dataKey="scenario" stroke="#27c5e8" dot={false} strokeWidth={3} isAnimationActive={false}/>
    </LineChart>
  </ResponsiveContainer></div>;
}

function ImpactNode({eyebrow,title,value,color,detail,footer}) {
  return <div className="impact-node" style={{"--node-color":color}}><small>{eyebrow}</small><h3>{title}</h3><strong>{value}</strong><p>{detail}</p><span>{footer}</span></div>;
}

const SIMULATOR_I18N={
  pt:{step1:"1. Defina o cenário",step1Sub:"Descreva o evento ou condição que deseja simular.",placeholder:"Cenário a simular",calculating:"Calculando dependências...",simulate:"Simular impacto",aiNote:"Motor de cenários + IA explicativa aplicados ao gêmeo digital.",
   step2:"2. Cadeia de impacto",step2Result:"(resultado da simulação)",step2Sub:"Como o evento se propaga pela operação.",project:"PROJETO",resource:"RECURSO",directImpact:"Impacto direto",cascadeImpact:"Impacto em cascata",exceededCapacity:"Capacidade excedida",
   confidence:"CONFIANÇA DA SIMULAÇÃO",confidenceNote:"Baseado na qualidade dos dados e histórico similar.",assumptions:"PRINCIPAIS SUPOSIÇÕES",
   assumptionItems:["Atraso causado exclusivamente pela falta de hardware.","Redes de precedência conforme baseline atual.","Capacidade e calendário conforme plano registrado."],
   seeAllAssumptions:"Ver todas as suposições (4)",assumptionToast:"4ª suposição: fornecedores mantêm o prazo confirmado em 10/07.",
   step3:"3. Linha do tempo — Capacidade do recurso PLC",step3Sub:"Projeção de utilização diária (% da capacidade disponível).",overload:"Sobrecarga prevista entre 28/08 e 20/09.",peak:"Pico de 146% em 10/09.",
   step4:"4. Ação executiva recomendada",step4Sub:"O que fazer agora para reduzir o impacto.",recTitle:"Acelerar aquisição de hardware para TITANO",recBody:"Antecipar a entrega dos equipamentos críticos em pelo menos 5 dias para eliminar o atraso e evitar a sobrecarga de PLC em setembro.",
   estImpact:"IMPACTO ESTIMADO",estImpactValue:"Elimina +5 dias e +40% de sobrecarga",estCost:"CUSTO ESTIMADO",createPlan:"Criar plano de ação",createPlanToast:"Plano de ação criado e vinculado ao projeto TITANO.",altPlan:"Ver alternativas de mitigação (2)",altToast:"Alternativas: remanejar PLC ou antecipar o lote crítico de hardware.",
   footer:"Os resultados são estimativas e dependem da precisão dos dados e das suposições adotadas."},
  es:{step1:"1. Define el escenario",step1Sub:"Describe el evento o condición que quieres simular.",placeholder:"Escenario a simular",calculating:"Calculando dependencias...",simulate:"Simular impacto",aiNote:"Motor de escenarios + IA explicativa aplicados al gemelo digital.",
   step2:"2. Cadena de impacto",step2Result:"(resultado de la simulación)",step2Sub:"Cómo se propaga el evento por la operación.",project:"PROYECTO",resource:"RECURSO",directImpact:"Impacto directo",cascadeImpact:"Impacto en cascada",exceededCapacity:"Capacidad excedida",
   confidence:"CONFIANZA DE LA SIMULACIÓN",confidenceNote:"Basado en la calidad de los datos y un histórico similar.",assumptions:"PRINCIPALES SUPOSICIONES",
   assumptionItems:["Atraso causado exclusivamente por falta de hardware.","Redes de precedencia según el baseline actual.","Capacidad y calendario según el plan registrado."],
   seeAllAssumptions:"Ver todas las suposiciones (4)",assumptionToast:"4ª suposición: los proveedores mantienen el plazo confirmado el 10/07.",
   step3:"3. Línea de tiempo — Capacidad del recurso PLC",step3Sub:"Proyección de uso diario (% de la capacidad disponible).",overload:"Sobrecarga prevista entre el 28/08 y el 20/09.",peak:"Pico de 146% el 10/09.",
   step4:"4. Acción ejecutiva recomendada",step4Sub:"Qué hacer ahora para reducir el impacto.",recTitle:"Acelerar la adquisición de hardware para TITANO",recBody:"Anticipar la entrega de los equipos críticos en al menos 5 días para eliminar el atraso y evitar la sobrecarga de PLC en septiembre.",
   estImpact:"IMPACTO ESTIMADO",estImpactValue:"Elimina +5 días y +40% de sobrecarga",estCost:"COSTO ESTIMADO",createPlan:"Crear plan de acción",createPlanToast:"Plan de acción creado y vinculado al proyecto TITANO.",altPlan:"Ver alternativas de mitigación (2)",altToast:"Alternativas: reasignar PLC o anticipar el lote crítico de hardware.",
   footer:"Los resultados son estimaciones y dependen de la precisión de los datos y las suposiciones adoptadas."},
  en:{step1:"1. Define the scenario",step1Sub:"Describe the event or condition you want to simulate.",placeholder:"Scenario to simulate",calculating:"Calculating dependencies...",simulate:"Simulate impact",aiNote:"Scenario engine + explanatory AI applied to the digital twin.",
   step2:"2. Impact chain",step2Result:"(simulation result)",step2Sub:"How the event propagates through the operation.",project:"PROJECT",resource:"RESOURCE",directImpact:"Direct impact",cascadeImpact:"Cascading impact",exceededCapacity:"Exceeded capacity",
   confidence:"SIMULATION CONFIDENCE",confidenceNote:"Based on data quality and similar historical cases.",assumptions:"KEY ASSUMPTIONS",
   assumptionItems:["Delay caused exclusively by hardware shortage.","Precedence networks per the current baseline.","Capacity and schedule per the recorded plan."],
   seeAllAssumptions:"See all assumptions (4)",assumptionToast:"4th assumption: suppliers keep the deadline confirmed on 07/10.",
   step3:"3. Timeline — PLC resource capacity",step3Sub:"Daily usage projection (% of available capacity).",overload:"Overload expected between 08/28 and 09/20.",peak:"146% peak on 09/10.",
   step4:"4. Recommended executive action",step4Sub:"What to do now to reduce the impact.",recTitle:"Accelerate hardware acquisition for TITANO",recBody:"Bring forward critical equipment delivery by at least 5 days to eliminate the delay and avoid PLC overload in September.",
   estImpact:"ESTIMATED IMPACT",estImpactValue:"Eliminates +5 days and +40% overload",estCost:"ESTIMATED COST",createPlan:"Create action plan",createPlanToast:"Action plan created and linked to the TITANO project.",altPlan:"See mitigation alternatives (2)",altToast:"Alternatives: reassign PLC or bring forward the critical hardware batch.",
   footer:"Results are estimates and depend on data accuracy and the assumptions adopted."},
};
function Simulator({scenario,setScenario,notify,lang="pt"}) {
  const t=SIMULATOR_I18N[lang]||SIMULATOR_I18N.pt;
  const [running,setRunning]=useState(false); const [ready,setReady]=useState(true);
  const runTimer=useRef();
  useEffect(()=>()=>window.clearTimeout(runTimer.current),[]);
  const run=()=>{setRunning(true);setReady(false);window.clearTimeout(runTimer.current);runTimer.current=window.setTimeout(()=>{setRunning(false);setReady(true)},850)};
  return <section className="page simulator-page">
    <div className="sim-grid">
      <div className="scenario-panel"><div className="section-heading"><b>{t.step1}</b><span>{t.step1Sub}</span></div>
        <div className="scenario-box"><textarea value={scenario} maxLength={250} onChange={e=>setScenario(e.target.value)} aria-label={t.placeholder}/><small>{scenario.length} / 250</small></div>
        <button className="primary" onClick={run} disabled={running}><Play size={19} weight="fill"/>{running?t.calculating:t.simulate}</button>
        <p className="ai-note"><Sparkle size={17}/>{t.aiNote}</p>
      </div>
      <div className={`impact-panel ${ready?"ready":"loading"}`}><div className="section-heading"><b>{t.step2} <em>{t.step2Result}</em></b><span>{t.step2Sub}</span></div>
        <div className="impact-chain"><ImpactNode eyebrow={t.project} title="TITANO" value="+5d" color="#fb5470" detail="Conclusão prevista 25 jul 2026" footer={t.directImpact}/><ArrowRight/>
          <ImpactNode eyebrow={t.project} title="QUELUZ" value="+12d" color="#f5c300" detail="Conclusão prevista 31 jul 2026" footer={t.cascadeImpact}/><ArrowRight/>
          <ImpactNode eyebrow={t.resource} title="PLC" value="+40%" color="#32bde0" detail="Carga em setembro" footer={t.exceededCapacity}/></div>
        <div className="confidence"><div><small>{t.confidence}</small><strong>78%</strong><div className="progress"><i style={{width:"78%"}}/></div><span>{t.confidenceNote}</span></div><div><small>{t.assumptions}</small><ul>{t.assumptionItems.map(i=><li key={i}>{i}</li>)}</ul><button className="link-button" onClick={()=>notify(t.assumptionToast)}>{t.seeAllAssumptions}</button></div></div>
      </div>
    </div>
    <div className="sim-bottom"><article><div className="section-heading"><b>{t.step3}</b><span>{t.step3Sub}</span></div><CapacityChart/><div className="chart-note"><Info size={22}/><span>{t.overload}<b>{t.peak}</b></span></div></article>
      <article><div className="section-heading"><b>{t.step4}</b><span>{t.step4Sub}</span></div><div className="recommendation"><span className="rec-icon"><TrendUp/></span><div><h3>{t.recTitle}</h3><p>{t.recBody}</p></div><div className="rec-metrics"><span><small>{t.estImpact}</small><b>{t.estImpactValue}</b></span><span><small>{t.estCost}</small><b>+ R$ 48.000,00</b></span></div><button className="primary" onClick={()=>notify(t.createPlanToast)}><CalendarBlank size={19}/>{t.createPlan}</button><button className="link-button" onClick={()=>notify(t.altToast)}>{t.altPlan}</button></div></article>
    </div>
    <footer>{t.footer}</footer>
  </section>;
}

function SensorTag({className,icon:Icon,title,status="OK",fault=false,detail}) { return <div className={`sensor-tag ${className} ${fault?"fault":""}`}><Icon size={20}/><span><b>{title}</b><small>{fault?<XCircle weight="fill"/>:<CheckCircle weight="fill"/>}{status}</small><em>{detail}</em></span></div>; }

const COMMISSIONING_I18N={
  pt:{twinTitle:"Digital Twin",twinLine:"— Linha de Expedição 01",faultDetected:"Falha detectada",normalOp:"Operação normal",
   lineSpeed:"Velocidade da linha",volumeToday:"Volume processado hoje",availability:"Disponibilidade",
   activeIncident:"INCIDENTE ATIVO",normalOpUpper:"OPERAÇÃO NORMAL",p0Created:"P0 criado automaticamente",sensorNormalized:"Sensor normalizado",
   faultBody:"Falha crítica detectada no Sensor X e vinculada ao projeto TITANO.",clearBody:"Telemetria estabilizada. O histórico do incidente foi preservado.",
   project:"Projeto",priority:"Prioridade",owner:"Responsável",sla:"SLA",source:"Fonte",closed:"encerrado",
   normalizeSensor:"Normalizar sensor",simulateFault:"Simular nova falha",injectToast:"Falha crítica detectada: P0 aberto e SLA iniciado.",clearToast:"Sensor X normalizado. O histórico do P0 foi preservado.",
   evidence:"Evidência",telemetry:"Telemetria do Sensor X",seeAllEvidence:"Ver todas as evidências",
   futureTag:"PLANO FUTURO PÓS-IMPLANTAÇÃO",futureTitle:"O próximo passo é simular a linha inteira.",futureBody:"Depois do núcleo operacional consolidado, o InventOps evolui de leitura e resposta para simulação ponta a ponta da operação conectada.",
   futureItems:[["Simulação da operação","cenários de impacto antes do problema explodir"],["Esteira + PLC + sensores","telemetria física conectada ao contexto do projeto"],["Servidores + infraestrutura","operação de TI entrando no mesmo quadro de decisão"],["WCS Velox no mesmo modelo","gêmeo digital real da execução e do software"]],
   openRoadmap:"Abrir visão do roadmap"},
  es:{twinTitle:"Digital Twin",twinLine:"— Línea de Expedición 01",faultDetected:"Falla detectada",normalOp:"Operación normal",
   lineSpeed:"Velocidad de la línea",volumeToday:"Volumen procesado hoy",availability:"Disponibilidad",
   activeIncident:"INCIDENTE ACTIVO",normalOpUpper:"OPERACIÓN NORMAL",p0Created:"P0 creado automáticamente",sensorNormalized:"Sensor normalizado",
   faultBody:"Falla crítica detectada en el Sensor X y vinculada al proyecto TITANO.",clearBody:"Telemetría estabilizada. El historial del incidente fue preservado.",
   project:"Proyecto",priority:"Prioridad",owner:"Responsable",sla:"SLA",source:"Fuente",closed:"cerrado",
   normalizeSensor:"Normalizar sensor",simulateFault:"Simular nueva falla",injectToast:"Falla crítica detectada: P0 abierto y SLA iniciado.",clearToast:"Sensor X normalizado. El historial del P0 fue preservado.",
   evidence:"Evidencia",telemetry:"Telemetría del Sensor X",seeAllEvidence:"Ver todas las evidencias",
   futureTag:"PLAN FUTURO POST-IMPLANTACIÓN",futureTitle:"El próximo paso es simular toda la línea.",futureBody:"Después del núcleo operativo consolidado, InventOps evoluciona de lectura y respuesta a simulación de punta a punta de la operación conectada.",
   futureItems:[["Simulación de la operación","escenarios de impacto antes de que el problema explote"],["Cinta + PLC + sensores","telemetría física conectada al contexto del proyecto"],["Servidores + infraestructura","operación de TI entrando en el mismo cuadro de decisión"],["WCS Velox en el mismo modelo","gemelo digital real de la ejecución y del software"]],
   openRoadmap:"Abrir visión del roadmap"},
  en:{twinTitle:"Digital Twin",twinLine:"— Shipping Line 01",faultDetected:"Fault detected",normalOp:"Normal operation",
   lineSpeed:"Line speed",volumeToday:"Volume processed today",availability:"Availability",
   activeIncident:"ACTIVE INCIDENT",normalOpUpper:"NORMAL OPERATION",p0Created:"P0 created automatically",sensorNormalized:"Sensor normalized",
   faultBody:"Critical fault detected on Sensor X and linked to the TITANO project.",clearBody:"Telemetry stabilized. The incident history was preserved.",
   project:"Project",priority:"Priority",owner:"Owner",sla:"SLA",source:"Source",closed:"closed",
   normalizeSensor:"Normalize sensor",simulateFault:"Simulate new fault",injectToast:"Critical fault detected: P0 opened and SLA started.",clearToast:"Sensor X normalized. The P0 history was preserved.",
   evidence:"Evidence",telemetry:"Sensor X telemetry",seeAllEvidence:"See all evidence",
   futureTag:"FUTURE PLAN POST-DEPLOYMENT",futureTitle:"The next step is simulating the whole line.",futureBody:"After the operational core is consolidated, InventOps evolves from reading and responding to end-to-end simulation of the connected operation.",
   futureItems:[["Operation simulation","impact scenarios before the problem explodes"],["Line + PLC + sensors","physical telemetry connected to the project context"],["Servers + infrastructure","IT operation entering the same decision picture"],["WCS Velox on the same model","real digital twin of execution and software"]],
   openRoadmap:"Open roadmap view"},
};
function Commissioning({fault,setFault,alerts,setAlerts,setActive,notify,lang="pt"}) {
  const t=COMMISSIONING_I18N[lang]||COMMISSIONING_I18N.pt;
  const inject=()=>{setFault(true);if(!alerts.some(a=>a.id===initialAlert.id))setAlerts([initialAlert,...alerts]);notify(t.injectToast)};
  const clear=()=>{setFault(false);notify(t.clearToast)};
  return <section className="page commissioning-page"><div className="commission-grid"><article className="twin-panel"><div className="panel-title"><div><b>{t.twinTitle}</b><span>{t.twinLine}</span></div><span className={fault?"state fault":"state"}><Radio size={16} weight="fill"/>{fault?t.faultDetected:t.normalOp}</span></div>
    <div className="twin-stage"><img src={assetPath("conveyor-twin.png")} alt="Esteira de expedição com scanner, motor, sensor e grade de segurança"/>
      <SensorTag className="plc" icon={Cpu} title="PLC" detail="Último scan: 10:24:18"/><SensorTag className="scanner" icon={Barcode} title="Scanner de código" detail="Leitura: 10:24:17"/>
      <SensorTag className="motor" icon={Wrench} title="Motor" detail="Torque: 18,4 Nm"/><SensorTag className="sensor" icon={Eye} title="Sensor X" status={fault?"FALHA":"OK"} fault={fault} detail={fault?"0,00 mA · 10:23:56":"18,7 mA"}/>
      <SensorTag className="gate" icon={ShieldCheck} title="Safety Gate" detail="Estado: fechado"/>
    </div><div className="line-stats"><span><b>1,25 m/s</b><small>{t.lineSpeed}</small></span><span><b>8.432 un.</b><small>{t.volumeToday}</small></span><span><b>97,6%</b><small>{t.availability}</small></span></div></article>
    <aside className="incident-column"><div className={`incident ${fault?"active":"resolved"}`}><span className="incident-pill">{fault?t.activeIncident:t.normalOpUpper}</span><h2>{fault?t.p0Created:t.sensorNormalized}</h2><p>{fault?t.faultBody:t.clearBody}</p>
      <dl><div><dt>{t.project}</dt><dd>TITANO</dd></div><div><dt>{t.priority}</dt><dd className="danger">{fault?"P0 · CRÍTICO":"—"}</dd></div><div><dt>{t.owner}</dt><dd>Rodrigo Baruco</dd></div><div><dt>{t.sla}</dt><dd className="timer">{fault?"07:35:42":t.closed}</dd></div><div><dt>{t.source}</dt><dd>IoT / CLP</dd></div></dl>
      <button className={fault?"danger-button":"primary"} onClick={fault?clear:inject}>{fault?<><ArrowCounterClockwise/>{t.normalizeSensor}</>:<><Lightning/>{t.simulateFault}</>}</button></div>
      <div className="telemetry"><div className="panel-title"><b>{t.evidence}</b><span>{t.telemetry}</span></div><div className="telemetry-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={fault?telemetryData:telemetryData.map(x=>({...x,v:18}))}><defs><linearGradient id="redArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fb5470" stopOpacity={.45}/><stop offset="100%" stopColor="#fb5470" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#19253a" vertical={false}/><XAxis dataKey="t" tick={{fontSize:10}} stroke="#65728a"/><YAxis domain={[0,24]} tick={{fontSize:10}} stroke="#65728a"/><Area type="monotone" dataKey="v" stroke="#fb5470" fill="url(#redArea)" strokeWidth={3} isAnimationActive={false}/></AreaChart></ResponsiveContainer></div><button className="ghost" onClick={()=>setActive("evidence")}>{t.seeAllEvidence}<ArrowRight/></button></div>
      <div className="future-vision-card">
        <div className="future-vision-head">
          <small>{t.futureTag}</small>
          <span>VISION</span>
        </div>
        <h3>{t.futureTitle}</h3>
        <p>{t.futureBody}</p>
        <ul className="future-vision-list">
          {t.futureItems.map(([title,note],i)=><li key={title}>{[<Sparkle key="i0" size={16}/>,<Cpu key="i1" size={16}/>,<CloudCheck key="i2" size={16}/>,<Circuitry key="i3" size={16}/>][i]}<span><b>{title}</b><small>{note}</small></span></li>)}
        </ul>
        <button className="ghost" onClick={()=>setActive("lifecycle")}>{t.openRoadmap}<ArrowRight/></button>
      </div>
    </aside></div></section>;
}

function EvidenceItem({icon:Icon,label,value,ok=true}) { return <li><Icon size={18}/><span>{label}</span><b className={ok?"ok":"warn"}>{value}</b></li>; }

const DECISION_ROOM_I18N={
  pt:{toolbarTitle:"Linha do tempo de dependências e capacidade",toolbarSub:"Projetos selecionados e equipe compartilhada",dateWindow:"Jul — Set 2026",windowToast:"Janela de decisão fixada em julho–setembro de 2026.",
   months:["JUL 2026","AGO 2026","SET 2026"],devIntegrations:"Desenvolvimento & Integrações",delayTitano:"Atraso previsto 12 dias",delayQueluz:"Atraso em cascata 8 dias",team:"Equipe PLC",sharedTeam:"Equipe compartilhada",
   evidenceTitle:"Evidências que explicam o cenário",evidenceSub:"Progresso real reportado até 11/07/2026",infra:"Infra",dev:"Dev",commissioning:"Comissionamento",validCommits:"commits válidos",tests:"testes",plannedAlloc:"Alocação planejada",projectedAlloc:"Alocação projetada",overtime:"Horas extras",
   recTitle:"Recomendação",recSub:"Ação com melhor impacto no prazo do portfólio.",recBody:"Repriorizar a Equipe PLC após 20/07 para antecipar o comissionamento do TITANO.",delayReduceTitano:"no atraso do TITANO",delayReduceQueluz:"no atraso do QUELUZ",compareScenarios:"Comparar cenários"},
  es:{toolbarTitle:"Línea de tiempo de dependencias y capacidad",toolbarSub:"Proyectos seleccionados y equipo compartido",dateWindow:"Jul — Sep 2026",windowToast:"Ventana de decisión fijada entre julio y septiembre de 2026.",
   months:["JUL 2026","AGO 2026","SEP 2026"],devIntegrations:"Desarrollo e Integraciones",delayTitano:"Atraso previsto de 12 días",delayQueluz:"Atraso en cascada de 8 días",team:"Equipo PLC",sharedTeam:"Equipo compartido",
   evidenceTitle:"Evidencias que explican el escenario",evidenceSub:"Progreso real reportado hasta el 11/07/2026",infra:"Infra",dev:"Dev",commissioning:"Comisionamiento",validCommits:"commits válidos",tests:"pruebas",plannedAlloc:"Asignación planificada",projectedAlloc:"Asignación proyectada",overtime:"Horas extra",
   recTitle:"Recomendación",recSub:"Acción con mejor impacto en el plazo del portafolio.",recBody:"Repriorizar el Equipo PLC después del 20/07 para anticipar el comisionamiento de TITANO.",delayReduceTitano:"en el atraso de TITANO",delayReduceQueluz:"en el atraso de QUELUZ",compareScenarios:"Comparar escenarios"},
  en:{toolbarTitle:"Dependency and capacity timeline",toolbarSub:"Selected projects and shared team",dateWindow:"Jul — Sep 2026",windowToast:"Decision window fixed between July and September 2026.",
   months:["JUL 2026","AUG 2026","SEP 2026"],devIntegrations:"Development & Integrations",delayTitano:"12-day forecasted delay",delayQueluz:"8-day cascading delay",team:"PLC Team",sharedTeam:"Shared team",
   evidenceTitle:"Evidence explaining the scenario",evidenceSub:"Real progress reported through 07/11/2026",infra:"Infra",dev:"Dev",commissioning:"Commissioning",validCommits:"valid commits",tests:"tests",plannedAlloc:"Planned allocation",projectedAlloc:"Projected allocation",overtime:"Overtime",
   recTitle:"Recommendation",recSub:"Action with the best impact on the portfolio schedule.",recBody:"Reprioritize the PLC Team after 07/20 to anticipate TITANO's commissioning.",delayReduceTitano:"in TITANO's delay",delayReduceQueluz:"in QUELUZ's delay",compareScenarios:"Compare scenarios"},
};
function DecisionRoom({setActive,notify,lang="pt"}){
  const t=DECISION_ROOM_I18N[lang]||DECISION_ROOM_I18N.pt;
  return <section className="page decision-page"><div className="decision-toolbar"><div><b>{t.toolbarTitle}</b><span>{t.toolbarSub}</span></div><button className="ghost" onClick={()=>notify(t.windowToast)}><CalendarBlank/>{t.dateWindow}<CaretDown/></button></div>
  <div className="timeline"><div className="months"><span>{t.months[0]}</span><span>{t.months[1]}</span><span>{t.months[2]}</span></div><div className="project-row"><header><b>TITANO</b><span>Go Live: 20/07/2026</span></header><div className="track"><i className="bar titano">{t.devIntegrations}</i><i className="risk-marker">{t.delayTitano}</i></div></div><div className="project-row"><header><b>QUELUZ</b><span>Go Live: 30/07/2026</span></header><div className="track"><i className="bar queluz">{t.devIntegrations}</i><i className="risk-marker second">{t.delayQueluz}</i></div></div><div className="capacity-row"><header><UsersThree/><b>{t.team}</b><span>{t.sharedTeam}</span></header><div><CapacityChart compact/></div></div></div>
  <div className="evidence-decision"><article><div className="section-heading"><b>{t.evidenceTitle}</b><span>{t.evidenceSub}</span></div><div className="evidence-columns"><div><h3>TITANO</h3><ul><EvidenceItem icon={CheckSquare} label={t.infra} value="4/5 checklists"/><EvidenceItem icon={GitCommit} label={t.dev} value={`12 ${t.validCommits}`}/><EvidenceItem icon={TestTube} label={t.commissioning} value={`18/20 ${t.tests}`}/></ul></div><div><h3>QUELUZ</h3><ul><EvidenceItem icon={CheckSquare} label={t.infra} value="5/5 checklists"/><EvidenceItem icon={GitCommit} label={t.dev} value={`9 ${t.validCommits}`}/><EvidenceItem icon={TestTube} label={t.commissioning} value={`10/20 ${t.tests}`} ok={false}/></ul></div><div><h3>{t.team}</h3><ul><EvidenceItem icon={UsersThree} label={t.plannedAlloc} value="92%"/><EvidenceItem icon={ChartLineUp} label={t.projectedAlloc} value="117%" ok={false}/><EvidenceItem icon={Timer} label={t.overtime} value="+128 h" ok={false}/></ul></div></div></article>
    <article className="decision-rec"><div className="section-heading"><b>{t.recTitle}</b><span>{t.recSub}</span></div><div><Lightning size={26} weight="fill"/><h3>{t.recBody}</h3><span><b>-6 {lang==="en"?"days":"dias"}</b> {t.delayReduceTitano}</span><span><b>-4 {lang==="en"?"days":"dias"}</b> {t.delayReduceQueluz}</span></div><button className="primary" onClick={()=>setActive("simulator")}>{t.compareScenarios}</button></article></div>
  </section>; }

function StatusBadge({status}) { return <span className={`status-badge status-${status.toLowerCase().replaceAll(" ","-")}`}>{status}</span>; }
function RiskBadge({risk}) { return <span className={`risk-badge risk-${risk.toLowerCase()}`}><i/>{risk}</span>; }

const PORTFOLIO_I18N={
  pt:{all:"Todos",statusLabels:{"Em andamento":"Em andamento",Bloqueado:"Bloqueado",Concluído:"Concluído"},riskLabels:{Baixo:"Baixo",Médio:"Médio",Alto:"Alto"},
   kpiPortfolio:"CARTEIRA OPERACIONAL",kpiPortfolioNote:"Base operacional priorizada",kpiHealth:"SAÚDE MÉDIA",kpiHealthNote:"2 projetos pedem ação",kpiRisk:"RISCO ALTO",kpiRiskNote:"Market Peru e Navepark",kpiMilestones:"PRÓXIMOS 30 DIAS",kpiMilestonesNote:"2 Go Lives confirmados",projectsSuffix:"projetos",milestonesValue:"4 marcos",riskValue:"2 projetos",
   title:"Portfólio operacional",subtitle:"Da estratégia à atividade: cada número abre a evidência que o sustenta.",kanban:"Kanban",list:"Lista",importKickoff:"Importar kickoff",importTitle:"Importa um Nexus_Kickoff_*.json — o projeto nasce com as pendências distribuídas pelas áreas",importAria:"Importar kickoff do Nexus",newProject:"Novo projeto",
   searchAria:"Buscar projeto",searchPlaceholder:"Buscar projeto, cliente ou código",
   phase:"FASE",nextMilestone:"PRÓXIMO MARCO",noneInStage:"Nenhum projeto nesta etapa.",evidenceTooltip:p=>`${p}% calculado por evidências técnicas verificadas.`,
   colProject:"Projeto",colPhase:"Fase atual",colProgress:"Progresso",colRisk:"Risco",colNext:"Próximo marco",colOwner:"Responsável",noneFound:"Nenhum projeto encontrado.",progressTooltip:p=>`${p}% = 35% entregáveis + 25% checklists + 20% commits válidos + 20% testes aprovados.`,
   capacityTitle:"Capacidade das equipes",capacitySubtitle:"Carga projetada para os próximos 90 dias.",attentionTitle:"Fila de atenção",attentionSubtitle:"Onde a governança deve agir primeiro.",
   attentionItems:[["MARKET PERU","3 dependências externas sem data confirmada","Escalar hoje"],["NAVEPARK","Ambiente HML compromete o marco de agosto","Definir dono"]],
   importModalTitle:name=>`Importar kickoff · ${name}`,importModalSub:(p)=>`${p.code} · Go Live ${p.golive} · kickoff ${p.totalPct}% preenchido no Nexus`,close:"Fechar",pendingWillDistribute:n=>`${n} pendências serão distribuídas:`,
   importNote:"Prévia — nada é aplicado antes de confirmar. Cada pendência aparece na Operação Assistida da área responsável.",cancel:"Cancelar",confirmImport:"Confirmar import",
   newProjectTitle:"Novo projeto",newProjectSub:"Crie a estrutura mínima. Fases e atividades entram em seguida.",projectName:"Nome do projeto",projectNamePlaceholder:"Ex.: EXPANSÃO CD SUL",client:"Cliente",clientPlaceholder:"Empresa ou unidade",owner:"Responsável",createProject:"Criar projeto",
   dupToast:(name,code)=>`${name} (${code}) já está no portfólio — nada foi duplicado.`,invalidFile:"Arquivo inválido — esperado um Nexus_Kickoff_*.json gerado pelo Nexus.",
   importToast:(name,count,areas)=>`${name} importado: ${count} pendências distribuídas para ${areas} áreas. Veja em Operação Assistida.`,createToast:name=>`Projeto ${name} criado no portfólio.`},
  es:{all:"Todos",statusLabels:{"Em andamento":"En curso",Bloqueado:"Bloqueado",Concluído:"Concluido"},riskLabels:{Baixo:"Bajo",Médio:"Medio",Alto:"Alto"},
   kpiPortfolio:"CARTERA OPERATIVA",kpiPortfolioNote:"Base operativa priorizada",kpiHealth:"SALUD PROMEDIO",kpiHealthNote:"2 proyectos requieren acción",kpiRisk:"RIESGO ALTO",kpiRiskNote:"Market Peru y Navepark",kpiMilestones:"PRÓXIMOS 30 DÍAS",kpiMilestonesNote:"2 Go Lives confirmados",projectsSuffix:"proyectos",milestonesValue:"4 hitos",riskValue:"2 proyectos",
   title:"Portafolio operativo",subtitle:"De la estrategia a la actividad: cada número abre la evidencia que lo sustenta.",kanban:"Kanban",list:"Lista",importKickoff:"Importar kickoff",importTitle:"Importa un Nexus_Kickoff_*.json — el proyecto nace con las pendientes distribuidas por área",importAria:"Importar kickoff de Nexus",newProject:"Nuevo proyecto",
   searchAria:"Buscar proyecto",searchPlaceholder:"Buscar proyecto, cliente o código",
   phase:"FASE",nextMilestone:"PRÓXIMO HITO",noneInStage:"Ningún proyecto en esta etapa.",evidenceTooltip:p=>`${p}% calculado por evidencia técnica verificada.`,
   colProject:"Proyecto",colPhase:"Fase actual",colProgress:"Progreso",colRisk:"Riesgo",colNext:"Próximo hito",colOwner:"Responsable",noneFound:"Ningún proyecto encontrado.",progressTooltip:p=>`${p}% = 35% entregables + 25% checklists + 20% commits válidos + 20% pruebas aprobadas.`,
   capacityTitle:"Capacidad de los equipos",capacitySubtitle:"Carga proyectada para los próximos 90 días.",attentionTitle:"Fila de atención",attentionSubtitle:"Dónde debe actuar primero la gobernanza.",
   attentionItems:[["MARKET PERU","3 dependencias externas sin fecha confirmada","Escalar hoy"],["NAVEPARK","El ambiente HML compromete el hito de agosto","Definir dueño"]],
   importModalTitle:name=>`Importar kickoff · ${name}`,importModalSub:(p)=>`${p.code} · Go Live ${p.golive} · kickoff ${p.totalPct}% completado en Nexus`,close:"Cerrar",pendingWillDistribute:n=>`Se distribuirán ${n} pendientes:`,
   importNote:"Vista previa — nada se aplica antes de confirmar. Cada pendiente aparece en la Operación Asistida del área responsable.",cancel:"Cancelar",confirmImport:"Confirmar importación",
   newProjectTitle:"Nuevo proyecto",newProjectSub:"Crea la estructura mínima. Las fases y actividades entran después.",projectName:"Nombre del proyecto",projectNamePlaceholder:"Ej.: EXPANSIÓN CD SUR",client:"Cliente",clientPlaceholder:"Empresa o unidad",owner:"Responsable",createProject:"Crear proyecto",
   dupToast:(name,code)=>`${name} (${code}) ya está en el portafolio — nada se duplicó.`,invalidFile:"Archivo inválido — se esperaba un Nexus_Kickoff_*.json generado por Nexus.",
   importToast:(name,count,areas)=>`${name} importado: ${count} pendientes distribuidas a ${areas} áreas. Consulta en Operación Asistida.`,createToast:name=>`Proyecto ${name} creado en el portafolio.`},
  en:{all:"All",statusLabels:{"Em andamento":"In progress",Bloqueado:"Blocked",Concluído:"Done"},riskLabels:{Baixo:"Low",Médio:"Medium",Alto:"High"},
   kpiPortfolio:"OPERATIONAL PORTFOLIO",kpiPortfolioNote:"Prioritized operational base",kpiHealth:"AVERAGE HEALTH",kpiHealthNote:"2 projects need action",kpiRisk:"HIGH RISK",kpiRiskNote:"Market Peru and Navepark",kpiMilestones:"NEXT 30 DAYS",kpiMilestonesNote:"2 Go Lives confirmed",projectsSuffix:"projects",milestonesValue:"4 milestones",riskValue:"2 projects",
   title:"Operational portfolio",subtitle:"From strategy to activity: every number opens the evidence behind it.",kanban:"Kanban",list:"List",importKickoff:"Import kickoff",importTitle:"Imports a Nexus_Kickoff_*.json — the project is born with pending items distributed across areas",importAria:"Import kickoff from Nexus",newProject:"New project",
   searchAria:"Search project",searchPlaceholder:"Search project, client or code",
   phase:"PHASE",nextMilestone:"NEXT MILESTONE",noneInStage:"No project in this stage.",evidenceTooltip:p=>`${p}% calculated from verified technical evidence.`,
   colProject:"Project",colPhase:"Current phase",colProgress:"Progress",colRisk:"Risk",colNext:"Next milestone",colOwner:"Owner",noneFound:"No project found.",progressTooltip:p=>`${p}% = 35% deliverables + 25% checklists + 20% valid commits + 20% approved tests.`,
   capacityTitle:"Team capacity",capacitySubtitle:"Projected load for the next 90 days.",attentionTitle:"Attention queue",attentionSubtitle:"Where governance should act first.",
   attentionItems:[["MARKET PERU","3 external dependencies with no confirmed date","Escalate today"],["NAVEPARK","HML environment jeopardizes the August milestone","Assign owner"]],
   importModalTitle:name=>`Import kickoff · ${name}`,importModalSub:(p)=>`${p.code} · Go Live ${p.golive} · kickoff ${p.totalPct}% filled in Nexus`,close:"Close",pendingWillDistribute:n=>`${n} pending items will be distributed:`,
   importNote:"Preview — nothing is applied before confirming. Each pending item appears in the responsible area's Assisted Operation.",cancel:"Cancel",confirmImport:"Confirm import",
   newProjectTitle:"New project",newProjectSub:"Create the minimal structure. Phases and activities follow.",projectName:"Project name",projectNamePlaceholder:"E.g.: SOUTH DC EXPANSION",client:"Client",clientPlaceholder:"Company or unit",owner:"Owner",createProject:"Create project",
   dupToast:(name,code)=>`${name} (${code}) is already in the portfolio — nothing was duplicated.`,invalidFile:"Invalid file — expected a Nexus_Kickoff_*.json generated by Nexus.",
   importToast:(name,count,areas)=>`${name} imported: ${count} pending items distributed to ${areas} areas. See Assisted Operation.`,createToast:name=>`Project ${name} created in the portfolio.`},
};
function PortfolioPage({projects,setProjects,setActive,setSelectedProject,setProjectModalOpen,setImportedDemands,notify,lang="pt"}) {
  const t=PORTFOLIO_I18N[lang]||PORTFOLIO_I18N.pt;
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("Todos");
  const [view,setView]=useState("kanban");
  const [creating,setCreating]=useState(false);
  const [preview,setPreview]=useState(null);
  const fileRef=useRef(null);
  const [draft,setDraft]=useState({name:"",client:"",owner:"Daiana Costa"});
  const handleFile=e=>{
    const file=e.target.files&&e.target.files[0]; e.target.value="";
    if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const data=JSON.parse(reader.result);
        if(!data||!data.meta||!data.meta.project||!data.sections||!data.progress)throw new Error("estrutura");
        const name=data.meta.project.trim();
        const code=((data.sections.ge&&data.sections.ge.g2)||"S/CÓDIGO").trim();
        if(projects.some(p=>p.code===code||p.name===name.toUpperCase())){notify(t.dupToast(name,code));return}
        const secs=Object.entries(data.progress).map(([k,v])=>({k,title:v.title,pct:v.pct,pend:Math.max(0,v.total-v.filled)}));
        const demands=[];
        for(const [k,fields] of Object.entries(data.sections)){
          if(typeof fields!=="object"||!fields)continue;
          for(const [f,val] of Object.entries(fields)){
            if(String(val).trim().toLowerCase()==="tbd"){
              const dept=SEC2DEPT[k]||"PM";
              const secTitle=(data.progress[k]&&data.progress[k].title)||k;
              demands.push({dept,project:name.toUpperCase(),title:IF_LABELS[f]||`${secTitle} — definição pendente (${f})`,to:"PM",due:"kickoff"});
            }
          }
        }
        const byDept={};demands.forEach(d=>{byDept[d.dept]=(byDept[d.dept]||0)+1});
        const golive=((data.sections.ge&&data.sections.ge.g_golive)||"").trim()||"a definir";
        setPreview({name,code,golive,totalPct:data.meta.total_pct,secs,demands,byDept,
          project:{name:name.toUpperCase(),code,client:((data.sections.ge&&data.sections.ge.g5)||"Cliente a definir").trim(),location:((data.sections.ge&&data.sections.ge.g3)||"Local a definir").trim().replace(/[-·]\s*$/,""),owner:"Daiana Costa",pm:"A definir",status:"Em andamento",risk:"Baixo",phase:1,progress:0,next:"Kickoff técnico",date:golive,health:75,blocker:"Sem bloqueio registrado.",nextAction:"Distribuir as pendências do kickoff pelas áreas responsáveis.",milestones:["Kickoff importado do Nexus · hoje",`Go Live · ${golive}`]}});
      }catch{notify(t.invalidFile)}
    };
    reader.readAsText(file);
  };
  const applyImport=()=>{
    setProjects([preview.project,...projects]);
    setImportedDemands(d=>[...d,...preview.demands]);
    notify(t.importToast(preview.name,preview.demands.length,Object.keys(preview.byDept).length));
    setPreview(null);
  };
  useEffect(()=>{if(!creating)return;const close=event=>event.key==="Escape"&&setCreating(false);document.addEventListener("keydown",close);return()=>document.removeEventListener("keydown",close)},[creating]);
  const shown=projects.filter(p=>(filter==="Todos"||p.status===filter||p.risk===filter)&&`${p.name} ${p.client} ${p.code}`.toLowerCase().includes(search.toLowerCase()));
  const openProject=(project)=>{setSelectedProject(project);setProjectModalOpen(true)};
  const createProject=(event)=>{event.preventDefault();const name=draft.name.trim().toUpperCase();if(!name)return;const project={name,code:`I26.${String(projects.length+4100)}`,client:draft.client.trim()||"Cliente a definir",location:"Local a definir",owner:draft.owner,pm:"A definir",status:"Em andamento",risk:"Baixo",phase:1,progress:0,next:"Kickoff",date:"A definir",health:75,blocker:"Sem bloqueio registrado.",nextAction:"Definir escopo, responsáveis e data do kickoff.",milestones:["Kickoff · A definir","Baseline · A definir","Go Live · A definir"]};setProjects([project,...projects]);setCreating(false);setDraft({name:"",client:"",owner:"Daiana Costa"});notify(t.createToast(name))};
  return <section className="page portfolio-page">
    <div className="portfolio-kpis">
      <article><FolderOpen/><span><small>{t.kpiPortfolio}</small><b>{projects.length} {t.projectsSuffix}</b><em>{t.kpiPortfolioNote}</em></span></article>
      <article><TrendUp/><span><small>{t.kpiHealth}</small><b>68/100</b><em>{t.kpiHealthNote}</em></span></article>
      <article><Warning/><span><small>{t.kpiRisk}</small><b>{t.riskValue}</b><em>{t.kpiRiskNote}</em></span></article>
      <article><FlagCheckered/><span><small>{t.kpiMilestones}</small><b>{t.milestonesValue}</b><em>{t.kpiMilestonesNote}</em></span></article>
    </div>
    <div className="portfolio-toolbar"><div><h2>{t.title}</h2><p>{t.subtitle}</p></div><div className="portfolio-view-actions"><span><button className={view==="kanban"?"active":""} onClick={()=>setView("kanban")}><SquaresFour/>{t.kanban}</button><button className={view==="table"?"active":""} onClick={()=>setView("table")}><Rows/>{t.list}</button></span><button className="ghost" onClick={()=>fileRef.current&&fileRef.current.click()} title={t.importTitle}><UploadSimple/>{t.importKickoff}</button><input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={handleFile} aria-label={t.importAria}/><button className="primary" onClick={()=>setCreating(true)}><Plus/>{t.newProject}</button></div></div>
    <div className="portfolio-filters"><label><MagnifyingGlass/><input aria-label={t.searchAria} value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.searchPlaceholder}/></label><Funnel/>{["Todos","Em andamento","Bloqueado","Alto"].map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{x==="Todos"?t.all:t.statusLabels[x]||t.riskLabels[x]||x}</button>)}</div>
    {view==="kanban"?<div className="portfolio-kanban">{[["Em andamento",shown.filter(p=>p.status==="Em andamento")],["Bloqueado",shown.filter(p=>p.status==="Bloqueado")],["Concluído",shown.filter(p=>p.status==="Concluído")]].map(([status,items])=><section key={status}><header><span><i className={`kanban-dot ${status.toLowerCase().replaceAll(" ","-")}`}/><b>{t.statusLabels[status]||status}</b></span><em>{items.length}</em></header><div>{items.map(p=><button key={p.name} onClick={()=>openProject(p)} aria-label={`Abrir projeto ${p.name}`}><span className="kanban-card-top"><small>{p.code}</small><RiskBadge risk={p.risk}/></span><h3>{p.name}</h3><p>{p.client} · {p.location}</p><span className="kanban-phase"><small>{t.phase} {p.phase}/7</small><b>{phaseNames[p.phase-1]}</b></span><span className="kanban-progress evidence-tooltip" tabIndex="0" data-tooltip={t.evidenceTooltip(p.progress)}><i><em style={{width:`${p.progress}%`}}/></i><b>{p.progress}%</b></span><footer><span className="avatar">{p.owner[0]}</span><span><small>{t.nextMilestone}</small><b>{p.next} · {p.date}</b></span><ArrowRight/></footer></button>)}</div>{!items.length?<p className="kanban-empty">{t.noneInStage}</p>:null}</section>)}</div>:null}
    {view==="table"?<div className="portfolio-table"><header><span>{t.colProject}</span><span>{t.colPhase}</span><span>{t.colProgress}</span><span>{t.colRisk}</span><span>{t.colNext}</span><span>{t.colOwner}</span><span/></header>
      {shown.map(p=><button key={p.name} className="portfolio-row" onClick={()=>openProject(p)} aria-label={`Abrir projeto ${p.name}`}>
        <span className="project-identity"><b>{p.name}</b><small>{p.code} · {p.client}</small></span><span><StatusBadge status={p.status}/><small>{phaseNames[p.phase-1]}</small></span>
        <span className="portfolio-progress evidence-tooltip" tabIndex="0" data-tooltip={t.progressTooltip(p.progress)}><i><em style={{width:`${p.progress}%`}}/></i><b>{p.progress}%</b></span><RiskBadge risk={p.risk}/>
        <span><b>{p.next}</b><small>{p.date}</small></span><span><b>{p.owner}</b><small>PM {p.pm}</small></span><ArrowRight/>
      </button>)}
      {!shown.length?<div className="empty"><MagnifyingGlass size={32}/>{t.noneFound}</div>:null}
    </div>:null}
    <div className="portfolio-bottom"><article><div className="section-heading"><b>{t.capacityTitle}</b><span>{t.capacitySubtitle}</span></div><CapacityChart compact/></article><article className="attention-list"><div className="section-heading"><b>{t.attentionTitle}</b><span>{t.attentionSubtitle}</span></div>{t.attentionItems.map(([name,note,action],i)=><div key={name}><strong>{String(i+1).padStart(2,"0")}</strong><span><b>{name}</b><small>{note}</small></span><em>{action}</em></div>)}</article></div>
    {preview?<div className="modal-layer" role="presentation" onMouseDown={e=>e.target===e.currentTarget&&setPreview(null)}><div className="project-modal import-preview" role="dialog" aria-modal="true" aria-labelledby="imp-title">
      <div><span className="project-symbol">⇪</span><div><h2 id="imp-title">{t.importModalTitle(preview.name)}</h2><p>{t.importModalSub(preview)}</p></div><button type="button" aria-label={t.close} onClick={()=>setPreview(null)}><XCircle/></button></div>
      <div className="imp-depts"><b>{t.pendingWillDistribute(preview.demands.length)}</b><div>{Object.entries(preview.byDept).map(([d,n])=><span key={d}><b>{d}</b>{n}</span>)}</div></div>
      <div className="imp-secs">{preview.secs.map(s=><div key={s.k}><span>{s.title}</span><i><em style={{width:`${s.pct}%`}}/></i><small>{s.pct}%{s.pend?` · ${s.pend} pend.`:""}</small></div>)}</div>
      <p className="imp-note">{t.importNote}</p>
      <div className="modal-actions"><button type="button" className="ghost" onClick={()=>setPreview(null)}>{t.cancel}</button><button className="primary" type="button" onClick={applyImport}><UploadSimple/>{t.confirmImport}</button></div>
    </div></div>:null}
    {creating?<div className="modal-layer" role="presentation" onMouseDown={e=>e.target===e.currentTarget&&setCreating(false)}><form className="project-modal" role="dialog" aria-modal="true" aria-labelledby="new-project-title" onSubmit={createProject}><div><span className="project-symbol">NP</span><div><h2 id="new-project-title">{t.newProjectTitle}</h2><p>{t.newProjectSub}</p></div><button type="button" aria-label={t.close} onClick={()=>setCreating(false)}><XCircle/></button></div><label>{t.projectName}<input autoFocus value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})} placeholder={t.projectNamePlaceholder} required/></label><label>{t.client}<input value={draft.client} onChange={e=>setDraft({...draft,client:e.target.value})} placeholder={t.clientPlaceholder}/></label><label>{t.owner}<select value={draft.owner} onChange={e=>setDraft({...draft,owner:e.target.value})}><option>Daiana Costa</option><option>Rodrigo Baruco</option><option>Admin</option></select></label><div className="modal-actions"><button type="button" className="ghost" onClick={()=>setCreating(false)}>{t.cancel}</button><button className="primary" type="submit"><Plus/>{t.createProject}</button></div></form></div>:null}
  </section>;
}

const PROJECT_WORKSPACE_I18N={
  pt:{backToPortfolio:"Voltar ao portfólio",genStatusReport:"Gerar Status Report",owner:"RESPONSÁVEL",
   health:"SAÚDE DO PROJETO",progressWithEvidence:"PROGRESSO COM EVIDÊNCIA",progressTooltip:"73% calculado por entregáveis aceitos, 4/5 checklists, 12 commits válidos e 18/20 testes aprovados.",nextMilestone:"PRÓXIMO MARCO",workPlan:"PLANO DE TRABALHO",activitiesDone:"atividades concluídas",
   tabs:[["overview","Visão geral"],["activities","Plano de trabalho"],["risks","Marcos & riscos"]],
   journeyTitle:"Jornada do projeto",journeySub:"Fases e gates de governança.",gateApproved:"Gate aprovado",currentPhase:"Fase atual",toStart:"A iniciar",
   nextActionTitle:"Próxima ação",nextActionSub:"A cobrança que move o projeto.",owner2:"Dono",due:"Prazo",criticality:"Criticidade",registerFollowUp:"Registrar cobrança",followUpToast:owner=>`Cobrança registrada para ${owner}.`,
   evidenceTitle:"Evidências de execução",evidenceSub:"O progresso só avança quando existe entrega verificável.",infraChecklists:"checklists de infraestrutura",baseCommits:"commits em base homologada",approvedTests:"testes aprovados",acceptedDocs:"documentos aceitos",
   milestonesTitle:"Marcos principais",milestonesSub:"Datas que dirigem as decisões.",dateToConfirm:"Data a confirmar",
   docsTitle:"Documentos do projeto",docsSub:"Os arquivos oficiais vivem no SharePoint — cofre único da empresa.",spPageTitle:"Página do projeto no SharePoint",spPageNote:"specs, atas, evidências e anexos compartilhados entre os times",openSharePoint:"Abrir no SharePoint ↗",spNote:"Acesso com a conta corporativa M365 · upload direto pelo InventOps chega na Era 3 do roadmap.",
   workplanTitle:"Plano de trabalho integrado",workplanSub:"Atividades, responsáveis, prazos e evidências.",newActivity:"Nova atividade",newActivityToast:"Nova atividade adicionada ao plano do projeto.",
   colActivity:"Atividade",colPhase:"Fase",colOwner:"Responsável",colDue:"Prazo",colEvidence:"Evidência",colStatus:"Status",addedNow:"Adicionada agora",statusOptions:["Não iniciado","Em andamento","Aguardando","Concluído"],
   currentBlocker:"Bloqueador atual",monitoredSituation:"Situação monitorada",blockerBody:"Problema materializado que exige correção.",noImpediment:"Nenhum impedimento crítico registrado.",
   strategy:"Estratégia",mitigate:"Mitigar",monitor:"Monitorar",review:"Revisão",daily:"Diária",weekly:"Semanal",updatePlan:"Atualizar plano de resposta",registerRisk:"Registrar novo risco",updatePlanToast:"Plano de resposta atualizado e responsável notificado.",registerRiskToast:"Novo risco registrado para acompanhamento.",
   decisionsTitle:"Marcos e decisões",decisionsSub:"Linha do tempo contratual e operacional.",attachedEvidence:"Evidência anexada",monitoredDeps:"Dependências monitoradas",registerDecision:"Registrar decisão",decisionToast:"Decisão registrada na linha do tempo do projeto."},
  es:{backToPortfolio:"Volver al portafolio",genStatusReport:"Generar Status Report",owner:"RESPONSABLE",
   health:"SALUD DEL PROYECTO",progressWithEvidence:"PROGRESO CON EVIDENCIA",progressTooltip:"73% calculado por entregables aceptados, 4/5 checklists, 12 commits válidos y 18/20 pruebas aprobadas.",nextMilestone:"PRÓXIMO HITO",workPlan:"PLAN DE TRABAJO",activitiesDone:"actividades concluidas",
   tabs:[["overview","Visión general"],["activities","Plan de trabajo"],["risks","Hitos y riesgos"]],
   journeyTitle:"Recorrido del proyecto",journeySub:"Fases y gates de gobernanza.",gateApproved:"Gate aprobado",currentPhase:"Fase actual",toStart:"Por iniciar",
   nextActionTitle:"Próxima acción",nextActionSub:"El reclamo que mueve el proyecto.",owner2:"Dueño",due:"Plazo",criticality:"Criticidad",registerFollowUp:"Registrar reclamo",followUpToast:owner=>`Reclamo registrado para ${owner}.`,
   evidenceTitle:"Evidencias de ejecución",evidenceSub:"El progreso solo avanza cuando existe una entrega verificable.",infraChecklists:"checklists de infraestructura",baseCommits:"commits en base homologada",approvedTests:"pruebas aprobadas",acceptedDocs:"documentos aceptados",
   milestonesTitle:"Hitos principales",milestonesSub:"Fechas que dirigen las decisiones.",dateToConfirm:"Fecha por confirmar",
   docsTitle:"Documentos del proyecto",docsSub:"Los archivos oficiales viven en SharePoint — bóveda única de la empresa.",spPageTitle:"Página del proyecto en SharePoint",spPageNote:"specs, actas, evidencias y anexos compartidos entre los equipos",openSharePoint:"Abrir en SharePoint ↗",spNote:"Acceso con la cuenta corporativa M365 · la carga directa por InventOps llega en la Era 3 del roadmap.",
   workplanTitle:"Plan de trabajo integrado",workplanSub:"Actividades, responsables, plazos y evidencias.",newActivity:"Nueva actividad",newActivityToast:"Nueva actividad agregada al plan del proyecto.",
   colActivity:"Actividad",colPhase:"Fase",colOwner:"Responsable",colDue:"Plazo",colEvidence:"Evidencia",colStatus:"Estado",addedNow:"Agregada ahora",statusOptions:["No iniciado","En curso","Esperando","Concluido"],
   currentBlocker:"Bloqueador actual",monitoredSituation:"Situación monitoreada",blockerBody:"Problema materializado que exige corrección.",noImpediment:"Ningún impedimento crítico registrado.",
   strategy:"Estrategia",mitigate:"Mitigar",monitor:"Monitorear",review:"Revisión",daily:"Diaria",weekly:"Semanal",updatePlan:"Actualizar plan de respuesta",registerRisk:"Registrar nuevo riesgo",updatePlanToast:"Plan de respuesta actualizado y responsable notificado.",registerRiskToast:"Nuevo riesgo registrado para seguimiento.",
   decisionsTitle:"Hitos y decisiones",decisionsSub:"Línea de tiempo contractual y operativa.",attachedEvidence:"Evidencia adjunta",monitoredDeps:"Dependencias monitoreadas",registerDecision:"Registrar decisión",decisionToast:"Decisión registrada en la línea de tiempo del proyecto."},
  en:{backToPortfolio:"Back to portfolio",genStatusReport:"Generate Status Report",owner:"OWNER",
   health:"PROJECT HEALTH",progressWithEvidence:"PROGRESS WITH EVIDENCE",progressTooltip:"73% calculated from accepted deliverables, 4/5 checklists, 12 valid commits and 18/20 approved tests.",nextMilestone:"NEXT MILESTONE",workPlan:"WORK PLAN",activitiesDone:"activities completed",
   tabs:[["overview","Overview"],["activities","Work plan"],["risks","Milestones & risks"]],
   journeyTitle:"Project journey",journeySub:"Governance phases and gates.",gateApproved:"Gate approved",currentPhase:"Current phase",toStart:"To start",
   nextActionTitle:"Next action",nextActionSub:"The follow-up that moves the project.",owner2:"Owner",due:"Due",criticality:"Criticality",registerFollowUp:"Log follow-up",followUpToast:owner=>`Follow-up logged for ${owner}.`,
   evidenceTitle:"Execution evidence",evidenceSub:"Progress only advances when there's a verifiable delivery.",infraChecklists:"infrastructure checklists",baseCommits:"commits on homologated base",approvedTests:"approved tests",acceptedDocs:"accepted documents",
   milestonesTitle:"Key milestones",milestonesSub:"Dates that drive decisions.",dateToConfirm:"Date to confirm",
   docsTitle:"Project documents",docsSub:"Official files live in SharePoint — the company's single vault.",spPageTitle:"Project page on SharePoint",spPageNote:"specs, minutes, evidence and attachments shared across teams",openSharePoint:"Open in SharePoint ↗",spNote:"Access with the M365 corporate account · direct upload through InventOps arrives in Roadmap Era 3.",
   workplanTitle:"Integrated work plan",workplanSub:"Activities, owners, deadlines and evidence.",newActivity:"New activity",newActivityToast:"New activity added to the project plan.",
   colActivity:"Activity",colPhase:"Phase",colOwner:"Owner",colDue:"Due",colEvidence:"Evidence",colStatus:"Status",addedNow:"Added now",statusOptions:["Not started","In progress","Waiting","Done"],
   currentBlocker:"Current blocker",monitoredSituation:"Monitored situation",blockerBody:"Materialized problem that requires correction.",noImpediment:"No critical impediment registered.",
   strategy:"Strategy",mitigate:"Mitigate",monitor:"Monitor",review:"Review",daily:"Daily",weekly:"Weekly",updatePlan:"Update response plan",registerRisk:"Register new risk",updatePlanToast:"Response plan updated and owner notified.",registerRiskToast:"New risk logged for follow-up.",
   decisionsTitle:"Milestones and decisions",decisionsSub:"Contractual and operational timeline.",attachedEvidence:"Evidence attached",monitoredDeps:"Dependencies monitored",registerDecision:"Log decision",decisionToast:"Decision logged in the project timeline."},
};
function ProjectWorkspace({project,setActive,notify,lang="pt"}) {
  const t=PROJECT_WORKSPACE_I18N[lang]||PROJECT_WORKSPACE_I18N.pt;
  const [tab,setTab]=useState("overview");
  const [reportOpen,setReportOpen]=useState(false);
  const [activities,setActivities]=useState(()=>baseActivities.map((a,i)=>({...a,id:`${project.name}-${i}`})));
  const updateActivity=(id,status)=>setActivities(current=>current.map(a=>a.id===id?{...a,status}:a));
  const addActivity=()=>{if(activities.some(a=>a.new))return;setActivities([...activities,{id:`${project.name}-new`,name:"Revisar plano integrado com todas as áreas",phase:"Implantação",owner:"Daiana",due:"29 jul",status:"Não iniciado",evidence:"A definir",new:true}]);notify(t.newActivityToast)};
  const done=activities.filter(a=>a.status==="Concluído").length;
  const hasBlocker=!project.blocker.startsWith("Sem bloqueio");
  return <section className="page project-page">
    <div className="project-top-actions"><button className="back-button" onClick={()=>setActive("portfolio")}><ArrowLeft/>{t.backToPortfolio}</button><button className="ghost" onClick={()=>setReportOpen(true)}><ClipboardText/>{t.genStatusReport}</button></div>
    <div className="project-head"><div className="project-symbol">{project.name.slice(0,2)}</div><div><div className="project-title-line"><h2>{project.name}</h2><StatusBadge status={project.status}/><RiskBadge risk={project.risk}/></div><p>{project.code} · {project.client} · <MapPin/>{project.location}</p></div><div className="project-owner"><span className="avatar">D</span><span><small>{t.owner}</small><b>{project.owner}</b><em>PM {project.pm}</em></span></div></div>
    <div className="project-scorebar"><span><small>{t.health}</small><b>{project.health}/100</b><i><em style={{width:`${project.health}%`}}/></i></span><span className="evidence-tooltip" tabIndex="0" data-tooltip={t.progressTooltip}><small>{t.progressWithEvidence}</small><b>{project.progress}%</b><i><em style={{width:`${project.progress}%`}}/></i></span><span><small>{t.nextMilestone}</small><b>{project.next}</b><em>{project.date}</em></span><span><small>{t.workPlan}</small><b>{done}/{activities.length}</b><em>{t.activitiesDone}</em></span></div>
    <div className="project-tabs" role="tablist">{t.tabs.map(([id,label])=><button role="tab" aria-selected={tab===id} className={tab===id?"active":""} key={id} onClick={()=>setTab(id)}>{label}</button>)}</div>
    {tab==="overview"?<div className="project-overview">
      <article className="phase-card"><div className="section-heading"><b>{t.journeyTitle}</b><span>{t.journeySub}</span></div><div className="phase-rail">{phaseNames.map((name,i)=>{const state=i+1<project.phase?"done":i+1===project.phase?"current":"future";return <div className={state} key={name}><i>{state==="done"?<CheckCircle weight="fill"/>:i+1}</i><span><b>{name}</b><small>{state==="done"?t.gateApproved:state==="current"?t.currentPhase:t.toStart}</small></span></div>})}</div></article>
      <aside className="governance-card"><div className="section-heading"><b>{t.nextActionTitle}</b><span>{t.nextActionSub}</span></div><h3>{project.nextAction}</h3><dl><div><dt>{t.owner2}</dt><dd>{project.owner}</dd></div><div><dt>{t.due}</dt><dd>15 jul 2026</dd></div><div><dt>{t.criticality}</dt><dd><RiskBadge risk={project.risk}/></dd></div></dl><button className="primary" onClick={()=>notify(t.followUpToast(project.owner))}>{t.registerFollowUp}</button></aside>
      <article className="evidence-summary"><div className="section-heading"><b>{t.evidenceTitle}</b><span>{t.evidenceSub}</span></div><div><span><CheckSquare/><b>4/5</b><small>{t.infraChecklists}</small></span><span><GitCommit/><b>12</b><small>{t.baseCommits}</small></span><span><TestTube/><b>18/20</b><small>{t.approvedTests}</small></span><span><CloudCheck/><b>3</b><small>{t.acceptedDocs}</small></span></div></article>
      <article className="milestone-summary"><div className="section-heading"><b>{t.milestonesTitle}</b><span>{t.milestonesSub}</span></div>{project.milestones.map((m,i)=><div key={m}><i className={i===0?"active":""}/><span><b>{m.split(" · ")[0]}</b><small>{m.split(" · ")[1]||t.dateToConfirm}</small></span></div>)}</article>
      <article className="sharepoint-card"><div className="section-heading"><b>{t.docsTitle}</b><span>{t.docsSub}</span></div>
        <div className="sp-row"><span className="sp-ico">📁</span><div><b>{t.spPageTitle}</b><small>{project.code} · {t.spPageNote}</small></div>
        <a className="sp-open" href={sharePointUrl(project.code)} target="_blank" rel="noopener noreferrer">{t.openSharePoint}</a></div>
        <small className="sp-note">{t.spNote}</small></article>
    </div>:null}
    {tab==="activities"?<div className="workplan"><div className="workplan-head"><div><h3>{t.workplanTitle}</h3><p>{t.workplanSub}</p></div><button className="primary" onClick={addActivity}><Plus/>{t.newActivity}</button></div><div className="activity-table"><header><span>{t.colActivity}</span><span>{t.colPhase}</span><span>{t.colOwner}</span><span>{t.colDue}</span><span>{t.colEvidence}</span><span>{t.colStatus}</span></header>{activities.map(a=><div key={a.id}><span><b>{a.name}</b>{a.new?<small>{t.addedNow}</small>:null}</span><span>{a.phase}</span><span><User/>{a.owner}</span><span><CalendarBlank/>{a.due}</span><span><LinkSimple/>{a.evidence}</span><select aria-label={`Status de ${a.name}`} value={a.status} onChange={e=>updateActivity(a.id,e.target.value)}>{["Não iniciado","Em andamento","Aguardando","Concluído"].map((v,i)=><option key={v} value={v}>{t.statusOptions[i]}</option>)}</select></div>)}</div></div>:null}
    {tab==="risks"?<div className="risk-workspace"><article className={hasBlocker?"has-blocker":"clear-risk"}><div className="section-heading"><b>{hasBlocker?t.currentBlocker:t.monitoredSituation}</b><span>{hasBlocker?t.blockerBody:t.noImpediment}</span></div>{hasBlocker?<Warning size={30}/>:<ShieldCheck size={30}/>}<h3>{project.blocker}</h3><dl><div><dt>{t.strategy}</dt><dd>{hasBlocker?t.mitigate:t.monitor}</dd></div><div><dt>{t.owner2}</dt><dd>{project.owner}</dd></div><div><dt>{t.review}</dt><dd>{hasBlocker?t.daily:t.weekly}</dd></div></dl><button className={hasBlocker?"danger-button":"primary"} onClick={()=>notify(hasBlocker?t.updatePlanToast:t.registerRiskToast)}>{hasBlocker?t.updatePlan:t.registerRisk}</button></article><article><div className="section-heading"><b>{t.decisionsTitle}</b><span>{t.decisionsSub}</span></div><div className="decision-log">{project.milestones.map((m,i)=><div key={m}><i className={i===0?"active":""}/><span><b>{m}</b><small>{i===0?t.attachedEvidence:t.monitoredDeps}</small></span></div>)}</div><button className="ghost" onClick={()=>notify(t.decisionToast)}><Plus/>{t.registerDecision}</button></article></div>:null}
    {reportOpen?<StatusReportModal project={project} onClose={()=>setReportOpen(false)} notify={notify} lang={lang}/>:null}
  </section>;
}

const ALERTS_I18N={
  pt:{all:"Todos",p0Crit:"P0 crítico",p1High:"P1 alto risco",p2Att:"P2 atenção",lowestSla:"menor SLA",
   colAlert:"Alerta",colProject:"Projeto",colOwner:"Responsável",colSla:"SLA",colStatus:"Status",closed:"Encerrado",emptyState:"Nenhum alerta nesta etapa.",
   statusLabels:{"Em triagem":"Em triagem","Em ação":"Em ação",Resolvido:"Resolvido"}},
  es:{all:"Todos",p0Crit:"P0 crítico",p1High:"P1 alto riesgo",p2Att:"P2 atención",lowestSla:"menor SLA",
   colAlert:"Alerta",colProject:"Proyecto",colOwner:"Responsable",colSla:"SLA",colStatus:"Estado",closed:"Cerrado",emptyState:"Ninguna alerta en esta etapa.",
   statusLabels:{"Em triagem":"En triaje","Em ação":"En acción",Resolvido:"Resuelto"}},
  en:{all:"All",p0Crit:"P0 critical",p1High:"P1 high risk",p2Att:"P2 attention",lowestSla:"lowest SLA",
   colAlert:"Alert",colProject:"Project",colOwner:"Owner",colSla:"SLA",colStatus:"Status",closed:"Closed",emptyState:"No alerts in this stage.",
   statusLabels:{"Em triagem":"Triaging","Em ação":"In progress",Resolvido:"Resolved"}},
};
function AlertsPage({alerts,setAlerts,lang="pt"}) {
  const t=ALERTS_I18N[lang]||ALERTS_I18N.pt;
  const [filter,setFilter]=useState("Todos");
  const shown=filter==="Todos"?alerts:alerts.filter(a=>a.priority===filter||a.status===filter);
  const active=alerts.filter(a=>a.status!=="Resolvido");
  const filterLabel=x=>x==="Todos"?t.all:t.statusLabels[x]||x;
  return <section className="page list-page"><div className="summary-strip"><span><b>{active.filter(a=>a.priority==="P0").length}</b>{t.p0Crit}</span><span><b>{active.filter(a=>a.priority==="P1").length}</b>{t.p1High}</span><span><b>{active.filter(a=>a.priority==="P2").length}</b>{t.p2Att}</span><span><b>7h35</b>{t.lowestSla}</span></div><div className="filter-row">{["Todos","P0","P1","P2","Em triagem","Em ação","Resolvido"].map(x=><button className={filter===x?"active":""} onClick={()=>setFilter(x)} key={x}>{filterLabel(x)}</button>)}</div><div className="alert-table smart-triage"><header><span>{t.colAlert}</span><span>{t.colProject}</span><span>{t.colOwner}</span><span>{t.colSla}</span><span>{t.colStatus}</span></header>{shown.length?shown.map(a=><div className="alert-row" key={a.id}><span><i className={`alert-priority ${a.priority.toLowerCase()}`}>{a.priority}</i><b>{a.title}</b><small>{a.description}</small></span><span>{a.project}<small>{a.source}</small></span><span>{a.owner}</span><span className={a.status==="Resolvido"?"resolved-time":a.priority==="P0"?"timer":"triage-sla"}>{a.status==="Resolvido"?t.closed:a.priority==="P0"?"07:35:42":a.priority==="P1"?"23:18:10":"46:42:08"}</span><select aria-label={`Status do alerta ${a.id}`} value={a.status} onChange={e=>setAlerts(alerts.map(x=>x.id===a.id?{...x,status:e.target.value}:x))}><option value="Em triagem">{t.statusLabels["Em triagem"]}</option><option value="Em ação">{t.statusLabels["Em ação"]}</option><option value="Resolvido">{t.statusLabels.Resolvido}</option></select></div>):<div className="empty"><CheckCircle size={34}/>{t.emptyState}</div>}</div></section>; }

const EVIDENCE_I18N={
  pt:{tag:"FAROL DE PRODUTIVIDADE",title:"Progresso que explica a si mesmo",body:"O percentual combina entregáveis aceitos, checklists, atividade válida em base homologada e testes de comissionamento.",
   deliverables:"Entregáveis",checklists:"Checklists",commits:"Commits válidos",tests:"Testes aprovados",
   colProject:"Projeto",colProgress:"Progresso",colInfra:"Infra",colDev:"Dev",colCommissioning:"Comissionamento",colConfidence:"Confiança",
   checklistsUnit:"checklists",commitsUnit:"commits",testsUnit:"testes",high:"Alta",medium:"Média"},
  es:{tag:"FAROL DE PRODUCTIVIDAD",title:"Progreso que se explica a sí mismo",body:"El porcentaje combina entregables aceptados, checklists, actividad válida en base homologada y pruebas de comisionamiento.",
   deliverables:"Entregables",checklists:"Checklists",commits:"Commits válidos",tests:"Pruebas aprobadas",
   colProject:"Proyecto",colProgress:"Progreso",colInfra:"Infra",colDev:"Dev",colCommissioning:"Comisionamiento",colConfidence:"Confianza",
   checklistsUnit:"checklists",commitsUnit:"commits",testsUnit:"pruebas",high:"Alta",medium:"Media"},
  en:{tag:"PRODUCTIVITY BEACON",title:"Progress that explains itself",body:"The percentage combines accepted deliverables, checklists, valid activity on a homologated base and commissioning tests.",
   deliverables:"Deliverables",checklists:"Checklists",commits:"Valid commits",tests:"Approved tests",
   colProject:"Project",colProgress:"Progress",colInfra:"Infra",colDev:"Dev",colCommissioning:"Commissioning",colConfidence:"Confidence",
   checklistsUnit:"checklists",commitsUnit:"commits",testsUnit:"tests",high:"High",medium:"Medium"},
};
function EvidencePage({lang="pt"}={}){
  const t=EVIDENCE_I18N[lang]||EVIDENCE_I18N.pt;
  const rows=[{project:"TITANO",progress:73,infra:"4/5",dev:"12",tests:"18/20",confidence:"Alta"},{project:"QUELUZ",progress:68,infra:"5/5",dev:"9",tests:"10/20",confidence:"Média"},{project:"MARKET PERU",progress:42,infra:"3/5",dev:"6",tests:"4/20",confidence:"Média"}];
  const confidenceLabel=c=>c==="Alta"?t.high:c==="Média"?t.medium:c;
  return <section className="page evidence-page"><div className="evidence-hero"><div><small>{t.tag}</small><h2>{t.title}</h2><p>{t.body}</p></div><div className="formula"><span>35%</span><b>{t.deliverables}</b><span>25%</span><b>{t.checklists}</b><span>20%</span><b>{t.commits}</b><span>20%</span><b>{t.tests}</b></div></div><div className="evidence-table"><header><span>{t.colProject}</span><span>{t.colProgress}</span><span>{t.colInfra}</span><span>{t.colDev}</span><span>{t.colCommissioning}</span><span>{t.colConfidence}</span></header>{rows.map(r=><div key={r.project}><b>{r.project}</b><span className="progress-cell"><span className="evidence-progress" aria-hidden="true"><i style={{width:`${r.progress}%`}}/></span><strong>{r.progress}%</strong></span><span>{r.infra} {t.checklistsUnit}</span><span>{r.dev} {t.commitsUnit}</span><span>{r.tests} {t.testsUnit}</span><em>{confidenceLabel(r.confidence)}</em></div>)}</div></section>; }

function Home({setActive}) {
  const spotlight = [
    { value: "14", label: "áreas coordenadas", tone: "cyan" },
    { value: "6", label: "projetos críticos no radar", tone: "purple" },
    { value: "3", label: "decisões do dia", tone: "gold" },
  ];
  const modules = [
    { id: "portfolio", icon: FolderOpen, title: "Controle de Projetos", body: "Portfólio, fases, atividades, marcos, evidências e riscos em uma única linha de execução.", note: "Espinha operacional" },
    { id: "simulator", icon: Sparkle, title: "Simulador de Impacto", body: "Antecipe atrasos, sobrecarga e conflito de capacidade antes que virem custo ou atraso real.", note: "Leitura preditiva" },
    { id: "commissioning", icon: Factory, title: "Comissionamento", body: "Conecte a telemetria física ao Smart Triage e transforme falha de campo em priorização imediata.", note: "Chão de fábrica vivo" },
  ];
  const decisionCards = [
    ["TITANO", "Sensor X exige decisão hoje", "Go Live protegido se o plano físico for fechado até 18:00."],
    ["MARKET PERU", "VPN e range IP seguem críticos", "Infraestrutura ainda dita a janela real de homologação."],
    ["NAVEPARK", "Topologia HML continua no centro", "A decisão técnica destrava DEV sem paralisar as outras áreas."],
  ];
  return <section className="page home-page premium-home">
    <div className="home-hero">
      <small>OPERAÇÃO ASSISTIDA · IMPLANTAÇÃO & DEVOPS</small>
      <h2>Conecte pessoas, evidências e decisões antes que o atraso vire operação.</h2>
      <p>O InventOps organiza a carteira inteira em uma única verdade operacional. Você enxerga o que destravar agora, quem está esperando e qual impacto cada decisão provoca nos próximos marcos.</p>
      <div className="home-spotlight">
        {spotlight.map(item => <span key={item.label} className={item.tone}><b>{item.value}</b><small>{item.label}</small></span>)}
      </div>
      <div className="home-cta-row">
        <button className="primary" onClick={()=>setActive("portfolio")}><FolderOpen/>Abrir Controle de Projetos</button>
        <button className="ghost" onClick={()=>setActive("executive")}><ChartLineUp/>Ver leitura executiva</button>
      </div>
      <div className="home-decision-cards">
        {decisionCards.map(([tag,title,body])=><article key={tag}><small>{tag}</small><b>{title}</b><p>{body}</p></article>)}
      </div>
    </div>
    <div className="module-list premium-module-list">
      {modules.map(item=>{const Icon=item.icon;return <button key={item.id} onClick={()=>setActive(item.id)}><Icon/><span><small>{item.note}</small><b>{item.title}</b><p>{item.body}</p></span><ArrowRight/></button>})}
    </div>
  </section>;
}

const SETTINGS_I18N={
  pt:{rulesTitle:"Regras de governança",rulesBody:"Controles ativos do produto. Nenhuma chave externa é armazenada no navegador.",
   toggles:[["p0","Criar P0 automaticamente","Falhas críticas de sensores abrem um alerta com SLA."],["capacity","Monitorar sobrecarga de capacidade","Avise quando uma equipe ultrapassar 100% de alocação."],["evidence","Exigir evidência para progresso","Percentuais só avançam com entregáveis verificáveis."]],
   sourcesTitle:"Fontes conectadas",sourcesBody:"Estado operacional atual das integrações e leituras ativas.",
   plcLabel:"CLP · Linha 01",plcNote:"Última leitura há 2s",baseLabel:"Base homologada",baseNote:"Commits e builds válidos",planLabel:"Planejamento",planNote:"Projetos e dependências",connected:"Conectado"},
  es:{rulesTitle:"Reglas de gobernanza",rulesBody:"Controles activos del producto. Ninguna clave externa se almacena en el navegador.",
   toggles:[["p0","Crear P0 automáticamente","Fallas críticas de sensores abren una alerta con SLA."],["capacity","Monitorear sobrecarga de capacidad","Avisa cuando un equipo supere el 100% de asignación."],["evidence","Exigir evidencia para el progreso","Los porcentajes solo avanzan con entregables verificables."]],
   sourcesTitle:"Fuentes conectadas",sourcesBody:"Estado operativo actual de las integraciones y lecturas activas.",
   plcLabel:"PLC · Línea 01",plcNote:"Última lectura hace 2s",baseLabel:"Base homologada",baseNote:"Commits y builds válidos",planLabel:"Planificación",planNote:"Proyectos y dependencias",connected:"Conectado"},
  en:{rulesTitle:"Governance rules",rulesBody:"Active product controls. No external key is stored in the browser.",
   toggles:[["p0","Create P0 automatically","Critical sensor failures open an alert with SLA."],["capacity","Monitor capacity overload","Warn when a team exceeds 100% allocation."],["evidence","Require evidence for progress","Percentages only advance with verifiable deliverables."]],
   sourcesTitle:"Connected sources",sourcesBody:"Current operational state of active integrations and readings.",
   plcLabel:"PLC · Line 01",plcNote:"Last reading 2s ago",baseLabel:"Homologated base",baseNote:"Valid commits and builds",planLabel:"Planning",planNote:"Projects and dependencies",connected:"Connected"},
};
function SettingsPage({lang="pt"}={}){
  const t=SETTINGS_I18N[lang]||SETTINGS_I18N.pt;
  const [settings,setSettings]=useState({p0:true,capacity:true,evidence:true});
  return <section className="page settings-page"><div className="settings-card"><h2>{t.rulesTitle}</h2><p>{t.rulesBody}</p>{t.toggles.map(([k,title,desc])=><label key={k}><span><b>{title}</b><small>{desc}</small></span><input type="checkbox" checked={settings[k]} onChange={()=>setSettings({...settings,[k]:!settings[k]})}/><i/></label>)}</div><div className="settings-card"><h2>{t.sourcesTitle}</h2><p>{t.sourcesBody}</p><ul className="sources"><li><Circuitry/><span><b>{t.plcLabel}</b><small>{t.plcNote}</small></span><em>{t.connected}</em></li><li><Database/><span><b>{t.baseLabel}</b><small>{t.baseNote}</small></span><em>{t.connected}</em></li><li><LinkSimple/><span><b>{t.planLabel}</b><small>{t.planNote}</small></span><em>{t.connected}</em></li></ul></div></section>; }

export function App() {
  const initialRoute=readRouteFromHash();
  const [authenticated,setAuthenticated]=useState(()=>sessionStorage.getItem("inventops-session")==="active");
  const [currentUser,setCurrentUser]=useState(()=>{try{return JSON.parse(sessionStorage.getItem("inventops-user"))||DEFAULT_USER}catch{return DEFAULT_USER}});
  const [active,setActive]=useState(()=>initialRoute.active||"home");
  const [lang,setLang]=useState(()=>sessionStorage.getItem("inventops-lang")||"pt");
  const [role,setRole]=useState(()=>currentUser.role||"Admin");
  const [theme,setTheme]=useState("Escuro");
  const [cockpitDept,setCockpitDept]=useState(()=>initialRoute.dept||currentUser.dept||"IMP");
  const [projects,setProjects]=useState(()=>{try{const saved=sessionStorage.getItem("inventops-projects");return saved?JSON.parse(saved):portfolioData}catch{return portfolioData}});
  const [selectedProject,setSelectedProject]=useState(()=>projects[0]);
  const [projectModalOpen,setProjectModalOpen]=useState(false);
  const [scenario,setScenario]=useState("E se o projeto TITANO atrasar 5 dias por falta de hardware?");
  const [fault,setFault]=useState(true); const [alerts,setAlerts]=useState(initialAlerts);
  const [importedDemands,setImportedDemands]=useState([]);
  const [message,setMessage]=useState("");
  const toastTimer=useRef();
  const notify=useCallback((text)=>{setMessage(text);window.clearTimeout(toastTimer.current);toastTimer.current=window.setTimeout(()=>setMessage(""),3200)},[]);
  useEffect(()=>()=>window.clearTimeout(toastTimer.current),[]);
  useEffect(()=>{window.scrollTo(0,0)},[active]);
  useEffect(()=>{sessionStorage.setItem("inventops-projects",JSON.stringify(projects))},[projects]);
  useEffect(()=>{sessionStorage.setItem("inventops-lang",lang)},[lang]);
  useEffect(()=>{
    const token=routeTokenFor(active,cockpitDept);
    if(window.location.hash!==`#${token}`) window.history.replaceState(null,"",`#${token}`);
  },[active,cockpitDept]);
  useEffect(()=>{
    const handleHashChange=()=>{
      const route=readRouteFromHash();
      setActive(route.active||"home");
      if(route.dept) setCockpitDept(route.dept);
    };
    window.addEventListener("hashchange",handleHashChange);
    return()=>window.removeEventListener("hashchange",handleHashChange);
  },[]);
  const updateProject=useCallback(updated=>{setProjects(current=>current.map(p=>p.code===updated.code?updated:p));setSelectedProject(updated)},[]);
  const openFullProject=()=>{setProjectModalOpen(false);setActive("project")};
  const login=(email)=>{const profile=resolveSessionProfile(email);const requested=readRouteFromHash();sessionStorage.setItem("inventops-session","active");sessionStorage.setItem("inventops-user",JSON.stringify(profile));setCurrentUser(profile);setRole(profile.role);setCockpitDept(requested.dept||profile.dept);setAuthenticated(true);setActive(requested.active||"home")};
  const logout=()=>{sessionStorage.removeItem("inventops-session");sessionStorage.removeItem("inventops-user");setCurrentUser(DEFAULT_USER);setAuthenticated(false);setRole("Admin");setCockpitDept("IMP");setActive("home");window.history.replaceState(null,"","#home")};
  const openPilotContext=(user)=>{setCockpitDept(user.dept||"INF");setActive("cockpit")};
  const openCockpitDept=(dept)=>{setCockpitDept(dept||"INF");setActive("cockpit")};
  if(!authenticated)return <LoginScreen onLogin={login}/>;
  const allowed={
    Admin:"*",
    Diretoria:["home","management","analytics","executive","portfolio","project","pm","cockpit","areas","simulator","decision","evidence","presentation","lifecycle"],
    Gestor:["home","action","management","portfolio","project","pm","cockpit","areas","alerts","raid","evidence","presentation","lifecycle"],
    Analista:["home","action","portfolio","project","cockpit","areas","alerts","commissioning","evidence","presentation"]
  };
  const canAccess=allowed[role]==="*"||allowed[role].includes(active);
  const pages={
    home:<ExecutiveDashboard projects={projects} setActive={setActive} openCockpitDept={openCockpitDept} currentUser={currentUser} lang={lang}/>,
    action:<ActionCenter notify={notify} lang={lang}/>,management:<ManagementPage lang={lang}/>,analytics:<AnalyticsPage lang={lang}/>,
    executive:<ExecutiveOnePager projects={projects} notify={notify} lang={lang}/>,
    portfolio:<PortfolioPage projects={projects} setProjects={setProjects} setActive={setActive} setSelectedProject={setSelectedProject} setProjectModalOpen={setProjectModalOpen} setImportedDemands={setImportedDemands} notify={notify} lang={lang}/>,
    pm:<PmControlTower projects={projects} onOpenProject={project=>{setSelectedProject(project);setProjectModalOpen(true)}} notify={notify} lang={lang}/>,
    project:<ProjectWorkspace key={selectedProject.name} project={selectedProject} setActive={setActive} notify={notify} lang={lang}/>,
    cockpit:<DepartmentCockpit key={cockpitDept} notify={notify} imported={importedDemands} initialDept={cockpitDept} currentUser={currentUser} lang={lang}/>,
    areas:<AreasPage lang={lang}/>,raid:<RaidPage lang={lang}/>,admin:<AdminGovernance role={role} setRole={setRole} theme={theme} setTheme={setTheme} notify={notify} onOpenPilotUser={openPilotContext} lang={lang}/>,
    presentation:<PresentationPage notify={notify} lang={lang}/>,lifecycle:<LifecyclePage lang={lang}/>,simulator:<Simulator scenario={scenario} setScenario={setScenario} notify={notify} lang={lang}/>,
    commissioning:<Commissioning fault={fault} setFault={setFault} alerts={alerts} setAlerts={setAlerts} setActive={setActive} notify={notify} lang={lang}/>,
    decision:<DecisionRoom setActive={setActive} notify={notify} lang={lang}/>,alerts:<AlertsPage alerts={alerts} setAlerts={setAlerts} lang={lang}/>,
    evidence:<EvidencePage lang={lang}/>,settings:<SettingsPage lang={lang}/>
  };
  const page=canAccess?pages[active]:<AccessDenied setActive={setActive} lang={lang}/>;
  return <div className="app-shell" data-theme={theme}><SidebarEnhanced active={active} setActive={setActive} alertCount={alerts.filter(a=>a.status!=="Resolvido").length} notify={notify} role={role} currentUser={currentUser} onLogout={logout} lang={lang}/><main className="workspace"><Topbar active={active} role={role} currentUser={currentUser} onLogout={logout} notify={notify} lang={lang} setLang={setLang}/><ProductJourneyRail active={active} setActive={setActive} lang={lang} />{page}</main>{projectModalOpen&&selectedProject?<ProjectControlModal project={selectedProject} onClose={()=>setProjectModalOpen(false)} onUpdate={updateProject} onOpenFull={openFullProject} notify={notify}/>:null}{message?<div className="toast" role="status"><CheckCircle weight="fill"/>{message}</div>:null}</div>;
}

