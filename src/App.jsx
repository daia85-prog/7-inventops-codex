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
import { PmoControlTower } from "./PmoControlTower";

const assetPath = (name) => `${import.meta.env.BASE_URL}assets/${name}`;

/* E1.5 â€” F1 SharePoint: link vivo por projeto (padrÃ£o proj-<cÃ³digo> do P5).
   âš ï¸ Base a confirmar com a Daiana antes da apresentaÃ§Ã£o â€” trocar SÃ“ esta linha. */
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

const phaseNames = ["Kickoff","Levantamento","Provisionamento","ImplantaÃ§Ã£o","HomologaÃ§Ã£o","Go Live","Encerramento"];

const portfolioData = [
  {name:"TITANO",code:"I25.8049",client:"Stellantis",location:"Betim Â· MG",owner:"Daiana Costa",pmo:"Alex",status:"Em andamento",risk:"MÃ©dio",phase:4,progress:73,next:"Go Live operacional",date:"20 jul 2026",health:78,blocker:"Sem bloqueio crÃ­tico. Servidor SaaS AWS em provisionamento.",nextAction:"Agendar VPN site-to-site e consolidar evidÃªncias de seguranÃ§a.",milestones:["Servidor SaaS aprovado Â· 23/06","Go Live operacional Â· 20/07","OAuth2 Â· D+20 apÃ³s Go Live"]},
  {name:"QUELUZ",code:"I25.3505",client:"D. MÃ¼ller",location:"ItajaÃ­ Â· SC",owner:"Daiana Costa",pmo:"Fabio",status:"Em andamento",risk:"MÃ©dio",phase:4,progress:68,next:"GL1 Â· ConferÃªncia",date:"30 jul 2026",health:72,blocker:"SSH porta 9844 e VPN do time de Dados aguardando confirmaÃ§Ã£o do cliente.",nextAction:"Garantir ambiente HML liberado antes do GL1.",milestones:["GL1 ConferÃªncia Â· 30/07","GL2 Sorter Â· 30/09","GL3 IA Â· 30/11","GL4 PBL Â· 25/01/27"]},
  {name:"MARKET PERU",code:"I25.115",client:"Tottus / Falabella",location:"Lima Â· Peru",owner:"Daiana Costa",pmo:"Giovanni",status:"Bloqueado",risk:"Alto",phase:3,progress:42,next:"Infra de testes",date:"28 jul 2026",health:41,blocker:"VPN site-to-site, range IP /24 e emulador WCS ainda pendentes.",nextAction:"Escalar definiÃ§Ãµes de rede e homologar arquitetura HA/DR.",milestones:["Servidores IA entregues Â· 05/06","Infra de testes Â· 28/07","Equipamentos export Â· out/26"]},
  {name:"NAVEPARK",code:"I25.4066",client:"Vedamotors",location:"Navegantes Â· SC",owner:"Daiana Costa",pmo:"Anderson",status:"Bloqueado",risk:"Alto",phase:3,progress:51,next:"Ambiente HML",date:"14 ago 2026",health:48,blocker:"VMs Oracle KVM e desenho de arquitetura de rede pendentes.",nextAction:"Cobrar retorno do cliente e fechar topologia das VMs.",milestones:["VPN IPSec recebida","Ambiente HML Â· 14/08","Go Live Â· 07/09"]},
  {name:"BP",code:"I24.215",client:"Baspan",location:"SÃ£o Paulo Â· SP",owner:"Daiana Costa",pmo:"Giovanni",status:"Em andamento",risk:"Baixo",phase:5,progress:84,next:"Go Live",date:"03 ago 2026",health:86,blocker:"Sem bloqueio crÃ­tico; acompanhar disponibilidade do fornecedor PTL.",nextAction:"Concluir homologaÃ§Ã£o e confirmar equipe de campo.",milestones:["REV14 aprovada Â· 01/06","HomologaÃ§Ã£o Â· 25/07","Go Live Â· 03/08"]},
  {name:"MARKET CHILE",code:"I24.222",client:"Falabella / Tottus",location:"La Farfana Â· Chile",owner:"Daiana Costa",pmo:"Giovanni",status:"Em andamento",risk:"Baixo",phase:2,progress:36,next:"1Âº embarque",date:"set 2026",health:81,blocker:"Sem bloqueio; diagrama de rede e VPN em configuraÃ§Ã£o.",nextAction:"Fechar diagrama de rede e concluir VPN site-to-site.",milestones:["EspecificaÃ§Ã£o enviada Â· 24/06","1Âº embarque Â· set/26","Go Live Â· jan/27"]},
];

const baseActivities = [
  {id:1,name:"Validar arquitetura do ambiente",phase:"Levantamento",owner:"Daiana",due:"15 jul",status:"ConcluÃ­do",evidence:"Documento REV4"},
  {id:2,name:"Provisionar servidores e acessos",phase:"Provisionamento",owner:"Ivan",due:"18 jul",status:"Em andamento",evidence:"Checklist 4/5"},
  {id:3,name:"Configurar VPN site-to-site",phase:"Provisionamento",owner:"Jonathan",due:"19 jul",status:"Aguardando",evidence:"Ticket #3278268"},
  {id:4,name:"Executar testes de integraÃ§Ã£o",phase:"HomologaÃ§Ã£o",owner:"Matheus",due:"24 jul",status:"NÃ£o iniciado",evidence:"0/12 testes"},
  {id:5,name:"Preparar plano de Go Live",phase:"Go Live",owner:"Fabio",due:"26 jul",status:"NÃ£o iniciado",evidence:"Modelo pendente"},
];

const initialAlert = {
  id: "P0-2026-0711-01", project: "TITANO", priority: "P0", title: "Falha crÃ­tica no Sensor X",
  description: "Leitura 0,00 mA detectada durante o comissionamento da Linha de ExpediÃ§Ã£o 01.",
  owner: "Rodrigo Baruco", source: "IoT / CLP", detected: "11/07/2026 10:23:56", status: "Em triagem"
};

/* E1.4 â€” contrato Nexus: seÃ§Ã£o do kickoff â†’ departamento dono (campos 'tbd' viram pendÃªncias) */
const SEC2DEPT = { ge:"PMO", la:"EMC", cu:"WCS", in:"WCS", os:"WCS", pb:"EMC", ct:"EMC", fc:"EMC", pk:"EMC", so:"EMC", pt:"EMC", es:"WCS", et:"ESP", if:"INF" };
const IF_LABELS = {
  if_resp_infra:"Definir responsÃ¡vel de infra do projeto", if_resp_srv:"Servidor: cliente Ã— Invent",
  if_ambiente:"Ambiente: nuvem Ã— on-premise", if_s:"EspecificaÃ§Ã£o tÃ©cnica de servidores",
  if_ambientes:"Ambientes PRD / HML", if1:"VPN site-to-site", if2:"Range de IPs",
  if3:"Acessos remotos", if4:"DomÃ­nio / DNS", if6:"Backup e monitoramento"
};

const navGroups = [
  { label: "EXECUTIVO", items: [
    { id: "home", label: "Dashboard Executivo", icon: House, mobile: true },
    { id: "action", label: "Minha OperaÃ§Ã£o", icon: CheckSquare, mobile: true },
    { id: "management", label: "Gerencial", icon: TrendUp },
    { id: "analytics", label: "AnÃ¡lise / BI", icon: ChartLineUp },
    { id: "executive", label: "RelatÃ³rio Executivo", icon: ClipboardText },
  ]},
  { label: "OPERAÃ‡ÃƒO", items: [
    { id: "portfolio", label: "Projetos", icon: FolderOpen, mobile: true },
    { id: "pmo", label: "Central PMO", icon: BellRinging, mobile: true },
    { id: "cockpit", label: "Operação Assistida", icon: HandWaving, mobile: true },
    { id: "areas", label: "Ãreas TÃ©cnicas", icon: UsersThree },
    { id: "alerts", label: "Smart Triage", icon: Warning },
    { id: "raid", label: "Matriz RAID", icon: ShieldCheck },
  ]},
  { label: "INTELIGÃŠNCIA", items: [
    { id: "simulator", label: "Simulador de Impacto", icon: Sparkle, mobile: true },
    { id: "commissioning", label: "Comissionamento", icon: Factory },
    { id: "decision", label: "Sala de DecisÃ£o", icon: SquaresFour },
    { id: "evidence", label: "EvidÃªncias", icon: ClipboardText },
  ]},
  { label: "GOVERNANÃ‡A", items: [
    { id: "admin", label: "AdministraÃ§Ã£o", icon: ShieldCheck, adminOnly: true },
    { id: "presentation", label: "ApresentaÃ§Ã£o por Perfil", icon: Play },
    { id: "lifecycle", label: "Releases & Roadmap", icon: FlagCheckered },
    { id: "settings", label: "ConfiguraÃ§Ãµes", icon: GearSix, adminOnly: true },
  ]},
];

const pageMeta = {
  home: ["Dashboard Executivo", "A carteira inteira traduzida em decisÃµes para hoje."],
  action: ["Minha OperaÃ§Ã£o", "Trabalho diÃ¡rio priorizado por impacto, dependÃªncia e evidÃªncia."],
  management: ["VisÃ£o Gerencial", "TendÃªncia, capacidade e gargalos ativos."],
  analytics: ["AnÃ¡lise / BI", "Indicadores avanÃ§ados e engajamento tÃ©cnico."],
  executive: ["RelatÃ³rio Executivo", "O portfÃ³lio consolidado em uma pÃ¡gina."],
  portfolio: ["Controle de Projetos", "Planeje, acompanhe e cobre entregas em uma visÃ£o operacional."],
  pmo: ["Central PMO", "A carteira inteira organizada por decisÃµes, dependÃªncias e handoffs."],
  cockpit: ["Operação Assistida", "A esteira real de cada área: entregas, esperas e handoffs com carimbo de hora."],
  project: ["Central do Projeto", "Fases, atividades, marcos, riscos e evidÃªncias em um Ãºnico lugar."],
  simulator: ["Simulador de Impacto", "Antecipe riscos. Decida com confianÃ§a."],
  commissioning: ["Comissionamento em Tempo Real", "Telemetria da operaÃ§Ã£o conectada Ã  governanÃ§a."],
  decision: ["Sala de DecisÃ£o", "Conecte evidÃªncias operacionais a impactos futuros."],
  areas: ["Ãreas TÃ©cnicas", "Capacidade e progresso nas 14 Ã¡reas da operaÃ§Ã£o."],
  alerts: ["Smart Triage", "Incidentes P0, P1 e P2, responsÃ¡veis e SLA em uma fila Ãºnica."],
  raid: ["Matriz RAID", "Riscos, premissas, impedimentos e dependÃªncias priorizados."],
  evidence: ["EvidÃªncias", "Progresso explicado por entregas tÃ©cnicas verificÃ¡veis."],
  admin: ["AdministraÃ§Ã£o", "Perfis, permissÃµes, validaÃ§Ãµes e auditoria."],
  presentation: ["ApresentaÃ§Ã£o por Perfil", "Finalidade do InventOps para Analista, Gestor e Diretor."],
  lifecycle: ["Releases & Roadmap", "Ciclo de vida e visÃ£o de futuro do InventOps."],
  settings: ["ConfiguraÃ§Ãµes", "Regras de simulaÃ§Ã£o, telemetria e governanÃ§a."],
};

const pageMetaIntl = {
  es: {
    home: ["Dashboard Ejecutivo", "Toda la cartera traducida en decisiones para hoy."],
    portfolio: ["Control de Proyectos", "Planifica, acompaÃ±a y cobra entregas en una visiÃ³n operativa."],
    executive: ["Informe Ejecutivo", "La cartera consolidada en una sola pÃ¡gina."],
  },
  en: {
    home: ["Executive Dashboard", "The full portfolio translated into decisions for today."],
    portfolio: ["Project Control", "Plan, track, and drive deliveries in one operational view."],
    executive: ["Executive Report", "The portfolio consolidated into a single page."],
  }
};

const productJourney = [
  { id: "home", label: "Home", helper: "Entrada executiva" },
  { id: "portfolio", label: "Projetos", helper: "Carteira ativa" },
  { id: "project", label: "Projeto", helper: "Controle ponta a ponta" },
  { id: "pmo", label: "PMO", helper: "CobranÃ§a e priorizaÃ§Ã£o" },
  { id: "executive", label: "Executivo", helper: "SÃ­ntese para decisÃ£o" },
];

const initialAlerts = [
  initialAlert,
  {id:"P1-2026-0711-04",project:"MARKET PERU",priority:"P1",title:"Conectividade sem confirmaÃ§Ã£o do cliente",description:"VPN site-to-site e range IP /24 ainda sem data firme.",owner:"Ivan",source:"GovernanÃ§a",detected:"10/07/2026 15:10:00",status:"Em aÃ§Ã£o"},
  {id:"P1-2026-0711-05",project:"NAVEPARK",priority:"P1",title:"Ambiente HML em risco",description:"Topologia das VMs Oracle KVM aguarda decisÃ£o tÃ©cnica.",owner:"Daiana Costa",source:"PMO",detected:"09/07/2026 09:30:00",status:"Em triagem"},
  {id:"P2-2026-0711-08",project:"QUELUZ",priority:"P2",title:"EvidÃªncias incompletas para GL1",description:"Dez testes de comissionamento ainda aguardam aprovaÃ§Ã£o.",owner:"Matheus",source:"EvidÃªncias",detected:"11/07/2026 08:12:00",status:"Em triagem"}
];

function Logo() {
  return <div className="brand"><img src={assetPath("icon.svg")} alt="InventOps"/><div><strong>Invent<span>Ops</span></strong><small>ENTERPRISE</small></div></div>;
}

function Sidebar({ active, setActive, alertCount, notify, role, setRole, theme, setTheme, onLogout }) {
  const themeOptions = ["Escuro","Claro","Contraste"];
  const roleOptions = ["Analista","Gestor","Diretoria","Admin"];
  return <aside className="sidebar">
    <Logo/>
    <div className="sidebar-controls">
      <section className="sidebar-card">
        <small>TEMA</small>
        <div className="sidebar-segmented">
          {themeOptions.map(option=><button key={option} className={theme===option?"active":""} onClick={()=>{setTheme(option);notify(`Tema alterado para ${option}.`)}}>{option}</button>)}
        </div>
      </section>
      <section className="sidebar-card">
        <small>VER COMO</small>
        <div className="sidebar-role-switch">
          {roleOptions.map(option=><button key={option} className={role===option?"active":""} onClick={()=>{setRole(option);notify(`VisualizaÃ§Ã£o alterada para ${option}.`)}}>{option==="Diretoria"?"Direx":option}</button>)}
        </div>
      </section>
    </div>
    <nav>{navGroups.map(group=><div className="nav-group" key={group.label}><small>{group.label}</small>{group.items.map(({id,label,icon:Icon,mobile,adminOnly}) => {const isActive=active===id||(active==="project"&&id==="portfolio");const restricted=adminOnly&&role!=="Admin";return <button data-mobile={mobile?"true":"false"} key={id} aria-label={label} className={`${isActive?"active":""} ${restricted?"restricted":""}`} onClick={()=>restricted?notify("Acesso restrito ao perfil Admin."):setActive(id)}>
      <Icon size={19} weight={isActive?"fill":"regular"}/><span>{label}</span>{restricted?<LockKey size={12}/>:null}{id==="alerts"&&alertCount>0?<b>{alertCount}</b>:null}
    </button>})}</div>)}</nav>
    <div className="sidebar-bottom">
      <button className="profile" onClick={()=>setActive("admin")}><span className="avatar">A</span><span><strong>Admin</strong><small>{role==="Diretoria"?"Diretoria Â· DIREX":role}</small></span><CaretDown size={15}/></button>
      <button className="logout-button" onClick={onLogout}><SignOut/><span>Sair com seguranÃ§a</span></button>
      <div className="credit"><Sparkle size={15} weight="fill"/><span>Desenvolvido por <b>Daiana Costa</b></span></div>
    </div>
  </aside>;
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
          notify(option.id==="pt"?"Idioma alterado para portuguÃªs.":option.id==="es"?"Idioma alterado para espanhol.":"Language switched to English.");
        }}
      >
        {option.label}
      </button>
    ))}
  </span>;
}

function SidebarEnhanced({ active, setActive, alertCount, notify, role, onLogout }) {
  const [openGroups,setOpenGroups]=useState({
    "EXECUTIVO":true,
    "OPERAÃ‡ÃƒO":true,
    "INTELIGÃŠNCIA":false,
    "GOVERNANÃ‡A":false,
  });

  return <aside className="sidebar">
    <Logo/>
    <nav>
      {navGroups.map(group=><div className={`nav-group ${openGroups[group.label]?"open":"collapsed"}`} key={group.label}>
        <button type="button" className="nav-group-toggle" aria-expanded={!!openGroups[group.label]} onClick={()=>setOpenGroups(current=>({...current,[group.label]:!current[group.label]}))}>
          <small>{group.label}</small>
          <CaretDown size={12} className={openGroups[group.label]?"open":""}/>
        </button>
        <div className="nav-group-items">
          {group.items.map(({id,label,icon:Icon,mobile,adminOnly}) => {
            const isActive=active===id||(active==="project"&&id==="portfolio");
            const restricted=adminOnly&&role!=="Admin";
            return <button data-mobile={mobile?"true":"false"} key={id} aria-label={label} className={`${isActive?"active":""} ${restricted?"restricted":""}`} onClick={()=>restricted?notify("Acesso restrito ao perfil Admin."):setActive(id)}>
              <Icon size={19} weight={isActive?"fill":"regular"}/>
              <span>{label}</span>
              {restricted?<LockKey size={12}/>:null}
              {id==="alerts"&&alertCount>0?<b>{alertCount}</b>:null}
            </button>
          })}
        </div>
      </div>)}
    </nav>
    <div className="sidebar-bottom">
      <button className="profile" onClick={()=>{setActive("admin");notify("AdministraÃ§Ã£o aberta para controlar perfil, tema e acessos.")}}><span className="avatar">A</span><span><strong>Admin</strong><small>{role==="Diretoria"?"Diretoria Â· DIREX":role}</small></span><CaretDown size={15}/></button>
      <button className="logout-button" onClick={onLogout}><SignOut/><span>Sair com seguranÃ§a</span></button>
      <div className="credit"><Sparkle size={15} weight="fill"/><span>Desenvolvido por <b>Daiana Costa</b></span></div>
    </div>
  </aside>;
}

function Topbar({ active, role, onLogout, notify, lang, setLang }) {
  const localizedMeta = pageMetaIntl[lang]?.[active] || pageMeta[active];
  const roadmapTitle = {
    pt: "Este m?dulo pertence ? expans?o do produto e mostra a pr?xima camada operacional que ser? incorporada ao InventOps.",
    es: "Este m?dulo pertenece a la expansi?n del producto y muestra la siguiente capa operacional que se incorporar? al InventOps.",
    en: "This module belongs to the product expansion and shows the next operational layer that will be incorporated into InventOps."
  };
  return <header className="topbar"><div><div className="title-line"><h1>{localizedMeta[0]}</h1>{VISION_PAGES.includes(active) ? <span className="vision-badge" title={roadmapTitle[lang]}>â†— VISÃƒO Â· ROADMAP</span> : null}</div><p>{localizedMeta[1]}</p></div><div className="top-actions">
    <LangSwitch lang={lang} setLang={setLang} notify={notify} /><span className="date"><CalendarBlank size={18} />11 jul 2026</span><span className="avatar">A</span><span className="top-user">Admin<small>{role==="Diretoria"?"Diretoria Â· DIREX":role}</small></span><button className="top-logout" onClick={onLogout} aria-label="Sair"><SignOut /></button>
  </div></header>;
}

function DemoJourneyRail({ active, setActive, lang }) {
  const currentIndex = productJourney.findIndex(step => step.id === active);
  if (currentIndex === -1) return null;
  const nextStep = productJourney[currentIndex + 1];
  const copy = {
    pt: { title: "JORNADA OPERACIONAL", progress: "concluÃ­do na jornada do produto", next: "PrÃ³xima etapa", current: "Etapa atual", done: "Jornada operacional completa" },
    es: { title: "JORNADA OPERACIONAL", progress: "completado en la jornada del producto", next: "PrÃ³xima etapa", current: "Etapa actual", done: "Jornada operacional completa" },
    en: { title: "OPERATIONAL JOURNEY", progress: "completed in the product journey", next: "Next stage", current: "Current stage", done: "Operational journey complete" }
  }[lang];

  return (
    <section className="demo-journey-rail" aria-label={copy.title}>
      <div className="demo-journey-head">
        <small>{copy.title}</small>
        <div className="demo-journey-meta">
          <b>{currentIndex + 1}/{productJourney.length} {copy.progress}</b>
          {nextStep ? <button className="ghost" onClick={() => setActive(nextStep.id)}>{copy.next}: {nextStep.label}</button> : <span className="demo-journey-done">{copy.done}</span>}
        </div>
      </div>
      <div className="demo-journey-track">
        {productJourney.map((step, index) => {
          const state = index < currentIndex ? "done" : index == currentIndex ? "current" : "future";
          return (
            <div key={step.id} className={`demo-journey-step ${state}`}>
              <i>{state === "done" ? <CheckCircle weight="fill" /> : index + 1}</i>
              <span>
                <b>{step.label}</b>
                <small>{state === "current" ? copy.current : step.helper}</small>
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
      <Line name="CenÃ¡rio simulado" type="monotone" dataKey="scenario" stroke="#27c5e8" dot={false} strokeWidth={3} isAnimationActive={false}/>
    </LineChart>
  </ResponsiveContainer></div>;
}

function ImpactNode({eyebrow,title,value,color,detail,footer}) {
  return <div className="impact-node" style={{"--node-color":color}}><small>{eyebrow}</small><h3>{title}</h3><strong>{value}</strong><p>{detail}</p><span>{footer}</span></div>;
}

function Simulator({scenario,setScenario,notify}) {
  const [running,setRunning]=useState(false); const [ready,setReady]=useState(true);
  const runTimer=useRef();
  useEffect(()=>()=>window.clearTimeout(runTimer.current),[]);
  const run=()=>{setRunning(true);setReady(false);window.clearTimeout(runTimer.current);runTimer.current=window.setTimeout(()=>{setRunning(false);setReady(true)},850)};
  return <section className="page simulator-page">
    <div className="sim-grid">
      <div className="scenario-panel"><div className="section-heading"><b>1. Defina o cenÃ¡rio</b><span>Descreva o evento ou condiÃ§Ã£o que deseja simular.</span></div>
        <div className="scenario-box"><textarea value={scenario} maxLength={250} onChange={e=>setScenario(e.target.value)} aria-label="CenÃ¡rio a simular"/><small>{scenario.length} / 250</small></div>
        <button className="primary" onClick={run} disabled={running}><Play size={19} weight="fill"/>{running?"Calculando dependÃªncias...":"Simular impacto"}</button>
        <p className="ai-note"><Sparkle size={17}/>Motor de cenÃ¡rios + IA explicativa aplicados ao gÃªmeo digital.</p>
      </div>
      <div className={`impact-panel ${ready?"ready":"loading"}`}><div className="section-heading"><b>2. Cadeia de impacto <em>(resultado da simulaÃ§Ã£o)</em></b><span>Como o evento se propaga pela operaÃ§Ã£o.</span></div>
        <div className="impact-chain"><ImpactNode eyebrow="PROJETO" title="TITANO" value="+5d" color="#fb5470" detail="ConclusÃ£o prevista 25 jul 2026" footer="Impacto direto"/><ArrowRight/>
          <ImpactNode eyebrow="PROJETO" title="QUELUZ" value="+12d" color="#f5c300" detail="ConclusÃ£o prevista 31 jul 2026" footer="Impacto em cascata"/><ArrowRight/>
          <ImpactNode eyebrow="RECURSO" title="PLC" value="+40%" color="#32bde0" detail="Carga em setembro" footer="Capacidade excedida"/></div>
        <div className="confidence"><div><small>CONFIANÃ‡A DA SIMULAÃ‡ÃƒO</small><strong>78%</strong><div className="progress"><i style={{width:"78%"}}/></div><span>Baseado na qualidade dos dados e histÃ³rico similar.</span></div><div><small>PRINCIPAIS SUPOSIÃ‡Ã•ES</small><ul><li>Atraso causado exclusivamente pela falta de hardware.</li><li>Redes de precedÃªncia conforme baseline atual.</li><li>Capacidade e calendÃ¡rio conforme plano registrado.</li></ul><button className="link-button" onClick={()=>notify("4Âª suposiÃ§Ã£o: fornecedores mantÃªm o prazo confirmado em 10/07.")}>Ver todas as suposiÃ§Ãµes (4)</button></div></div>
      </div>
    </div>
    <div className="sim-bottom"><article><div className="section-heading"><b>3. Linha do tempo â€” Capacidade do recurso PLC</b><span>ProjeÃ§Ã£o de utilizaÃ§Ã£o diÃ¡ria (% da capacidade disponÃ­vel).</span></div><CapacityChart/><div className="chart-note"><Info size={22}/><span>Sobrecarga prevista entre 28/08 e 20/09.<b>Pico de 146% em 10/09.</b></span></div></article>
      <article><div className="section-heading"><b>4. AÃ§Ã£o executiva recomendada</b><span>O que fazer agora para reduzir o impacto.</span></div><div className="recommendation"><span className="rec-icon"><TrendUp/></span><div><h3>Acelerar aquisiÃ§Ã£o de hardware para TITANO</h3><p>Antecipar a entrega dos equipamentos crÃ­ticos em pelo menos 5 dias para eliminar o atraso e evitar a sobrecarga de PLC em setembro.</p></div><div className="rec-metrics"><span><small>IMPACTO ESTIMADO</small><b>Elimina +5 dias e +40% de sobrecarga</b></span><span><small>CUSTO ESTIMADO</small><b>+ R$ 48.000,00</b></span></div><button className="primary" onClick={()=>notify("Plano de aÃ§Ã£o criado e vinculado ao projeto TITANO.")}><CalendarBlank size={19}/>Criar plano de aÃ§Ã£o</button><button className="link-button" onClick={()=>notify("Alternativas: remanejar PLC ou antecipar o lote crÃ­tico de hardware.")}>Ver alternativas de mitigaÃ§Ã£o (2)</button></div></article>
    </div>
    <footer>Os resultados sÃ£o estimativas e dependem da precisÃ£o dos dados e das suposiÃ§Ãµes adotadas.</footer>
  </section>;
}

function SensorTag({className,icon:Icon,title,status="OK",fault=false,detail}) { return <div className={`sensor-tag ${className} ${fault?"fault":""}`}><Icon size={20}/><span><b>{title}</b><small>{fault?<XCircle weight="fill"/>:<CheckCircle weight="fill"/>}{status}</small><em>{detail}</em></span></div>; }

function Commissioning({fault,setFault,alerts,setAlerts,setActive,notify}) {
  const inject=()=>{setFault(true);if(!alerts.some(a=>a.id===initialAlert.id))setAlerts([initialAlert,...alerts]);notify("Falha crÃ­tica detectada: P0 aberto e SLA iniciado.")};
  const clear=()=>{setFault(false);notify("Sensor X normalizado. O histÃ³rico do P0 foi preservado.")};
  return <section className="page commissioning-page"><div className="commission-grid"><article className="twin-panel"><div className="panel-title"><div><b>Digital Twin</b><span>â€” Linha de ExpediÃ§Ã£o 01</span></div><span className={fault?"state fault":"state"}><Radio size={16} weight="fill"/>{fault?"Falha detectada":"OperaÃ§Ã£o normal"}</span></div>
    <div className="twin-stage"><img src={assetPath("conveyor-twin.png")} alt="Esteira de expediÃ§Ã£o com scanner, motor, sensor e grade de seguranÃ§a"/>
      <SensorTag className="plc" icon={Cpu} title="PLC" detail="Ãšltimo scan: 10:24:18"/><SensorTag className="scanner" icon={Barcode} title="Scanner de cÃ³digo" detail="Leitura: 10:24:17"/>
      <SensorTag className="motor" icon={Wrench} title="Motor" detail="Torque: 18,4 Nm"/><SensorTag className="sensor" icon={Eye} title="Sensor X" status={fault?"FALHA":"OK"} fault={fault} detail={fault?"0,00 mA Â· 10:23:56":"18,7 mA"}/>
      <SensorTag className="gate" icon={ShieldCheck} title="Safety Gate" detail="Estado: fechado"/>
    </div><div className="line-stats"><span><b>1,25 m/s</b><small>Velocidade da linha</small></span><span><b>8.432 un.</b><small>Volume processado hoje</small></span><span><b>97,6%</b><small>Disponibilidade</small></span></div></article>
    <aside className="incident-column"><div className={`incident ${fault?"active":"resolved"}`}><span className="incident-pill">{fault?"INCIDENTE ATIVO":"OPERAÃ‡ÃƒO NORMAL"}</span><h2>{fault?"P0 criado automaticamente":"Sensor normalizado"}</h2><p>{fault?"Falha crÃ­tica detectada no Sensor X e vinculada ao projeto TITANO.":"Telemetria estabilizada. O histÃ³rico do incidente foi preservado."}</p>
      <dl><div><dt>Projeto</dt><dd>TITANO</dd></div><div><dt>Prioridade</dt><dd className="danger">{fault?"P0 Â· CRÃTICO":"â€”"}</dd></div><div><dt>ResponsÃ¡vel</dt><dd>Rodrigo Baruco</dd></div><div><dt>SLA</dt><dd className="timer">{fault?"07:35:42":"encerrado"}</dd></div><div><dt>Fonte</dt><dd>IoT / CLP</dd></div></dl>
      <button className={fault?"danger-button":"primary"} onClick={fault?clear:inject}>{fault?<><ArrowCounterClockwise/>Normalizar sensor</>:<><Lightning/>Simular nova falha</>}</button></div>
      <div className="telemetry"><div className="panel-title"><b>EvidÃªncia</b><span>Telemetria do Sensor X</span></div><div className="telemetry-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={fault?telemetryData:telemetryData.map(x=>({...x,v:18}))}><defs><linearGradient id="redArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fb5470" stopOpacity={.45}/><stop offset="100%" stopColor="#fb5470" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#19253a" vertical={false}/><XAxis dataKey="t" tick={{fontSize:10}} stroke="#65728a"/><YAxis domain={[0,24]} tick={{fontSize:10}} stroke="#65728a"/><Area type="monotone" dataKey="v" stroke="#fb5470" fill="url(#redArea)" strokeWidth={3} isAnimationActive={false}/></AreaChart></ResponsiveContainer></div><button className="ghost" onClick={()=>setActive("evidence")}>Ver todas as evidÃªncias<ArrowRight/></button></div>
      <div className="future-vision-card">
        <div className="future-vision-head">
          <small>PLANO FUTURO PÃ“S-IMPLANTAÃ‡ÃƒO</small>
          <span>VISION</span>
        </div>
        <h3>O prÃ³ximo passo Ã© simular a linha inteira.</h3>
        <p>
          Depois do nÃºcleo operacional consolidado, o InventOps evolui de leitura e resposta
          para simulaÃ§Ã£o ponta a ponta da operaÃ§Ã£o conectada.
        </p>
        <ul className="future-vision-list">
          <li><Sparkle size={16}/><span><b>SimulaÃ§Ã£o da operaÃ§Ã£o</b><small>cenÃ¡rios de impacto antes do problema explodir</small></span></li>
          <li><Cpu size={16}/><span><b>Esteira + PLC + sensores</b><small>telemetria fÃ­sica conectada ao contexto do projeto</small></span></li>
          <li><CloudCheck size={16}/><span><b>Servidores + infraestrutura</b><small>operaÃ§Ã£o de TI entrando no mesmo quadro de decisÃ£o</small></span></li>
          <li><Circuitry size={16}/><span><b>WCS Velox no mesmo modelo</b><small>gÃªmeo digital real da execuÃ§Ã£o e do software</small></span></li>
        </ul>
        <button className="ghost" onClick={()=>setActive("lifecycle")}>Abrir visÃ£o do roadmap<ArrowRight/></button>
      </div>
    </aside></div></section>;
}

function EvidenceItem({icon:Icon,label,value,ok=true}) { return <li><Icon size={18}/><span>{label}</span><b className={ok?"ok":"warn"}>{value}</b></li>; }

function DecisionRoom({setActive,notify}){ return <section className="page decision-page"><div className="decision-toolbar"><div><b>Linha do tempo de dependÃªncias e capacidade</b><span>Projetos selecionados e equipe compartilhada</span></div><button className="ghost" onClick={()=>notify("Janela de decisÃ£o fixada em julhoâ€“setembro de 2026.")}><CalendarBlank/>Jul â€” Set 2026<CaretDown/></button></div>
  <div className="timeline"><div className="months"><span>JUL 2026</span><span>AGO 2026</span><span>SET 2026</span></div><div className="project-row"><header><b>TITANO</b><span>Go Live: 20/07/2026</span></header><div className="track"><i className="bar titano">Desenvolvimento & IntegraÃ§Ãµes</i><i className="risk-marker">Atraso previsto 12 dias</i></div></div><div className="project-row"><header><b>QUELUZ</b><span>Go Live: 30/07/2026</span></header><div className="track"><i className="bar queluz">Desenvolvimento & IntegraÃ§Ãµes</i><i className="risk-marker second">Atraso em cascata 8 dias</i></div></div><div className="capacity-row"><header><UsersThree/><b>Equipe PLC</b><span>Equipe compartilhada</span></header><div><CapacityChart compact/></div></div></div>
  <div className="evidence-decision"><article><div className="section-heading"><b>EvidÃªncias que explicam o cenÃ¡rio</b><span>Progresso real reportado atÃ© 11/07/2026</span></div><div className="evidence-columns"><div><h3>TITANO</h3><ul><EvidenceItem icon={CheckSquare} label="Infra" value="4/5 checklists"/><EvidenceItem icon={GitCommit} label="Dev" value="12 commits vÃ¡lidos"/><EvidenceItem icon={TestTube} label="Comissionamento" value="18/20 testes"/></ul></div><div><h3>QUELUZ</h3><ul><EvidenceItem icon={CheckSquare} label="Infra" value="5/5 checklists"/><EvidenceItem icon={GitCommit} label="Dev" value="9 commits vÃ¡lidos"/><EvidenceItem icon={TestTube} label="Comissionamento" value="10/20 testes" ok={false}/></ul></div><div><h3>Equipe PLC</h3><ul><EvidenceItem icon={UsersThree} label="AlocaÃ§Ã£o planejada" value="92%"/><EvidenceItem icon={ChartLineUp} label="AlocaÃ§Ã£o projetada" value="117%" ok={false}/><EvidenceItem icon={Timer} label="Horas extras" value="+128 h" ok={false}/></ul></div></div></article>
    <article className="decision-rec"><div className="section-heading"><b>RecomendaÃ§Ã£o</b><span>AÃ§Ã£o com melhor impacto no prazo do portfÃ³lio.</span></div><div><Lightning size={26} weight="fill"/><h3>Repriorizar a Equipe PLC apÃ³s 20/07 para antecipar o comissionamento do TITANO.</h3><span><b>-6 dias</b> no atraso do TITANO</span><span><b>-4 dias</b> no atraso do QUELUZ</span></div><button className="primary" onClick={()=>setActive("simulator")}>Comparar cenÃ¡rios</button></article></div>
  </section>; }

function StatusBadge({status}) { return <span className={`status-badge status-${status.toLowerCase().replaceAll(" ","-")}`}>{status}</span>; }
function RiskBadge({risk}) { return <span className={`risk-badge risk-${risk.toLowerCase()}`}><i/>{risk}</span>; }

function PortfolioPage({projects,setProjects,setActive,setSelectedProject,setProjectModalOpen,setImportedDemands,notify}) {
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
        const code=((data.sections.ge&&data.sections.ge.g2)||"S/CÃ“DIGO").trim();
        if(projects.some(p=>p.code===code||p.name===name.toUpperCase())){notify(`${name} (${code}) jÃ¡ estÃ¡ no portfÃ³lio â€” nada foi duplicado.`);return}
        const secs=Object.entries(data.progress).map(([k,v])=>({k,title:v.title,pct:v.pct,pend:Math.max(0,v.total-v.filled)}));
        const demands=[];
        for(const [k,fields] of Object.entries(data.sections)){
          if(typeof fields!=="object"||!fields)continue;
          for(const [f,val] of Object.entries(fields)){
            if(String(val).trim().toLowerCase()==="tbd"){
              const dept=SEC2DEPT[k]||"PMO";
              const secTitle=(data.progress[k]&&data.progress[k].title)||k;
              demands.push({dept,project:name.toUpperCase(),title:IF_LABELS[f]||`${secTitle} â€” definiÃ§Ã£o pendente (${f})`,to:"PMO",due:"kickoff"});
            }
          }
        }
        const byDept={};demands.forEach(d=>{byDept[d.dept]=(byDept[d.dept]||0)+1});
        const golive=((data.sections.ge&&data.sections.ge.g_golive)||"").trim()||"a definir";
        setPreview({name,code,golive,totalPct:data.meta.total_pct,secs,demands,byDept,
          project:{name:name.toUpperCase(),code,client:((data.sections.ge&&data.sections.ge.g5)||"Cliente a definir").trim(),location:((data.sections.ge&&data.sections.ge.g3)||"Local a definir").trim().replace(/[-Â·]\s*$/,""),owner:"Daiana Costa",pmo:"A definir",status:"Em andamento",risk:"Baixo",phase:1,progress:0,next:"Kickoff tÃ©cnico",date:golive,health:75,blocker:"Sem bloqueio registrado.",nextAction:"Distribuir as pendÃªncias do kickoff pelas Ã¡reas responsÃ¡veis.",milestones:["Kickoff importado do Nexus Â· hoje",`Go Live Â· ${golive}`]}});
      }catch{notify("Arquivo invÃ¡lido â€” esperado um Nexus_Kickoff_*.json gerado pelo Nexus.")}
    };
    reader.readAsText(file);
  };
  const applyImport=()=>{
    setProjects([preview.project,...projects]);
    setImportedDemands(d=>[...d,...preview.demands]);
    notify(`${preview.name} importado: ${preview.demands.length} pendÃªncias distribuÃ­das para ${Object.keys(preview.byDept).length} Ã¡reas. Veja em Operação Assistida.`);
    setPreview(null);
  };
  useEffect(()=>{if(!creating)return;const close=event=>event.key==="Escape"&&setCreating(false);document.addEventListener("keydown",close);return()=>document.removeEventListener("keydown",close)},[creating]);
  const shown=projects.filter(p=>(filter==="Todos"||p.status===filter||p.risk===filter)&&`${p.name} ${p.client} ${p.code}`.toLowerCase().includes(search.toLowerCase()));
  const openProject=(project)=>{setSelectedProject(project);setProjectModalOpen(true)};
  const createProject=(event)=>{event.preventDefault();const name=draft.name.trim().toUpperCase();if(!name)return;const project={name,code:`I26.${String(projects.length+4100)}`,client:draft.client.trim()||"Cliente a definir",location:"Local a definir",owner:draft.owner,pmo:"A definir",status:"Em andamento",risk:"Baixo",phase:1,progress:0,next:"Kickoff",date:"A definir",health:75,blocker:"Sem bloqueio registrado.",nextAction:"Definir escopo, responsÃ¡veis e data do kickoff.",milestones:["Kickoff Â· A definir","Baseline Â· A definir","Go Live Â· A definir"]};setProjects([project,...projects]);setCreating(false);setDraft({name:"",client:"",owner:"Daiana Costa"});notify(`Projeto ${name} criado no portfÃ³lio.`)};
  return <section className="page portfolio-page">
    <div className="portfolio-kpis">
      <article><FolderOpen/><span><small>CARTEIRA OPERACIONAL</small><b>{projects.length} projetos</b><em>Base operacional priorizada</em></span></article>
      <article><TrendUp/><span><small>SAÃšDE MÃ‰DIA</small><b>68/100</b><em>2 projetos pedem aÃ§Ã£o</em></span></article>
      <article><Warning/><span><small>RISCO ALTO</small><b>2 projetos</b><em>Market Peru e Navepark</em></span></article>
      <article><FlagCheckered/><span><small>PRÃ“XIMOS 30 DIAS</small><b>4 marcos</b><em>2 Go Lives confirmados</em></span></article>
    </div>
    <div className="portfolio-toolbar"><div><h2>PortfÃ³lio operacional</h2><p>Da estratÃ©gia Ã  atividade: cada nÃºmero abre a evidÃªncia que o sustenta.</p></div><div className="portfolio-view-actions"><span><button className={view==="kanban"?"active":""} onClick={()=>setView("kanban")}><SquaresFour/>Kanban</button><button className={view==="table"?"active":""} onClick={()=>setView("table")}><Rows/>Lista</button></span><button className="ghost" onClick={()=>fileRef.current&&fileRef.current.click()} title="Importa um Nexus_Kickoff_*.json â€” o projeto nasce com as pendÃªncias distribuÃ­das pelas Ã¡reas"><UploadSimple/>Importar kickoff</button><input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={handleFile} aria-label="Importar kickoff do Nexus"/><button className="primary" onClick={()=>setCreating(true)}><Plus/>Novo projeto</button></div></div>
    <div className="portfolio-filters"><label><MagnifyingGlass/><input aria-label="Buscar projeto" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar projeto, cliente ou cÃ³digo"/></label><Funnel/>{["Todos","Em andamento","Bloqueado","Alto"].map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{x}</button>)}</div>
    {view==="kanban"?<div className="portfolio-kanban">{[["Em andamento",shown.filter(p=>p.status==="Em andamento")],["Bloqueado",shown.filter(p=>p.status==="Bloqueado")],["ConcluÃ­do",shown.filter(p=>p.status==="ConcluÃ­do")]].map(([status,items])=><section key={status}><header><span><i className={`kanban-dot ${status.toLowerCase().replaceAll(" ","-")}`}/><b>{status}</b></span><em>{items.length}</em></header><div>{items.map(p=><button key={p.name} onClick={()=>openProject(p)} aria-label={`Abrir projeto ${p.name}`}><span className="kanban-card-top"><small>{p.code}</small><RiskBadge risk={p.risk}/></span><h3>{p.name}</h3><p>{p.client} Â· {p.location}</p><span className="kanban-phase"><small>FASE {p.phase}/7</small><b>{phaseNames[p.phase-1]}</b></span><span className="kanban-progress evidence-tooltip" tabIndex="0" data-tooltip={`${p.progress}% calculado por evidÃªncias tÃ©cnicas verificadas.`}><i><em style={{width:`${p.progress}%`}}/></i><b>{p.progress}%</b></span><footer><span className="avatar">{p.owner[0]}</span><span><small>PRÃ“XIMO MARCO</small><b>{p.next} Â· {p.date}</b></span><ArrowRight/></footer></button>)}</div>{!items.length?<p className="kanban-empty">Nenhum projeto nesta etapa.</p>:null}</section>)}</div>:null}
    {view==="table"?<div className="portfolio-table"><header><span>Projeto</span><span>Fase atual</span><span>Progresso</span><span>Risco</span><span>PrÃ³ximo marco</span><span>ResponsÃ¡vel</span><span/></header>
      {shown.map(p=><button key={p.name} className="portfolio-row" onClick={()=>openProject(p)} aria-label={`Abrir projeto ${p.name}`}>
        <span className="project-identity"><b>{p.name}</b><small>{p.code} Â· {p.client}</small></span><span><StatusBadge status={p.status}/><small>{phaseNames[p.phase-1]}</small></span>
        <span className="portfolio-progress evidence-tooltip" tabIndex="0" data-tooltip={`${p.progress}% = 35% entregÃ¡veis + 25% checklists + 20% commits vÃ¡lidos + 20% testes aprovados.`}><i><em style={{width:`${p.progress}%`}}/></i><b>{p.progress}%</b></span><RiskBadge risk={p.risk}/>
        <span><b>{p.next}</b><small>{p.date}</small></span><span><b>{p.owner}</b><small>PMO {p.pmo}</small></span><ArrowRight/>
      </button>)}
      {!shown.length?<div className="empty"><MagnifyingGlass size={32}/>Nenhum projeto encontrado.</div>:null}
    </div>:null}
    <div className="portfolio-bottom"><article><div className="section-heading"><b>Capacidade das equipes</b><span>Carga projetada para os prÃ³ximos 90 dias.</span></div><CapacityChart compact/></article><article className="attention-list"><div className="section-heading"><b>Fila de atenÃ§Ã£o</b><span>Onde a governanÃ§a deve agir primeiro.</span></div><div><strong>01</strong><span><b>MARKET PERU</b><small>3 dependÃªncias externas sem data confirmada</small></span><em>Escalar hoje</em></div><div><strong>02</strong><span><b>NAVEPARK</b><small>Ambiente HML compromete o marco de agosto</small></span><em>Definir dono</em></div></article></div>
    {preview?<div className="modal-layer" role="presentation" onMouseDown={e=>e.target===e.currentTarget&&setPreview(null)}><div className="project-modal import-preview" role="dialog" aria-modal="true" aria-labelledby="imp-title">
      <div><span className="project-symbol">â‡ª</span><div><h2 id="imp-title">Importar kickoff Â· {preview.name}</h2><p>{preview.code} Â· Go Live {preview.golive} Â· kickoff {preview.totalPct}% preenchido no Nexus</p></div><button type="button" aria-label="Fechar" onClick={()=>setPreview(null)}><XCircle/></button></div>
      <div className="imp-depts"><b>{preview.demands.length} pendÃªncias serÃ£o distribuÃ­das:</b><div>{Object.entries(preview.byDept).map(([d,n])=><span key={d}><b>{d}</b>{n}</span>)}</div></div>
      <div className="imp-secs">{preview.secs.map(s=><div key={s.k}><span>{s.title}</span><i><em style={{width:`${s.pct}%`}}/></i><small>{s.pct}%{s.pend?` Â· ${s.pend} pend.`:""}</small></div>)}</div>
      <p className="imp-note">Prévia — nada é aplicado antes de confirmar. Cada pendência aparece na Operação Assistida da área responsável.</p>
      <div className="modal-actions"><button type="button" className="ghost" onClick={()=>setPreview(null)}>Cancelar</button><button className="primary" type="button" onClick={applyImport}><UploadSimple/>Confirmar import</button></div>
    </div></div>:null}
    {creating?<div className="modal-layer" role="presentation" onMouseDown={e=>e.target===e.currentTarget&&setCreating(false)}><form className="project-modal" role="dialog" aria-modal="true" aria-labelledby="new-project-title" onSubmit={createProject}><div><span className="project-symbol">NP</span><div><h2 id="new-project-title">Novo projeto</h2><p>Crie a estrutura mÃ­nima. Fases e atividades entram em seguida.</p></div><button type="button" aria-label="Fechar" onClick={()=>setCreating(false)}><XCircle/></button></div><label>Nome do projeto<input autoFocus value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})} placeholder="Ex.: EXPANSÃƒO CD SUL" required/></label><label>Cliente<input value={draft.client} onChange={e=>setDraft({...draft,client:e.target.value})} placeholder="Empresa ou unidade"/></label><label>ResponsÃ¡vel<select value={draft.owner} onChange={e=>setDraft({...draft,owner:e.target.value})}><option>Daiana Costa</option><option>Rodrigo Baruco</option><option>Admin</option></select></label><div className="modal-actions"><button type="button" className="ghost" onClick={()=>setCreating(false)}>Cancelar</button><button className="primary" type="submit"><Plus/>Criar projeto</button></div></form></div>:null}
  </section>;
}

function ProjectWorkspace({project,setActive,notify}) {
  const [tab,setTab]=useState("overview");
  const [reportOpen,setReportOpen]=useState(false);
  const [activities,setActivities]=useState(()=>baseActivities.map((a,i)=>({...a,id:`${project.name}-${i}`})));
  const updateActivity=(id,status)=>setActivities(current=>current.map(a=>a.id===id?{...a,status}:a));
  const addActivity=()=>{if(activities.some(a=>a.new))return;setActivities([...activities,{id:`${project.name}-new`,name:"Revisar plano integrado com todas as Ã¡reas",phase:"ImplantaÃ§Ã£o",owner:"Daiana",due:"29 jul",status:"NÃ£o iniciado",evidence:"A definir",new:true}]);notify("Nova atividade adicionada ao plano do projeto.")};
  const done=activities.filter(a=>a.status==="ConcluÃ­do").length;
  const hasBlocker=!project.blocker.startsWith("Sem bloqueio");
  return <section className="page project-page">
    <div className="project-top-actions"><button className="back-button" onClick={()=>setActive("portfolio")}><ArrowLeft/>Voltar ao portfÃ³lio</button><button className="ghost" onClick={()=>setReportOpen(true)}><ClipboardText/>Gerar Status Report</button></div>
    <div className="project-head"><div className="project-symbol">{project.name.slice(0,2)}</div><div><div className="project-title-line"><h2>{project.name}</h2><StatusBadge status={project.status}/><RiskBadge risk={project.risk}/></div><p>{project.code} Â· {project.client} Â· <MapPin/>{project.location}</p></div><div className="project-owner"><span className="avatar">D</span><span><small>RESPONSÃVEL</small><b>{project.owner}</b><em>PMO {project.pmo}</em></span></div></div>
    <div className="project-scorebar"><span><small>SAÃšDE DO PROJETO</small><b>{project.health}/100</b><i><em style={{width:`${project.health}%`}}/></i></span><span className="evidence-tooltip" tabIndex="0" data-tooltip="73% calculado por entregÃ¡veis aceitos, 4/5 checklists, 12 commits vÃ¡lidos e 18/20 testes aprovados."><small>PROGRESSO COM EVIDÃŠNCIA</small><b>{project.progress}%</b><i><em style={{width:`${project.progress}%`}}/></i></span><span><small>PRÃ“XIMO MARCO</small><b>{project.next}</b><em>{project.date}</em></span><span><small>PLANO DE TRABALHO</small><b>{done}/{activities.length}</b><em>atividades concluÃ­das</em></span></div>
    <div className="project-tabs" role="tablist">{[["overview","VisÃ£o geral"],["activities","Plano de trabalho"],["risks","Marcos & riscos"]].map(([id,label])=><button role="tab" aria-selected={tab===id} className={tab===id?"active":""} key={id} onClick={()=>setTab(id)}>{label}</button>)}</div>
    {tab==="overview"?<div className="project-overview">
      <article className="phase-card"><div className="section-heading"><b>Jornada do projeto</b><span>Fases e gates de governanÃ§a.</span></div><div className="phase-rail">{phaseNames.map((name,i)=>{const state=i+1<project.phase?"done":i+1===project.phase?"current":"future";return <div className={state} key={name}><i>{state==="done"?<CheckCircle weight="fill"/>:i+1}</i><span><b>{name}</b><small>{state==="done"?"Gate aprovado":state==="current"?"Fase atual":"A iniciar"}</small></span></div>})}</div></article>
      <aside className="governance-card"><div className="section-heading"><b>PrÃ³xima aÃ§Ã£o</b><span>A cobranÃ§a que move o projeto.</span></div><h3>{project.nextAction}</h3><dl><div><dt>Dono</dt><dd>{project.owner}</dd></div><div><dt>Prazo</dt><dd>15 jul 2026</dd></div><div><dt>Criticidade</dt><dd><RiskBadge risk={project.risk}/></dd></div></dl><button className="primary" onClick={()=>notify(`CobranÃ§a registrada para ${project.owner}.`)}>Registrar cobranÃ§a</button></aside>
      <article className="evidence-summary"><div className="section-heading"><b>EvidÃªncias de execuÃ§Ã£o</b><span>O progresso sÃ³ avanÃ§a quando existe entrega verificÃ¡vel.</span></div><div><span><CheckSquare/><b>4/5</b><small>checklists de infraestrutura</small></span><span><GitCommit/><b>12</b><small>commits em base homologada</small></span><span><TestTube/><b>18/20</b><small>testes aprovados</small></span><span><CloudCheck/><b>3</b><small>documentos aceitos</small></span></div></article>
      <article className="milestone-summary"><div className="section-heading"><b>Marcos principais</b><span>Datas que dirigem as decisÃµes.</span></div>{project.milestones.map((m,i)=><div key={m}><i className={i===0?"active":""}/><span><b>{m.split(" Â· ")[0]}</b><small>{m.split(" Â· ")[1]||"Data a confirmar"}</small></span></div>)}</article>
      <article className="sharepoint-card"><div className="section-heading"><b>Documentos do projeto</b><span>Os arquivos oficiais vivem no SharePoint â€” cofre Ãºnico da empresa.</span></div>
        <div className="sp-row"><span className="sp-ico">ðŸ“</span><div><b>PÃ¡gina do projeto no SharePoint</b><small>{project.code} Â· specs, atas, evidÃªncias e anexos compartilhados entre os times</small></div>
        <a className="sp-open" href={sharePointUrl(project.code)} target="_blank" rel="noopener noreferrer">Abrir no SharePoint â†—</a></div>
        <small className="sp-note">Acesso com a conta corporativa M365 Â· upload direto pelo InventOps chega na Era 3 do roadmap.</small></article>
    </div>:null}
    {tab==="activities"?<div className="workplan"><div className="workplan-head"><div><h3>Plano de trabalho integrado</h3><p>Atividades, responsÃ¡veis, prazos e evidÃªncias.</p></div><button className="primary" onClick={addActivity}><Plus/>Nova atividade</button></div><div className="activity-table"><header><span>Atividade</span><span>Fase</span><span>ResponsÃ¡vel</span><span>Prazo</span><span>EvidÃªncia</span><span>Status</span></header>{activities.map(a=><div key={a.id}><span><b>{a.name}</b>{a.new?<small>Adicionada agora</small>:null}</span><span>{a.phase}</span><span><User/>{a.owner}</span><span><CalendarBlank/>{a.due}</span><span><LinkSimple/>{a.evidence}</span><select aria-label={`Status de ${a.name}`} value={a.status} onChange={e=>updateActivity(a.id,e.target.value)}><option>NÃ£o iniciado</option><option>Em andamento</option><option>Aguardando</option><option>ConcluÃ­do</option></select></div>)}</div></div>:null}
    {tab==="risks"?<div className="risk-workspace"><article className={hasBlocker?"has-blocker":"clear-risk"}><div className="section-heading"><b>{hasBlocker?"Bloqueador atual":"SituaÃ§Ã£o monitorada"}</b><span>{hasBlocker?"Problema materializado que exige correÃ§Ã£o.":"Nenhum impedimento crÃ­tico registrado."}</span></div>{hasBlocker?<Warning size={30}/>:<ShieldCheck size={30}/>}<h3>{project.blocker}</h3><dl><div><dt>EstratÃ©gia</dt><dd>{hasBlocker?"Mitigar":"Monitorar"}</dd></div><div><dt>ResponsÃ¡vel</dt><dd>{project.owner}</dd></div><div><dt>RevisÃ£o</dt><dd>{hasBlocker?"DiÃ¡ria":"Semanal"}</dd></div></dl><button className={hasBlocker?"danger-button":"primary"} onClick={()=>notify(hasBlocker?"Plano de resposta atualizado e responsÃ¡vel notificado.":"Novo risco registrado para acompanhamento.")}>{hasBlocker?"Atualizar plano de resposta":"Registrar novo risco"}</button></article><article><div className="section-heading"><b>Marcos e decisÃµes</b><span>Linha do tempo contratual e operacional.</span></div><div className="decision-log">{project.milestones.map((m,i)=><div key={m}><i className={i===0?"active":""}/><span><b>{m}</b><small>{i===0?"EvidÃªncia anexada":"DependÃªncias monitoradas"}</small></span></div>)}</div><button className="ghost" onClick={()=>notify("DecisÃ£o registrada na linha do tempo do projeto.")}><Plus/>Registrar decisÃ£o</button></article></div>:null}
    {reportOpen?<StatusReportModal project={project} onClose={()=>setReportOpen(false)} notify={notify}/>:null}
  </section>;
}

function AlertsPage({alerts,setAlerts}) { const [filter,setFilter]=useState("Todos"); const shown=filter==="Todos"?alerts:alerts.filter(a=>a.priority===filter||a.status===filter); const active=alerts.filter(a=>a.status!=="Resolvido"); return <section className="page list-page"><div className="summary-strip"><span><b>{active.filter(a=>a.priority==="P0").length}</b>P0 crÃ­tico</span><span><b>{active.filter(a=>a.priority==="P1").length}</b>P1 alto risco</span><span><b>{active.filter(a=>a.priority==="P2").length}</b>P2 atenÃ§Ã£o</span><span><b>7h35</b>menor SLA</span></div><div className="filter-row">{["Todos","P0","P1","P2","Em triagem","Em aÃ§Ã£o","Resolvido"].map(x=><button className={filter===x?"active":""} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div><div className="alert-table smart-triage"><header><span>Alerta</span><span>Projeto</span><span>ResponsÃ¡vel</span><span>SLA</span><span>Status</span></header>{shown.length?shown.map(a=><div className="alert-row" key={a.id}><span><i className={`alert-priority ${a.priority.toLowerCase()}`}>{a.priority}</i><b>{a.title}</b><small>{a.description}</small></span><span>{a.project}<small>{a.source}</small></span><span>{a.owner}</span><span className={a.status==="Resolvido"?"resolved-time":a.priority==="P0"?"timer":"triage-sla"}>{a.status==="Resolvido"?"Encerrado":a.priority==="P0"?"07:35:42":a.priority==="P1"?"23:18:10":"46:42:08"}</span><select aria-label={`Status do alerta ${a.id}`} value={a.status} onChange={e=>setAlerts(alerts.map(x=>x.id===a.id?{...x,status:e.target.value}:x))}><option>Em triagem</option><option>Em aÃ§Ã£o</option><option>Resolvido</option></select></div>):<div className="empty"><CheckCircle size={34}/>Nenhum alerta nesta etapa.</div>}</div></section>; }

function EvidencePage(){ const rows=[{project:"TITANO",progress:73,infra:"4/5",dev:"12",tests:"18/20",confidence:"Alta"},{project:"QUELUZ",progress:68,infra:"5/5",dev:"9",tests:"10/20",confidence:"MÃ©dia"},{project:"MARKET PERU",progress:42,infra:"3/5",dev:"6",tests:"4/20",confidence:"MÃ©dia"}]; return <section className="page evidence-page"><div className="evidence-hero"><div><small>FAROL DE PRODUTIVIDADE</small><h2>Progresso que explica a si mesmo</h2><p>O percentual combina entregÃ¡veis aceitos, checklists, atividade vÃ¡lida em base homologada e testes de comissionamento.</p></div><div className="formula"><span>35%</span><b>EntregÃ¡veis</b><span>25%</span><b>Checklists</b><span>20%</span><b>Commits vÃ¡lidos</b><span>20%</span><b>Testes aprovados</b></div></div><div className="evidence-table"><header><span>Projeto</span><span>Progresso</span><span>Infra</span><span>Dev</span><span>Comissionamento</span><span>ConfianÃ§a</span></header>{rows.map(r=><div key={r.project}><b>{r.project}</b><span className="progress-cell"><span className="evidence-progress" aria-hidden="true"><i style={{width:`${r.progress}%`}}/></span><strong>{r.progress}%</strong></span><span>{r.infra} checklists</span><span>{r.dev} commits</span><span>{r.tests} testes</span><em>{r.confidence}</em></div>)}</div></section>; }

function Home({setActive}) {
  const spotlight = [
    { value: "14", label: "Ã¡reas coordenadas", tone: "cyan" },
    { value: "6", label: "projetos crÃ­ticos no radar", tone: "purple" },
    { value: "3", label: "decisÃµes do dia", tone: "gold" },
  ];
  const modules = [
    { id: "portfolio", icon: FolderOpen, title: "Controle de Projetos", body: "PortfÃ³lio, fases, atividades, marcos, evidÃªncias e riscos em uma Ãºnica linha de execuÃ§Ã£o.", note: "Espinha operacional" },
    { id: "simulator", icon: Sparkle, title: "Simulador de Impacto", body: "Antecipe atrasos, sobrecarga e conflito de capacidade antes que virem custo ou atraso real.", note: "Leitura preditiva" },
    { id: "commissioning", icon: Factory, title: "Comissionamento", body: "Conecte a telemetria fÃ­sica ao Smart Triage e transforme falha de campo em priorizaÃ§Ã£o imediata.", note: "ChÃ£o de fÃ¡brica vivo" },
  ];
  const decisionCards = [
    ["TITANO", "Sensor X exige decisÃ£o hoje", "Go Live protegido se o plano fÃ­sico for fechado atÃ© 18:00."],
    ["MARKET PERU", "VPN e range IP seguem crÃ­ticos", "Infraestrutura ainda dita a janela real de homologaÃ§Ã£o."],
    ["NAVEPARK", "Topologia HML continua no centro", "A decisÃ£o tÃ©cnica destrava DEV sem paralisar as outras Ã¡reas."],
  ];
  return <section className="page home-page premium-home">
    <div className="home-hero">
      <small>OPERAÇÃO ASSISTIDA · IMPLANTAÇÃO & DEVOPS</small>
      <h2>Conecte pessoas, evidÃªncias e decisÃµes antes que o atraso vire operaÃ§Ã£o.</h2>
      <p>O InventOps organiza a carteira inteira em uma Ãºnica verdade operacional. VocÃª enxerga o que destravar agora, quem estÃ¡ esperando e qual impacto cada decisÃ£o provoca nos prÃ³ximos marcos.</p>
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

function SettingsPage(){ const [settings,setSettings]=useState({p0:true,capacity:true,evidence:true}); return <section className="page settings-page"><div className="settings-card"><h2>Regras de governanÃ§a</h2><p>Controles ativos do produto. Nenhuma chave externa Ã© armazenada no navegador.</p>{[["p0","Criar P0 automaticamente","Falhas crÃ­ticas de sensores abrem um alerta com SLA."],["capacity","Monitorar sobrecarga de capacidade","Avise quando uma equipe ultrapassar 100% de alocaÃ§Ã£o."],["evidence","Exigir evidÃªncia para progresso","Percentuais sÃ³ avanÃ§am com entregÃ¡veis verificÃ¡veis."]].map(([k,t,d])=><label key={k}><span><b>{t}</b><small>{d}</small></span><input type="checkbox" checked={settings[k]} onChange={()=>setSettings({...settings,[k]:!settings[k]})}/><i/></label>)}</div><div className="settings-card"><h2>Fontes conectadas</h2><p>Estado operacional atual das integraÃ§Ãµes e leituras ativas.</p><ul className="sources"><li><Circuitry/><span><b>CLP Â· Linha 01</b><small>Ãšltima leitura hÃ¡ 2s</small></span><em>Conectado</em></li><li><Database/><span><b>Base homologada</b><small>Commits e builds vÃ¡lidos</small></span><em>Conectado</em></li><li><LinkSimple/><span><b>Planejamento</b><small>Projetos e dependÃªncias</small></span><em>Conectado</em></li></ul></div></section>; }

export function App() {
  const [authenticated,setAuthenticated]=useState(()=>sessionStorage.getItem("inventops-session")==="active");
  const [active,setActive]=useState("home");
  const [lang,setLang]=useState(()=>sessionStorage.getItem("inventops-lang")||"pt");
  const [role,setRole]=useState("Admin");
  const [theme,setTheme]=useState("Escuro");
  const [cockpitDept,setCockpitDept]=useState("IMP");
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
  const updateProject=useCallback(updated=>{setProjects(current=>current.map(p=>p.code===updated.code?updated:p));setSelectedProject(updated)},[]);
  const openFullProject=()=>{setProjectModalOpen(false);setActive("project")};
  const login=()=>{sessionStorage.setItem("inventops-session","active");setAuthenticated(true);setActive("home")};
  const logout=()=>{sessionStorage.removeItem("inventops-session");setAuthenticated(false);setRole("Admin");setActive("home")};
  const openPilotContext=(user)=>{setCockpitDept(user.dept||"INF");setActive("cockpit")};
  const openCockpitDept=(dept)=>{setCockpitDept(dept||"INF");setActive("cockpit")};
  if(!authenticated)return <LoginScreen onLogin={login}/>;
  const allowed={
    Admin:"*",
    Diretoria:["home","management","analytics","executive","portfolio","project","pmo","cockpit","areas","simulator","decision","evidence","presentation","lifecycle"],
    Gestor:["home","action","management","portfolio","project","pmo","cockpit","areas","alerts","raid","evidence","presentation","lifecycle"],
    Analista:["home","action","portfolio","project","cockpit","areas","alerts","commissioning","evidence","presentation"]
  };
  const canAccess=allowed[role]==="*"||allowed[role].includes(active);
  const pages={
    home:<ExecutiveDashboard projects={projects} setActive={setActive} openCockpitDept={openCockpitDept} lang={lang}/>,
    action:<ActionCenter notify={notify}/>,management:<ManagementPage/>,analytics:<AnalyticsPage/>,
    executive:<ExecutiveOnePager projects={projects} notify={notify}/>,
    portfolio:<PortfolioPage projects={projects} setProjects={setProjects} setActive={setActive} setSelectedProject={setSelectedProject} setProjectModalOpen={setProjectModalOpen} setImportedDemands={setImportedDemands} notify={notify}/>,
    pmo:<PmoControlTower projects={projects} onOpenProject={project=>{setSelectedProject(project);setProjectModalOpen(true)}} notify={notify}/>,
    project:<ProjectWorkspace key={selectedProject.name} project={selectedProject} setActive={setActive} notify={notify}/>,
    cockpit:<DepartmentCockpit notify={notify} imported={importedDemands} initialDept={cockpitDept}/>,
    areas:<AreasPage/>,raid:<RaidPage/>,admin:<AdminGovernance role={role} setRole={setRole} theme={theme} setTheme={setTheme} notify={notify} onOpenPilotUser={openPilotContext}/>,
    presentation:<PresentationPage notify={notify}/>,lifecycle:<LifecyclePage/>,simulator:<Simulator scenario={scenario} setScenario={setScenario} notify={notify}/>,
    commissioning:<Commissioning fault={fault} setFault={setFault} alerts={alerts} setAlerts={setAlerts} setActive={setActive} notify={notify}/>,
    decision:<DecisionRoom setActive={setActive} notify={notify}/>,alerts:<AlertsPage alerts={alerts} setAlerts={setAlerts}/>,
    evidence:<EvidencePage/>,settings:<SettingsPage/>
  };
  const page=canAccess?pages[active]:<AccessDenied setActive={setActive}/>;
  return <div className="app-shell" data-theme={theme}><SidebarEnhanced active={active} setActive={setActive} alertCount={alerts.filter(a=>a.status!=="Resolvido").length} notify={notify} role={role} onLogout={logout}/><main className="workspace"><Topbar active={active} role={role} onLogout={logout} notify={notify} lang={lang} setLang={setLang}/><DemoJourneyRail active={active} setActive={setActive} lang={lang} />{page}</main>{projectModalOpen&&selectedProject?<ProjectControlModal project={selectedProject} onClose={()=>setProjectModalOpen(false)} onUpdate={updateProject} onOpenFull={openFullProject} notify={notify}/>:null}{message?<div className="toast" role="status"><CheckCircle weight="fill"/>{message}</div>:null}</div>;
}

