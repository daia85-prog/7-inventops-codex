import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, BellRinging, Buildings, CalendarBlank, ChartLineUp,
  CheckCircle, CheckSquare, ClipboardText, ClockCountdown, Database, Envelope,
  Cpu, Eye, Factory, FileText, FlagCheckered, Gauge, GitCommit, HardDrives, LockKey, MonitorPlay, Moon,
  Play, Printer, Sun,
  RocketLaunch, ShieldCheck, Sparkle, TrendUp, UserGear, UsersThree, Warning,
  Waveform, WhatsappLogo, XCircle
} from "@phosphor-icons/react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

const trend = [
  {day:"12 jun",health:61,delivery:54},{day:"17 jun",health:64,delivery:58},
  {day:"22 jun",health:62,delivery:61},{day:"27 jun",health:67,delivery:64},
  {day:"02 jul",health:70,delivery:68},{day:"07 jul",health:66,delivery:71},
  {day:"11 jul",health:68,delivery:73}
];

const departments = [
  ["COM","Comercial / Concept","André Mota",74,66,1],["PM","PM","Rodrigo Baruco",91,78,2],
  ["PCP","PCP","Weslley Silva",86,72,2],["CMP","Compras / Importação","Claudia Duarte",103,61,3],
  ["EMC","Eng. Mecânica","Gustavo Pereira",94,69,2],["EEL","Eng. Elétrica","Gustavo Pereira",88,64,1],
  ["PRD","Produção","Flavio Moreno",82,70,1],["MON","Montagem","Rojekson Souza",83,57,1],
  ["INF","Infraestrutura","Admin Invent",112,65,4],["ESP","Espec. de Software","Thomas",78,62,1],
  ["WCS","WCS Velox","Marcelo Sanches",98,73,2],["IMP","Implantação","Daniel",108,68,3],
  ["PLC","PLC","Gustavo Pereira",117,71,4],["PÓS","Pós-vendas","Caique Fracaro",63,82,0]
].map(([code,name,owner,load,progress,blocked])=>({code,name,owner,load,progress,blocked}));

const actionsSeed = [
  {id:1,p:"P0",project:"TITANO",dept:"PLC",task:"Normalizar falha do Sensor X e anexar telemetria",owner:"Rodrigo Baruco",email:"rodrigo.baruco@invent-corp.com",due:"Hoje · 18:00",status:"Em ação",impact:"Bloqueia a sequência de testes SAT e reduz a confiança do Go Live de 78% para 61%.",dependency:"Troca física do Sensor X",dependencyState:"Bloqueante",evidence:"Telemetria estável + registro de 20 ciclos aprovados",evidenceState:"Pendente"},
  {id:2,p:"P1",project:"MARKET PERU",dept:"INF",task:"Confirmar range IP /24 e VPN site-to-site",owner:"Ivan",email:"ivan@invent-corp.com",due:"Hoje · 16:00",status:"Aguardando cliente",impact:"Sem conectividade, a homologação integrada perde a janela de 15/07.",dependency:"Resposta técnica do cliente",dependencyState:"Externa",evidence:"E-mail de aceite + teste de túnel VPN",evidenceState:"Pendente"},
  {id:3,p:"P1",project:"NAVEPARK",dept:"INF",task:"Fechar topologia das VMs Oracle KVM",owner:"Daiana Costa",email:"daiana.costa@invent-corp.com",due:"12 jul",status:"Em andamento",impact:"Define o ambiente homologado usado por DEV e WCS sem interromper Compras ou Engenharia.",dependency:"Especificação de capacidade",dependencyState:"Paralela",evidence:"Diagrama aprovado + checklist de provisionamento",evidenceState:"Rascunho"},
  {id:4,p:"P2",project:"QUELUZ",dept:"PM",task:"Consolidar evidências para o Gate GL1",owner:"Matheus",email:"matheus@invent-corp.com",due:"15 jul",status:"Não iniciado",impact:"O gate não pode ser aprovado sem rastreabilidade das entregas das áreas.",dependency:"Aceites de ENG, INF e DEV",dependencyState:"Paralela",evidence:"Ata do gate + índice de evidências aceitas",evidenceState:"Pendente"},
  {id:5,p:"P2",project:"BP",dept:"IMP",task:"Confirmar equipe de campo para Go Live",owner:"Giovanni",email:"giovanni@invent-corp.com",due:"18 jul",status:"Não iniciado",impact:"Protege a escala de implantação e evita conflito com o projeto TITANO.",dependency:"Agenda de campo",dependencyState:"Paralela",evidence:"Escala nominal validada pelo gestor",evidenceState:"Pendente"}
];

const blockers = [
  {project:"MARKET PERU",area:"INF · Cliente",age:"12 dias",impact:"Infra de testes sem condição de homologação",owner:"Ivan",action:"Escalar arquitetura e fechar IP/VPN até 12/07."},
  {project:"NAVEPARK",area:"EMC · INF",age:"8 dias",impact:"Ambiente HML ameaça o Go Live de setembro",owner:"Daiana",action:"Validar VMs e registrar decisão técnica até 14/07."},
  {project:"TITANO",area:"CMP · PLC",age:"2 horas",impact:"Sensor físico interrompe sequência de testes",owner:"Baruco",action:"Trocar sensor, testar 20 ciclos e anexar evidência."}
];

const riskItems = [
  {id:"R-18",kind:"Risco",title:"Atraso na aquisição de hardware crítico",project:"TITANO",prob:4,impact:5,owner:"Claudia Duarte",response:"Mitigar",due:"12 jul"},
  {id:"I-09",kind:"Impedimento",title:"VPN e range IP não confirmados",project:"MARKET PERU",prob:5,impact:4,owner:"Ivan",response:"Escalar",due:"Hoje"},
  {id:"A-07",kind:"Premissa",title:"Cliente libera VMs até 14/07",project:"NAVEPARK",prob:3,impact:4,owner:"Daiana",response:"Validar",due:"14 jul"},
  {id:"D-04",kind:"Dependência",title:"GL1 depende da homologação do ambiente",project:"QUELUZ",prob:3,impact:3,owner:"Matheus",response:"Monitorar",due:"18 jul"},
  {id:"R-21",kind:"Risco",title:"Capacidade PLC acima do limite em setembro",project:"PORTFÓLIO",prob:4,impact:4,owner:"Baruco",response:"Replanejar",due:"15 jul"}
];

function Panel({title,subtitle,children,className=""}){
  return <article className={`foundation-panel ${className}`}><div className="foundation-title"><div><b>{title}</b><span>{subtitle}</span></div></div>{children}</article>;
}

function Metric({icon:Icon,label,value,note,tone="cyan"}){
  return <article className={`foundation-metric ${tone}`}><Icon/><span><small>{label}</small><b>{value}</b><em>{note}</em></span></article>;
}

export function ExecutiveDashboard({projects,setActive,openCockpitDept,currentUser={dept:"ADM",name:"Admin"},lang="pt"}){
  const health=Math.round(projects.reduce((sum,p)=>sum+p.health,0)/projects.length);
  const hotAreas=departments.filter(area=>area.load>=100).slice(0,3);
  const copyByLang={
    pt:{
      pulse:[
        {label:"Operação viva",value:"14 áreas conectadas",tone:"cyan"},
        {label:"Decisões hoje",value:"3 críticas",tone:"gold"},
        {label:"Risco imediato",value:"PLC + Infra + Compras",tone:"red"}
      ],
      directorial:[
        ["Operações ativas","2 áreas em uso real","Implantação + Especificação/DevOps"],
        ["Próxima meta","Semana de uso assistido","subir confiança com usuários reais"],
        ["Sinal do sistema","A mesma base alimenta direção e execução","sem narrativa paralela"]
      ],
      briefing:"BRIEFING EXECUTIVO · 11 JUL 2026",
      heroTitle:"A operação já tem onde começar a usar de verdade.",
      heroBody:"O InventOps já saiu do conceito básico: Implantação e Especificação/DevOps entram na próxima semana em uso assistido real, enquanto a diretoria acompanha a mesma verdade operacional sem precisar de relatório paralelo.",
      openPlan:"Abrir plano de ação",
      viewOnePager:"Ver one-page",
      nextGoLive:"PRÓXIMO GO LIVE",
      confidence:"78% de confiança",
      pilotEyebrow:"Operação pronta para uso",
      sessionEyebrow:"Seu contexto operacional",
      sessionCta:"Abrir minha operação",
      pilotCards:{
        IMP:{
          title:"Implantação",
          summary:"Campo, readiness, handoff e execução do Go Live em uma leitura única.",
          metric:"7 handoffs vivos",
          detail:"Daniel e time já conseguem navegar pela operação real da área.",
          cta:"Abrir operação de Implantação"
        },
        ESP:{
          title:"Especificação + DevOps",
          summary:"Especificação, checkpoint, dependências e prontidão técnica sem planilha paralela.",
          metric:"5 checkpoints ativos",
          detail:"Thomas e time já entram num fluxo orientado por evidência e bloqueio real.",
          cta:"Abrir operação de DevOps"
        }
      },
      pressureTitle:"ÁREAS SOB PRESSÃO",
      pressureBody:"Onde agir antes do atraso virar custo",
      readingTitle:"LEITURA DO INVENTOPS",
      readingBody:"A carteira está controlada, mas o sistema já aponta a próxima pressão.",
      readingText:"O InventOps cruza capacidade, bloqueios e datas de marco para mostrar onde a coordenação precisa acontecer antes do problema aparecer no cronograma executivo.",
      openPm:"Abrir PM Control Tower",
      seeDecision:"Ver Decision Room",
      coordTitle:"Mapa de coordenação",
      coordSub:"Quem precisa andar junto agora",
      routeTitle:"Rota crítica da semana",
      routeSub:"Os três movimentos que protegem a carteira",
      metrics:[
        ["CARTEIRA",`${projects.length} projetos`,"2 bloqueados","cyan"],
        ["RISCO MATERIAL","R$ 1,8 mi","exposição estimada","red"],
        ["CAPACIDADE","117% PLC","pico em setembro","yellow"],
        ["GO LIVES","4 em 90d","2 confirmados","green"]
      ],
      chargeTitle:"Quem o COO deve cobrar hoje",
      chargeSub:"Priorização calculada por impacto, prazo e SLA",
      pulseTitle:"Pulso do portfólio",
      pulseSub:"Tendência dos últimos 30 dias.",
      handoffTitle:"Bastões em movimento",
      handoffSub:"Onde Daniel e Thomas precisam agir agora",
      handoffItems:[
        {dept:"IMP",area:"Implantação",owner:"Daniel",project:"PETER 2",state:"Ajuste solicitado",detail:"Cliente sem retorno há 5 dias. A passagem final só libera com aceite registrado.",tone:"attention"},
        {dept:"ESP",area:"Espec. + DevOps",owner:"Thomas",project:"QUELUZ Fase 2",state:"Checklist em curso",detail:"4 de 6 checkpoints concluídos antes de liberar Implantação.",tone:"open"},
        {dept:"IMP",area:"Implantação",owner:"Daniel",project:"QUELUZ Fase 1",state:"Pronto para aceite",detail:"8 de 10 itens concluídos. Decisão necessária antes do go-live.",tone:"ready"}
      ]
    },
    es:{
      pulse:[
        {label:"Operación viva",value:"14 áreas conectadas",tone:"cyan"},
        {label:"Decisiones hoy",value:"3 críticas",tone:"gold"},
        {label:"Riesgo inmediato",value:"PLC + Infra + Compras",tone:"red"}
      ],
      directorial:[
        ["Operaciones activas","2 áreas en uso real","Implantación + Especificación/DevOps"],
        ["Próxima meta","Semana de uso asistido","subir confianza con usuarios reales"],
        ["Señal del sistema","La misma base alimenta dirección y ejecución","sin narrativa paralela"]
      ],
      briefing:"BRIEFING EJECUTIVO · 11 JUL 2026",
      heroTitle:"La operación ya tiene por dónde empezar a usarse de verdad.",
      heroBody:"InventOps ya salió del concepto básico: Implantación y Especificación/DevOps entran la próxima semana en uso asistido real, mientras la dirección acompaña la misma verdad operacional sin depender de informes paralelos.",
      openPlan:"Abrir plan de acción",
      viewOnePager:"Ver one-page",
      nextGoLive:"PRÓXIMO GO LIVE",
      confidence:"78% de confianza",
      pilotEyebrow:"Operación lista para uso",
      sessionEyebrow:"Tu contexto operacional",
      sessionCta:"Abrir mi operación",
      pilotCards:{
        IMP:{
          title:"Implantación",
          summary:"Campo, readiness, handoff y ejecución del Go Live en una sola lectura.",
          metric:"7 handoffs vivos",
          detail:"Daniel y el equipo ya pueden navegar la operación real del área.",
          cta:"Abrir operación de Implantación"
        },
        ESP:{
          title:"Especificación + DevOps",
          summary:"Especificación, checkpoints, dependencias y preparación técnica sin planillas paralelas.",
          metric:"5 checkpoints activos",
          detail:"Thomas y el equipo ya entran en un flujo guiado por evidencia y bloqueo real.",
          cta:"Abrir operación de DevOps"
        }
      },
      pressureTitle:"ÁREAS BAJO PRESIÓN",
      pressureBody:"Dónde actuar antes de que el atraso se convierta en costo",
      readingTitle:"LECTURA DEL INVENTOPS",
      readingBody:"La cartera está controlada, pero el sistema ya señala la próxima presión.",
      readingText:"InventOps cruza capacidad, bloqueos y fechas clave para mostrar dónde debe ocurrir la coordinación antes de que el problema aparezca en el cronograma ejecutivo.",
      openPm:"Abrir PM Control Tower",
      seeDecision:"Ver Decision Room",
      coordTitle:"Mapa de coordinación",
      coordSub:"Quién necesita avanzar en conjunto ahora",
      routeTitle:"Ruta crítica de la semana",
      routeSub:"Los tres movimientos que protegen la cartera",
      metrics:[
        ["CARTERA",`${projects.length} proyectos`,"2 bloqueados","cyan"],
        ["RIESGO MATERIAL","R$ 1,8 mi","exposición estimada","red"],
        ["CAPACIDAD","117% PLC","pico en septiembre","yellow"],
        ["GO LIVES","4 en 90d","2 confirmados","green"]
      ],
      chargeTitle:"A quién debe cobrar el COO hoy",
      chargeSub:"Priorización calculada por impacto, plazo y SLA",
      pulseTitle:"Pulso de la cartera",
      pulseSub:"Tendencia de los últimos 30 días.",
      handoffTitle:"Traspasos en movimiento",
      handoffSub:"Dónde Daniel y Thomas deben actuar ahora",
      handoffItems:[
        {dept:"IMP",area:"Implantación",owner:"Daniel",project:"PETER 2",state:"Ajuste solicitado",detail:"Cliente sin respuesta hace 5 días. El traspaso final sólo libera con aceptación registrada.",tone:"attention"},
        {dept:"ESP",area:"Espec. + DevOps",owner:"Thomas",project:"QUELUZ Fase 2",state:"Checklist en curso",detail:"4 de 6 checkpoints concluidos antes de liberar Implantación.",tone:"open"},
        {dept:"IMP",area:"Implantación",owner:"Daniel",project:"QUELUZ Fase 1",state:"Listo para aceptación",detail:"8 de 10 ítems concluidos. Decisión necesaria antes del go-live.",tone:"ready"}
      ]
    },
    en:{
      pulse:[
        {label:"Live operation",value:"14 connected areas",tone:"cyan"},
        {label:"Decisions today",value:"3 critical",tone:"gold"},
        {label:"Immediate risk",value:"PLC + Infra + Purchasing",tone:"red"}
      ],
      directorial:[
        ["Active operations","2 areas in real use","Implementation + Specification/DevOps"],
        ["Next goal","Assisted usage week","raise confidence with real users"],
        ["System signal","The same base feeds leadership and execution","no parallel narrative"]
      ],
      briefing:"EXECUTIVE BRIEFING · 11 JUL 2026",
      heroTitle:"The operation now has a real place to start being used.",
      heroBody:"InventOps has moved beyond the basic concept: Implementation and Specification/DevOps enter next week in real assisted use, while leadership follows the same operational truth without relying on parallel reporting.",
      openPlan:"Open action plan",
      viewOnePager:"View one-page",
      nextGoLive:"NEXT GO LIVE",
      confidence:"78% confidence",
      pilotEyebrow:"Operation ready for use",
      sessionEyebrow:"Your operational context",
      sessionCta:"Open my operation",
      pilotCards:{
        IMP:{
          title:"Implementation",
          summary:"Field work, readiness, handoff, and Go Live execution in a single reading.",
          metric:"7 live handoffs",
          detail:"Daniel and team can already navigate the area's real operation.",
          cta:"Open Implementation operations"
        },
        ESP:{
          title:"Specification + DevOps",
          summary:"Specification, checkpoints, dependencies, and technical readiness without parallel spreadsheets.",
          metric:"5 active checkpoints",
          detail:"Thomas and the team already enter a flow guided by evidence and real blockers.",
          cta:"Open DevOps operations"
        }
      },
      pressureTitle:"AREAS UNDER PRESSURE",
      pressureBody:"Where to act before delay turns into cost",
      readingTitle:"INVENTOPS READING",
      readingBody:"The portfolio is controlled, but the system is already pointing to the next pressure point.",
      readingText:"InventOps crosses capacity, blockers, and milestone dates to show where coordination must happen before the issue appears in the executive schedule.",
      openPm:"Open PM Control Tower",
      seeDecision:"View Decision Room",
      coordTitle:"Coordination map",
      coordSub:"Who needs to move together right now",
      routeTitle:"Critical route of the week",
      routeSub:"The three moves protecting the portfolio",
      metrics:[
        ["PORTFOLIO",`${projects.length} projects`,"2 blocked","cyan"],
        ["MATERIAL RISK","R$ 1.8M","estimated exposure","red"],
        ["CAPACITY","117% PLC","September peak","yellow"],
        ["GO LIVES","4 in 90d","2 confirmed","green"]
      ],
      chargeTitle:"Who the COO should challenge today",
      chargeSub:"Prioritization calculated by impact, due date, and SLA",
      pulseTitle:"Portfolio pulse",
      pulseSub:"Trend over the last 30 days.",
      handoffTitle:"Handoffs in motion",
      handoffSub:"Where Daniel and Thomas need to act now",
      handoffItems:[
        {dept:"IMP",area:"Implementation",owner:"Daniel",project:"PETER 2",state:"Adjustment requested",detail:"Client has been silent for 5 days. Final handoff only clears with registered acceptance.",tone:"attention"},
        {dept:"ESP",area:"Spec. + DevOps",owner:"Thomas",project:"QUELUZ Phase 2",state:"Checklist in progress",detail:"4 of 6 checkpoints completed before releasing Implementation.",tone:"open"},
        {dept:"IMP",area:"Implementation",owner:"Daniel",project:"QUELUZ Phase 1",state:"Ready for acceptance",detail:"8 of 10 items completed. Decision needed before go-live.",tone:"ready"}
      ]
    }
  };
  const copy=copyByLang[lang]||copyByLang.pt;
  const sessionDept = currentUser?.dept==="IMP" || currentUser?.dept==="ESP" ? currentUser.dept : null;
  const sessionArea = sessionDept ? { code: sessionDept, ...copy.pilotCards[sessionDept] } : null;
  const pilotAreas = [
    {
      code: "IMP",
      ...copy.pilotCards.IMP,
      eyebrow: copy.pilotEyebrow
    },
    {
      code: "ESP",
      ...copy.pilotCards.ESP,
      eyebrow: copy.pilotEyebrow
    }
  ];
  const coordinationNodes=[
    {label:"Infraestrutura",className:"infra"},
    {label:"Compras",className:"compras"},
    {label:"Comercial",className:"comercial"},
    {label:"Implantação",className:"implantacao"},
    {label:"Produção",className:"producao"}
  ];
  const criticalRoute=[
    ["Market Peru","VPN + range IP","Hoje"],
    ["Titano","Sensor X + SAT","Próx. 18h"],
    ["Navepark","VMs HML","14 jul"]
  ];
  const decisionPulse=copy.pulse;
  const directorialReading = copy.directorial;
  return <section className="page foundation-page">
    <div className="executive-command-strip">
      {decisionPulse.map(item=><span key={item.label} className={item.tone}><small>{item.label}</small><b>{item.value}</b></span>)}
    </div>
      <div className="executive-world-strip">
      {directorialReading.map(([label,value,detail])=><article key={label}><small>{label}</small><b>{value}</b><span>{detail}</span></article>)}
    </div>
    {sessionArea?<div className="session-operational-card">
      <div>
        <small>{copy.sessionEyebrow}</small>
        <b>{currentUser.name}: {sessionArea.title}</b>
        <p>{sessionArea.summary}</p>
      </div>
      <button className="ghost" onClick={()=>openCockpitDept(sessionArea.code)}><ArrowRight/>{copy.sessionCta}</button>
    </div>:null}
    <div className="executive-hero executive-world-hero">
      <div className="health-visual"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{v:health},{v:100-health}]} dataKey="v" startAngle={90} endAngle={-270} innerRadius={55} outerRadius={67} stroke="none"><Cell fill="#f5c300"/><Cell fill="#18263a"/></Pie></PieChart></ResponsiveContainer><span><small>HEALTH SCORE</small><b>{health}</b><em>/100</em></span></div>
      <div className="executive-brief"><small>{copy.briefing}</small><h2>{copy.heroTitle}</h2><p>{copy.heroBody}</p><div><button className="primary" onClick={()=>setActive("action")}><CheckSquare/>{copy.openPlan}</button><button className="ghost" onClick={()=>setActive("executive")}><FileText/>{copy.viewOnePager}</button></div></div>
      <div className="countdown"><small>{copy.nextGoLive}</small><b>9</b><span>dias</span><strong>TITANO · 20 JUL</strong><em>{copy.confidence}</em></div>
    </div>
    <div className="pilot-launch-grid">
      {pilotAreas.map(area=><article key={area.code} className="pilot-launch-card">
        <header>
          <small>{area.eyebrow}</small>
          <span>{area.code}</span>
        </header>
        <b>{area.title}</b>
        <p>{area.summary}</p>
        <div className="pilot-launch-metric">
          <strong>{area.metric}</strong>
          <small>{area.detail}</small>
        </div>
        <button className="ghost" onClick={()=>openCockpitDept(area.code)}><ArrowRight/>{area.cta}</button>
      </article>)}
    </div>
    <div className="home-handoff-board">
      <header>
        <small>{copy.handoffTitle}</small>
        <b>{copy.handoffSub}</b>
      </header>
      <div>
        {copy.handoffItems.map(item=><button key={`${item.dept}-${item.project}-${item.state}`} className={`home-handoff-card ${item.tone}`} type="button" onClick={()=>openCockpitDept(item.dept)}>
          <span>{item.area}</span>
          <b>{item.project}</b>
          <p>{item.detail}</p>
          <em><strong>{item.owner}</strong><i>{item.state}</i><ArrowRight/></em>
        </button>)}
      </div>
    </div>
    <div className="executive-signal-grid">
      <article className="signal-panel priority">
        <small>{copy.pressureTitle}</small>
        <b>{copy.pressureBody}</b>
        <div className="signal-list">
          {hotAreas.map(area=><button key={area.code} type="button" onClick={()=>setActive("areas")}><span>{area.code}</span><div><strong>{area.name}</strong><small>{area.owner}</small></div><em>{area.load}%</em></button>)}
        </div>
      </article>
      <article className="signal-panel synopsis">
        <small>{copy.readingTitle}</small>
        <b>{copy.readingBody}</b>
        <p>{copy.readingText}</p>
        <div className="synopsis-actions">
          <button className="ghost" onClick={()=>setActive("pm")}><ChartLineUp/>{copy.openPm}</button>
          <button className="ghost" onClick={()=>setActive("decision")}><Sparkle/>{copy.seeDecision}</button>
        </div>
      </article>
    </div>
    <div className="foundation-grid equal executive-insight-grid">
      <Panel title={copy.coordTitle} subtitle={copy.coordSub}>
        <div className="coordination-map">
          {coordinationNodes.map(node=><span key={node.label} className={`coord-node ${node.className}`}>{node.label}</span>)}
          <div className="coord-core"><b>PM</b><small>núcleo da decisão</small></div>
        </div>
      </Panel>
      <Panel title={copy.routeTitle} subtitle={copy.routeSub}>
        <div className="critical-route-list">
          {criticalRoute.map(([project,task,eta],index)=><button key={project} type="button" onClick={()=>setActive(index===0?"action":index===1?"alerts":"pm")}><strong>{String(index+1).padStart(2,"0")}</strong><span><b>{project}</b><small>{task}</small></span><em>{eta}</em><ArrowRight/></button>)}
        </div>
      </Panel>
    </div>
    <div className="foundation-metrics">{copy.metrics.map(([label,value,note,tone])=><Metric key={label} icon={label===copy.metrics[0][0]?Buildings:label===copy.metrics[1][0]?Warning:label===copy.metrics[2][0]?UsersThree:FlagCheckered} label={label} value={value} note={note} tone={tone}/>)}</div>
    <div className="foundation-grid two-one"><Panel title={copy.chargeTitle} subtitle={copy.chargeSub}><div className="charge-list">{blockers.map((b,i)=><button key={b.project} onClick={()=>setActive(i===2?"alerts":"action")}><strong>0{i+1}</strong><span><b>{b.project}</b><small>{b.action}</small></span><em>{b.owner}</em><ArrowRight/></button>)}</div></Panel><Panel title={copy.pulseTitle} subtitle={copy.pulseSub}><div className="foundation-chart"><ResponsiveContainer><AreaChart data={trend}><defs><linearGradient id="healthFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#28c5e7" stopOpacity=".35"/><stop offset="1" stopColor="#28c5e7" stopOpacity="0"/></linearGradient></defs><CartesianGrid stroke="#17243a" vertical={false}/><XAxis dataKey="day" tick={{fontSize:9}} stroke="#66758c"/><YAxis domain={[40,100]} tick={{fontSize:9}} stroke="#66758c"/><Tooltip/><Area dataKey="health" stroke="#28c5e7" fill="url(#healthFill)" strokeWidth={2}/></AreaChart></ResponsiveContainer></div></Panel></div>
  </section>;
}

const ACTION_CENTER_I18N={
  pt:{tag:"MEU DIA · VISÃO DO ANALISTA",greet:"Bom dia, Daiana. Três ações protegem os próximos marcos.",lead:"O InventOps organizou sua fila por impacto no Go Live, SLA e dependências — sem depender de cobranças espalhadas em grupos.",governance:"GOVERNANÇA",governanceValue:"100% com responsável",governanceNote:"e-mail corporativo vinculado",
   immediate:"AÇÃO IMEDIATA",immediateNote:"SLA em curso",dueToday:"VENCEM HOJE",dueTodayNote:"1 dependência externa",inValidation:"EM VALIDAÇÃO",inValidationNote:"com evidência anexada",noOwner:"SEM RESPONSÁVEL",noOwnerNote:"governança íntegra",
   queueTitle:"Fila inteligente de execução",queueSubtitle:"Prioridade, contexto, dono, prazo e evidência em uma única tela.",
   filters:{myQueue:"Minha fila",today:"Hoje",waiting:"Aguardando",p0:"P0"},
   why:"POR QUE ISSO IMPORTA",linkedOwner:"Responsável vinculado",dependency:"Dependência",evidenceToClose:"Evidência para concluir",
   prepareUpdate:"Preparar atualização",registerEvidence:"Registrar evidência",done:"Concluída",validate:"Validar e concluir",footerNote:"Conclusão bloqueada até existir evidência auditável.",
   parallelTitle:"Execução paralela · NAVEPARK",parallelSubtitle:"As áreas avançam juntas; apenas dependências reais bloqueiam o trabalho",parallelReadTitle:"Leitura do InventOps:",parallelRead:"Compras e Especificação continuam trabalhando. Somente DEV aguarda a topologia de Infra — o sistema não transforma sequência de departamentos em bloqueio artificial.",
   commTag:"ATUALIZAÇÃO OPERACIONAL",commTitle:"Mensagem pronta para revisão",commBody:"O destinatário vem da tarefa vinculada ao e-mail corporativo.",close:"Fechar",recipient:"DESTINATÁRIO",copy:"Copiar",openOutlook:"Abrir Outlook",commFooter:"O InventOps prepara e registra; o usuário revisa antes do envio.",
   copiedToast:"Atualização copiada e registrada no histórico.",evidenceToast:"Evidência registrada. A atividade entrou na fila de validação técnica.",approveToast:"Atividade concluída com evidência auditável vinculada ao projeto.",
   msgTemplate:(c)=>`InventOps · ${c.project}\n${c.task}\nStatus: ${c.status}\nPrazo: ${c.due}\nResponsável: ${c.owner}\nPróxima evidência: ${c.evidence}`},
  es:{tag:"MI DÍA · VISIÓN DEL ANALISTA",greet:"Buenos días, Daiana. Tres acciones protegen los próximos hitos.",lead:"InventOps organizó tu fila por impacto en el Go Live, SLA y dependencias — sin depender de reclamos dispersos en grupos.",governance:"GOBERNANZA",governanceValue:"100% con responsable",governanceNote:"correo corporativo vinculado",
   immediate:"ACCIÓN INMEDIATA",immediateNote:"SLA en curso",dueToday:"VENCEN HOY",dueTodayNote:"1 dependencia externa",inValidation:"EN VALIDACIÓN",inValidationNote:"con evidencia adjunta",noOwner:"SIN RESPONSABLE",noOwnerNote:"gobernanza íntegra",
   queueTitle:"Fila inteligente de ejecución",queueSubtitle:"Prioridad, contexto, dueño, plazo y evidencia en una sola pantalla.",
   filters:{myQueue:"Mi fila",today:"Hoy",waiting:"Esperando",p0:"P0"},
   why:"POR QUÉ ESTO IMPORTA",linkedOwner:"Responsable vinculado",dependency:"Dependencia",evidenceToClose:"Evidencia para concluir",
   prepareUpdate:"Preparar actualización",registerEvidence:"Registrar evidencia",done:"Concluida",validate:"Validar y concluir",footerNote:"La conclusión queda bloqueada hasta existir evidencia auditable.",
   parallelTitle:"Ejecución paralela · NAVEPARK",parallelSubtitle:"Las áreas avanzan juntas; solo dependencias reales bloquean el trabajo",parallelReadTitle:"Lectura de InventOps:",parallelRead:"Compras y Especificación siguen trabajando. Solo DEV espera la topología de Infra — el sistema no transforma la secuencia de departamentos en bloqueo artificial.",
   commTag:"ACTUALIZACIÓN OPERATIVA",commTitle:"Mensaje listo para revisión",commBody:"El destinatario viene de la tarea vinculada al correo corporativo.",close:"Cerrar",recipient:"DESTINATARIO",copy:"Copiar",openOutlook:"Abrir Outlook",commFooter:"InventOps prepara y registra; el usuario revisa antes del envío.",
   copiedToast:"Actualización copiada y registrada en el historial.",evidenceToast:"Evidencia registrada. La actividad entró en la fila de validación técnica.",approveToast:"Actividad concluida con evidencia auditable vinculada al proyecto.",
   msgTemplate:(c)=>`InventOps · ${c.project}\n${c.task}\nEstado: ${c.status}\nPlazo: ${c.due}\nResponsable: ${c.owner}\nPróxima evidencia: ${c.evidence}`},
  en:{tag:"MY DAY · ANALYST VIEW",greet:"Good morning, Daiana. Three actions protect the next milestones.",lead:"InventOps organized your queue by impact on Go Live, SLA and dependencies — without relying on follow-ups scattered across group chats.",governance:"GOVERNANCE",governanceValue:"100% with owner",governanceNote:"corporate e-mail linked",
   immediate:"IMMEDIATE ACTION",immediateNote:"SLA in progress",dueToday:"DUE TODAY",dueTodayNote:"1 external dependency",inValidation:"IN VALIDATION",inValidationNote:"with attached evidence",noOwner:"NO OWNER",noOwnerNote:"governance intact",
   queueTitle:"Smart execution queue",queueSubtitle:"Priority, context, owner, due date and evidence in a single screen.",
   filters:{myQueue:"My queue",today:"Today",waiting:"Waiting",p0:"P0"},
   why:"WHY THIS MATTERS",linkedOwner:"Linked owner",dependency:"Dependency",evidenceToClose:"Evidence to close",
   prepareUpdate:"Prepare update",registerEvidence:"Register evidence",done:"Done",validate:"Validate and close",footerNote:"Closing is blocked until auditable evidence exists.",
   parallelTitle:"Parallel execution · NAVEPARK",parallelSubtitle:"Areas move forward together; only real dependencies block the work",parallelReadTitle:"InventOps read:",parallelRead:"Purchasing and Specification keep working. Only DEV is waiting on Infra's topology — the system doesn't turn a department sequence into an artificial blocker.",
   commTag:"OPERATIONAL UPDATE",commTitle:"Message ready for review",commBody:"The recipient comes from the task linked to the corporate e-mail.",close:"Close",recipient:"RECIPIENT",copy:"Copy",openOutlook:"Open Outlook",commFooter:"InventOps prepares and logs it; the user reviews before sending.",
   copiedToast:"Update copied and logged to history.",evidenceToast:"Evidence registered. The activity entered the technical validation queue.",approveToast:"Activity completed with auditable evidence linked to the project.",
   msgTemplate:(c)=>`InventOps · ${c.project}\n${c.task}\nStatus: ${c.status}\nDue: ${c.due}\nOwner: ${c.owner}\nNext evidence: ${c.evidence}`},
};
export function ActionCenter({notify,lang="pt"}){
  const t=ACTION_CENTER_I18N[lang]||ACTION_CENTER_I18N.pt;
  const [actions,setActions]=useState(actionsSeed);
  const [filter,setFilter]=useState("myQueue");
  const [selectedId,setSelectedId]=useState(3);
  const [communication,setCommunication]=useState(null);
  const selected=actions.find(a=>a.id===selectedId)||actions[0];
  const shown=filter==="myQueue"?actions:filter==="today"?actions.filter(a=>a.due.startsWith("Hoje")):filter==="waiting"?actions.filter(a=>a.status.includes("Aguardando")):actions.filter(a=>a.p==="P0");
  const registerEvidence=id=>{setActions(current=>current.map(a=>a.id===id?{...a,evidenceState:"Anexada",status:"Em validação"}:a));notify(t.evidenceToast)};
  const approve=id=>{setActions(current=>current.map(a=>a.id===id?{...a,status:"Concluído"}:a));notify(t.approveToast)};
  const prepareCommunication=a=>setCommunication(a);
  const message=communication?t.msgTemplate(communication):"";
  return <section className="page foundation-page analyst-workspace">
    <div className="analyst-brief"><div><small>{t.tag}</small><h2>{t.greet}</h2><p>{t.lead}</p></div><span><ShieldCheck/><small>{t.governance}</small><b>{t.governanceValue}</b><em>{t.governanceNote}</em></span></div>
    <div className="foundation-metrics"><Metric icon={BellRinging} label={t.immediate} value="1 P0" note={t.immediateNote} tone="red"/><Metric icon={ClockCountdown} label={t.dueToday} value="2 tarefas" note={t.dueTodayNote} tone="yellow"/><Metric icon={CheckCircle} label={t.inValidation} value={`${actions.filter(a=>a.status==="Em validação").length}`} note={t.inValidationNote} tone="green"/><Metric icon={UsersThree} label={t.noOwner} value="0" note={t.noOwnerNote}/></div>
    <div className="action-toolbar"><div><h2>{t.queueTitle}</h2><p>{t.queueSubtitle}</p></div><div>{Object.entries(t.filters).map(([key,label])=><button className={filter===key?"active":""} key={key} onClick={()=>setFilter(key)}>{label}</button>)}</div></div>
    <div className="analyst-grid"><div className="action-board">{shown.map(a=><button type="button" key={a.id} className={`action-item ${a.p.toLowerCase()} ${selectedId===a.id?"selected":""}`} onClick={()=>setSelectedId(a.id)}><span className="priority-pill">{a.p}</span><div><small>{a.project} · {a.dept}</small><h3>{a.task}</h3><span><UsersThree/>{a.owner}<CalendarBlank/>{a.due}</span></div><em>{a.status}</em><ArrowRight/></button>)}</div>
      <aside className="task-context"><header><span className={`priority-pill ${selected.p.toLowerCase()}`}>{selected.p}</span><div><small>{selected.project} · {selected.dept}</small><h3>{selected.task}</h3></div></header><div className="context-impact"><Warning/><span><small>{t.why}</small><p>{selected.impact}</p></span></div><dl><div><dt>{t.linkedOwner}</dt><dd>{selected.owner}<small>{selected.email}</small></dd></div><div><dt>{t.dependency}</dt><dd>{selected.dependency}<em className={selected.dependencyState.toLowerCase()}>{selected.dependencyState}</em></dd></div><div><dt>{t.evidenceToClose}</dt><dd>{selected.evidence}<small className={selected.evidenceState==="Anexada"?"ready":""}>{selected.evidenceState}</small></dd></div></dl><div className="context-actions"><button className="ghost" onClick={()=>prepareCommunication(selected)}><Envelope/>{t.prepareUpdate}</button>{selected.evidenceState!=="Anexada"?<button className="primary" onClick={()=>registerEvidence(selected.id)}><Database/>{t.registerEvidence}</button>:<button className="primary" disabled={selected.status==="Concluído"} onClick={()=>approve(selected.id)}><CheckCircle/>{selected.status==="Concluído"?t.done:t.validate}</button>}</div><footer><ShieldCheck/>{t.footerNote}</footer></aside>
    </div>
    <Panel title={t.parallelTitle} subtitle={t.parallelSubtitle}><div className="parallel-flow">{[["INF","Topologia das VMs","Em andamento","72%"],["CMP","Compra de servidores","Em paralelo","48%"],["ESP","Especificação funcional","Em paralelo","64%"],["DEV","Integrações WCS","Aguardando INF","26%"]].map((x,i)=><div key={x[0]} className={i===3?"blocked":""}><span>{x[0]}</span><section><b>{x[1]}</b><small>{x[2]}</small><i><em style={{width:x[3]}}/></i></section><strong>{x[3]}</strong>{i<3?<ArrowRight/>:null}</div>)}</div><p className="parallel-note"><Sparkle/><span><b>{t.parallelReadTitle}</b> {t.parallelRead}</span></p></Panel>
    {communication?<div className="modal-layer" onMouseDown={e=>e.target===e.currentTarget&&setCommunication(null)}><article className="analyst-communication" role="dialog" aria-modal="true"><header><div><small>{t.commTag}</small><h2>{t.commTitle}</h2><p>{t.commBody}</p></div><button aria-label={t.close} onClick={()=>setCommunication(null)}><XCircle/></button></header><div className="communication-recipient"><Envelope/><span><small>{t.recipient}</small><b>{communication.email}</b></span><em>{communication.dept}</em></div><pre>{message}</pre><div><button className="ghost" onClick={()=>{navigator.clipboard?.writeText(message);notify(t.copiedToast)}}><ClipboardText/>{t.copy}</button><a className="whatsapp" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer"><WhatsappLogo/>WhatsApp</a><a className="primary" href={`mailto:${communication.email}?subject=${encodeURIComponent(`InventOps · ${communication.project}`)}&body=${encodeURIComponent(message)}`}><Envelope/>{t.openOutlook}</a></div><footer><ShieldCheck/>{t.commFooter}</footer></article></div>:null}
  </section>;
}

const MANAGEMENT_I18N={
  pt:{healthAvg:"SAÚDE MÉDIA",healthNote:"+7 em 30 dias",delivery:"ENTREGA",deliveryNote:"+19 p.p.",bottlenecks:"GARGALOS",bottlenecksNote:"23 dias acumulados",predict:"PREVISIBILIDADE",predictNote:"marcos no prazo",
   trendTitle:"Tendência de performance · 30 dias",trendSubtitle:"Saúde e entrega com base nas evidências registradas",seriesHealth:"Saúde",seriesDelivery:"Entrega",
   capacityTitle:"Capacidade por área crítica",capacitySubtitle:"Acima de 100% exige replanejamento",seriesLoad:"Carga %",
   bottleneckTitle:"Gargalos ativos",bottleneckSubtitle:"Texto completo para orientar cobrança, não apenas um semáforo",
   colProject:"Projeto / área",colImpact:"Impacto operacional",colAction:"Próxima ação obrigatória",colOwner:"Dono / idade"},
  es:{healthAvg:"SALUD PROMEDIO",healthNote:"+7 en 30 días",delivery:"ENTREGA",deliveryNote:"+19 p.p.",bottlenecks:"CUELLOS DE BOTELLA",bottlenecksNote:"23 días acumulados",predict:"PREVISIBILIDAD",predictNote:"hitos a tiempo",
   trendTitle:"Tendencia de desempeño · 30 días",trendSubtitle:"Salud y entrega según la evidencia registrada",seriesHealth:"Salud",seriesDelivery:"Entrega",
   capacityTitle:"Capacidad por área crítica",capacitySubtitle:"Por encima del 100% exige replanificación",seriesLoad:"Carga %",
   bottleneckTitle:"Cuellos de botella activos",bottleneckSubtitle:"Texto completo para orientar el reclamo, no solo un semáforo",
   colProject:"Proyecto / área",colImpact:"Impacto operativo",colAction:"Próxima acción obligatoria",colOwner:"Dueño / antigüedad"},
  en:{healthAvg:"AVERAGE HEALTH",healthNote:"+7 in 30 days",delivery:"DELIVERY",deliveryNote:"+19 p.p.",bottlenecks:"BOTTLENECKS",bottlenecksNote:"23 days accumulated",predict:"PREDICTABILITY",predictNote:"milestones on time",
   trendTitle:"Performance trend · 30 days",trendSubtitle:"Health and delivery based on recorded evidence",seriesHealth:"Health",seriesDelivery:"Delivery",
   capacityTitle:"Capacity by critical area",capacitySubtitle:"Above 100% requires replanning",seriesLoad:"Load %",
   bottleneckTitle:"Active bottlenecks",bottleneckSubtitle:"Full text to guide follow-up, not just a traffic light",
   colProject:"Project / area",colImpact:"Operational impact",colAction:"Next required action",colOwner:"Owner / age"},
};
export function ManagementPage({lang="pt"}={}){
  const t=MANAGEMENT_I18N[lang]||MANAGEMENT_I18N.pt;
  return <section className="page foundation-page"><div className="foundation-metrics"><Metric icon={Gauge} label={t.healthAvg} value="68/100" note={t.healthNote} tone="green"/><Metric icon={TrendUp} label={t.delivery} value="73%" note={t.deliveryNote}/><Metric icon={Warning} label={t.bottlenecks} value="3 ativos" note={t.bottlenecksNote} tone="red"/><Metric icon={ClockCountdown} label={t.predict} value="81%" note={t.predictNote} tone="yellow"/></div><div className="foundation-grid equal"><Panel title={t.trendTitle} subtitle={t.trendSubtitle}><div className="foundation-chart large"><ResponsiveContainer><AreaChart data={trend}><CartesianGrid stroke="#17243a" vertical={false}/><XAxis dataKey="day" tick={{fontSize:9}} stroke="#66758c"/><YAxis domain={[40,100]} tick={{fontSize:9}} stroke="#66758c"/><Tooltip/><Area dataKey="health" name={t.seriesHealth} stroke="#28c5e7" fill="#28c5e722" strokeWidth={2}/><Area dataKey="delivery" name={t.seriesDelivery} stroke="#f5c300" fill="#f5c30012" strokeWidth={2}/></AreaChart></ResponsiveContainer></div></Panel><Panel title={t.capacityTitle} subtitle={t.capacitySubtitle}><div className="foundation-chart large"><ResponsiveContainer><BarChart data={departments.filter(d=>d.load>=90)} layout="vertical"><CartesianGrid stroke="#17243a" horizontal={false}/><XAxis type="number" domain={[0,130]} tick={{fontSize:9}} stroke="#66758c"/><YAxis dataKey="code" type="category" tick={{fontSize:9}} stroke="#66758c" width={35}/><Tooltip/><Bar dataKey="load" name={t.seriesLoad} radius={[0,4,4,0]}>{departments.filter(d=>d.load>=90).map(d=><Cell key={d.code} fill={d.load>100?"#fb5470":"#28c5e7"}/>)}</Bar></BarChart></ResponsiveContainer></div></Panel></div><Panel title={t.bottleneckTitle} subtitle={t.bottleneckSubtitle}><div className="blocker-table"><header><span>{t.colProject}</span><span>{t.colImpact}</span><span>{t.colAction}</span><span>{t.colOwner}</span></header>{blockers.map(b=><div key={b.project}><span><b>{b.project}</b><small>{b.area}</small></span><p>{b.impact}</p><p>{b.action}</p><span><b>{b.owner}</b><small>{b.age}</small></span></div>)}</div></Panel></section>;
}

const ANALYTICS_I18N={
  pt:{healthTitle:"Saúde do portfólio",healthSubtitle:"Distribuição dos projetos",projects:"projetos",healthy:"Saudáveis",attention:"Atenção",critical:"Críticos",
   evidenceTitle:"Qualidade da evidência",evidenceSubtitle:"Confiabilidade do progresso calculado",highConfidence:"ALTA CONFIANÇA",evidenceBody:"91% dos itens concluídos possuem evidência auditável e origem identificada.",
   riskTitle:"Risco por natureza",riskSubtitle:"RAID consolidado",riskLabels:["Riscos","Impedimentos","Premissas","Dependências"],
   commitTitle:"Commit Grid · engajamento técnico",commitSubtitle:"Atividade válida em bases homologadas · últimos 84 dias",validCommits:v=>`${v} commits válidos`,less:"Menos",more:"Mais",legend:"312 commits válidos · 11 colaboradores"},
  es:{healthTitle:"Salud del portafolio",healthSubtitle:"Distribución de los proyectos",projects:"proyectos",healthy:"Saludables",attention:"Atención",critical:"Críticos",
   evidenceTitle:"Calidad de la evidencia",evidenceSubtitle:"Confiabilidad del progreso calculado",highConfidence:"ALTA CONFIANZA",evidenceBody:"El 91% de los ítems concluidos tienen evidencia auditable y origen identificado.",
   riskTitle:"Riesgo por naturaleza",riskSubtitle:"RAID consolidado",riskLabels:["Riesgos","Impedimentos","Premisas","Dependencias"],
   commitTitle:"Commit Grid · compromiso técnico",commitSubtitle:"Actividad válida en bases homologadas · últimos 84 días",validCommits:v=>`${v} commits válidos`,less:"Menos",more:"Más",legend:"312 commits válidos · 11 colaboradores"},
  en:{healthTitle:"Portfolio health",healthSubtitle:"Project distribution",projects:"projects",healthy:"Healthy",attention:"Attention",critical:"Critical",
   evidenceTitle:"Evidence quality",evidenceSubtitle:"Reliability of the calculated progress",highConfidence:"HIGH CONFIDENCE",evidenceBody:"91% of completed items have auditable evidence and identified origin.",
   riskTitle:"Risk by nature",riskSubtitle:"Consolidated RAID",riskLabels:["Risks","Impediments","Assumptions","Dependencies"],
   commitTitle:"Commit Grid · technical engagement",commitSubtitle:"Valid activity on homologated bases · last 84 days",validCommits:v=>`${v} valid commits`,less:"Less",more:"More",legend:"312 valid commits · 11 collaborators"},
};
export function AnalyticsPage({lang="pt"}={}){
  const t=ANALYTICS_I18N[lang]||ANALYTICS_I18N.pt;
  const commitDays=Array.from({length:84},(_,i)=>({i,v:(i*7+i%5*3)%5}));
  const riskValues=[[t.riskLabels[0],7,70],[t.riskLabels[1],4,40],[t.riskLabels[2],5,50],[t.riskLabels[3],8,80]];
  return <section className="page foundation-page"><div className="foundation-grid thirds"><Panel title={t.healthTitle} subtitle={t.healthSubtitle}><div className="donut-wrap"><div className="donut"><ResponsiveContainer><PieChart><Pie data={[{n:t.healthy,v:2},{n:t.attention,v:2},{n:t.critical,v:2}]} dataKey="v" innerRadius={48} outerRadius={70} stroke="none"><Cell fill="#40d986"/><Cell fill="#f5c300"/><Cell fill="#fb5470"/></Pie><Tooltip/></PieChart></ResponsiveContainer><span><b>6</b><small>{t.projects}</small></span></div><ul><li><i className="green"/>{t.healthy} <b>2</b></li><li><i className="yellow"/>{t.attention} <b>2</b></li><li><i className="red"/>{t.critical} <b>2</b></li></ul></div></Panel><Panel title={t.evidenceTitle} subtitle={t.evidenceSubtitle}><div className="score-gauge"><b>82%</b><span>{t.highConfidence}</span><i><em style={{width:"82%"}}/></i><p>{t.evidenceBody}</p></div></Panel><Panel title={t.riskTitle} subtitle={t.riskSubtitle}><div className="risk-bars">{riskValues.map(([n,v,w])=><span key={n}><small>{n}</small><i><em style={{width:`${w}%`}}/></i><b>{v}</b></span>)}</div></Panel></div><Panel title={t.commitTitle} subtitle={t.commitSubtitle}><div className="commit-grid">{commitDays.map(x=><i key={x.i} className={`level-${x.v}`} title={t.validCommits(x.v*2)}/>)}</div><div className="commit-legend"><span>{t.less}</span>{[0,1,2,3,4].map(x=><i key={x} className={`level-${x}`}/>)}<span>{t.more}</span><b>{t.legend}</b></div></Panel></section>;
}

const EXEC_ONEPAGER_I18N={
  pt:{updated:"Relatório executivo · atualizado em 11/07/2026 às 21:40",print:"Imprimir",share:"Compartilhar",shareToast:"One-page preparado para envio com trilha de auditoria.",
   tag:"INVENTOPS · RELATÓRIO EXECUTIVO",title:"Portfólio de Projetos",subtitle:"Decisões, riscos e próximos marcos em uma página.",healthScore:"HEALTH SCORE",
   kpiProjects:"PROJETOS",kpiProjectsNote:"2 bloqueados",kpiRisk:"RISCO FINANCEIRO",kpiRiskNote:"exposição estimada",kpiGoLive:"GO LIVES 90D",kpiGoLiveNote:"2 confirmados",kpiCapacity:"CAPACIDADE",kpiCapacityNote:"PLC em setembro",
   readTitle:"Leitura executiva",readBody:"A carteira evoluiu 7 pontos em saúde nos últimos 30 dias. O avanço é sustentado por evidências técnicas, mas três dependências ameaçam a previsibilidade: conectividade do Market Peru, ambiente HML do Navepark e capacidade compartilhada de PLC.",
   journeyTag:"JORNADA VALIDADA",journeyTitle:"Sequência visível da entrega",journey:[["Login","Check"],["Home","Check"],["PM","Check"],["Executive","Em fechamento"]],
   decisionsTitle:"Decisões solicitadas",decisions:["Autorizar aceleração do hardware TITANO.","Escalar conectividade Market Peru com o cliente.","Repriorizar capacidade PLC para agosto e setembro."],
   milestonesTitle:"Próximos marcos",source:"Fonte: InventOps · dados auditáveis",internalUse:"Uso executivo interno"},
  es:{updated:"Reporte ejecutivo · actualizado el 11/07/2026 a las 21:40",print:"Imprimir",share:"Compartir",shareToast:"One-page preparado para enviar con trazabilidad de auditoría.",
   tag:"INVENTOPS · REPORTE EJECUTIVO",title:"Portafolio de Proyectos",subtitle:"Decisiones, riesgos y próximos hitos en una página.",healthScore:"HEALTH SCORE",
   kpiProjects:"PROYECTOS",kpiProjectsNote:"2 bloqueados",kpiRisk:"RIESGO FINANCIERO",kpiRiskNote:"exposición estimada",kpiGoLive:"GO LIVES 90D",kpiGoLiveNote:"2 confirmados",kpiCapacity:"CAPACIDAD",kpiCapacityNote:"PLC en septiembre",
   readTitle:"Lectura ejecutiva",readBody:"La cartera avanzó 7 puntos en salud en los últimos 30 días. El avance está sustentado por evidencia técnica, pero tres dependencias amenazan la previsibilidad: conectividad de Market Peru, ambiente HML de Navepark y capacidad compartida de PLC.",
   journeyTag:"RECORRIDO VALIDADO",journeyTitle:"Secuencia visible de la entrega",journey:[["Login","Listo"],["Home","Listo"],["PM","Listo"],["Ejecutivo","En cierre"]],
   decisionsTitle:"Decisiones solicitadas",decisions:["Autorizar la aceleración del hardware TITANO.","Escalar la conectividad de Market Peru con el cliente.","Repriorizar la capacidad de PLC para agosto y septiembre."],
   milestonesTitle:"Próximos hitos",source:"Fuente: InventOps · datos auditables",internalUse:"Uso ejecutivo interno"},
  en:{updated:"Executive report · updated on 07/11/2026 at 21:40",print:"Print",share:"Share",shareToast:"One-page ready to send with audit trail.",
   tag:"INVENTOPS · EXECUTIVE REPORT",title:"Project Portfolio",subtitle:"Decisions, risks and next milestones on one page.",healthScore:"HEALTH SCORE",
   kpiProjects:"PROJECTS",kpiProjectsNote:"2 blocked",kpiRisk:"FINANCIAL RISK",kpiRiskNote:"estimated exposure",kpiGoLive:"90D GO-LIVES",kpiGoLiveNote:"2 confirmed",kpiCapacity:"CAPACITY",kpiCapacityNote:"PLC in September",
   readTitle:"Executive read",readBody:"The portfolio improved 7 health points over the last 30 days. The progress is backed by technical evidence, but three dependencies threaten predictability: Market Peru connectivity, Navepark's HML environment and shared PLC capacity.",
   journeyTag:"VALIDATED JOURNEY",journeyTitle:"Visible delivery sequence",journey:[["Login","Check"],["Home","Check"],["PM","Check"],["Executive","Closing"]],
   decisionsTitle:"Requested decisions",decisions:["Authorize TITANO hardware acceleration.","Escalate Market Peru connectivity with the client.","Reprioritize PLC capacity for August and September."],
   milestonesTitle:"Next milestones",source:"Source: InventOps · auditable data",internalUse:"Internal executive use"},
};
export function ExecutiveOnePager({projects,notify,lang="pt"}){
  const t=EXEC_ONEPAGER_I18N[lang]||EXEC_ONEPAGER_I18N.pt;
  return <section className="page foundation-page onepager-page"><div className="onepager-actions"><span>{t.updated}</span><button className="ghost" onClick={()=>window.print()}><Printer/>{t.print}</button><button className="primary" onClick={()=>notify(t.shareToast)}><Envelope/>{t.share}</button></div><article className="onepager"><header><div><small>{t.tag}</small><h2>{t.title}</h2><p>{t.subtitle}</p></div><span><b>68</b><small>{t.healthScore}</small></span></header><div className="onepage-kpis"><span><small>{t.kpiProjects}</small><b>{projects.length}</b><em>{t.kpiProjectsNote}</em></span><span><small>{t.kpiRisk}</small><b>R$ 1,8 mi</b><em>{t.kpiRiskNote}</em></span><span><small>{t.kpiGoLive}</small><b>4</b><em>{t.kpiGoLiveNote}</em></span><span><small>{t.kpiCapacity}</small><b>117%</b><em>{t.kpiCapacityNote}</em></span></div><section><h3>{t.readTitle}</h3><p>{t.readBody}</p></section><section className="onepage-journey"><div><small>{t.journeyTag}</small><h3>{t.journeyTitle}</h3></div><div className="journey-strip">{t.journey.map(([label,state],index)=><span key={label} className={index===t.journey.length-1?"over":""}><b>{label}</b><small>{state}</small></span>)}</div></section><div className="onepage-columns"><section><h3>{t.decisionsTitle}</h3><ol>{t.decisions.map(d=><li key={d}>{d}</li>)}</ol></section><section><h3>{t.milestonesTitle}</h3>{projects.slice(0,4).map(p=><div className="onepage-project" key={p.name}><b>{p.name}</b><span>{p.next}</span><em>{p.date}</em></div>)}</section></div><footer><span>{t.source}</span><b>{t.internalUse}</b></footer></article></section>;
}

const AREAS_I18N={
  pt:{journeyTag:"JORNADA CROSS-DEPARTMENT · TITANO",journeyTitle:"14 áreas, uma única verdade operacional",journeyBody:"Cada etapa mostra progresso, capacidade e bloqueios sem perder a visão horizontal do projeto.",
   done:"Concluído",ongoing:"Em curso",planned:"Planejado",priorityTag:"ÁREA PRIORITÁRIA",
   descINF:"Ambiente, conectividade, VMs, acessos e sustentação técnica do projeto.",descIMP:"Campo, agenda, readiness e execução do go live com evidência operacional.",descESP:"Especificação funcional, handoff com DEV e coerência do fluxo técnico.",
   openArea:"Abrir visão da área",allAreas:"Todas as áreas",overload:"Sobrecarga",inf:"Infraestrutura",imp:"Implantação",esp:"Especificação / DevOps",overCapacity:"acima de 100% de capacidade",
   progress:"PROGRESSO",activeBlocks:n=>`${n} bloqueios ativos`,replan:"Replanejar",controlled:"Capacidade controlada"},
  es:{journeyTag:"RECORRIDO ENTRE DEPARTAMENTOS · TITANO",journeyTitle:"14 áreas, una única verdad operativa",journeyBody:"Cada etapa muestra progreso, capacidad y bloqueos sin perder la visión horizontal del proyecto.",
   done:"Concluido",ongoing:"En curso",planned:"Planificado",priorityTag:"ÁREA PRIORITARIA",
   descINF:"Ambiente, conectividad, VMs, accesos y sustentación técnica del proyecto.",descIMP:"Campo, agenda, disponibilidad y ejecución del go live con evidencia operativa.",descESP:"Especificación funcional, handoff con DEV y coherencia del flujo técnico.",
   openArea:"Abrir vista del área",allAreas:"Todas las áreas",overload:"Sobrecarga",inf:"Infraestructura",imp:"Implantación",esp:"Especificación / DevOps",overCapacity:"por encima del 100% de capacidad",
   progress:"PROGRESO",activeBlocks:n=>`${n} bloqueos activos`,replan:"Replanificar",controlled:"Capacidad controlada"},
  en:{journeyTag:"CROSS-DEPARTMENT JOURNEY · TITANO",journeyTitle:"14 areas, one single operational truth",journeyBody:"Each stage shows progress, capacity and blockers without losing the project's horizontal view.",
   done:"Done",ongoing:"Ongoing",planned:"Planned",priorityTag:"PRIORITY AREA",
   descINF:"Environment, connectivity, VMs, access and technical sustainment of the project.",descIMP:"Field, schedule, readiness and go-live execution with operational evidence.",descESP:"Functional specification, handoff with DEV and technical flow coherence.",
   openArea:"Open area view",allAreas:"All areas",overload:"Overload",inf:"Infrastructure",imp:"Deployment",esp:"Specification / DevOps",overCapacity:"above 100% capacity",
   progress:"PROGRESS",activeBlocks:n=>`${n} active blockers`,replan:"Replan",controlled:"Controlled capacity"},
};
export function AreasPage({lang="pt"}={}){
  const t=AREAS_I18N[lang]||AREAS_I18N.pt;
  const [selected,setSelected]=useState("Todos");
  const focusAreas=["INF","IMP","ESP"];
  const shown=selected==="Todos"
    ? departments
    : selected==="Sobrecarga"
      ? departments.filter(d=>d.load>100)
      : departments.filter(d=>d.code===selected);
  const focusCards=departments.filter(d=>focusAreas.includes(d.code));
  return <section className="page foundation-page">
    <div className="area-journey"><div><small>{t.journeyTag}</small><h2>{t.journeyTitle}</h2><p>{t.journeyBody}</p></div><div className="journey-strip">{departments.map((d,i)=><span className={d.load>100?"over":""} key={d.code}><b>{d.code}</b><small>{i<3?t.done:i<10?t.ongoing:t.planned}</small></span>)}</div></div>
    <div className="foundation-grid thirds area-focus-strip">
      {focusCards.map(card=><article key={card.code} className={`area-focus-card ${selected===card.code?"active":""}`}><small>{t.priorityTag}</small><b>{card.name}</b><p>{card.code==="INF"?t.descINF:card.code==="IMP"?t.descIMP:t.descESP}</p><button className="ghost" onClick={()=>setSelected(card.code)}>{t.openArea}</button></article>)}
    </div>
    <div className="area-toolbar"><div><button className={selected==="Todos"?"active":""} onClick={()=>setSelected("Todos")}>{t.allAreas}</button><button className={selected==="Sobrecarga"?"active":""} onClick={()=>setSelected("Sobrecarga")}>{t.overload}</button><button className={selected==="INF"?"active":""} onClick={()=>setSelected("INF")}>{t.inf}</button><button className={selected==="IMP"?"active":""} onClick={()=>setSelected("IMP")}>{t.imp}</button><button className={selected==="ESP"?"active":""} onClick={()=>setSelected("ESP")}>{t.esp}</button></div><span><i/> {t.overCapacity}</span></div>
    <div className="area-grid">{shown.map(d=><article key={d.code} className={d.load>100?"over":""}><header><span>{d.code}</span><div><b>{d.name}</b><small>{d.owner}</small></div><em>{d.load}%</em></header><div><span><small>{t.progress}</small><b>{d.progress}%</b></span><i><em style={{width:`${d.progress}%`}}/></i></div><footer><span>{t.activeBlocks(d.blocked)}</span><b>{d.load>100?t.replan:t.controlled}</b></footer></article>)}</div>
  </section>;
}

const RAID_I18N={
  pt:{criticalScore:"SCORE CRÍTICO",criticalNote:"2 itens",active:"RAID ATIVO",activeNote:"5 exigem ação",withResponse:"COM RESPOSTA",withResponseNote:"meta ≥ 95%",overdue:"VENCIDOS",overdueNote:"Market Peru",
   matrixTitle:"Matriz de risco 5 × 5",matrixSubtitle:"Probabilidade × impacto · clique em um item para abrir",impactAxis:"IMPACTO →",probAxis:"PROBABILIDADE →",
   listTitle:"RAID prioritário",listSubtitle:"Risco, premissa, impedimento e dependência",
   close:"Fechar",probability:"PROBABILIDADE",impact:"IMPACTO",score:"SCORE",responsible:"Responsável",strategy:"Estratégia",due:"Prazo",openPlan:"Abrir plano de resposta"},
  es:{criticalScore:"SCORE CRÍTICO",criticalNote:"2 ítems",active:"RAID ACTIVO",activeNote:"5 requieren acción",withResponse:"CON RESPUESTA",withResponseNote:"meta ≥ 95%",overdue:"VENCIDOS",overdueNote:"Market Peru",
   matrixTitle:"Matriz de riesgo 5 × 5",matrixSubtitle:"Probabilidad × impacto · haz clic en un ítem para abrir",impactAxis:"IMPACTO →",probAxis:"PROBABILIDAD →",
   listTitle:"RAID prioritario",listSubtitle:"Riesgo, premisa, impedimento y dependencia",
   close:"Cerrar",probability:"PROBABILIDAD",impact:"IMPACTO",score:"SCORE",responsible:"Responsable",strategy:"Estrategia",due:"Plazo",openPlan:"Abrir plan de respuesta"},
  en:{criticalScore:"CRITICAL SCORE",criticalNote:"2 items",active:"ACTIVE RAID",activeNote:"5 require action",withResponse:"WITH RESPONSE",withResponseNote:"target ≥ 95%",overdue:"OVERDUE",overdueNote:"Market Peru",
   matrixTitle:"5 × 5 risk matrix",matrixSubtitle:"Probability × impact · click an item to open",impactAxis:"IMPACT →",probAxis:"PROBABILITY →",
   listTitle:"Priority RAID",listSubtitle:"Risk, assumption, impediment and dependency",
   close:"Close",probability:"PROBABILITY",impact:"IMPACT",score:"SCORE",responsible:"Owner",strategy:"Strategy",due:"Due",openPlan:"Open response plan"},
};
export function RaidPage({lang="pt"}={}){
  const t=RAID_I18N[lang]||RAID_I18N.pt;
  const [selected,setSelected]=useState(null); const matrix=useMemo(()=>Array.from({length:25},(_,i)=>({impact:5-Math.floor(i/5),prob:i%5+1})),[]);
  return <section className="page foundation-page"><div className="foundation-metrics"><Metric icon={Warning} label={t.criticalScore} value="20–25" note={t.criticalNote} tone="red"/><Metric icon={ChartLineUp} label={t.active} value="24 itens" note={t.activeNote} tone="yellow"/><Metric icon={ShieldCheck} label={t.withResponse} value="92%" note={t.withResponseNote} tone="green"/><Metric icon={ClockCountdown} label={t.overdue} value="1" note={t.overdueNote} tone="red"/></div><div className="foundation-grid raid-layout"><Panel title={t.matrixTitle} subtitle={t.matrixSubtitle}><div className="raid-axis"><span>{t.impactAxis}</span><div className="raid-matrix">{matrix.map(cell=>{const item=riskItems.find(r=>r.prob===cell.prob&&r.impact===cell.impact);const score=cell.prob*cell.impact;return <button key={`${cell.prob}-${cell.impact}`} className={score>=16?"critical":score>=9?"warning":"low"} onClick={()=>item&&setSelected(item)}><small>{score}</small>{item?<b>{item.id}</b>:null}</button>})}</div><em>{t.probAxis}</em></div></Panel><Panel title={t.listTitle} subtitle={t.listSubtitle}><div className="raid-list">{riskItems.map(r=><button key={r.id} onClick={()=>setSelected(r)}><span>{r.id}</span><div><b>{r.title}</b><small>{r.project} · {r.owner}</small></div><em>{r.prob*r.impact}</em></button>)}</div></Panel></div>{selected?<div className="modal-layer" onMouseDown={e=>e.target===e.currentTarget&&setSelected(null)}><article className="raid-modal" role="dialog" aria-modal="true"><header><span>{selected.id}</span><button onClick={()=>setSelected(null)} aria-label={t.close}><XCircle/></button></header><small>{selected.kind} · {selected.project}</small><h2>{selected.title}</h2><div><span><small>{t.probability}</small><b>{selected.prob}/5</b></span><span><small>{t.impact}</small><b>{selected.impact}/5</b></span><span><small>{t.score}</small><b>{selected.prob*selected.impact}/25</b></span></div><dl><div><dt>{t.responsible}</dt><dd>{selected.owner}</dd></div><div><dt>{t.strategy}</dt><dd>{selected.response}</dd></div><div><dt>{t.due}</dt><dd>{selected.due}</dd></div></dl><button className="primary" onClick={()=>setSelected(null)}>{t.openPlan}</button></article></div>:null}</section>;
}

const DEFAULT_ADMIN_USERS = [
  {name:"Admin InventOps", profile:"Admin", area:"Administração", status:"Ativo", dept:"INF", source:"Plataforma", gate:"Governança liberada", lastAction:"Revisão de acesso e permissões por capacidade", nextAction:"Acompanhar Daniel e Thomas na operação assistida"},
  {name:"Daniel", profile:"Gestor", area:"Implantação", status:"Operação ativa", dept:"IMP", source:"Planner", gate:"2 bastões em aceite", lastAction:"PETER 2 com ajuste solicitado após 5 dias sem retorno", nextAction:"Registrar aceite ou devolver bastão com motivo"},
  {name:"Thomas", profile:"Analista", area:"Espec. Software / DevOps", status:"Operação ativa", dept:"ESP", source:"Planner", gate:"4/6 checkpoints", lastAction:"QUELUZ Fase 2 em validação técnica antes de Implantação", nextAction:"Fechar checkpoints e liberar passagem para Daniel"},
];

function readStoredAdminUsers() {
  try {
    const raw = window.localStorage.getItem("inventops-admin-users");
    return raw ? JSON.parse(raw) : DEFAULT_ADMIN_USERS;
  } catch {
    return DEFAULT_ADMIN_USERS;
  }
}

const ADMIN_I18N={
  pt:{roleMeta:{Admin:{label:"Enterprise Admin",helper:"Controle total da plataforma e das integrações.",scope:"Administração, governança, acessos e regras centrais."},
     Diretoria:{label:"Diretoria · DIREX",helper:"Leitura executiva, decisão e priorização.",scope:"Visão consolidada, indicadores, riscos e decisões."},
     Gestor:{label:"Gestor",helper:"Cobrança, coordenação e desbloqueio da operação.",scope:"Projetos, PM, áreas, RAID e evidências."},
     Analista:{label:"Analista",helper:"Execução com contexto, prazo e evidência.",scope:"Minha operação, projetos, áreas e comissionamento."}},
   permissions:["Visualizar","Editar operação","Gerenciar projetos","Administrar acessos","Configurar integrações"],
   governancePulse:[["Perfis ativos","4 perfis","Admin · Diretoria · Gestor · Analista"],["Sessões auditáveis","100%","Toda ação crítica deixa trilha"],["Regra central","RBAC + evidência","Capacidade correta para cada contexto"]],
   adminPrinciples:[["Permissão por capacidade","Cada perfil vê e faz só o que precisa."],["Acessível de nascença","Contraste forte, leitura clara e navegação sem susto."],["Trilíngue de nascença","PT, ES e EN seguem juntos no mesmo fluxo."],["Auditoria viva","Toda ação crítica fica explicável depois."]],
   navigateToast:label=>`Navegando para ${label}.`,
   adminModules:[["admin-access","Acessos","Criar, revisar e preparar usuários válidos."],["admin-themes","Perfis & experiência","Simular RBAC e validar a interface."],["admin-pilots","Operação assistida","Abrir Daniel, Thomas e o contexto de administração no lugar certo."],["admin-audit","Auditoria","Conferir trilha, permissões e regra aplicada."]],
   themeOptions:[{id:"Escuro",label:"Escuro",helper:"Padrão corporativo"},{id:"Claro",label:"Claro",helper:"Leitura clara"},{id:"Contraste",label:"Contraste",helper:"Máxima legibilidade"}],
   areaOptions:["Infraestrutura","Implantação","Espec. de Software","WCS Velox","PM"],
   inviteToast:(name,profile,area)=>`Acesso preparado para ${name||"novo usuário"} · perfil ${profile} · área ${area}.`,
   validatedStamp:t=>`Validado pela Administração · ${t}`,nextActionIMP:"Abrir Implantação e concluir ou devolver bastão.",nextActionESP:"Abrir Especificação/DevOps e fechar checkpoints.",nextActionOther:"Acompanhar operação assistida e auditoria.",
   validateToast:(name,area)=>`${name} validado em ${area}. Próxima ação registrada.`,
   bannerTag:"GOVERNANÇA DE ACESSO",bannerTitle:"Permissão clara, ação auditável",bannerBody:"Os perfis já governam a experiência do produto e seguem a mesma regra operacional aplicada no ambiente real.",activeSession:"Sessão ativa",
   moduleTag:"MÓDULO",open:"abrir",principleTag:"PRINCÍPIO",
   roleTitle:"Controlar perfil de acesso",roleSubtitle:"RBAC aplicado na navegação, leitura e contexto operacional",roleChangeToast:label=>`Perfil alterado para ${label}. A navegação foi recalculada.`,
   rulesTitle:"Regras obrigatórias",rulesSubtitle:"Validações que protegem a qualidade do dado",
   rules:[["Concluído = 100%","Sem atraso pendente ou atividade aberta."],["Bloqueado exige plano","Categoria, responsável, próxima ação e data."],["Importação transacional","Arquivo inválido não altera a base."],["Link seguro do analista","Token expirável vinculado a e-mail e tarefa."]],
   viewAs:"VER COMO",activeProfile:"Perfil ativo",availableCapacity:"Capacidade disponível",
   accessTitle:"Novo acesso",accessSubtitle:"Quem entra e o que cada perfil pode fazer",
   nameLabel:"Nome",namePlaceholder:"Ex.: Daniel Souza",emailLabel:"E-mail corporativo",emailPlaceholder:"nome@invent-corp.com",profileLabel:"Perfil",areaLabel:"Área",
   accessNoteTitle:"Permissão por capacidade",accessNoteBody:"Cada perfil enxerga e faz só o que precisa. O usuário recebe o acesso conforme o papel e a área definidos acima.",prepareAccess:"Preparar acesso",
   visualTitle:"Experiência visual",visualSubtitle:"Tema controlado aqui, não na lateral",themeChangeToast:label=>`Tema visual alterado para ${label}.`,activeTheme:"TEMA ATIVO",
   pilotsTitle:"Usuários válidos da operação",pilotsSubtitle:"Escopo atual vindo das áreas e do inventops79",gate:"Gate",lastAction:"Última ação",nextAction:"Próxima ação",validateUser:"Validar usuário",openContext:"Abrir contexto",openContextToast:(name,area)=>`Abrindo ${name} no contexto de ${area}.`,
   matrixTitle:"Matriz de permissões",matrixSubtitle:"Rotas e ações por perfil",permissionCol:"Permissão",
   auditTitle:"Trilha de auditoria",auditSubtitle:"Quem fez o quê, quando e sobre qual registro",
   auditLog:[["21:38","Admin InventOps","Alterou prazo do Go Live","TITANO"],["20:54","Daiana Costa","Anexou evidência REV4","QUELUZ"],["19:42","Sistema IoT","Criou alerta P0","TITANO"],["18:17","Ivan","Atualizou bloqueio de VPN","MARKET PERU"]]},
  es:{roleMeta:{Admin:{label:"Enterprise Admin",helper:"Control total de la plataforma y las integraciones.",scope:"Administración, gobernanza, accesos y reglas centrales."},
     Diretoria:{label:"Dirección · DIREX",helper:"Lectura ejecutiva, decisión y priorización.",scope:"Visión consolidada, indicadores, riesgos y decisiones."},
     Gestor:{label:"Gestor",helper:"Reclamo, coordinación y desbloqueo de la operación.",scope:"Proyectos, PM, áreas, RAID y evidencias."},
     Analista:{label:"Analista",helper:"Ejecución con contexto, plazo y evidencia.",scope:"Mi operación, proyectos, áreas y comisionamiento."}},
   permissions:["Visualizar","Editar operación","Gestionar proyectos","Administrar accesos","Configurar integraciones"],
   governancePulse:[["Perfiles activos","4 perfiles","Admin · Dirección · Gestor · Analista"],["Sesiones auditables","100%","Toda acción crítica deja rastro"],["Regla central","RBAC + evidencia","Capacidad correcta para cada contexto"]],
   adminPrinciples:[["Permiso por capacidad","Cada perfil ve y hace solo lo que necesita."],["Accesible de nacimiento","Contraste fuerte, lectura clara y navegación sin sustos."],["Trilingüe de nacimiento","PT, ES y EN avanzan juntos en el mismo flujo."],["Auditoría viva","Toda acción crítica queda explicable después."]],
   navigateToast:label=>`Navegando a ${label}.`,
   adminModules:[["admin-access","Accesos","Crear, revisar y preparar usuarios válidos."],["admin-themes","Perfiles y experiencia","Simular RBAC y validar la interfaz."],["admin-pilots","Operación asistida","Abrir a Daniel, Thomas y el contexto de administración en el lugar correcto."],["admin-audit","Auditoría","Revisar rastro, permisos y regla aplicada."]],
   themeOptions:[{id:"Escuro",label:"Oscuro",helper:"Estándar corporativo"},{id:"Claro",label:"Claro",helper:"Lectura clara"},{id:"Contraste",label:"Contraste",helper:"Máxima legibilidad"}],
   areaOptions:["Infraestrutura","Implantação","Espec. de Software","WCS Velox","PM"],
   inviteToast:(name,profile,area)=>`Acceso preparado para ${name||"nuevo usuario"} · perfil ${profile} · área ${area}.`,
   validatedStamp:t=>`Validado por la Administración · ${t}`,nextActionIMP:"Abrir Implantación y concluir o devolver el testigo.",nextActionESP:"Abrir Especificación/DevOps y cerrar checkpoints.",nextActionOther:"Acompañar la operación asistida y la auditoría.",
   validateToast:(name,area)=>`${name} validado en ${area}. Próxima acción registrada.`,
   bannerTag:"GOBERNANZA DE ACCESO",bannerTitle:"Permiso claro, acción auditable",bannerBody:"Los perfiles ya gobiernan la experiencia del producto y siguen la misma regla operativa aplicada en el ambiente real.",activeSession:"Sesión activa",
   moduleTag:"MÓDULO",open:"abrir",principleTag:"PRINCIPIO",
   roleTitle:"Controlar perfil de acceso",roleSubtitle:"RBAC aplicado en la navegación, lectura y contexto operativo",roleChangeToast:label=>`Perfil cambiado a ${label}. La navegación fue recalculada.`,
   rulesTitle:"Reglas obligatorias",rulesSubtitle:"Validaciones que protegen la calidad del dato",
   rules:[["Concluido = 100%","Sin atraso pendiente ni actividad abierta."],["Bloqueado exige plan","Categoría, responsable, próxima acción y fecha."],["Importación transaccional","Un archivo inválido no altera la base."],["Enlace seguro del analista","Token expirable vinculado a correo y tarea."]],
   viewAs:"VER COMO",activeProfile:"Perfil activo",availableCapacity:"Capacidad disponible",
   accessTitle:"Nuevo acceso",accessSubtitle:"Quién entra y qué puede hacer cada perfil",
   nameLabel:"Nombre",namePlaceholder:"Ej.: Daniel Souza",emailLabel:"Correo corporativo",emailPlaceholder:"nombre@invent-corp.com",profileLabel:"Perfil",areaLabel:"Área",
   accessNoteTitle:"Permiso por capacidad",accessNoteBody:"Cada perfil ve y hace solo lo que necesita. El usuario recibe el acceso según el rol y el área definidos arriba.",prepareAccess:"Preparar acceso",
   visualTitle:"Experiencia visual",visualSubtitle:"Tema controlado aquí, no en la barra lateral",themeChangeToast:label=>`Tema visual cambiado a ${label}.`,activeTheme:"TEMA ACTIVO",
   pilotsTitle:"Usuarios válidos de la operación",pilotsSubtitle:"Alcance actual proveniente de las áreas y de inventops79",gate:"Gate",lastAction:"Última acción",nextAction:"Próxima acción",validateUser:"Validar usuario",openContext:"Abrir contexto",openContextToast:(name,area)=>`Abriendo a ${name} en el contexto de ${area}.`,
   matrixTitle:"Matriz de permisos",matrixSubtitle:"Rutas y acciones por perfil",permissionCol:"Permiso",
   auditTitle:"Rastro de auditoría",auditSubtitle:"Quién hizo qué, cuándo y sobre qué registro",
   auditLog:[["21:38","Admin InventOps","Cambió el plazo del Go Live","TITANO"],["20:54","Daiana Costa","Adjuntó evidencia REV4","QUELUZ"],["19:42","Sistema IoT","Creó alerta P0","TITANO"],["18:17","Ivan","Actualizó bloqueo de VPN","MARKET PERU"]]},
  en:{roleMeta:{Admin:{label:"Enterprise Admin",helper:"Full control of the platform and integrations.",scope:"Administration, governance, access and core rules."},
     Diretoria:{label:"Leadership · DIREX",helper:"Executive read, decision and prioritization.",scope:"Consolidated view, indicators, risks and decisions."},
     Gestor:{label:"Manager",helper:"Follow-up, coordination and operation unblocking.",scope:"Projects, PM, areas, RAID and evidence."},
     Analista:{label:"Analyst",helper:"Execution with context, deadline and evidence.",scope:"My operation, projects, areas and commissioning."}},
   permissions:["View","Edit operation","Manage projects","Administer access","Configure integrations"],
   governancePulse:[["Active profiles","4 profiles","Admin · Leadership · Manager · Analyst"],["Auditable sessions","100%","Every critical action leaves a trail"],["Core rule","RBAC + evidence","Right capability for each context"]],
   adminPrinciples:[["Capability-based permission","Each profile sees and does only what it needs."],["Accessible from birth","Strong contrast, clear reading and navigation without surprises."],["Trilingual from birth","PT, ES and EN move together in the same flow."],["Living audit trail","Every critical action stays explainable afterward."]],
   navigateToast:label=>`Navigating to ${label}.`,
   adminModules:[["admin-access","Access","Create, review and prepare valid users."],["admin-themes","Profiles & experience","Simulate RBAC and validate the interface."],["admin-pilots","Assisted operation","Open Daniel, Thomas and the admin context in the right place."],["admin-audit","Audit","Check trail, permissions and applied rule."]],
   themeOptions:[{id:"Escuro",label:"Dark",helper:"Corporate default"},{id:"Claro",label:"Light",helper:"Clear reading"},{id:"Contraste",label:"Contrast",helper:"Maximum legibility"}],
   areaOptions:["Infraestrutura","Implantação","Espec. de Software","WCS Velox","PM"],
   inviteToast:(name,profile,area)=>`Access prepared for ${name||"new user"} · profile ${profile} · area ${area}.`,
   validatedStamp:t=>`Validated by Administration · ${t}`,nextActionIMP:"Open Deployment and close or return the baton.",nextActionESP:"Open Specification/DevOps and close checkpoints.",nextActionOther:"Follow the assisted operation and audit.",
   validateToast:(name,area)=>`${name} validated in ${area}. Next action logged.`,
   bannerTag:"ACCESS GOVERNANCE",bannerTitle:"Clear permission, auditable action",bannerBody:"Profiles already govern the product experience and follow the same operational rule applied in the real environment.",activeSession:"Active session",
   moduleTag:"MODULE",open:"open",principleTag:"PRINCIPLE",
   roleTitle:"Control access profile",roleSubtitle:"RBAC applied to navigation, reading and operational context",roleChangeToast:label=>`Profile changed to ${label}. Navigation was recalculated.`,
   rulesTitle:"Mandatory rules",rulesSubtitle:"Validations that protect data quality",
   rules:[["Done = 100%","No pending delay or open activity."],["Blocked requires a plan","Category, owner, next action and date."],["Transactional import","An invalid file doesn't change the base."],["Analyst's secure link","Expiring token linked to e-mail and task."]],
   viewAs:"VIEW AS",activeProfile:"Active profile",availableCapacity:"Available capability",
   accessTitle:"New access",accessSubtitle:"Who's in and what each profile can do",
   nameLabel:"Name",namePlaceholder:"E.g.: Daniel Souza",emailLabel:"Corporate e-mail",emailPlaceholder:"name@invent-corp.com",profileLabel:"Profile",areaLabel:"Area",
   accessNoteTitle:"Capability-based permission",accessNoteBody:"Each profile sees and does only what it needs. The user gets access according to the role and area set above.",prepareAccess:"Prepare access",
   visualTitle:"Visual experience",visualSubtitle:"Theme controlled here, not in the sidebar",themeChangeToast:label=>`Visual theme changed to ${label}.`,activeTheme:"ACTIVE THEME",
   pilotsTitle:"Valid operational users",pilotsSubtitle:"Current scope coming from the areas and inventops79",gate:"Gate",lastAction:"Last action",nextAction:"Next action",validateUser:"Validate user",openContext:"Open context",openContextToast:(name,area)=>`Opening ${name} in the context of ${area}.`,
   matrixTitle:"Permission matrix",matrixSubtitle:"Routes and actions by profile",permissionCol:"Permission",
   auditTitle:"Audit trail",auditSubtitle:"Who did what, when and on which record",
   auditLog:[["21:38","Admin InventOps","Changed the Go Live deadline","TITANO"],["20:54","Daiana Costa","Attached REV4 evidence","QUELUZ"],["19:42","IoT System","Created P0 alert","TITANO"],["18:17","Ivan","Updated VPN blocker","MARKET PERU"]]},
};
export function AdminGovernance({role,setRole,theme,setTheme,notify,onOpenPilotUser,lang="pt"}){
  const t=ADMIN_I18N[lang]||ADMIN_I18N.pt;
  const roles={Admin:[1,1,1,1,1],Diretoria:[1,0,1,0,0],Gestor:[1,1,1,0,0],Analista:[1,1,0,0,0]};
  const permissions=t.permissions;
  const [invite,setInvite]=useState({name:"",email:"",profile:"Analista",area:"Infraestrutura"});
  const [users,setUsers]=useState(readStoredAdminUsers);
  useEffect(()=>{
    try {
      window.localStorage.setItem("inventops-admin-users", JSON.stringify(users));
    } catch {}
  },[users]);
  const roleMeta=t.roleMeta;
  const jumpTo=(target,label)=>{
    document.getElementById(target)?.scrollIntoView({behavior:"smooth",block:"start"});
    notify(t.navigateToast(label));
  };
  const sendInvite=(event)=>{
    event.preventDefault();
    const deptMap={Infraestrutura:"INF","Implantação":"IMP","Espec. de Software":"ESP","WCS Velox":"WCS","PM":"PM"};
    const newUser={
      name:invite.name,
      profile:invite.profile,
      area:invite.area,
      status:"Acesso preparado",
      dept:deptMap[invite.area]||"INF",
      source:"Administração",
      gate:"Aguardando primeira operação",
      lastAction:"Acesso criado pela Administração",
      nextAction:"Associar usuário a uma área operacional"
    };
    setUsers(current=>[newUser,...current.filter(item=>item.name!==newUser.name)]);
    notify(t.inviteToast(invite.name,invite.profile,invite.area));
    setInvite({name:"",email:"",profile:"Analista",area:"Infraestrutura"});
  };
  const validateOperationalUser=(user)=>{
    const stamped=t.validatedStamp(new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}));
    setUsers(current=>current.map(item=>{
      if(item.name!==user.name||item.area!==user.area) return item;
      return {
        ...item,
        status:"Usuário validado",
        gate:"Acesso operacional confirmado",
        lastAction:stamped,
        nextAction:item.dept==="IMP"?t.nextActionIMP:item.dept==="ESP"?t.nextActionESP:t.nextActionOther
      };
    }));
    notify(t.validateToast(user.name,user.area));
  };
  return <section className="page foundation-page">
    <div className="admin-banner"><ShieldCheck/><div><small>{t.bannerTag}</small><h2>{t.bannerTitle}</h2><p>{t.bannerBody}</p></div><span><LockKey/>{t.activeSession}</span></div>
    <div className="admin-module-strip">
      {t.adminModules.map(([id,title,body])=><button key={id} onClick={()=>jumpTo(id,title)}><small>{t.moduleTag}</small><b>{title}</b><p>{body}</p><span>{t.open}</span></button>)}
    </div>
    <div className="executive-command-strip">
      {t.governancePulse.map(item=><span key={item[0]}><small>{item[0]}</small><b>{item[1]}</b><em>{item[2]}</em></span>)}
    </div>
    <div className="admin-principles">
      {t.adminPrinciples.map(([title,body])=><article key={title}><small>{t.principleTag}</small><b>{title}</b><p>{body}</p></article>)}
    </div>
    <div className="foundation-grid equal">
      <div id="admin-themes"><Panel title={t.roleTitle} subtitle={t.roleSubtitle}><div className="role-selector">{Object.keys(roles).map(r=><button className={role===r?"active":""} key={r} onClick={()=>{setRole(r);notify(t.roleChangeToast(roleMeta[r].label))}}><UserGear/><span><b>{roleMeta[r].label}</b><small>{roleMeta[r].helper}</small></span></button>)}</div></Panel></div>
      <Panel title={t.rulesTitle} subtitle={t.rulesSubtitle}><ul className="governance-rules">{t.rules.map(([title,body])=><li key={title}><CheckCircle/><span><b>{title}</b><small>{body}</small></span></li>)}</ul></Panel>
    </div>
    <div className="admin-role-overview">{Object.entries(roleMeta).map(([key,item])=><article key={key} className={role===key?"active":""}><small>{t.viewAs}</small><b>{item.label}</b><p>{item.scope}</p><span>{role===key?t.activeProfile:t.availableCapacity}</span></article>)}</div>
    <div className="foundation-grid equal">
      <div id="admin-access"><Panel title={t.accessTitle} subtitle={t.accessSubtitle}>
        <form className="admin-access-form" onSubmit={sendInvite}>
          <label><span>{t.nameLabel}</span><input value={invite.name} onChange={e=>setInvite({...invite,name:e.target.value})} placeholder={t.namePlaceholder} required/></label>
          <label><span>{t.emailLabel}</span><input type="email" value={invite.email} onChange={e=>setInvite({...invite,email:e.target.value})} placeholder={t.emailPlaceholder} required/></label>
          <div className="admin-access-row">
            <label><span>{t.profileLabel}</span><select value={invite.profile} onChange={e=>setInvite({...invite,profile:e.target.value})}>{Object.keys(roleMeta).map(key=><option key={key}>{key}</option>)}</select></label>
            <label><span>{t.areaLabel}</span><select value={invite.area} onChange={e=>setInvite({...invite,area:e.target.value})}>{t.areaOptions.map(item=><option key={item}>{item}</option>)}</select></label>
          </div>
          <div className="admin-access-note"><b>{t.accessNoteTitle}</b><p>{t.accessNoteBody}</p></div>
          <button className="primary" type="submit"><Envelope/>{t.prepareAccess}</button>
        </form>
      </Panel></div>
      <Panel title={t.visualTitle} subtitle={t.visualSubtitle}>
        <div className="admin-theme-picker">
          {t.themeOptions.map((option,i)=>{
            const Icon=[Moon,Sun,Eye][i];
            return <button key={option.id} className={theme===option.id?"active":""} onClick={()=>{setTheme(option.id);notify(t.themeChangeToast(option.label))}}>
              <span className="theme-icon-chip"><Icon size={18} weight={theme===option.id?"fill":"regular"}/></span>
              <span><b>{option.label}</b><small>{option.helper}</small></span>
            </button>;
          })}
        </div>
        <div className="admin-theme-state"><ShieldCheck/><span><small>{t.activeTheme}</small><b>{theme}</b></span></div>
      </Panel>
    </div>
    <div id="admin-pilots"><Panel title={t.pilotsTitle} subtitle={t.pilotsSubtitle}>
      <div className="admin-pilot-users">
        {users.map((user)=><article key={`${user.name}-${user.area}`}>
          <small>{user.profile}</small>
          <b>{user.name}</b>
          <p>{user.area}</p>
          <span>{user.status}</span>
          <em>{user.source}</em>
          <dl className="admin-user-state">
            <div><dt>{t.gate}</dt><dd>{user.gate}</dd></div>
            <div><dt>{t.lastAction}</dt><dd>{user.lastAction}</dd></div>
            <div><dt>{t.nextAction}</dt><dd>{user.nextAction}</dd></div>
          </dl>
          <div className="admin-pilot-actions">
            <button className="ghost" type="button" onClick={()=>validateOperationalUser(user)}>{t.validateUser}</button>
            <button className="ghost" type="button" onClick={()=>{
              setRole(user.profile);
              onOpenPilotUser?.(user);
              notify(t.openContextToast(user.name,user.area));
            }}>{t.openContext}</button>
          </div>
        </article>)}
      </div>
    </Panel></div>
    <Panel title={t.matrixTitle} subtitle={t.matrixSubtitle}><div className="permission-table"><header><span>{t.permissionCol}</span>{Object.keys(roles).map(r=><span key={r}>{r==="Diretoria"?"DIREX":r}</span>)}</header>{permissions.map((p,i)=><div key={p}><b>{p}</b>{Object.keys(roles).map(r=><span key={r}>{roles[r][i]?<CheckCircle/>:<XCircle/>}</span>)}</div>)}</div></Panel>
    <div id="admin-audit"><Panel title={t.auditTitle} subtitle={t.auditSubtitle}><div className="audit-log">{t.auditLog.map(x=><div key={x.join()}><span>{x[0]}</span><b>{x[1]}</b><p>{x[2]}</p><em>{x[3]}</em></div>)}</div></Panel></div></section>;
}

const LIFECYCLE_I18N={
  pt:{horizons:{"90d":"90 dias","6m":"6 meses","12m":"12 meses"},
   statusLabels:{ATUAL:"ATUAL",PRÓXIMO:"PRÓXIMO",PLANEJADO:"PLANEJADO",VISÃO:"VISÃO","NORTH STAR":"NORTH STAR"},
   releaseTag:"RELEASE ATUAL",productTag:"INVENTOPS · PRODUCT ROADMAP",heroTitle:"Da verdade operacional à prevenção automática",heroBody:"Um único produto em cinco estágios de maturidade. Primeiro tornamos a operação confiável; depois conectamos dados, prevemos impacto e fechamos o ciclo com o chão de fábrica.",cycle:"ciclo atual",
   horizonTag:"HORIZONTE DE DECISÃO",lastReview:"ÚLTIMA REVISÃO",lastReviewValue:"12 jul 2026",nextGate:"PRÓXIMO GATE",nextGateValue:"Validação com diretoria",thesis:"TESE DO PRODUTO",thesisValue:"Controlar → Prever → Agir",
   era:"ERA ESTRATÉGICA",owner:"RESPONSÁVEL",maturity:"MATURIDADE",exitCriteria:"CRITÉRIO DE SAÍDA",
   valueTitle:"Valor liberado por etapa",valueSubtitle:"O roadmap mede resultado, não apenas funcionalidades",
   valueLadder:[["AGORA","Confiabilidade","Uma fonte oficial para projetos e decisões"],["V18","Eficiência","Menos cobrança manual e retrabalho de relatório"],["V19","Antecipação","Risco traduzido em prazo, capacidade e custo"],["V20+","Autonomia","Falha detectada, priorizada e tratada no fluxo"]],
   govTitle:"Governança do roadmap",govSubtitle:"Como uma etapa avança",execGate:"Gate executivo",execGateNote:"Patrocínio, prioridade e valor aprovados.",techGate:"Gate técnico",techGateNote:"Dados, segurança e integração validados.",opGate:"Gate operacional",opGateNote:"Operação aceita com evidência e responsável.",seeFull:"Ver visão completa",
   futureTitle:"Plano futuro pós-implantação",futureSubtitle:"A próxima ambição do InventOps depois do núcleo operacional consolidado",
   futureItems:[["Simulação da linha inteira","O sistema passa a simular a operação ponta a ponta e não apenas tarefas isoladas."],["Esteira, PLC e sensores","Leitura operacional conectada ao chão de fábrica com contexto real de falha e impacto."],["Servidores + WCS Velox","Infraestrutura, telemetria e lógica do WCS entram no mesmo contexto decisório."],["Sala de decisão operacional","Cenários, alertas e recomendações para agir antes do problema explodir."]]},
  es:{horizons:{"90d":"90 días","6m":"6 meses","12m":"12 meses"},
   statusLabels:{ATUAL:"ACTUAL",PRÓXIMO:"PRÓXIMO",PLANEJADO:"PLANIFICADO",VISÃO:"VISIÓN","NORTH STAR":"NORTH STAR"},
   releaseTag:"RELEASE ACTUAL",productTag:"INVENTOPS · PRODUCT ROADMAP",heroTitle:"De la verdad operativa a la prevención automática",heroBody:"Un único producto en cinco etapas de madurez. Primero hacemos confiable la operación; luego conectamos datos, anticipamos impacto y cerramos el ciclo con el piso de fábrica.",cycle:"ciclo actual",
   horizonTag:"HORIZONTE DE DECISIÓN",lastReview:"ÚLTIMA REVISIÓN",lastReviewValue:"12 jul 2026",nextGate:"PRÓXIMO GATE",nextGateValue:"Validación con la dirección",thesis:"TESIS DEL PRODUCTO",thesisValue:"Controlar → Prever → Actuar",
   era:"ERA ESTRATÉGICA",owner:"RESPONSABLE",maturity:"MADUREZ",exitCriteria:"CRITERIO DE SALIDA",
   valueTitle:"Valor liberado por etapa",valueSubtitle:"El roadmap mide resultado, no solo funcionalidades",
   valueLadder:[["AHORA","Confiabilidad","Una fuente oficial para proyectos y decisiones"],["V18","Eficiencia","Menos reclamo manual y retrabajo de reportes"],["V19","Anticipación","Riesgo traducido en plazo, capacidad y costo"],["V20+","Autonomía","Falla detectada, priorizada y tratada en el flujo"]],
   govTitle:"Gobernanza del roadmap",govSubtitle:"Cómo avanza una etapa",execGate:"Gate ejecutivo",execGateNote:"Patrocinio, prioridad y valor aprobados.",techGate:"Gate técnico",techGateNote:"Datos, seguridad e integración validados.",opGate:"Gate operativo",opGateNote:"Operación aceptada con evidencia y responsable.",seeFull:"Ver visión completa",
   futureTitle:"Plan futuro post-implantación",futureSubtitle:"La próxima ambición de InventOps después del núcleo operativo consolidado",
   futureItems:[["Simulación de toda la línea","El sistema pasa a simular la operación de punta a punta y no solo tareas aisladas."],["Cinta, PLC y sensores","Lectura operativa conectada al piso de fábrica con contexto real de falla e impacto."],["Servidores + WCS Velox","Infraestructura, telemetría y lógica del WCS entran en el mismo contexto decisorio."],["Sala de decisión operativa","Escenarios, alertas y recomendaciones para actuar antes de que el problema explote."]]},
  en:{horizons:{"90d":"90 days","6m":"6 months","12m":"12 months"},
   statusLabels:{ATUAL:"CURRENT",PRÓXIMO:"NEXT",PLANEJADO:"PLANNED",VISÃO:"VISION","NORTH STAR":"NORTH STAR"},
   releaseTag:"CURRENT RELEASE",productTag:"INVENTOPS · PRODUCT ROADMAP",heroTitle:"From operational truth to automatic prevention",heroBody:"One single product across five maturity stages. First we make the operation reliable; then we connect data, predict impact and close the loop with the shop floor.",cycle:"current cycle",
   horizonTag:"DECISION HORIZON",lastReview:"LAST REVIEW",lastReviewValue:"Jul 12, 2026",nextGate:"NEXT GATE",nextGateValue:"Leadership validation",thesis:"PRODUCT THESIS",thesisValue:"Control → Predict → Act",
   era:"STRATEGIC ERA",owner:"OWNER",maturity:"MATURITY",exitCriteria:"EXIT CRITERIA",
   valueTitle:"Value unlocked per stage",valueSubtitle:"The roadmap measures outcomes, not just features",
   valueLadder:[["NOW","Reliability","One official source for projects and decisions"],["V18","Efficiency","Less manual follow-up and report rework"],["V19","Anticipation","Risk translated into schedule, capacity and cost"],["V20+","Autonomy","Failure detected, prioritized and handled in-flow"]],
   govTitle:"Roadmap governance",govSubtitle:"How a stage moves forward",execGate:"Executive gate",execGateNote:"Sponsorship, priority and value approved.",techGate:"Technical gate",techGateNote:"Data, security and integration validated.",opGate:"Operational gate",opGateNote:"Operation accepted with evidence and owner.",seeFull:"See full view",
   futureTitle:"Future plan post-deployment",futureSubtitle:"InventOps' next ambition after the operational core is consolidated",
   futureItems:[["Whole-line simulation","The system starts simulating the operation end-to-end, not just isolated tasks."],["Line, PLC and sensors","Operational reading connected to the shop floor with real failure and impact context."],["Servers + WCS Velox","Infrastructure, telemetry and WCS logic enter the same decision context."],["Operational decision room","Scenarios, alerts and recommendations to act before the problem explodes."]]},
};
export function LifecyclePage({lang="pt"}={}){
  const t=LIFECYCLE_I18N[lang]||LIFECYCLE_I18N.pt;
  const [horizon,setHorizon]=useState("12m");
  const milestones=[
    {version:"V17.9",period:"JUL · 2026",status:t.statusLabels.ATUAL,title:"Governança operacional",owner:"PM + Tecnologia",progress:98,tone:"yellow",value:"Uma carteira única, auditável e explicável.",scope:["Central PM e plano integrado","Sete fases com gates formais","Dependências, evidências e handoffs"],gate:"Operação assistida validada pelo PM"},
    {version:"V18",period:"AGO–SET · 2026",status:t.statusLabels.PRÓXIMO,title:"Operação conectada",owner:"TI + Dados",progress:24,tone:"cyan",value:"Fim das planilhas paralelas e atualização manual.",scope:["PostgreSQL e APIs reais","SSO Microsoft 365 + RBAC","Importação segura e notificações"],gate:"Base integrada com 3 projetos reais"},
    {version:"V19",period:"OUT–DEZ · 2026",status:t.statusLabels.PLANEJADO,title:"Inteligência preditiva",owner:"PM + Genius AI",progress:8,tone:"purple",value:"Decidir antes que o atraso vire custo.",scope:["Simulador de impacto IA","Previsão de gargalos e capacidade","Briefing executivo recomendado"],gate:"Acurácia preditiva ≥ 80%"},
    {version:"V20",period:"JAN–MAR · 2027",status:t.statusLabels.VISÃO,title:"Chão de fábrica vivo",owner:"Automação + IoT",progress:0,tone:"green",value:"TI e TA conectadas ao mesmo projeto.",scope:["Telemetria de CLPs e sensores","Gêmeo digital de comissionamento","Falha física gera alerta P0"],gate:"Uma esteira real em produção assistida"},
    {version:"V21",period:"ABR–JUN · 2027",status:t.statusLabels["NORTH STAR"],title:"Operação autônoma assistida",owner:"Diretoria + Operações",progress:0,tone:"blue",value:"O sistema recomenda, orquestra e aprende.",scope:["Workflows automáticos","Playbooks de recuperação","Benchmark de projetos e squads"],gate:"Redução mensurável de atraso e retrabalho"}
  ];
  const visible=horizon==="90d"?milestones.slice(0,2):horizon==="6m"?milestones.slice(0,3):milestones;
  return <section className="page foundation-page lifecycle-page">
    <div className="release-hero roadmap-hero"><div><small>{t.releaseTag}</small><span>V17.9</span></div><div><small>{t.productTag}</small><h2>{t.heroTitle}</h2><p>{t.heroBody}</p></div><div className="roadmap-health"><RocketLaunch/><span><b>98%</b><small>{t.cycle}</small></span></div></div>
    <div className="roadmap-command"><div><small>{t.horizonTag}</small><div>{Object.entries(t.horizons).map(([key,label])=><button key={key} className={horizon===key?"active":""} onClick={()=>setHorizon(key)}>{label}</button>)}</div></div><span><CalendarBlank/><small>{t.lastReview}</small><b>{t.lastReviewValue}</b></span><span><FlagCheckered/><small>{t.nextGate}</small><b>{t.nextGateValue}</b></span><span><ShieldCheck/><small>{t.thesis}</small><b>{t.thesisValue}</b></span></div>
    <div className="roadmap-board">{visible.map((m,i)=><article className={`roadmap-card ${m.tone}`} key={m.version}>
      <header><span>{String(i+1).padStart(2,"0")}</span><div><small>{m.period}</small><b>{m.version}</b></div><em>{m.status}</em></header>
      <div className="roadmap-card-body"><small>{t.era}</small><h3>{m.title}</h3><p>{m.value}</p><div className="roadmap-owner"><UsersThree/><span><small>{t.owner}</small><b>{m.owner}</b></span></div><ul>{m.scope.map(x=><li key={x}><CheckCircle/>{x}</li>)}</ul></div>
      <footer><div><span><small>{t.maturity}</small><b>{m.progress}%</b></span><i><em style={{width:`${m.progress}%`}}/></i></div><p><FlagCheckered/><span><small>{t.exitCriteria}</small><b>{m.gate}</b></span></p></footer>
    </article>)}</div>
    <div className="foundation-grid two-one roadmap-bottom"><Panel title={t.valueTitle} subtitle={t.valueSubtitle}><div className="value-ladder">{t.valueLadder.map((x,i)=><div key={x[0]}><span>{i+1}</span><small>{x[0]}</small><b>{x[1]}</b><p>{x[2]}</p></div>)}</div></Panel><Panel title={t.govTitle} subtitle={t.govSubtitle}><div className="roadmap-governance"><p><ShieldCheck/><span><b>{t.execGate}</b><small>{t.execGateNote}</small></span></p><p><Database/><span><b>{t.techGate}</b><small>{t.techGateNote}</small></span></p><p><CheckSquare/><span><b>{t.opGate}</b><small>{t.opGateNote}</small></span></p><button className="primary" onClick={()=>setHorizon("12m")}>{t.seeFull}<ArrowRight/></button></div></Panel></div>
    <Panel title={t.futureTitle} subtitle={t.futureSubtitle}><div className="roadmap-governance">{t.futureItems.map(([title,note],i)=><p key={title}>{[<Sparkle key="i0"/>,<Cpu key="i1"/>,<HardDrives key="i2"/>,<Waveform key="i3"/>][i]}<span><b>{title}</b><small>{note}</small></span></p>)}</div></Panel>
  </section>;
}

const PRESENTATION_I18N={
  pt:{heroTag:"MODO APRESENTAÇÃO · DIRETORIA",heroTitle:"Um produto. Três níveis de valor.",heroBody:"Roteiro visual pronto para demonstrar o InventOps pelo ponto de vista de quem executa, de quem coordena e de quem decide.",duration:"≈ 3 min",durationNote:"roteiro completo",
   view:"VISÃO",selected:"Selecionado",open:"Abrir",scriptTag:"ROTEIRO ·",copyNarration:"Copiar narração",screenTag:"TELA",
   guideTag:"GUIA DE GRAVAÇÃO",guideTitle:"Direto, real e sem promessas falsas",guideItems:["Gravar as telas reais do InventOps.","Usar os perfis Analista, Gestor e Diretor.","Mostrar Outlook e WhatsApp como preparação para envio.","Encerrar com o Roadmap V17.9 → V21."],
   brandTitle:"Branding oficial",brandNote:"Nome InventOps confirmado por Daiana. Logo final depende da validação do Marketing.",
   copyToast:name=>`Roteiro ${name} copiado para gravação ou ElevenLabs.`},
  es:{heroTag:"MODO PRESENTACIÓN · DIRECCIÓN",heroTitle:"Un producto. Tres niveles de valor.",heroBody:"Guion visual listo para demostrar InventOps desde la mirada de quien ejecuta, quien coordina y quien decide.",duration:"≈ 3 min",durationNote:"guion completo",
   view:"VISIÓN",selected:"Seleccionado",open:"Abrir",scriptTag:"GUION ·",copyNarration:"Copiar narración",screenTag:"PANTALLA",
   guideTag:"GUÍA DE GRABACIÓN",guideTitle:"Directo, real y sin promesas falsas",guideItems:["Grabar las pantallas reales de InventOps.","Usar los perfiles Analista, Gestor y Director.","Mostrar Outlook y WhatsApp como preparación para el envío.","Cerrar con el Roadmap V17.9 → V21."],
   brandTitle:"Branding oficial",brandNote:"Nombre InventOps confirmado por Daiana. El logo final depende de la validación de Marketing.",
   copyToast:name=>`Guion ${name} copiado para grabación o ElevenLabs.`},
  en:{heroTag:"PRESENTATION MODE · LEADERSHIP",heroTitle:"One product. Three levels of value.",heroBody:"Visual script ready to demo InventOps from the point of view of whoever executes, coordinates and decides.",duration:"≈ 3 min",durationNote:"full script",
   view:"VIEW",selected:"Selected",open:"Open",scriptTag:"SCRIPT ·",copyNarration:"Copy narration",screenTag:"SCREEN",
   guideTag:"RECORDING GUIDE",guideTitle:"Direct, real and with no false promises",guideItems:["Record InventOps' real screens.","Use the Analyst, Manager and Director profiles.","Show Outlook and WhatsApp as send preparation.","Close with the V17.9 → V21 Roadmap."],
   brandTitle:"Official branding",brandNote:"InventOps name confirmed by Daiana. Final logo pending Marketing validation.",
   copyToast:name=>`${name} script copied for recording or ElevenLabs.`},
};
export function PresentationPage({notify,lang="pt"}){
  const t=PRESENTATION_I18N[lang]||PRESENTATION_I18N.pt;
  const profiles={
    Analista:{icon:CheckSquare,color:"cyan",promise:"Minha rotina, sem planilhas paralelas.",screens:["Minha Operação","Entregas por Área","Evidências"],focus:["Demandas vinculadas ao perfil","Prazo, dependência e handoff","Progresso sustentado por evidência"],script:"Para o analista, o InventOps centraliza a rotina e elimina planilhas paralelas. Cada demanda chega vinculada ao perfil corporativo, com prazo, evidência esperada e contexto do projeto. O analista atualiza a entrega e transforma trabalho técnico em progresso confiável."},
    Gestor:{icon:UsersThree,color:"yellow",promise:"Distribuir, cobrar e desbloquear com contexto.",screens:["Central PM","Plano integrado","Matriz RAID"],focus:["Fila única de decisões e cobranças","Atividades, responsáveis e evidências","Riscos com plano de resposta"],script:"Para o gestor, o InventOps reúne a carteira em uma Central PM e detalha cada entrega no plano integrado. A fila mostra quem cobrar, enquanto o projeto distribui atividades com responsável, dependência e evidência. O briefing diário prepara a comunicação para WhatsApp e Outlook."},
    Diretor:{icon:ChartLineUp,color:"purple",promise:"Decidir antes que o atraso vire custo.",screens:["Dashboard Executivo","Simulador de Impacto","Releases & Roadmap"],focus:["Health Score e decisões do dia","Cenários de prazo e capacidade","Evolução do produto por valor"],script:"Para a diretoria, o InventOps traduz a carteira em decisões. O dashboard aponta onde agir hoje, o simulador antecipa impactos entre projetos e o roadmap mostra como a plataforma evolui da V17.9, com governança operacional por gates, para a prevenção automática no chão de fábrica."}
  };
  const [selected,setSelected]=useState("Diretor");
  const current=profiles[selected]; const Icon=current.icon;
  const copy=async()=>{try{await navigator.clipboard.writeText(current.script)}catch{}notify(t.copyToast(selected))};
  return <section className="page foundation-page presentation-page"><div className="presentation-hero"><div><small>{t.heroTag}</small><h2>{t.heroTitle}</h2><p>{t.heroBody}</p></div><span><Play weight="fill"/><b>{t.duration}</b><small>{t.durationNote}</small></span></div><div className="presentation-profiles">{Object.entries(profiles).map(([name,item])=>{const RoleIcon=item.icon;return <button key={name} className={`${selected===name?"active":""} ${item.color}`} onClick={()=>setSelected(name)}><RoleIcon/><span><small>{t.view}</small><b>{name}</b><p>{item.promise}</p></span><em>{selected===name?t.selected:t.open}</em></button>})}</div><div className="presentation-stage"><article><header><span className={current.color}><Icon/></span><div><small>{t.scriptTag} {selected.toUpperCase()}</small><h3>{current.promise}</h3></div><button className="primary" onClick={copy}><ClipboardText/>{t.copyNarration}</button></header><div className="presentation-route">{current.screens.map((screen,i)=><div key={screen}><span>{i+1}</span><div><small>{t.screenTag} {i+1}</small><b>{screen}</b><p>{current.focus[i]}</p></div>{i<current.screens.length-1?<ArrowRight/>:null}</div>)}</div><blockquote>“{current.script}”</blockquote></article><aside><small>{t.guideTag}</small><h3>{t.guideTitle}</h3><ul>{t.guideItems.map(item=><li key={item}><CheckCircle/>{item}</li>)}</ul><div><ShieldCheck/><span><b>{t.brandTitle}</b><small>{t.brandNote}</small></span></div></aside></div></section>;
}

const LOGIN_DEPARTMENTS=["Pós-\nvendas","Comercial","PM","PCP","Compras","Eng.\nMecânica","Eng.\nElétrica","Produção","Montagem","Infraestrutura","Espec.\nSoftware","WCS Velox","Implantação","PLC"];
const LOGIN_TEXT={
  pt:{
    eyebrow:"VISÃO UNIFICADA · 14 ÁREAS",
    titleTop:"Um ecossistema integrado.",
    titleBottom:"Um só propósito.",
    subtitle:"Conecte departamentos, projetos, solicitações e decisões em uma única operação auditável.",
    secure:"ACESSO SEGURO",
    welcome:"Bem-vinda de volta",
    body:"Entre com sua conta corporativa para acessar a visão completa da operação.",
    email:"E-mail corporativo",
    password:"Senha",
    keep:"Manter sessão neste dispositivo",
    forgot:"Esqueci minha senha",
    enter:"Entrar no InventOps",
    connecting:"Conectando...",
    or:"ou",
    microsoft:"Continuar com Microsoft / Azure AD",
    footer:"Conectando pessoas, processos e resultados.",
    assurance:["SSO corporativo","Perfis validados","Acesso auditável"],
    highlights:[
      {title:"Acesso governado",body:"Perfis, visões e ações alinhadas à responsabilidade de cada pessoa."},
      {title:"Operação rastreável",body:"Solicitações, projetos, decisões e evidências conectados na mesma linha."},
      {title:"Leitura executiva viva",body:"O que mudou, o que trava e qual é a próxima ação entram já no primeiro acesso."}
    ],
    pulseA:"projetos ativos",
    pulseB:"solicitações no mês",
    pulseC:"usuários conectados",
    pulseD:"sistemas monitorados"
  },
  es:{
    eyebrow:"VISIÓN UNIFICADA · 14 ÁREAS",
    titleTop:"Un ecosistema integrado.",
    titleBottom:"Un solo propósito.",
    subtitle:"Conecta departamentos, proyectos, solicitudes y decisiones en una sola operación auditable.",
    secure:"ACCESO SEGURO",
    welcome:"Bienvenida de nuevo",
    body:"Ingresa con tu cuenta corporativa para acceder a la visión completa de la operación.",
    email:"Correo corporativo",
    password:"Contraseña",
    keep:"Mantener la sesión en este dispositivo",
    forgot:"Olvidé mi contraseña",
    enter:"Entrar en InventOps",
    connecting:"Conectando...",
    or:"o",
    microsoft:"Continuar con Microsoft / Azure AD",
    footer:"Conectando personas, procesos y resultados.",
    assurance:["SSO corporativo","Perfiles validados","Acceso auditable"],
    highlights:[
      {title:"Acceso gobernado",body:"Perfiles, vistas y acciones alineadas con la responsabilidad de cada persona."},
      {title:"Operación trazable",body:"Solicitudes, proyectos, decisiones y evidencias conectados en la misma línea."},
      {title:"Lectura ejecutiva viva",body:"Lo que cambió, lo que bloquea y la próxima acción entran desde el primer acceso."}
    ],
    pulseA:"proyectos activos",
    pulseB:"solicitudes del mes",
    pulseC:"usuarios conectados",
    pulseD:"sistemas monitoreados"
  },
  en:{
    eyebrow:"UNIFIED VIEW · 14 AREAS",
    titleTop:"One connected ecosystem.",
    titleBottom:"One shared purpose.",
    subtitle:"Connect departments, projects, requests, and decisions in a single auditable operation.",
    secure:"SECURE ACCESS",
    welcome:"Welcome back",
    body:"Sign in with your corporate account to access the full operational view.",
    email:"Corporate email",
    password:"Password",
    keep:"Keep me signed in on this device",
    forgot:"Forgot my password",
    enter:"Enter InventOps",
    connecting:"Connecting...",
    or:"or",
    microsoft:"Continue with Microsoft / Azure AD",
    footer:"Connecting people, processes, and results.",
    assurance:["Corporate SSO","Validated profiles","Auditable access"],
    highlights:[
      {title:"Governed access",body:"Profiles, views, and actions aligned to each person’s responsibility."},
      {title:"Traceable operation",body:"Requests, projects, decisions, and evidence connected on the same line."},
      {title:"Live executive reading",body:"What changed, what blocks, and the next action appear from the first access."}
    ],
    pulseA:"active projects",
    pulseB:"requests this month",
    pulseC:"connected users",
    pulseD:"monitored systems"
  }
};

const LOGIN_SYNC_TEXT={
  pt:{
    preparing:"Preparando seu ambiente",
    subtitle:"Autenticando perfil, sincronizando contexto e carregando a sua visão operacional.",
    finalizing:"Consolidando contexto, validando permissões e abrindo sua visão executiva.",
    steps:[
      {icon:"auth",label:"Autenticando credenciais"},
      {icon:"departments",label:"Conectando departamentos"},
      {icon:"indicators",label:"Sincronizando indicadores"},
      {icon:"dashboard",label:"Abrindo dashboard executivo"}
    ]
  },
  es:{
    preparing:"Preparando tu entorno",
    subtitle:"Autenticando perfil, sincronizando contexto y cargando tu visión operativa.",
    finalizing:"Consolidando contexto, validando permisos y abriendo tu visión ejecutiva.",
    steps:[
      {icon:"auth",label:"Autenticando credenciales"},
      {icon:"departments",label:"Conectando departamentos"},
      {icon:"indicators",label:"Sincronizando indicadores"},
      {icon:"dashboard",label:"Abriendo panel ejecutivo"}
    ]
  },
  en:{
    preparing:"Preparing your workspace",
    subtitle:"Authenticating your profile, syncing context, and loading your operational view.",
    finalizing:"Consolidating context, validating permissions, and opening your executive view.",
    steps:[
      {icon:"auth",label:"Authenticating credentials"},
      {icon:"departments",label:"Connecting departments"},
      {icon:"indicators",label:"Syncing indicators"},
      {icon:"dashboard",label:"Opening executive dashboard"}
    ]
  }
};

export function LoginScreen({onLogin}){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [lang,setLang]=useState("pt");
  const [isSubmitting,setIsSubmitting]=useState(false);
  const [syncStep,setSyncStep]=useState(0);
  const [progress,setProgress]=useState(12);
  const [syncMessage,setSyncMessage]=useState("");
  const copy=LOGIN_TEXT[lang];
  const syncCopy=LOGIN_SYNC_TEXT[lang];
  const syncIcons={
    auth:LockKey,
    departments:Buildings,
    indicators:ChartLineUp,
    dashboard:Gauge
  };
  const valueHighlights=[
    {icon:ShieldCheck,...copy.highlights[0]},
    {icon:ClipboardText,...copy.highlights[1]},
    {icon:Factory,...copy.highlights[2]}
  ];
  const runLogin=async(nextEmail)=>{
    if(isSubmitting)return;
    setIsSubmitting(true);
    setSyncStep(0);
    setProgress(12);
    setSyncMessage(syncCopy.subtitle);
    const timeline=[
      {step:0,progress:20,wait:560},
      {step:1,progress:42,wait:760},
      {step:2,progress:66,wait:980},
      {step:3,progress:82,wait:1260},
      {step:3,progress:93,wait:960,message:syncCopy.finalizing},
      {step:3,progress:100,wait:1080,message:syncCopy.finalizing}
    ];
    for(const entry of timeline){
      await new Promise(resolve=>window.setTimeout(resolve,entry.wait));
      setSyncStep(entry.step);
      setProgress(entry.progress);
      if(entry.message)setSyncMessage(entry.message);
    }
    await new Promise(resolve=>window.setTimeout(resolve,900));
    await onLogin(nextEmail);
  };
  const submit=async e=>{e.preventDefault();if(email&&password)await runLogin(email)};
  return <main className={`login-screen premium-login-grid ${isSubmitting?"is-authenticating":""}`}>
    <div className="login-global-topbar">
      <div className="lang-switch login-lang global" role="group" aria-label="Idioma">
        {["pt","es","en"].map(option=><button key={option} className={lang===option?"active":""} aria-pressed={lang===option} onClick={()=>setLang(option)} disabled={isSubmitting}>{option==="pt"?"PT-BR":option.toUpperCase()}</button>)}
      </div>
    </div>
    <div className="login-visual ecosystem-visual">
      <div className="login-brand"><img src={`${import.meta.env.BASE_URL}assets/icon.svg`} alt="InventOps"/><span><b>Invent<span>Ops</span></b><small>OPERATIONS INTELLIGENCE</small></span></div>
      <div className="ecosystem-copy">
        <small>{copy.eyebrow}</small>
        <h1><span>{copy.titleTop}</span><span>{copy.titleBottom}</span></h1>
        <p>{copy.subtitle}</p>
      </div>
      <div className="login-value-highlights">
        {valueHighlights.map(item=>{
          const Icon=item.icon;
          return <article key={item.title}><Icon/><span><b>{item.title}</b><small>{item.body}</small></span></article>;
        })}
      </div>
      <div className="ecosystem-orbit" aria-hidden="true">
        {LOGIN_DEPARTMENTS.map((department,index)=>{
          const isLongDepartment=/Pós-|Elétrica|Mecânica|Infraestrutura|Implantação|Software/.test(department);
          const ring=index%2===0?"ring-outer":"ring-inner";
          return <span key={department} className={`${ring}${isLongDepartment?" is-long-department":""}`} style={{"--i":index}}>{department.split("\n").map((part,partIndex)=><strong key={`${department}-${partIndex}`}>{part}</strong>)}</span>;
        })}
        <div className="ecosystem-core"><b>InventOps</b><small>ENTERPRISE</small></div>
      </div>
      <div className="login-pulse compact">
        <span><Factory/><b>128</b><small>{copy.pulseA}</small></span>
        <span><ClipboardText/><b>342</b><small>{copy.pulseB}</small></span>
        <span><UsersThree/><b>1.247</b><small>{copy.pulseC}</small></span>
        <span><MonitorPlay/><b>23</b><small>{copy.pulseD}</small></span>
      </div>
    </div>
    <section className="login-panel premium-panel">
      <form onSubmit={submit}>
        <div className="login-mobile-brand"><img src={`${import.meta.env.BASE_URL}assets/icon.svg`} alt=""/><b>Invent<span>Ops</span></b></div>
        <small>{copy.secure}</small>
        <div className="login-headline-block">
          <span>{copy.welcome}</span>
          <h2>InventOps Enterprise</h2>
          <p>{copy.body}</p>
        </div>
        <label>{copy.email}<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoFocus disabled={isSubmitting}/></label>
        <label>{copy.password}<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required disabled={isSubmitting}/></label>
        <div className="login-options"><label><input type="checkbox" disabled={isSubmitting}/> {copy.keep}</label></div>
        <div className="login-support-row"><span>{copy.forgot}</span></div>
        <button className="primary" type="submit" disabled={isSubmitting}>{isSubmitting?<><MonitorPlay/>{copy.connecting}</>:<>{copy.enter}<ArrowRight/></>}</button>
        <div className="sso-divider"><span>{copy.or}</span></div>
        <button className="sso-button" type="button" onClick={()=>runLogin(email || "admin@invent-corp.com")} disabled={isSubmitting}><span>M</span>{copy.microsoft}</button>
        <div className="login-assurance-row">
          <span><ShieldCheck/>{copy.assurance[0]}</span>
          <span><UsersThree/>{copy.assurance[1]}</span>
          <span><MonitorPlay/>{copy.assurance[2]}</span>
        </div>
        <footer><ShieldCheck/>{copy.footer}</footer>
      </form>
    </section>
    {isSubmitting?<div className="login-transition-layer" role="status" aria-live="polite"><div className="login-transition-card"><div className="login-transition-mark"><img src={`${import.meta.env.BASE_URL}assets/icon.svg`} alt=""/><span><b>InventOps</b><small>ENTERPRISE</small></span></div><div className="login-transition-orb" aria-hidden="true"><i/><i/><i/></div><h3>{syncCopy.preparing}</h3><p>{syncMessage||syncCopy.subtitle}</p><div className="login-transition-progress"><i style={{width:`${progress}%`}}/></div><strong>{progress}%</strong><ul>{syncCopy.steps.map((step,index)=>{const StepIcon=syncIcons[step.icon]||MonitorPlay;return <li key={step.label} className={index<=syncStep?"done":""}><span><StepIcon weight="bold"/></span><b>{step.label}</b></li>})}</ul></div></div>:null}
  </main>;
}

const STATUS_REPORT_I18N={
  pt:{title:"CENTRAL DE COMUNICAÇÃO",sub:"Revise o conteúdo e escolha como deseja compartilhar.",close:"Fechar",recipient:"DESTINATÁRIO VINCULADO",corporate:"Corporativo",
   copyText:"Copiar texto",openWhatsapp:"Abrir WhatsApp",openOutlook:"Abrir no Outlook",footer:"O InventOps prepara a comunicação com contexto e rastreabilidade. O usuário revisa e confirma o envio no canal corporativo escolhido.",
   registerToast:channel=>`Status Report preparado para ${channel} e registrado no histórico de comunicações.`,copyChannel:"cópia",mailChannel:"e-mail corporativo"},
  es:{title:"CENTRAL DE COMUNICACIÓN",sub:"Revisa el contenido y elige cómo quieres compartirlo.",close:"Cerrar",recipient:"DESTINATARIO VINCULADO",corporate:"Corporativo",
   copyText:"Copiar texto",openWhatsapp:"Abrir WhatsApp",openOutlook:"Abrir en Outlook",footer:"InventOps prepara la comunicación con contexto y trazabilidad. El usuario revisa y confirma el envío en el canal corporativo elegido.",
   registerToast:channel=>`Status Report preparado para ${channel} y registrado en el historial de comunicaciones.`,copyChannel:"copia",mailChannel:"correo corporativo"},
  en:{title:"COMMUNICATION CENTER",sub:"Review the content and choose how you want to share it.",close:"Close",recipient:"LINKED RECIPIENT",corporate:"Corporate",
   copyText:"Copy text",openWhatsapp:"Open WhatsApp",openOutlook:"Open in Outlook",footer:"InventOps prepares the communication with context and traceability. The user reviews and confirms sending on the chosen corporate channel.",
   registerToast:channel=>`Status Report prepared for ${channel} and logged to communication history.`,copyChannel:"copy",mailChannel:"corporate e-mail"},
};
export function StatusReportModal({project,onClose,notify,lang="pt"}){
  const t=STATUS_REPORT_I18N[lang]||STATUS_REPORT_I18N.pt;
  const text=`📊 STATUS REPORT — ${project.name}\n🟡 Saúde: ${project.health}/100 · Progresso: ${project.progress}%\n📍 Fase atual: ${project.phase}/7\n🚩 Próximo marco: ${project.next} — ${project.date}\n⚠️ Ponto de atenção: ${project.blocker}\n✅ Próxima ação: ${project.nextAction}\n👤 Responsável: ${project.owner}`;
  const email=project.ownerEmail||`${(project.owner||"responsavel").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().replace(/\s+/g,".")}@invent-corp.com`;
  const register=channel=>notify(t.registerToast(channel));
  const copy=async()=>{try{await navigator.clipboard.writeText(text)}catch{}register(t.copyChannel)};
  const whatsapp=()=>{window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank","noopener,noreferrer");register("WhatsApp")};
  const mail=()=>{const subject=`InventOps · Status Report · ${project.name}`;window.location.href=`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;register(t.mailChannel)};
  return <div className="modal-layer" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><article className="status-report-modal communication-modal" role="dialog" aria-modal="true"><header><div><small>{t.title}</small><h2>Status Report · {project.name}</h2><p>{t.sub}</p></div><button onClick={onClose} aria-label={t.close}><XCircle/></button></header><pre>{text}</pre><div className="communication-recipient"><Envelope/><span><small>{t.recipient}</small><b>{email}</b></span><em>{t.corporate}</em></div><div className="communication-actions"><button className="ghost" onClick={copy}><ClipboardText/>{t.copyText}</button><button className="whatsapp" onClick={whatsapp}><WhatsappLogo/>{t.openWhatsapp}</button><button className="primary" onClick={mail}><Envelope/>{t.openOutlook}</button></div><footer><ShieldCheck/>{t.footer}</footer></article></div>;
}

const ACCESS_DENIED_I18N={
  pt:{tag:"ACESSO RESTRITO · 403",title:"Este perfil não pode acessar este módulo.",body:"A política de acesso foi aplicada antes da abertura da página. Solicite permissão a um administrador ou retorne ao dashboard.",cta:"Voltar ao Dashboard"},
  es:{tag:"ACCESO RESTRINGIDO · 403",title:"Este perfil no puede acceder a este módulo.",body:"La política de acceso se aplicó antes de abrir la página. Solicita permiso a un administrador o vuelve al dashboard.",cta:"Volver al Dashboard"},
  en:{tag:"RESTRICTED ACCESS · 403",title:"This profile can't access this module.",body:"The access policy was applied before the page opened. Request permission from an administrator or return to the dashboard.",cta:"Back to Dashboard"},
};
export function AccessDenied({setActive,lang="pt"}){
  const t=ACCESS_DENIED_I18N[lang]||ACCESS_DENIED_I18N.pt;
  return <section className="page access-denied"><LockKey/><small>{t.tag}</small><h2>{t.title}</h2><p>{t.body}</p><button className="primary" onClick={()=>setActive("home")}>{t.cta}</button></section>;
}



