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
  {name:"TITANO",code:"I25.8049",client:"Stellantis",location:"Betim · MG",owner:"Daiana Costa",pmo:"Alex",status:"Em andamento",risk:"Médio",phase:4,progress:73,next:"Go Live operacional",date:"20 jul 2026",health:78,blocker:"Sem bloqueio crítico. Servidor SaaS AWS em provisionamento.",nextAction:"Agendar VPN site-to-site e consolidar evidências de segurança.",milestones:["Servidor SaaS aprovado · 23/06","Go Live operacional · 20/07","OAuth2 · D+20 após Go Live"]},
  {name:"QUELUZ",code:"I25.3505",client:"D. Müller",location:"Itajaí · SC",owner:"Daiana Costa",pmo:"Fabio",status:"Em andamento",risk:"Médio",phase:4,progress:68,next:"GL1 · Conferência",date:"30 jul 2026",health:72,blocker:"SSH porta 9844 e VPN do time de Dados aguardando confirmação do cliente.",nextAction:"Garantir ambiente HML liberado antes do GL1.",milestones:["GL1 Conferência · 30/07","GL2 Sorter · 30/09","GL3 IA · 30/11","GL4 PBL · 25/01/27"]},
  {name:"MARKET PERU",code:"I25.115",client:"Tottus / Falabella",location:"Lima · Peru",owner:"Daiana Costa",pmo:"Giovanni",status:"Bloqueado",risk:"Alto",phase:3,progress:42,next:"Infra de testes",date:"28 jul 2026",health:41,blocker:"VPN site-to-site, range IP /24 e emulador WCS ainda pendentes.",nextAction:"Escalar definições de rede e homologar arquitetura HA/DR.",milestones:["Servidores IA entregues · 05/06","Infra de testes · 28/07","Equipamentos export · out/26"]},
  {name:"NAVEPARK",code:"I25.4066",client:"Vedamotors",location:"Navegantes · SC",owner:"Daiana Costa",pmo:"Anderson",status:"Bloqueado",risk:"Alto",phase:3,progress:51,next:"Ambiente HML",date:"14 ago 2026",health:48,blocker:"VMs Oracle KVM e desenho de arquitetura de rede pendentes.",nextAction:"Cobrar retorno do cliente e fechar topologia das VMs.",milestones:["VPN IPSec recebida","Ambiente HML · 14/08","Go Live · 07/09"]},
  {name:"BP",code:"I24.215",client:"Baspan",location:"São Paulo · SP",owner:"Daiana Costa",pmo:"Giovanni",status:"Em andamento",risk:"Baixo",phase:5,progress:84,next:"Go Live",date:"03 ago 2026",health:86,blocker:"Sem bloqueio crítico; acompanhar disponibilidade do fornecedor PTL.",nextAction:"Concluir homologação e confirmar equipe de campo.",milestones:["REV14 aprovada · 01/06","Homologação · 25/07","Go Live · 03/08"]},
  {name:"MARKET CHILE",code:"I24.222",client:"Falabella / Tottus",location:"La Farfana · Chile",owner:"Daiana Costa",pmo:"Giovanni",status:"Em andamento",risk:"Baixo",phase:2,progress:36,next:"1º embarque",date:"set 2026",health:81,blocker:"Sem bloqueio; diagrama de rede e VPN em configuração.",nextAction:"Fechar diagrama de rede e concluir VPN site-to-site.",milestones:["Especificação enviada · 24/06","1º embarque · set/26","Go Live · jan/27"]},
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
const SEC2DEPT = { ge:"PMO", la:"EMC", cu:"WCS", in:"WCS", os:"WCS", pb:"EMC", ct:"EMC", fc:"EMC", pk:"EMC", so:"EMC", pt:"EMC", es:"WCS", et:"ESP", if:"INF" };
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
    { id: "cockpit", label: "Meu Departamento", icon: HandWaving, mobile: true },
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
  cockpit: ["Meu Departamento", "O bastão de cada área: entregas, esperas e handoffs com carimbo de hora."],
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

const initialAlerts = [
  initialAlert,
  {id:"P1-2026-0711-04",project:"MARKET PERU",priority:"P1",title:"Conectividade sem confirmação do cliente",description:"VPN site-to-site e range IP /24 ainda sem data firme.",owner:"Ivan",source:"Governança",detected:"10/07/2026 15:10:00",status:"Em ação"},
  {id:"P1-2026-0711-05",project:"NAVEPARK",priority:"P1",title:"Ambiente HML em risco",description:"Topologia das VMs Oracle KVM aguarda decisão técnica.",owner:"Daiana Costa",source:"PMO",detected:"09/07/2026 09:30:00",status:"Em triagem"},
  {id:"P2-2026-0711-08",project:"QUELUZ",priority:"P2",title:"Evidências incompletas para GL1",description:"Dez testes de comissionamento ainda aguardam aprovação.",owner:"Matheus",source:"Evidências",detected:"11/07/2026 08:12:00",status:"Em triagem"}
];

function Logo() {
  return <div className="brand"><img src={assetPath("icon.svg")} alt="InventOps"/><div><strong>Invent<span>Ops</span></strong><small>PREDICTIVE TWIN</small></div></div>;
}

function Sidebar({ active, setActive, alertCount, notify, role, onLogout }) {
  return <aside className="sidebar">
    <Logo/>
    <nav>{navGroups.map(group=><div className="nav-group" key={group.label}><small>{group.label}</small>{group.items.map(({id,label,icon:Icon,mobile,adminOnly}) => {const isActive=active===id||(active==="project"&&id==="portfolio");const restricted=adminOnly&&role!=="Admin";return <button data-mobile={mobile?"true":"false"} key={id} aria-label={label} className={`${isActive?"active":""} ${restricted?"restricted":""}`} onClick={()=>restricted?notify("Acesso restrito ao perfil Admin."):setActive(id)}>
      <Icon size={19} weight={isActive?"fill":"regular"}/><span>{label}</span>{restricted?<LockKey size={12}/>:null}{id==="alerts"&&alertCount>0?<b>{alertCount}</b>:null}
    </button>})}</div>)}</nav>
    <div className="sidebar-bottom">
      <button className="profile" onClick={()=>setActive("admin")}><span className="avatar">D</span><span><strong>Douglas</strong><small>{role}</small></span><CaretDown size={15}/></button>
      <button className="logout-button" onClick={onLogout}><SignOut/><span>Sair com segurança</span></button>
      <div className="credit"><Sparkle size={15} weight="fill"/><span>Desenvolvido por <b>Daiana Costa</b></span></div>
    </div>
  </aside>;
}

const VISION_PAGES = ["simulator", "commissioning"];

function LangSwitch({ notify }) {
  return <span className="lang-switch" role="group" aria-label="Idioma">
    <button className="active" aria-pressed="true">PT</button>
    <button onClick={()=>notify("Español · em breve — chega na próxima versão do InventOps.")} title="Em breve · disponível na próxima versão">ES</button>
    <button onClick={()=>notify("English · em breve — chega na próxima versão do InventOps.")} title="Em breve · disponível na próxima versão">EN</button>
  </span>;
}

function Topbar({ active, role, onLogout, notify }) {
  return <header className="topbar"><div><div className="title-line"><h1>{pageMeta[active][0]}</h1>{VISION_PAGES.includes(active)?<span className="vision-badge" title="Este módulo mostra aonde o produto vai — faz parte do roadmap (Eras 4-5) e ainda não está em operação. Os dados são simulados.">✦ VISÃO · ROADMAP</span>:null}</div><p>{pageMeta[active][1]}</p></div><div className="top-actions">
    <LangSwitch notify={notify}/><span className="date"><CalendarBlank size={18}/>11 jul 2026</span><span className="avatar">D</span><span className="top-user">Douglas<small>{role}</small></span><button className="top-logout" onClick={onLogout} aria-label="Sair"><SignOut/></button>
  </div></header>;
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

function Simulator({scenario,setScenario,notify}) {
  const [running,setRunning]=useState(false); const [ready,setReady]=useState(true);
  const runTimer=useRef();
  useEffect(()=>()=>window.clearTimeout(runTimer.current),[]);
  const run=()=>{setRunning(true);setReady(false);window.clearTimeout(runTimer.current);runTimer.current=window.setTimeout(()=>{setRunning(false);setReady(true)},850)};
  return <section className="page simulator-page">
    <div className="sim-grid">
      <div className="scenario-panel"><div className="section-heading"><b>1. Defina o cenário</b><span>Descreva o evento ou condição que deseja simular.</span></div>
        <div className="scenario-box"><textarea value={scenario} maxLength={250} onChange={e=>setScenario(e.target.value)} aria-label="Cenário a simular"/><small>{scenario.length} / 250</small></div>
        <button className="primary" onClick={run} disabled={running}><Play size={19} weight="fill"/>{running?"Calculando dependências...":"Simular impacto"}</button>
        <p className="ai-note"><Sparkle size={17}/>Motor de cenários + IA explicativa aplicados ao gêmeo digital.</p>
      </div>
      <div className={`impact-panel ${ready?"ready":"loading"}`}><div className="section-heading"><b>2. Cadeia de impacto <em>(resultado da simulação)</em></b><span>Como o evento se propaga pela operação.</span></div>
        <div className="impact-chain"><ImpactNode eyebrow="PROJETO" title="TITANO" value="+5d" color="#fb5470" detail="Conclusão prevista 25 jul 2026" footer="Impacto direto"/><ArrowRight/>
          <ImpactNode eyebrow="PROJETO" title="QUELUZ" value="+12d" color="#f5c300" detail="Conclusão prevista 31 jul 2026" footer="Impacto em cascata"/><ArrowRight/>
          <ImpactNode eyebrow="RECURSO" title="PLC" value="+40%" color="#32bde0" detail="Carga em setembro" footer="Capacidade excedida"/></div>
        <div className="confidence"><div><small>CONFIANÇA DA SIMULAÇÃO</small><strong>78%</strong><div className="progress"><i style={{width:"78%"}}/></div><span>Baseado na qualidade dos dados e histórico similar.</span></div><div><small>PRINCIPAIS SUPOSIÇÕES</small><ul><li>Atraso causado exclusivamente pela falta de hardware.</li><li>Redes de precedência conforme baseline atual.</li><li>Capacidade e calendário conforme plano registrado.</li></ul><button className="link-button" onClick={()=>notify("4ª suposição: fornecedores mantêm o prazo confirmado em 10/07.")}>Ver todas as suposições (4)</button></div></div>
      </div>
    </div>
    <div className="sim-bottom"><article><div className="section-heading"><b>3. Linha do tempo — Capacidade do recurso PLC</b><span>Projeção de utilização diária (% da capacidade disponível).</span></div><CapacityChart/><div className="chart-note"><Info size={22}/><span>Sobrecarga prevista entre 28/08 e 20/09.<b>Pico de 146% em 10/09.</b></span></div></article>
      <article><div className="section-heading"><b>4. Ação executiva recomendada</b><span>O que fazer agora para reduzir o impacto.</span></div><div className="recommendation"><span className="rec-icon"><TrendUp/></span><div><h3>Acelerar aquisição de hardware para TITANO</h3><p>Antecipar a entrega dos equipamentos críticos em pelo menos 5 dias para eliminar o atraso e evitar a sobrecarga de PLC em setembro.</p></div><div className="rec-metrics"><span><small>IMPACTO ESTIMADO</small><b>Elimina +5 dias e +40% de sobrecarga</b></span><span><small>CUSTO ESTIMADO</small><b>+ R$ 48.000,00</b></span></div><button className="primary" onClick={()=>notify("Plano de ação criado e vinculado ao projeto TITANO.")}><CalendarBlank size={19}/>Criar plano de ação</button><button className="link-button" onClick={()=>notify("Alternativas: remanejar PLC ou antecipar o lote crítico de hardware.")}>Ver alternativas de mitigação (2)</button></div></article>
    </div>
    <footer>Os resultados são estimativas e dependem da precisão dos dados e das suposições adotadas.</footer>
  </section>;
}

function SensorTag({className,icon:Icon,title,status="OK",fault=false,detail}) { return <div className={`sensor-tag ${className} ${fault?"fault":""}`}><Icon size={20}/><span><b>{title}</b><small>{fault?<XCircle weight="fill"/>:<CheckCircle weight="fill"/>}{status}</small><em>{detail}</em></span></div>; }

function Commissioning({fault,setFault,alerts,setAlerts,setActive,notify}) {
  const inject=()=>{setFault(true);if(!alerts.some(a=>a.id===initialAlert.id))setAlerts([initialAlert,...alerts]);notify("Falha crítica detectada: P0 aberto e SLA iniciado.")};
  const clear=()=>{setFault(false);notify("Sensor X normalizado. O histórico do P0 foi preservado.")};
  return <section className="page commissioning-page"><div className="commission-grid"><article className="twin-panel"><div className="panel-title"><div><b>Digital Twin</b><span>— Linha de Expedição 01</span></div><span className={fault?"state fault":"state"}><Radio size={16} weight="fill"/>{fault?"Falha detectada":"Operação normal"}</span></div>
    <div className="twin-stage"><img src={assetPath("conveyor-twin.png")} alt="Esteira de expedição com scanner, motor, sensor e grade de segurança"/>
      <SensorTag className="plc" icon={Cpu} title="PLC" detail="Último scan: 10:24:18"/><SensorTag className="scanner" icon={Barcode} title="Scanner de código" detail="Leitura: 10:24:17"/>
      <SensorTag className="motor" icon={Wrench} title="Motor" detail="Torque: 18,4 Nm"/><SensorTag className="sensor" icon={Eye} title="Sensor X" status={fault?"FALHA":"OK"} fault={fault} detail={fault?"0,00 mA · 10:23:56":"18,7 mA"}/>
      <SensorTag className="gate" icon={ShieldCheck} title="Safety Gate" detail="Estado: fechado"/>
    </div><div className="line-stats"><span><b>1,25 m/s</b><small>Velocidade da linha</small></span><span><b>8.432 un.</b><small>Volume processado hoje</small></span><span><b>97,6%</b><small>Disponibilidade</small></span></div></article>
    <aside className="incident-column"><div className={`incident ${fault?"active":"resolved"}`}><span className="incident-pill">{fault?"INCIDENTE ATIVO":"OPERAÇÃO NORMAL"}</span><h2>{fault?"P0 criado automaticamente":"Sensor normalizado"}</h2><p>{fault?"Falha crítica detectada no Sensor X e vinculada ao projeto TITANO.":"Telemetria estabilizada. O histórico do incidente foi preservado."}</p>
      <dl><div><dt>Projeto</dt><dd>TITANO</dd></div><div><dt>Prioridade</dt><dd className="danger">{fault?"P0 · CRÍTICO":"—"}</dd></div><div><dt>Responsável</dt><dd>Rodrigo Baruco</dd></div><div><dt>SLA</dt><dd className="timer">{fault?"07:35:42":"encerrado"}</dd></div><div><dt>Fonte</dt><dd>IoT / CLP</dd></div></dl>
      <button className={fault?"danger-button":"primary"} onClick={fault?clear:inject}>{fault?<><ArrowCounterClockwise/>Normalizar sensor</>:<><Lightning/>Simular nova falha</>}</button></div>
      <div className="telemetry"><div className="panel-title"><b>Evidência</b><span>Telemetria do Sensor X</span></div><div className="telemetry-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={fault?telemetryData:telemetryData.map(x=>({...x,v:18}))}><defs><linearGradient id="redArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fb5470" stopOpacity={.45}/><stop offset="100%" stopColor="#fb5470" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#19253a" vertical={false}/><XAxis dataKey="t" tick={{fontSize:10}} stroke="#65728a"/><YAxis domain={[0,24]} tick={{fontSize:10}} stroke="#65728a"/><Area type="monotone" dataKey="v" stroke="#fb5470" fill="url(#redArea)" strokeWidth={3} isAnimationActive={false}/></AreaChart></ResponsiveContainer></div><button className="ghost" onClick={()=>setActive("evidence")}>Ver todas as evidências<ArrowRight/></button></div>
    </aside></div></section>;
}

function EvidenceItem({icon:Icon,label,value,ok=true}) { return <li><Icon size={18}/><span>{label}</span><b className={ok?"ok":"warn"}>{value}</b></li>; }

function DecisionRoom({setActive,notify}){ return <section className="page decision-page"><div className="decision-toolbar"><div><b>Linha do tempo de dependências e capacidade</b><span>Projetos selecionados e equipe compartilhada</span></div><button className="ghost" onClick={()=>notify("Janela de decisão fixada em julho–setembro de 2026.")}><CalendarBlank/>Jul — Set 2026<CaretDown/></button></div>
  <div className="timeline"><div className="months"><span>JUL 2026</span><span>AGO 2026</span><span>SET 2026</span></div><div className="project-row"><header><b>TITANO</b><span>Go Live: 20/07/2026</span></header><div className="track"><i className="bar titano">Desenvolvimento & Integrações</i><i className="risk-marker">Atraso previsto 12 dias</i></div></div><div className="project-row"><header><b>QUELUZ</b><span>Go Live: 30/07/2026</span></header><div className="track"><i className="bar queluz">Desenvolvimento & Integrações</i><i className="risk-marker second">Atraso em cascata 8 dias</i></div></div><div className="capacity-row"><header><UsersThree/><b>Equipe PLC</b><span>Equipe compartilhada</span></header><div><CapacityChart compact/></div></div></div>
  <div className="evidence-decision"><article><div className="section-heading"><b>Evidências que explicam o cenário</b><span>Progresso real reportado até 11/07/2026</span></div><div className="evidence-columns"><div><h3>TITANO</h3><ul><EvidenceItem icon={CheckSquare} label="Infra" value="4/5 checklists"/><EvidenceItem icon={GitCommit} label="Dev" value="12 commits válidos"/><EvidenceItem icon={TestTube} label="Comissionamento" value="18/20 testes"/></ul></div><div><h3>QUELUZ</h3><ul><EvidenceItem icon={CheckSquare} label="Infra" value="5/5 checklists"/><EvidenceItem icon={GitCommit} label="Dev" value="9 commits válidos"/><EvidenceItem icon={TestTube} label="Comissionamento" value="10/20 testes" ok={false}/></ul></div><div><h3>Equipe PLC</h3><ul><EvidenceItem icon={UsersThree} label="Alocação planejada" value="92%"/><EvidenceItem icon={ChartLineUp} label="Alocação projetada" value="117%" ok={false}/><EvidenceItem icon={Timer} label="Horas extras" value="+128 h" ok={false}/></ul></div></div></article>
    <article className="decision-rec"><div className="section-heading"><b>Recomendação</b><span>Ação com melhor impacto no prazo do portfólio.</span></div><div><Lightning size={26} weight="fill"/><h3>Repriorizar a Equipe PLC após 20/07 para antecipar o comissionamento do TITANO.</h3><span><b>-6 dias</b> no atraso do TITANO</span><span><b>-4 dias</b> no atraso do QUELUZ</span></div><button className="primary" onClick={()=>setActive("simulator")}>Comparar cenários</button></article></div>
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
        const code=((data.sections.ge&&data.sections.ge.g2)||"S/CÓDIGO").trim();
        if(projects.some(p=>p.code===code||p.name===name.toUpperCase())){notify(`${name} (${code}) já está no portfólio — nada foi duplicado.`);return}
        const secs=Object.entries(data.progress).map(([k,v])=>({k,title:v.title,pct:v.pct,pend:Math.max(0,v.total-v.filled)}));
        const demands=[];
        for(const [k,fields] of Object.entries(data.sections)){
          if(typeof fields!=="object"||!fields)continue;
          for(const [f,val] of Object.entries(fields)){
            if(String(val).trim().toLowerCase()==="tbd"){
              const dept=SEC2DEPT[k]||"PMO";
              const secTitle=(data.progress[k]&&data.progress[k].title)||k;
              demands.push({dept,project:name.toUpperCase(),title:IF_LABELS[f]||`${secTitle} — definição pendente (${f})`,to:"PMO",due:"kickoff"});
            }
          }
        }
        const byDept={};demands.forEach(d=>{byDept[d.dept]=(byDept[d.dept]||0)+1});
        const golive=((data.sections.ge&&data.sections.ge.g_golive)||"").trim()||"a definir";
        setPreview({name,code,golive,totalPct:data.meta.total_pct,secs,demands,byDept,
          project:{name:name.toUpperCase(),code,client:((data.sections.ge&&data.sections.ge.g5)||"Cliente a definir").trim(),location:((data.sections.ge&&data.sections.ge.g3)||"Local a definir").trim().replace(/[-·]\s*$/,""),owner:"Daiana Costa",pmo:"A definir",status:"Em andamento",risk:"Baixo",phase:1,progress:0,next:"Kickoff técnico",date:golive,health:75,blocker:"Sem bloqueio registrado.",nextAction:"Distribuir as pendências do kickoff pelas áreas responsáveis.",milestones:["Kickoff importado do Nexus · hoje",`Go Live · ${golive}`]}});
      }catch{notify("Arquivo inválido — esperado um Nexus_Kickoff_*.json gerado pelo Nexus.")}
    };
    reader.readAsText(file);
  };
  const applyImport=()=>{
    setProjects([preview.project,...projects]);
    setImportedDemands(d=>[...d,...preview.demands]);
    notify(`${preview.name} importado: ${preview.demands.length} pendências distribuídas para ${Object.keys(preview.byDept).length} áreas. Veja no Meu Departamento.`);
    setPreview(null);
  };
  useEffect(()=>{if(!creating)return;const close=event=>event.key==="Escape"&&setCreating(false);document.addEventListener("keydown",close);return()=>document.removeEventListener("keydown",close)},[creating]);
  const shown=projects.filter(p=>(filter==="Todos"||p.status===filter||p.risk===filter)&&`${p.name} ${p.client} ${p.code}`.toLowerCase().includes(search.toLowerCase()));
  const openProject=(project)=>{setSelectedProject(project);setProjectModalOpen(true)};
  const createProject=(event)=>{event.preventDefault();const name=draft.name.trim().toUpperCase();if(!name)return;const project={name,code:`I26.${String(projects.length+4100)}`,client:draft.client.trim()||"Cliente a definir",location:"Local a definir",owner:draft.owner,pmo:"A definir",status:"Em andamento",risk:"Baixo",phase:1,progress:0,next:"Kickoff",date:"A definir",health:75,blocker:"Sem bloqueio registrado.",nextAction:"Definir escopo, responsáveis e data do kickoff.",milestones:["Kickoff · A definir","Baseline · A definir","Go Live · A definir"]};setProjects([project,...projects]);setCreating(false);setDraft({name:"",client:"",owner:"Daiana Costa"});notify(`Projeto ${name} criado no portfólio.`)};
  return <section className="page portfolio-page">
    <div className="portfolio-kpis">
      <article><FolderOpen/><span><small>PORTFÓLIO DEMO</small><b>{projects.length} projetos</b><em>Base operacional priorizada</em></span></article>
      <article><TrendUp/><span><small>SAÚDE MÉDIA</small><b>68/100</b><em>2 projetos pedem ação</em></span></article>
      <article><Warning/><span><small>RISCO ALTO</small><b>2 projetos</b><em>Market Peru e Navepark</em></span></article>
      <article><FlagCheckered/><span><small>PRÓXIMOS 30 DIAS</small><b>4 marcos</b><em>2 Go Lives confirmados</em></span></article>
    </div>
    <div className="portfolio-toolbar"><div><h2>Portfólio operacional</h2><p>Da estratégia à atividade: cada número abre a evidência que o sustenta.</p></div><div className="portfolio-view-actions"><span><button className={view==="kanban"?"active":""} onClick={()=>setView("kanban")}><SquaresFour/>Kanban</button><button className={view==="table"?"active":""} onClick={()=>setView("table")}><Rows/>Lista</button></span><button className="ghost" onClick={()=>fileRef.current&&fileRef.current.click()} title="Importa um Nexus_Kickoff_*.json — o projeto nasce com as pendências distribuídas pelas áreas"><UploadSimple/>Importar kickoff</button><input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={handleFile} aria-label="Importar kickoff do Nexus"/><button className="primary" onClick={()=>setCreating(true)}><Plus/>Novo projeto</button></div></div>
    <div className="portfolio-filters"><label><MagnifyingGlass/><input aria-label="Buscar projeto" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar projeto, cliente ou código"/></label><Funnel/>{["Todos","Em andamento","Bloqueado","Alto"].map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{x}</button>)}</div>
    {view==="kanban"?<div className="portfolio-kanban">{[["Em andamento",shown.filter(p=>p.status==="Em andamento")],["Bloqueado",shown.filter(p=>p.status==="Bloqueado")],["Concluído",shown.filter(p=>p.status==="Concluído")]].map(([status,items])=><section key={status}><header><span><i className={`kanban-dot ${status.toLowerCase().replaceAll(" ","-")}`}/><b>{status}</b></span><em>{items.length}</em></header><div>{items.map(p=><button key={p.name} onClick={()=>openProject(p)} aria-label={`Abrir projeto ${p.name}`}><span className="kanban-card-top"><small>{p.code}</small><RiskBadge risk={p.risk}/></span><h3>{p.name}</h3><p>{p.client} · {p.location}</p><span className="kanban-phase"><small>FASE {p.phase}/7</small><b>{phaseNames[p.phase-1]}</b></span><span className="kanban-progress evidence-tooltip" tabIndex="0" data-tooltip={`${p.progress}% calculado por evidências técnicas verificadas.`}><i><em style={{width:`${p.progress}%`}}/></i><b>{p.progress}%</b></span><footer><span className="avatar">{p.owner[0]}</span><span><small>PRÓXIMO MARCO</small><b>{p.next} · {p.date}</b></span><ArrowRight/></footer></button>)}</div>{!items.length?<p className="kanban-empty">Nenhum projeto nesta etapa.</p>:null}</section>)}</div>:null}
    {view==="table"?<div className="portfolio-table"><header><span>Projeto</span><span>Fase atual</span><span>Progresso</span><span>Risco</span><span>Próximo marco</span><span>Responsável</span><span/></header>
      {shown.map(p=><button key={p.name} className="portfolio-row" onClick={()=>openProject(p)} aria-label={`Abrir projeto ${p.name}`}>
        <span className="project-identity"><b>{p.name}</b><small>{p.code} · {p.client}</small></span><span><StatusBadge status={p.status}/><small>{phaseNames[p.phase-1]}</small></span>
        <span className="portfolio-progress evidence-tooltip" tabIndex="0" data-tooltip={`${p.progress}% = 35% entregáveis + 25% checklists + 20% commits válidos + 20% testes aprovados.`}><i><em style={{width:`${p.progress}%`}}/></i><b>{p.progress}%</b></span><RiskBadge risk={p.risk}/>
        <span><b>{p.next}</b><small>{p.date}</small></span><span><b>{p.owner}</b><small>PMO {p.pmo}</small></span><ArrowRight/>
      </button>)}
      {!shown.length?<div className="empty"><MagnifyingGlass size={32}/>Nenhum projeto encontrado.</div>:null}
    </div>:null}
    <div className="portfolio-bottom"><article><div className="section-heading"><b>Capacidade das equipes</b><span>Carga projetada para os próximos 90 dias.</span></div><CapacityChart compact/></article><article className="attention-list"><div className="section-heading"><b>Fila de atenção</b><span>Onde a governança deve agir primeiro.</span></div><div><strong>01</strong><span><b>MARKET PERU</b><small>3 dependências externas sem data confirmada</small></span><em>Escalar hoje</em></div><div><strong>02</strong><span><b>NAVEPARK</b><small>Ambiente HML compromete o marco de agosto</small></span><em>Definir dono</em></div></article></div>
    {preview?<div className="modal-layer" role="presentation" onMouseDown={e=>e.target===e.currentTarget&&setPreview(null)}><div className="project-modal import-preview" role="dialog" aria-modal="true" aria-labelledby="imp-title">
      <div><span className="project-symbol">⇪</span><div><h2 id="imp-title">Importar kickoff · {preview.name}</h2><p>{preview.code} · Go Live {preview.golive} · kickoff {preview.totalPct}% preenchido no Nexus</p></div><button type="button" aria-label="Fechar" onClick={()=>setPreview(null)}><XCircle/></button></div>
      <div className="imp-depts"><b>{preview.demands.length} pendências serão distribuídas:</b><div>{Object.entries(preview.byDept).map(([d,n])=><span key={d}><b>{d}</b>{n}</span>)}</div></div>
      <div className="imp-secs">{preview.secs.map(s=><div key={s.k}><span>{s.title}</span><i><em style={{width:`${s.pct}%`}}/></i><small>{s.pct}%{s.pend?` · ${s.pend} pend.`:""}</small></div>)}</div>
      <p className="imp-note">Prévia — nada é aplicado antes de confirmar. Cada pendência aparece no Cockpit da área responsável.</p>
      <div className="modal-actions"><button type="button" className="ghost" onClick={()=>setPreview(null)}>Cancelar</button><button className="primary" type="button" onClick={applyImport}><UploadSimple/>Confirmar import</button></div>
    </div></div>:null}
    {creating?<div className="modal-layer" role="presentation" onMouseDown={e=>e.target===e.currentTarget&&setCreating(false)}><form className="project-modal" role="dialog" aria-modal="true" aria-labelledby="new-project-title" onSubmit={createProject}><div><span className="project-symbol">NP</span><div><h2 id="new-project-title">Novo projeto</h2><p>Crie a estrutura mínima. Fases e atividades entram em seguida.</p></div><button type="button" aria-label="Fechar" onClick={()=>setCreating(false)}><XCircle/></button></div><label>Nome do projeto<input autoFocus value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})} placeholder="Ex.: EXPANSÃO CD SUL" required/></label><label>Cliente<input value={draft.client} onChange={e=>setDraft({...draft,client:e.target.value})} placeholder="Empresa ou unidade"/></label><label>Responsável<select value={draft.owner} onChange={e=>setDraft({...draft,owner:e.target.value})}><option>Daiana Costa</option><option>Rodrigo Baruco</option><option>Douglas</option></select></label><div className="modal-actions"><button type="button" className="ghost" onClick={()=>setCreating(false)}>Cancelar</button><button className="primary" type="submit"><Plus/>Criar projeto</button></div></form></div>:null}
  </section>;
}

function ProjectWorkspace({project,setActive,notify}) {
  const [tab,setTab]=useState("overview");
  const [reportOpen,setReportOpen]=useState(false);
  const [activities,setActivities]=useState(()=>baseActivities.map((a,i)=>({...a,id:`${project.name}-${i}`})));
  const updateActivity=(id,status)=>setActivities(current=>current.map(a=>a.id===id?{...a,status}:a));
  const addActivity=()=>{if(activities.some(a=>a.new))return;setActivities([...activities,{id:`${project.name}-new`,name:"Revisar plano integrado com todas as áreas",phase:"Implantação",owner:"Daiana",due:"29 jul",status:"Não iniciado",evidence:"A definir",new:true}]);notify("Nova atividade adicionada ao plano do projeto.")};
  const done=activities.filter(a=>a.status==="Concluído").length;
  const hasBlocker=!project.blocker.startsWith("Sem bloqueio");
  return <section className="page project-page">
    <div className="project-top-actions"><button className="back-button" onClick={()=>setActive("portfolio")}><ArrowLeft/>Voltar ao portfólio</button><button className="ghost" onClick={()=>setReportOpen(true)}><ClipboardText/>Gerar Status Report</button></div>
    <div className="project-head"><div className="project-symbol">{project.name.slice(0,2)}</div><div><div className="project-title-line"><h2>{project.name}</h2><StatusBadge status={project.status}/><RiskBadge risk={project.risk}/></div><p>{project.code} · {project.client} · <MapPin/>{project.location}</p></div><div className="project-owner"><span className="avatar">D</span><span><small>RESPONSÁVEL</small><b>{project.owner}</b><em>PMO {project.pmo}</em></span></div></div>
    <div className="project-scorebar"><span><small>SAÚDE DO PROJETO</small><b>{project.health}/100</b><i><em style={{width:`${project.health}%`}}/></i></span><span className="evidence-tooltip" tabIndex="0" data-tooltip="73% calculado por entregáveis aceitos, 4/5 checklists, 12 commits válidos e 18/20 testes aprovados."><small>PROGRESSO COM EVIDÊNCIA</small><b>{project.progress}%</b><i><em style={{width:`${project.progress}%`}}/></i></span><span><small>PRÓXIMO MARCO</small><b>{project.next}</b><em>{project.date}</em></span><span><small>PLANO DE TRABALHO</small><b>{done}/{activities.length}</b><em>atividades concluídas</em></span></div>
    <div className="project-tabs" role="tablist">{[["overview","Visão geral"],["activities","Plano de trabalho"],["risks","Marcos & riscos"]].map(([id,label])=><button role="tab" aria-selected={tab===id} className={tab===id?"active":""} key={id} onClick={()=>setTab(id)}>{label}</button>)}</div>
    {tab==="overview"?<div className="project-overview">
      <article className="phase-card"><div className="section-heading"><b>Jornada do projeto</b><span>Fases e gates de governança.</span></div><div className="phase-rail">{phaseNames.map((name,i)=>{const state=i+1<project.phase?"done":i+1===project.phase?"current":"future";return <div className={state} key={name}><i>{state==="done"?<CheckCircle weight="fill"/>:i+1}</i><span><b>{name}</b><small>{state==="done"?"Gate aprovado":state==="current"?"Fase atual":"A iniciar"}</small></span></div>})}</div></article>
      <aside className="governance-card"><div className="section-heading"><b>Próxima ação</b><span>A cobrança que move o projeto.</span></div><h3>{project.nextAction}</h3><dl><div><dt>Dono</dt><dd>{project.owner}</dd></div><div><dt>Prazo</dt><dd>15 jul 2026</dd></div><div><dt>Criticidade</dt><dd><RiskBadge risk={project.risk}/></dd></div></dl><button className="primary" onClick={()=>notify(`Cobrança registrada para ${project.owner}.`)}>Registrar cobrança</button></aside>
      <article className="evidence-summary"><div className="section-heading"><b>Evidências de execução</b><span>O progresso só avança quando existe entrega verificável.</span></div><div><span><CheckSquare/><b>4/5</b><small>checklists de infraestrutura</small></span><span><GitCommit/><b>12</b><small>commits em base homologada</small></span><span><TestTube/><b>18/20</b><small>testes aprovados</small></span><span><CloudCheck/><b>3</b><small>documentos aceitos</small></span></div></article>
      <article className="milestone-summary"><div className="section-heading"><b>Marcos principais</b><span>Datas que dirigem as decisões.</span></div>{project.milestones.map((m,i)=><div key={m}><i className={i===0?"active":""}/><span><b>{m.split(" · ")[0]}</b><small>{m.split(" · ")[1]||"Data a confirmar"}</small></span></div>)}</article>
      <article className="sharepoint-card"><div className="section-heading"><b>Documentos do projeto</b><span>Os arquivos oficiais vivem no SharePoint — cofre único da empresa.</span></div>
        <div className="sp-row"><span className="sp-ico">📁</span><div><b>Página do projeto no SharePoint</b><small>{project.code} · specs, atas, evidências e anexos compartilhados entre os times</small></div>
        <a className="sp-open" href={sharePointUrl(project.code)} target="_blank" rel="noopener noreferrer">Abrir no SharePoint ↗</a></div>
        <small className="sp-note">Acesso com a conta corporativa M365 · upload direto pelo InventOps chega na Era 3 do roadmap.</small></article>
    </div>:null}
    {tab==="activities"?<div className="workplan"><div className="workplan-head"><div><h3>Plano de trabalho integrado</h3><p>Atividades, responsáveis, prazos e evidências.</p></div><button className="primary" onClick={addActivity}><Plus/>Nova atividade</button></div><div className="activity-table"><header><span>Atividade</span><span>Fase</span><span>Responsável</span><span>Prazo</span><span>Evidência</span><span>Status</span></header>{activities.map(a=><div key={a.id}><span><b>{a.name}</b>{a.new?<small>Adicionada agora</small>:null}</span><span>{a.phase}</span><span><User/>{a.owner}</span><span><CalendarBlank/>{a.due}</span><span><LinkSimple/>{a.evidence}</span><select aria-label={`Status de ${a.name}`} value={a.status} onChange={e=>updateActivity(a.id,e.target.value)}><option>Não iniciado</option><option>Em andamento</option><option>Aguardando</option><option>Concluído</option></select></div>)}</div></div>:null}
    {tab==="risks"?<div className="risk-workspace"><article className={hasBlocker?"has-blocker":"clear-risk"}><div className="section-heading"><b>{hasBlocker?"Bloqueador atual":"Situação monitorada"}</b><span>{hasBlocker?"Problema materializado que exige correção.":"Nenhum impedimento crítico registrado."}</span></div>{hasBlocker?<Warning size={30}/>:<ShieldCheck size={30}/>}<h3>{project.blocker}</h3><dl><div><dt>Estratégia</dt><dd>{hasBlocker?"Mitigar":"Monitorar"}</dd></div><div><dt>Responsável</dt><dd>{project.owner}</dd></div><div><dt>Revisão</dt><dd>{hasBlocker?"Diária":"Semanal"}</dd></div></dl><button className={hasBlocker?"danger-button":"primary"} onClick={()=>notify(hasBlocker?"Plano de resposta atualizado e responsável notificado.":"Novo risco registrado para acompanhamento.")}>{hasBlocker?"Atualizar plano de resposta":"Registrar novo risco"}</button></article><article><div className="section-heading"><b>Marcos e decisões</b><span>Linha do tempo contratual e operacional.</span></div><div className="decision-log">{project.milestones.map((m,i)=><div key={m}><i className={i===0?"active":""}/><span><b>{m}</b><small>{i===0?"Evidência anexada":"Dependências monitoradas"}</small></span></div>)}</div><button className="ghost" onClick={()=>notify("Decisão registrada na linha do tempo do projeto.")}><Plus/>Registrar decisão</button></article></div>:null}
    {reportOpen?<StatusReportModal project={project} onClose={()=>setReportOpen(false)} notify={notify}/>:null}
  </section>;
}

function AlertsPage({alerts,setAlerts}) { const [filter,setFilter]=useState("Todos"); const shown=filter==="Todos"?alerts:alerts.filter(a=>a.priority===filter||a.status===filter); const active=alerts.filter(a=>a.status!=="Resolvido"); return <section className="page list-page"><div className="summary-strip"><span><b>{active.filter(a=>a.priority==="P0").length}</b>P0 crítico</span><span><b>{active.filter(a=>a.priority==="P1").length}</b>P1 alto risco</span><span><b>{active.filter(a=>a.priority==="P2").length}</b>P2 atenção</span><span><b>7h35</b>menor SLA</span></div><div className="filter-row">{["Todos","P0","P1","P2","Em triagem","Em ação","Resolvido"].map(x=><button className={filter===x?"active":""} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div><div className="alert-table smart-triage"><header><span>Alerta</span><span>Projeto</span><span>Responsável</span><span>SLA</span><span>Status</span></header>{shown.length?shown.map(a=><div className="alert-row" key={a.id}><span><i className={`alert-priority ${a.priority.toLowerCase()}`}>{a.priority}</i><b>{a.title}</b><small>{a.description}</small></span><span>{a.project}<small>{a.source}</small></span><span>{a.owner}</span><span className={a.status==="Resolvido"?"resolved-time":a.priority==="P0"?"timer":"triage-sla"}>{a.status==="Resolvido"?"Encerrado":a.priority==="P0"?"07:35:42":a.priority==="P1"?"23:18:10":"46:42:08"}</span><select aria-label={`Status do alerta ${a.id}`} value={a.status} onChange={e=>setAlerts(alerts.map(x=>x.id===a.id?{...x,status:e.target.value}:x))}><option>Em triagem</option><option>Em ação</option><option>Resolvido</option></select></div>):<div className="empty"><CheckCircle size={34}/>Nenhum alerta nesta etapa.</div>}</div></section>; }

function EvidencePage(){ const rows=[{project:"TITANO",progress:73,infra:"4/5",dev:"12",tests:"18/20",confidence:"Alta"},{project:"QUELUZ",progress:68,infra:"5/5",dev:"9",tests:"10/20",confidence:"Média"},{project:"MARKET PERU",progress:42,infra:"3/5",dev:"6",tests:"4/20",confidence:"Média"}]; return <section className="page evidence-page"><div className="evidence-hero"><div><small>FAROL DE PRODUTIVIDADE</small><h2>Progresso que explica a si mesmo</h2><p>O percentual combina entregáveis aceitos, checklists, atividade válida em base homologada e testes de comissionamento.</p></div><div className="formula"><span>35%</span><b>Entregáveis</b><span>25%</span><b>Checklists</b><span>20%</span><b>Commits válidos</b><span>20%</span><b>Testes aprovados</b></div></div><div className="evidence-table"><header><span>Projeto</span><span>Progresso</span><span>Infra</span><span>Dev</span><span>Comissionamento</span><span>Confiança</span></header>{rows.map(r=><div key={r.project}><b>{r.project}</b><span className="progress-cell"><span className="evidence-progress" aria-hidden="true"><i style={{width:`${r.progress}%`}}/></span><strong>{r.progress}%</strong></span><span>{r.infra} checklists</span><span>{r.dev} commits</span><span>{r.tests} testes</span><em>{r.confidence}</em></div>)}</div></section>; }

function Home({setActive}) { return <section className="page home-page"><div className="home-hero"><small>CENTRO DE INTELIGÊNCIA OPERACIONAL</small><h2>Controle o projeto hoje. Antecipe o gargalo de amanhã.</h2><p>Planeje fases e atividades, cobre responsáveis, reúna evidências e use a mesma base para prever impactos antes que eles parem a operação.</p><button className="primary" onClick={()=>setActive("portfolio")}><FolderOpen/>Abrir Controle de Projetos</button></div><div className="module-list"><button onClick={()=>setActive("portfolio")}><FolderOpen/><span><b>Controle de Projetos</b><small>Portfólio, fases, atividades, marcos e riscos.</small></span><ArrowRight/></button><button onClick={()=>setActive("simulator")}><Sparkle/><span><b>Simulador de Impacto</b><small>Antecipe atrasos e sobrecarga de equipes.</small></span><ArrowRight/></button><button onClick={()=>setActive("commissioning")}><Factory/><span><b>Comissionamento</b><small>Conecte a telemetria física ao Smart Triage.</small></span><ArrowRight/></button></div></section>; }

function SettingsPage(){ const [settings,setSettings]=useState({p0:true,capacity:true,evidence:true}); return <section className="page settings-page"><div className="settings-card"><h2>Regras de governança</h2><p>Controles da demonstração. Nenhuma chave externa é armazenada no navegador.</p>{[["p0","Criar P0 automaticamente","Falhas críticas de sensores abrem um alerta com SLA."],["capacity","Monitorar sobrecarga de capacidade","Avise quando uma equipe ultrapassar 100% de alocação."],["evidence","Exigir evidência para progresso","Percentuais só avançam com entregáveis verificáveis."]].map(([k,t,d])=><label key={k}><span><b>{t}</b><small>{d}</small></span><input type="checkbox" checked={settings[k]} onChange={()=>setSettings({...settings,[k]:!settings[k]})}/><i/></label>)}</div><div className="settings-card"><h2>Fontes conectadas</h2><p>Estado simulado para a apresentação.</p><ul className="sources"><li><Circuitry/><span><b>CLP · Linha 01</b><small>Última leitura há 2s</small></span><em>Conectado</em></li><li><Database/><span><b>Base homologada</b><small>Commits e builds válidos</small></span><em>Conectado</em></li><li><LinkSimple/><span><b>Planejamento</b><small>Projetos e dependências</small></span><em>Conectado</em></li></ul></div></section>; }

export function App() {
  const [authenticated,setAuthenticated]=useState(()=>sessionStorage.getItem("inventops-demo-session")==="active");
  const [active,setActive]=useState("home");
  const [role,setRole]=useState("Admin");
  const [projects,setProjects]=useState(()=>{try{const saved=sessionStorage.getItem("inventops-projects-demo");return saved?JSON.parse(saved):portfolioData}catch{return portfolioData}});
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
  useEffect(()=>{sessionStorage.setItem("inventops-projects-demo",JSON.stringify(projects))},[projects]);
  const updateProject=useCallback(updated=>{setProjects(current=>current.map(p=>p.code===updated.code?updated:p));setSelectedProject(updated)},[]);
  const openFullProject=()=>{setProjectModalOpen(false);setActive("project")};
  const login=()=>{sessionStorage.setItem("inventops-demo-session","active");setAuthenticated(true);setActive("home")};
  const logout=()=>{sessionStorage.removeItem("inventops-demo-session");setAuthenticated(false);setRole("Admin");setActive("home")};
  if(!authenticated)return <LoginScreen onLogin={login}/>;
  const allowed={
    Admin:"*",
    Editor:["home","action","management","analytics","executive","portfolio","project","cockpit","areas","alerts","raid","simulator","commissioning","decision","evidence","presentation","lifecycle"],
    Analista:["home","action","portfolio","project","cockpit","areas","alerts","raid","commissioning","evidence","presentation"],
    Viewer:["home","management","analytics","executive","portfolio","project","cockpit","areas","evidence","presentation","lifecycle"]
  };
  const canAccess=allowed[role]==="*"||allowed[role].includes(active);
  const pages={
    home:<ExecutiveDashboard projects={projects} setActive={setActive}/>,
    action:<ActionCenter notify={notify}/>,management:<ManagementPage/>,analytics:<AnalyticsPage/>,
    executive:<ExecutiveOnePager projects={projects} notify={notify}/>,
    portfolio:<PortfolioPage projects={projects} setProjects={setProjects} setActive={setActive} setSelectedProject={setSelectedProject} setProjectModalOpen={setProjectModalOpen} setImportedDemands={setImportedDemands} notify={notify}/>,
    project:<ProjectWorkspace key={selectedProject.name} project={selectedProject} setActive={setActive} notify={notify}/>,
    cockpit:<DepartmentCockpit notify={notify} imported={importedDemands}/>,
    areas:<AreasPage/>,raid:<RaidPage/>,admin:<AdminGovernance role={role} setRole={setRole} notify={notify}/>,
    presentation:<PresentationPage notify={notify}/>,lifecycle:<LifecyclePage/>,simulator:<Simulator scenario={scenario} setScenario={setScenario} notify={notify}/>,
    commissioning:<Commissioning fault={fault} setFault={setFault} alerts={alerts} setAlerts={setAlerts} setActive={setActive} notify={notify}/>,
    decision:<DecisionRoom setActive={setActive} notify={notify}/>,alerts:<AlertsPage alerts={alerts} setAlerts={setAlerts}/>,
    evidence:<EvidencePage/>,settings:<SettingsPage/>
  };
  const page=canAccess?pages[active]:<AccessDenied setActive={setActive}/>;
  return <div className="app-shell"><Sidebar active={active} setActive={setActive} alertCount={alerts.filter(a=>a.status!=="Resolvido").length} notify={notify} role={role} onLogout={logout}/><main className="workspace"><Topbar active={active} role={role} onLogout={logout} notify={notify}/>{page}</main>{projectModalOpen&&selectedProject?<ProjectControlModal project={selectedProject} onClose={()=>setProjectModalOpen(false)} onUpdate={updateProject} onOpenFull={openFullProject} notify={notify}/>:null}{message?<div className="toast" role="status"><CheckCircle weight="fill"/>{message}</div>:null}</div>;
}
