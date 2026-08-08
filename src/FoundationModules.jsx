import { useMemo, useState } from "react";
import {
  ArrowRight, BellRinging, Buildings, CalendarBlank, ChartLineUp,
  CheckCircle, CheckSquare, ClipboardText, ClockCountdown, Database, Envelope,
  Factory, FileText, FlagCheckered, Gauge, GitCommit, LockKey, MonitorPlay, Play, Printer,
  RocketLaunch, ShieldCheck, Sparkle, TrendUp, UserGear, UsersThree, Warning,
  WhatsappLogo, XCircle
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
  ["COM","Comercial / Concept","André Mota",74,66,1],["PMO","PMO","Rodrigo Baruco",91,78,2],
  ["PCP","PCP","Weslley Silva",86,72,2],["CMP","Compras / Importação","Claudia Duarte",103,61,3],
  ["EMC","Eng. Mecânica","Gustavo Pereira",94,69,2],["EEL","Eng. Elétrica","Gustavo Pereira",88,64,1],
  ["PRD","Produção","Flavio Moreno",82,70,1],["MON","Montagem","Rojekson Souza",83,57,1],
  ["INF","Infraestrutura","Douglas Alves",112,65,4],["ESP","Espec. de Software","Douglas Alves",78,62,1],
  ["WCS","WCS Velox","Marcelo Sanches",98,73,2],["IMP","Implantação","Douglas Alves",108,68,3],
  ["PLC","PLC","Gustavo Pereira",117,71,4],["PÓS","Pós-vendas","Caique Fracaro",63,82,0]
].map(([code,name,owner,load,progress,blocked])=>({code,name,owner,load,progress,blocked}));

const actionsSeed = [
  {id:1,p:"P0",project:"TITANO",dept:"PLC",task:"Normalizar falha do Sensor X e anexar telemetria",owner:"Rodrigo Baruco",email:"rodrigo.baruco@invent-corp.com",due:"Hoje Â· 18:00",status:"Em aÃ§Ã£o",impact:"Bloqueia a sequÃªncia de testes SAT e reduz a confianÃ§a do Go Live de 78% para 61%.",dependency:"Troca fÃ­sica do Sensor X",dependencyState:"Bloqueante",evidence:"Telemetria estÃ¡vel + registro de 20 ciclos aprovados",evidenceState:"Pendente"},
  {id:2,p:"P1",project:"MARKET PERU",dept:"INF",task:"Confirmar range IP /24 e VPN site-to-site",owner:"Ivan",email:"ivan@invent-corp.com",due:"Hoje Â· 16:00",status:"Aguardando cliente",impact:"Sem conectividade, a homologaÃ§Ã£o integrada perde a janela de 15/07.",dependency:"Resposta tÃ©cnica do cliente",dependencyState:"Externa",evidence:"E-mail de aceite + teste de tÃºnel VPN",evidenceState:"Pendente"},
  {id:3,p:"P1",project:"NAVEPARK",dept:"INF",task:"Fechar topologia das VMs Oracle KVM",owner:"Daiana Costa",email:"daiana.costa@invent-corp.com",due:"12 jul",status:"Em andamento",impact:"Define o ambiente homologado usado por DEV e WCS sem interromper Compras ou Engenharia.",dependency:"EspecificaÃ§Ã£o de capacidade",dependencyState:"Paralela",evidence:"Diagrama aprovado + checklist de provisionamento",evidenceState:"Rascunho"},
  {id:4,p:"P2",project:"QUELUZ",dept:"PMO",task:"Consolidar evidÃªncias para o Gate GL1",owner:"Matheus",email:"matheus@invent-corp.com",due:"15 jul",status:"NÃ£o iniciado",impact:"O gate nÃ£o pode ser aprovado sem rastreabilidade das entregas das Ã¡reas.",dependency:"Aceites de ENG, INF e DEV",dependencyState:"Paralela",evidence:"Ata do gate + Ã­ndice de evidÃªncias aceitas",evidenceState:"Pendente"},
  {id:5,p:"P2",project:"BP",dept:"IMP",task:"Confirmar equipe de campo para Go Live",owner:"Giovanni",email:"giovanni@invent-corp.com",due:"18 jul",status:"NÃ£o iniciado",impact:"Protege a escala de implantaÃ§Ã£o e evita conflito com o projeto TITANO.",dependency:"Agenda de campo",dependencyState:"Paralela",evidence:"Escala nominal validada pelo gestor",evidenceState:"Pendente"}
];

const blockers = [
  {project:"MARKET PERU",area:"INF · Cliente",age:"12 dias",impact:"Infra de testes sem condição de homologação",owner:"Ivan",action:"Escalar arquitetura e fechar IP/VPN até 12/07."},
  {project:"NAVEPARK",area:"EMC · INF",age:"8 dias",impact:"Ambiente HML ameaça o Go Live de setembro",owner:"Daiana",action:"Validar VMs e registrar decisão técnica até 14/07."},
  {project:"TITANO",area:"CMP · PLC",age:"2 horas",impact:"Sensor físico interrompe sequência de testes",owner:"Baruco",action:"Trocar sensor, testar 20 ciclos e anexar evidência."}
];

const riskItems = [
  {id:"R-18",kind:"Risco",title:"Atraso na aquisiÃ§Ã£o de hardware crÃ­tico",project:"TITANO",prob:4,impact:5,owner:"Claudia Duarte",response:"Mitigar",due:"12 jul"},
  {id:"I-09",kind:"Impedimento",title:"VPN e range IP nÃ£o confirmados",project:"MARKET PERU",prob:5,impact:4,owner:"Ivan",response:"Escalar",due:"Hoje"},
  {id:"A-07",kind:"Premissa",title:"Cliente libera VMs atÃ© 14/07",project:"NAVEPARK",prob:3,impact:4,owner:"Daiana",response:"Validar",due:"14 jul"},
  {id:"D-04",kind:"DependÃªncia",title:"GL1 depende da homologaÃ§Ã£o do ambiente",project:"QUELUZ",prob:3,impact:3,owner:"Matheus",response:"Monitorar",due:"18 jul"},
  {id:"R-21",kind:"Risco",title:"Capacidade PLC acima do limite em setembro",project:"PORTFÃ“LIO",prob:4,impact:4,owner:"Baruco",response:"Replanejar",due:"15 jul"}
];

function Panel({title,subtitle,children,className=""}){
  return <article className={`foundation-panel ${className}`}><div className="foundation-title"><div><b>{title}</b><span>{subtitle}</span></div></div>{children}</article>;
}

function Metric({icon:Icon,label,value,note,tone="cyan"}){
  return <article className={`foundation-metric ${tone}`}><Icon/><span><small>{label}</small><b>{value}</b><em>{note}</em></span></article>;
}

export function ExecutiveDashboard({projects,setActive,openCockpitDept}){
  const health=Math.round(projects.reduce((sum,p)=>sum+p.health,0)/projects.length);
  const hotAreas=departments.filter(area=>area.load>=100).slice(0,3);
  const pilotAreas = [
    {
      code: "IMP",
      title: "Implantação",
      eyebrow: "Piloto pronto para teste",
      summary: "Campo, readiness, handoff e execução do Go Live em uma leitura única.",
      metric: "7 handoffs vivos",
      detail: "Daniel e time já conseguem navegar pela operação real da área.",
      cta: "Abrir cockpit de Implantação"
    },
    {
      code: "ESP",
      title: "Especificação + DevOps",
      eyebrow: "Piloto pronto para teste",
      summary: "Especificação, checkpoint, dependências e prontidão técnica sem planilha paralela.",
      metric: "5 checkpoints ativos",
      detail: "Thomas e time já entram num fluxo orientado por evidência e bloqueio real.",
      cta: "Abrir cockpit de DevOps"
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
  const decisionPulse=[
    {label:"Operação viva",value:"14 áreas conectadas",tone:"cyan"},
    {label:"Decisões hoje",value:"3 críticas",tone:"gold"},
    {label:"Risco imediato",value:"PLC + Infra + Compras",tone:"red"}
  ];
  const directorialReading = [
    ["Pilotos ativos", "2 áreas em validação real", "Implantação + Especificação/DevOps"],
    ["Próxima meta", "Semana de uso assistido", "subir confiança com usuários reais"],
    ["Sinal do sistema", "A mesma base alimenta direção e execução", "sem narrativa paralela"]
  ];
  return <section className="page foundation-page">
    <div className="executive-command-strip">
      {decisionPulse.map(item=><span key={item.label} className={item.tone}><small>{item.label}</small><b>{item.value}</b></span>)}
    </div>
    <div className="executive-world-strip">
      {directorialReading.map(([label,value,detail])=><article key={label}><small>{label}</small><b>{value}</b><span>{detail}</span></article>)}
    </div>
    <div className="executive-hero executive-world-hero">
      <div className="health-visual"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{v:health},{v:100-health}]} dataKey="v" startAngle={90} endAngle={-270} innerRadius={55} outerRadius={67} stroke="none"><Cell fill="#f5c300"/><Cell fill="#18263a"/></Pie></PieChart></ResponsiveContainer><span><small>HEALTH SCORE</small><b>{health}</b><em>/100</em></span></div>
      <div className="executive-brief"><small>BRIEFING EXECUTIVO · 11 JUL 2026</small><h2>A operação já tem onde começar a usar de verdade.</h2><p>O InventOps já saiu do conceito básico: <b>Implantação</b> e <b>Especificação/DevOps</b> entram na próxima semana como pilotos reais, enquanto a diretoria acompanha a mesma verdade operacional sem precisar de relatório paralelo.</p><div><button className="primary" onClick={()=>setActive("action")}><CheckSquare/>Abrir plano de ação</button><button className="ghost" onClick={()=>setActive("executive")}><FileText/>Ver one-page</button></div></div>
      <div className="countdown"><small>PRÓXIMO GO LIVE</small><b>9</b><span>dias</span><strong>TITANO · 20 JUL</strong><em>78% de confiança</em></div>
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
    <div className="executive-signal-grid">
      <article className="signal-panel priority">
        <small>ÁREAS SOB PRESSÃO</small>
        <b>Onde agir antes do atraso virar custo</b>
        <div className="signal-list">
          {hotAreas.map(area=><button key={area.code} type="button" onClick={()=>setActive("areas")}><span>{area.code}</span><div><strong>{area.name}</strong><small>{area.owner}</small></div><em>{area.load}%</em></button>)}
        </div>
      </article>
      <article className="signal-panel synopsis">
        <small>LEITURA DO INVENTOPS</small>
        <b>A carteira está controlada, mas o sistema já aponta a próxima pressão.</b>
        <p>O InventOps cruza capacidade, bloqueios e datas de marco para mostrar onde a coordenação precisa acontecer antes do problema aparecer no cronograma executivo.</p>
        <div className="synopsis-actions">
          <button className="ghost" onClick={()=>setActive("pmo")}><ChartLineUp/>Abrir PMO Control Tower</button>
          <button className="ghost" onClick={()=>setActive("decision")}><Sparkle/>Ver Decision Room</button>
        </div>
      </article>
    </div>
    <div className="foundation-grid equal executive-insight-grid">
      <Panel title="Mapa de coordenação" subtitle="Quem precisa andar junto agora">
        <div className="coordination-map">
          {coordinationNodes.map(node=><span key={node.label} className={`coord-node ${node.className}`}>{node.label}</span>)}
          <div className="coord-core"><b>PMO</b><small>núcleo da decisão</small></div>
        </div>
      </Panel>
      <Panel title="Rota crítica da semana" subtitle="Os três movimentos que protegem a carteira">
        <div className="critical-route-list">
          {criticalRoute.map(([project,task,eta],index)=><button key={project} type="button" onClick={()=>setActive(index===0?"action":index===1?"alerts":"pmo")}><strong>{String(index+1).padStart(2,"0")}</strong><span><b>{project}</b><small>{task}</small></span><em>{eta}</em><ArrowRight/></button>)}
        </div>
      </Panel>
    </div>
    <div className="foundation-metrics"><Metric icon={Buildings} label="CARTEIRA" value={`${projects.length} projetos`} note="2 bloqueados"/><Metric icon={Warning} label="RISCO MATERIAL" value="R$ 1,8 mi" note="exposição estimada" tone="red"/><Metric icon={UsersThree} label="CAPACIDADE" value="117% PLC" note="pico em setembro" tone="yellow"/><Metric icon={FlagCheckered} label="GO LIVES" value="4 em 90d" note="2 confirmados" tone="green"/></div>
    <div className="foundation-grid two-one"><Panel title="Quem o COO deve cobrar hoje" subtitle="Priorização calculada por impacto, prazo e SLA"><div className="charge-list">{blockers.map((b,i)=><button key={b.project} onClick={()=>setActive(i===2?"alerts":"action")}><strong>0{i+1}</strong><span><b>{b.project}</b><small>{b.action}</small></span><em>{b.owner}</em><ArrowRight/></button>)}</div></Panel><Panel title="Pulso do portfólio" subtitle="Tendência dos últimos 30 dias"><div className="foundation-chart"><ResponsiveContainer><AreaChart data={trend}><defs><linearGradient id="healthFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#28c5e7" stopOpacity=".35"/><stop offset="1" stopColor="#28c5e7" stopOpacity="0"/></linearGradient></defs><CartesianGrid stroke="#17243a" vertical={false}/><XAxis dataKey="day" tick={{fontSize:9}} stroke="#66758c"/><YAxis domain={[40,100]} tick={{fontSize:9}} stroke="#66758c"/><Tooltip/><Area dataKey="health" stroke="#28c5e7" fill="url(#healthFill)" strokeWidth={2}/></AreaChart></ResponsiveContainer></div></Panel></div>
  </section>;
}

export function ActionCenter({notify}){
  const [actions,setActions]=useState(actionsSeed);
  const [filter,setFilter]=useState("Minha fila");
  const [selectedId,setSelectedId]=useState(3);
  const [communication,setCommunication]=useState(null);
  const selected=actions.find(a=>a.id===selectedId)||actions[0];
  const shown=filter==="Minha fila"?actions:filter==="Hoje"?actions.filter(a=>a.due.startsWith("Hoje")):filter==="Aguardando"?actions.filter(a=>a.status.includes("Aguardando")):actions.filter(a=>a.p===filter);
  const registerEvidence=id=>{setActions(current=>current.map(a=>a.id===id?{...a,evidenceState:"Anexada",status:"Em validaÃ§Ã£o"}:a));notify("EvidÃªncia registrada. A atividade entrou na fila de validaÃ§Ã£o tÃ©cnica.")};
  const approve=id=>{setActions(current=>current.map(a=>a.id===id?{...a,status:"ConcluÃ­do"}:a));notify("Atividade concluÃ­da com evidÃªncia auditÃ¡vel vinculada ao projeto.")};
  const prepareCommunication=a=>setCommunication(a);
  const message=communication?`InventOps Â· ${communication.project}\n${communication.task}\nStatus: ${communication.status}\nPrazo: ${communication.due}\nResponsÃ¡vel: ${communication.owner}\nPrÃ³xima evidÃªncia: ${communication.evidence}`:"";
  return <section className="page foundation-page analyst-workspace">
    <div className="analyst-brief"><div><small>MEU DIA Â· VISÃƒO DO ANALISTA</small><h2>Bom dia, Daiana. TrÃªs aÃ§Ãµes protegem os prÃ³ximos marcos.</h2><p>O InventOps organizou sua fila por impacto no Go Live, SLA e dependÃªncias â€” sem depender de cobranÃ§as espalhadas em grupos.</p></div><span><ShieldCheck/><small>GOVERNANÃ‡A</small><b>100% com responsÃ¡vel</b><em>e-mail corporativo vinculado</em></span></div>
    <div className="foundation-metrics"><Metric icon={BellRinging} label="AÃ‡ÃƒO IMEDIATA" value="1 P0" note="SLA em curso" tone="red"/><Metric icon={ClockCountdown} label="VENCEM HOJE" value="2 tarefas" note="1 dependÃªncia externa" tone="yellow"/><Metric icon={CheckCircle} label="EM VALIDAÃ‡ÃƒO" value={`${actions.filter(a=>a.status==="Em validaÃ§Ã£o").length}`} note="com evidÃªncia anexada" tone="green"/><Metric icon={UsersThree} label="SEM RESPONSÃVEL" value="0" note="governanÃ§a Ã­ntegra"/></div>
    <div className="action-toolbar"><div><h2>Fila inteligente de execuÃ§Ã£o</h2><p>Prioridade, contexto, dono, prazo e evidÃªncia em uma Ãºnica tela.</p></div><div>{["Minha fila","Hoje","Aguardando","P0"].map(x=><button className={filter===x?"active":""} key={x} onClick={()=>setFilter(x)}>{x}</button>)}</div></div>
    <div className="analyst-grid"><div className="action-board">{shown.map(a=><button type="button" key={a.id} className={`action-item ${a.p.toLowerCase()} ${selectedId===a.id?"selected":""}`} onClick={()=>setSelectedId(a.id)}><span className="priority-pill">{a.p}</span><div><small>{a.project} Â· {a.dept}</small><h3>{a.task}</h3><span><UsersThree/>{a.owner}<CalendarBlank/>{a.due}</span></div><em>{a.status}</em><ArrowRight/></button>)}</div>
      <aside className="task-context"><header><span className={`priority-pill ${selected.p.toLowerCase()}`}>{selected.p}</span><div><small>{selected.project} Â· {selected.dept}</small><h3>{selected.task}</h3></div></header><div className="context-impact"><Warning/><span><small>POR QUE ISSO IMPORTA</small><p>{selected.impact}</p></span></div><dl><div><dt>ResponsÃ¡vel vinculado</dt><dd>{selected.owner}<small>{selected.email}</small></dd></div><div><dt>DependÃªncia</dt><dd>{selected.dependency}<em className={selected.dependencyState.toLowerCase()}>{selected.dependencyState}</em></dd></div><div><dt>EvidÃªncia para concluir</dt><dd>{selected.evidence}<small className={selected.evidenceState==="Anexada"?"ready":""}>{selected.evidenceState}</small></dd></div></dl><div className="context-actions"><button className="ghost" onClick={()=>prepareCommunication(selected)}><Envelope/>Preparar atualizaÃ§Ã£o</button>{selected.evidenceState!=="Anexada"?<button className="primary" onClick={()=>registerEvidence(selected.id)}><Database/>Registrar evidÃªncia</button>:<button className="primary" disabled={selected.status==="ConcluÃ­do"} onClick={()=>approve(selected.id)}><CheckCircle/>{selected.status==="ConcluÃ­do"?"ConcluÃ­da":"Validar e concluir"}</button>}</div><footer><ShieldCheck/>ConclusÃ£o bloqueada atÃ© existir evidÃªncia auditÃ¡vel.</footer></aside>
    </div>
    <Panel title="ExecuÃ§Ã£o paralela Â· NAVEPARK" subtitle="As Ã¡reas avanÃ§am juntas; apenas dependÃªncias reais bloqueiam o trabalho"><div className="parallel-flow">{[["INF","Topologia das VMs","Em andamento","72%"],["CMP","Compra de servidores","Em paralelo","48%"],["ESP","EspecificaÃ§Ã£o funcional","Em paralelo","64%"],["DEV","IntegraÃ§Ãµes WCS","Aguardando INF","26%"]].map((x,i)=><div key={x[0]} className={i===3?"blocked":""}><span>{x[0]}</span><section><b>{x[1]}</b><small>{x[2]}</small><i><em style={{width:x[3]}}/></i></section><strong>{x[3]}</strong>{i<3?<ArrowRight/>:null}</div>)}</div><p className="parallel-note"><Sparkle/><span><b>Leitura do InventOps:</b> Compras e EspecificaÃ§Ã£o continuam trabalhando. Somente DEV aguarda a topologia de Infra â€” o sistema nÃ£o transforma sequÃªncia de departamentos em bloqueio artificial.</span></p></Panel>
    {communication?<div className="modal-layer" onMouseDown={e=>e.target===e.currentTarget&&setCommunication(null)}><article className="analyst-communication" role="dialog" aria-modal="true"><header><div><small>ATUALIZAÃ‡ÃƒO OPERACIONAL</small><h2>Mensagem pronta para revisÃ£o</h2><p>O destinatÃ¡rio vem da tarefa vinculada ao e-mail corporativo.</p></div><button aria-label="Fechar" onClick={()=>setCommunication(null)}><XCircle/></button></header><div className="communication-recipient"><Envelope/><span><small>DESTINATÃRIO</small><b>{communication.email}</b></span><em>{communication.dept}</em></div><pre>{message}</pre><div><button className="ghost" onClick={()=>{navigator.clipboard?.writeText(message);notify("AtualizaÃ§Ã£o copiada e registrada no histÃ³rico.")}}><ClipboardText/>Copiar</button><a className="whatsapp" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer"><WhatsappLogo/>WhatsApp</a><a className="primary" href={`mailto:${communication.email}?subject=${encodeURIComponent(`InventOps Â· ${communication.project}`)}&body=${encodeURIComponent(message)}`}><Envelope/>Abrir Outlook</a></div><footer><ShieldCheck/>O InventOps prepara e registra; o usuÃ¡rio revisa antes do envio.</footer></article></div>:null}
  </section>;
}

export function ManagementPage(){
  return <section className="page foundation-page"><div className="foundation-metrics"><Metric icon={Gauge} label="SAÃšDE MÃ‰DIA" value="68/100" note="+7 em 30 dias" tone="green"/><Metric icon={TrendUp} label="ENTREGA" value="73%" note="+19 p.p."/><Metric icon={Warning} label="GARGALOS" value="3 ativos" note="23 dias acumulados" tone="red"/><Metric icon={ClockCountdown} label="PREVISIBILIDADE" value="81%" note="marcos no prazo" tone="yellow"/></div><div className="foundation-grid equal"><Panel title="TendÃªncia de performance Â· 30 dias" subtitle="SaÃºde e entrega com base nas evidÃªncias registradas"><div className="foundation-chart large"><ResponsiveContainer><AreaChart data={trend}><CartesianGrid stroke="#17243a" vertical={false}/><XAxis dataKey="day" tick={{fontSize:9}} stroke="#66758c"/><YAxis domain={[40,100]} tick={{fontSize:9}} stroke="#66758c"/><Tooltip/><Area dataKey="health" name="SaÃºde" stroke="#28c5e7" fill="#28c5e722" strokeWidth={2}/><Area dataKey="delivery" name="Entrega" stroke="#f5c300" fill="#f5c30012" strokeWidth={2}/></AreaChart></ResponsiveContainer></div></Panel><Panel title="Capacidade por Ã¡rea crÃ­tica" subtitle="Acima de 100% exige replanejamento"><div className="foundation-chart large"><ResponsiveContainer><BarChart data={departments.filter(d=>d.load>=90)} layout="vertical"><CartesianGrid stroke="#17243a" horizontal={false}/><XAxis type="number" domain={[0,130]} tick={{fontSize:9}} stroke="#66758c"/><YAxis dataKey="code" type="category" tick={{fontSize:9}} stroke="#66758c" width={35}/><Tooltip/><Bar dataKey="load" name="Carga %" radius={[0,4,4,0]}>{departments.filter(d=>d.load>=90).map(d=><Cell key={d.code} fill={d.load>100?"#fb5470":"#28c5e7"}/>)}</Bar></BarChart></ResponsiveContainer></div></Panel></div><Panel title="Gargalos ativos" subtitle="Texto completo para orientar cobranÃ§a, nÃ£o apenas um semÃ¡foro"><div className="blocker-table"><header><span>Projeto / Ã¡rea</span><span>Impacto operacional</span><span>PrÃ³xima aÃ§Ã£o obrigatÃ³ria</span><span>Dono / idade</span></header>{blockers.map(b=><div key={b.project}><span><b>{b.project}</b><small>{b.area}</small></span><p>{b.impact}</p><p>{b.action}</p><span><b>{b.owner}</b><small>{b.age}</small></span></div>)}</div></Panel></section>;
}

export function AnalyticsPage(){
  const commitDays=Array.from({length:84},(_,i)=>({i,v:(i*7+i%5*3)%5}));
  return <section className="page foundation-page"><div className="foundation-grid thirds"><Panel title="SaÃºde do portfÃ³lio" subtitle="DistribuiÃ§Ã£o dos projetos"><div className="donut-wrap"><div className="donut"><ResponsiveContainer><PieChart><Pie data={[{n:"SaudÃ¡vel",v:2},{n:"AtenÃ§Ã£o",v:2},{n:"CrÃ­tico",v:2}]} dataKey="v" innerRadius={48} outerRadius={70} stroke="none"><Cell fill="#40d986"/><Cell fill="#f5c300"/><Cell fill="#fb5470"/></Pie><Tooltip/></PieChart></ResponsiveContainer><span><b>6</b><small>projetos</small></span></div><ul><li><i className="green"/>SaudÃ¡veis <b>2</b></li><li><i className="yellow"/>AtenÃ§Ã£o <b>2</b></li><li><i className="red"/>CrÃ­ticos <b>2</b></li></ul></div></Panel><Panel title="Qualidade da evidÃªncia" subtitle="Confiabilidade do progresso calculado"><div className="score-gauge"><b>82%</b><span>ALTA CONFIANÃ‡A</span><i><em style={{width:"82%"}}/></i><p>91% dos itens concluÃ­dos possuem evidÃªncia auditÃ¡vel e origem identificada.</p></div></Panel><Panel title="Risco por natureza" subtitle="RAID consolidado"><div className="risk-bars">{[["Riscos",7,70],["Impedimentos",4,40],["Premissas",5,50],["DependÃªncias",8,80]].map(([n,v,w])=><span key={n}><small>{n}</small><i><em style={{width:`${w}%`}}/></i><b>{v}</b></span>)}</div></Panel></div><Panel title="Commit Grid Â· engajamento tÃ©cnico" subtitle="Atividade vÃ¡lida em bases homologadas Â· Ãºltimos 84 dias"><div className="commit-grid">{commitDays.map(x=><i key={x.i} className={`level-${x.v}`} title={`${x.v*2} commits vÃ¡lidos`}/>)}</div><div className="commit-legend"><span>Menos</span>{[0,1,2,3,4].map(x=><i key={x} className={`level-${x}`}/>)}<span>Mais</span><b>312 commits vÃ¡lidos Â· 11 colaboradores</b></div></Panel></section>;
}

export function ExecutiveOnePager({projects,notify}){
  const executiveJourney = [
    ["Login","Check"],
    ["Home","Check"],
    ["PMO","Check"],
    ["Executive","Em fechamento"]
  ];
  return <section className="page foundation-page onepager-page"><div className="onepager-actions"><span>RelatÃ³rio executivo Â· atualizado em 11/07/2026 Ã s 21:40</span><button className="ghost" onClick={()=>window.print()}><Printer/>Imprimir</button><button className="primary" onClick={()=>notify("One-page preparado para envio com trilha de auditoria.")}><Envelope/>Compartilhar</button></div><article className="onepager"><header><div><small>INVENTOPS Â· RELATÃ“RIO EXECUTIVO</small><h2>PortfÃ³lio de Projetos</h2><p>DecisÃµes, riscos e prÃ³ximos marcos em uma pÃ¡gina.</p></div><span><b>68</b><small>HEALTH SCORE</small></span></header><div className="onepage-kpis"><span><small>PROJETOS</small><b>{projects.length}</b><em>2 bloqueados</em></span><span><small>RISCO FINANCEIRO</small><b>R$ 1,8 mi</b><em>exposiÃ§Ã£o estimada</em></span><span><small>GO LIVES 90D</small><b>4</b><em>2 confirmados</em></span><span><small>CAPACIDADE</small><b>117%</b><em>PLC em setembro</em></span></div><section><h3>Leitura executiva</h3><p>A carteira evoluiu 7 pontos em saÃºde nos Ãºltimos 30 dias. O avanÃ§o Ã© sustentado por evidÃªncias tÃ©cnicas, mas trÃªs dependÃªncias ameaÃ§am a previsibilidade: conectividade do Market Peru, ambiente HML do Navepark e capacidade compartilhada de PLC.</p></section><section className="onepage-journey"><div><small>JORNADA VALIDADA</small><h3>SequÃªncia visÃ­vel da entrega</h3></div><div className="journey-strip">{executiveJourney.map(([label,state],index)=><span key={label} className={index===executiveJourney.length-1?"over":""}><b>{label}</b><small>{state}</small></span>)}</div></section><div className="onepage-columns"><section><h3>DecisÃµes solicitadas</h3><ol><li>Autorizar aceleraÃ§Ã£o do hardware TITANO.</li><li>Escalar conectividade Market Peru com o cliente.</li><li>Repriorizar capacidade PLC para agosto e setembro.</li></ol></section><section><h3>PrÃ³ximos marcos</h3>{projects.slice(0,4).map(p=><div className="onepage-project" key={p.name}><b>{p.name}</b><span>{p.next}</span><em>{p.date}</em></div>)}</section></div><footer><span>Fonte: InventOps Â· dados auditÃ¡veis</span><b>Uso executivo interno</b></footer></article></section>;
}

export function AreasPage(){
  const [selected,setSelected]=useState("Todos");
  const focusAreas=["INF","IMP","ESP"];
  const shown=selected==="Todos"
    ? departments
    : selected==="Sobrecarga"
      ? departments.filter(d=>d.load>100)
      : departments.filter(d=>d.code===selected);
  const focusCards=departments.filter(d=>focusAreas.includes(d.code));
  return <section className="page foundation-page">
    <div className="area-journey"><div><small>JORNADA CROSS-DEPARTMENT · TITANO</small><h2>14 áreas, uma única verdade operacional</h2><p>Cada etapa mostra progresso, capacidade e bloqueios sem perder a visão horizontal do projeto.</p></div><div className="journey-strip">{departments.map((d,i)=><span className={d.load>100?"over":""} key={d.code}><b>{d.code}</b><small>{i<3?"Concluído":i<10?"Em curso":"Planejado"}</small></span>)}</div></div>
    <div className="foundation-grid thirds area-focus-strip">
      {focusCards.map(card=><article key={card.code} className={`area-focus-card ${selected===card.code?"active":""}`}><small>FOCO DE TESTE</small><b>{card.name}</b><p>{card.code==="INF"?"Ambiente, conectividade, VMs, acessos e sustentação técnica do projeto.":card.code==="IMP"?"Campo, agenda, readiness e execução do go live com evidência operacional.":"Especificação funcional, handoff com DEV e coerência do fluxo técnico."}</p><button className="ghost" onClick={()=>setSelected(card.code)}>Abrir visão da área</button></article>)}
    </div>
    <div className="area-toolbar"><div><button className={selected==="Todos"?"active":""} onClick={()=>setSelected("Todos")}>Todas as áreas</button><button className={selected==="Sobrecarga"?"active":""} onClick={()=>setSelected("Sobrecarga")}>Sobrecarga</button><button className={selected==="INF"?"active":""} onClick={()=>setSelected("INF")}>Infraestrutura</button><button className={selected==="IMP"?"active":""} onClick={()=>setSelected("IMP")}>Implantação</button><button className={selected==="ESP"?"active":""} onClick={()=>setSelected("ESP")}>Especificação / DevOps</button></div><span><i/> acima de 100% de capacidade</span></div>
    <div className="area-grid">{shown.map(d=><article key={d.code} className={d.load>100?"over":""}><header><span>{d.code}</span><div><b>{d.name}</b><small>{d.owner}</small></div><em>{d.load}%</em></header><div><span><small>PROGRESSO</small><b>{d.progress}%</b></span><i><em style={{width:`${d.progress}%`}}/></i></div><footer><span>{d.blocked} bloqueios ativos</span><b>{d.load>100?"Replanejar":"Capacidade controlada"}</b></footer></article>)}</div>
  </section>;
}

export function RaidPage(){
  const [selected,setSelected]=useState(null); const matrix=useMemo(()=>Array.from({length:25},(_,i)=>({impact:5-Math.floor(i/5),prob:i%5+1})),[]);
  return <section className="page foundation-page"><div className="foundation-metrics"><Metric icon={Warning} label="SCORE CRÃTICO" value="20â€“25" note="2 itens" tone="red"/><Metric icon={ChartLineUp} label="RAID ATIVO" value="24 itens" note="5 exigem aÃ§Ã£o" tone="yellow"/><Metric icon={ShieldCheck} label="COM RESPOSTA" value="92%" note="meta â‰¥ 95%" tone="green"/><Metric icon={ClockCountdown} label="VENCIDOS" value="1" note="Market Peru" tone="red"/></div><div className="foundation-grid raid-layout"><Panel title="Matriz de risco 5 Ã— 5" subtitle="Probabilidade Ã— impacto Â· clique em um item para abrir"><div className="raid-axis"><span>IMPACTO â†’</span><div className="raid-matrix">{matrix.map(cell=>{const item=riskItems.find(r=>r.prob===cell.prob&&r.impact===cell.impact);const score=cell.prob*cell.impact;return <button key={`${cell.prob}-${cell.impact}`} className={score>=16?"critical":score>=9?"warning":"low"} onClick={()=>item&&setSelected(item)}><small>{score}</small>{item?<b>{item.id}</b>:null}</button>})}</div><em>PROBABILIDADE â†’</em></div></Panel><Panel title="RAID prioritÃ¡rio" subtitle="Risco, premissa, impedimento e dependÃªncia"><div className="raid-list">{riskItems.map(r=><button key={r.id} onClick={()=>setSelected(r)}><span>{r.id}</span><div><b>{r.title}</b><small>{r.project} Â· {r.owner}</small></div><em>{r.prob*r.impact}</em></button>)}</div></Panel></div>{selected?<div className="modal-layer" onMouseDown={e=>e.target===e.currentTarget&&setSelected(null)}><article className="raid-modal" role="dialog" aria-modal="true"><header><span>{selected.id}</span><button onClick={()=>setSelected(null)} aria-label="Fechar"><XCircle/></button></header><small>{selected.kind} Â· {selected.project}</small><h2>{selected.title}</h2><div><span><small>PROBABILIDADE</small><b>{selected.prob}/5</b></span><span><small>IMPACTO</small><b>{selected.impact}/5</b></span><span><small>SCORE</small><b>{selected.prob*selected.impact}/25</b></span></div><dl><div><dt>ResponsÃ¡vel</dt><dd>{selected.owner}</dd></div><div><dt>EstratÃ©gia</dt><dd>{selected.response}</dd></div><div><dt>Prazo</dt><dd>{selected.due}</dd></div></dl><button className="primary" onClick={()=>setSelected(null)}>Abrir plano de resposta</button></article></div>:null}</section>;
}

export function AdminGovernance({role,setRole,notify,onOpenPilotUser}){
  const roles={Admin:[1,1,1,1,1],Diretoria:[1,0,1,0,0],Gestor:[1,1,1,0,0],Analista:[1,1,0,0,0]};
  const permissions=["Visualizar","Editar operação","Gerenciar projetos","Administrar acessos","Configurar integrações"];
  const [theme,setTheme]=useState("Escuro");
  const [invite,setInvite]=useState({name:"",email:"",profile:"Analista",area:"Infraestrutura"});
  const [users,setUsers]=useState([
    {name:"Douglas Alves", profile:"Gestor", area:"Infraestrutura / Implantação", status:"Ativo", dept:"INF", source:"Piloto"},
    {name:"Daniel", profile:"Gestor", area:"Implantação", status:"Piloto real", dept:"IMP", source:"Piloto"},
    {name:"Thomas", profile:"Analista", area:"Espec. Software / DevOps", status:"Piloto real", dept:"ESP", source:"Piloto"},
  ]);
  const roleMeta={
    Admin:{label:"Enterprise Admin",helper:"Controle total da plataforma e das integrações.",scope:"Administração, governança, acessos e regras centrais."},
    Diretoria:{label:"Diretoria · DIREX",helper:"Leitura executiva, decisão e priorização.",scope:"Visão consolidada, indicadores, riscos e decisões."},
    Gestor:{label:"Gestor",helper:"Cobrança, coordenação e desbloqueio da operação.",scope:"Projetos, PMO, áreas, RAID e evidências."},
    Analista:{label:"Analista",helper:"Execução com contexto, prazo e evidência.",scope:"Minha operação, projetos, áreas e comissionamento."}
  };
  const governancePulse=[
    ["Perfis ativos","4 perfis","Admin · Diretoria · Gestor · Analista"],
    ["Sessões auditáveis","100%","Toda ação crítica deixa trilha"],
    ["Regra central","RBAC + evidência","Capacidade correta para cada contexto"]
  ];
  const adminPrinciples=[
    ["Permissão por capacidade","Cada perfil vê e faz só o que precisa."],
    ["Acessível de nascença","Contraste forte, leitura clara e navegação sem susto."],
    ["Trilíngue de nascença","PT, ES e EN seguem juntos no mesmo fluxo."],
    ["Auditoria viva","Toda ação crítica fica explicável depois."]
  ];
  const sendInvite=(event)=>{
    event.preventDefault();
    const deptMap={Infraestrutura:"INF","Implantação":"IMP","Espec. de Software":"ESP","WCS Velox":"WCS","PMO":"PMO"};
    const newUser={
      name:invite.name,
      profile:invite.profile,
      area:invite.area,
      status:"Acesso preparado",
      dept:deptMap[invite.area]||"INF",
      source:"Administração"
    };
    setUsers(current=>[newUser,...current.filter(item=>item.name!==newUser.name)]);
    notify(`Acesso preparado para ${invite.name||"novo usuário"} · perfil ${invite.profile} · área ${invite.area}.`);
    setInvite({name:"",email:"",profile:"Analista",area:"Infraestrutura"});
  };
  return <section className="page foundation-page">
    <div className="admin-banner"><ShieldCheck/><div><small>GOVERNANÇA DE ACESSO</small><h2>Permissão clara, ação auditável</h2><p>A demonstração aplica perfis na interface. Em produção, a mesma regra será validada novamente no servidor.</p></div><span><LockKey/>Sessão ativa</span></div>
    <div className="executive-command-strip">
      {governancePulse.map(item=><span key={item[0]}><small>{item[0]}</small><b>{item[1]}</b><em>{item[2]}</em></span>)}
    </div>
    <div className="admin-principles">
      {adminPrinciples.map(([title,body])=><article key={title}><small>PRINCÍPIO</small><b>{title}</b><p>{body}</p></article>)}
    </div>
    <div className="foundation-grid equal">
      <Panel title="Simular perfil de acesso" subtitle="Use na apresentação para demonstrar o RBAC"><div className="role-selector">{Object.keys(roles).map(r=><button className={role===r?"active":""} key={r} onClick={()=>{setRole(r);notify(`Perfil alterado para ${roleMeta[r].label}. A navegação foi recalculada.`)}}><UserGear/><span><b>{roleMeta[r].label}</b><small>{roleMeta[r].helper}</small></span></button>)}</div></Panel>
      <Panel title="Regras obrigatórias" subtitle="Validações que protegem a qualidade do dado"><ul className="governance-rules"><li><CheckCircle/><span><b>Concluído = 100%</b><small>Sem atraso pendente ou atividade aberta.</small></span></li><li><CheckCircle/><span><b>Bloqueado exige plano</b><small>Categoria, responsável, próxima ação e data.</small></span></li><li><CheckCircle/><span><b>Importação transacional</b><small>Arquivo inválido não altera a base.</small></span></li><li><CheckCircle/><span><b>Link seguro do analista</b><small>Token expirável vinculado a e-mail e tarefa.</small></span></li></ul></Panel>
    </div>
    <div className="admin-role-overview">{Object.entries(roleMeta).map(([key,item])=><article key={key} className={role===key?"active":""}><small>VER COMO</small><b>{item.label}</b><p>{item.scope}</p><span>{role===key?"Perfil ativo":"Capacidade disponível"}</span></article>)}</div>
    <div className="foundation-grid equal">
      <Panel title="Novo acesso" subtitle="Quem entra e o que cada perfil pode fazer">
        <form className="admin-access-form" onSubmit={sendInvite}>
          <label><span>Nome</span><input value={invite.name} onChange={e=>setInvite({...invite,name:e.target.value})} placeholder="Ex.: Daniel Souza" required/></label>
          <label><span>E-mail corporativo</span><input type="email" value={invite.email} onChange={e=>setInvite({...invite,email:e.target.value})} placeholder="nome@invent-corp.com" required/></label>
          <div className="admin-access-row">
            <label><span>Perfil</span><select value={invite.profile} onChange={e=>setInvite({...invite,profile:e.target.value})}>{Object.keys(roleMeta).map(key=><option key={key}>{key}</option>)}</select></label>
            <label><span>Área</span><select value={invite.area} onChange={e=>setInvite({...invite,area:e.target.value})}>{["Infraestrutura","Implantação","Espec. de Software","WCS Velox","PMO"].map(item=><option key={item}>{item}</option>)}</select></label>
          </div>
          <div className="admin-access-note"><b>Permissão por capacidade</b><p>Cada perfil enxerga e faz só o que precisa. O usuário recebe o acesso conforme o papel e a área definidos acima.</p></div>
          <button className="primary" type="submit"><Envelope/>Preparar acesso</button>
        </form>
      </Panel>
      <Panel title="Tema da interface" subtitle="Modelo vindo do inventops79">
        <div className="admin-theme-picker">
          {["Escuro","Claro","Alto contraste"].map(option=><button key={option} className={theme===option?"active":""} onClick={()=>{setTheme(option);notify(`Tema visual alterado para ${option}.`)}}><b>{option}</b><small>{option==="Escuro"?"Padrão corporativo":option==="Claro"?"Ambiente claro para leitura":"Máximo contraste para validação"}</small></button>)}
        </div>
        <div className="admin-theme-state"><ShieldCheck/><span><small>TEMA ATIVO</small><b>{theme}</b></span></div>
      </Panel>
    </div>
    <Panel title="Usuários válidos do piloto" subtitle="Escopo atual vindo das áreas e do inventops79">
      <div className="admin-pilot-users">
        {users.map((user)=><article key={`${user.name}-${user.area}`}>
          <small>{user.profile}</small>
          <b>{user.name}</b>
          <p>{user.area}</p>
          <span>{user.status}</span>
          <em>{user.source}</em>
          <div className="admin-pilot-actions">
            <button className="ghost" type="button" onClick={()=>notify(`${user.name} está registrado como usuário válido do piloto em ${user.area}.`)}>Validar usuário</button>
            <button className="ghost" type="button" onClick={()=>{
              setRole(user.profile);
              onOpenPilotUser?.(user);
              notify(`Abrindo ${user.name} no contexto de ${user.area}.`);
            }}>Abrir contexto</button>
          </div>
        </article>)}
      </div>
    </Panel>
    <Panel title="Matriz de permissões" subtitle="Rotas e ações por perfil"><div className="permission-table"><header><span>Permissão</span>{Object.keys(roles).map(r=><span key={r}>{r==="Diretoria"?"DIREX":r}</span>)}</header>{permissions.map((p,i)=><div key={p}><b>{p}</b>{Object.keys(roles).map(r=><span key={r}>{roles[r][i]?<CheckCircle/>:<XCircle/>}</span>)}</div>)}</div></Panel>
    <Panel title="Trilha de auditoria" subtitle="Quem fez o quê, quando e sobre qual registro"><div className="audit-log">{[["21:38","Douglas","Alterou prazo do Go Live","TITANO"],["20:54","Daiana Costa","Anexou evidência REV4","QUELUZ"],["19:42","Sistema IoT","Criou alerta P0","TITANO"],["18:17","Ivan","Atualizou bloqueio de VPN","MARKET PERU"]].map(x=><div key={x.join()}><span>{x[0]}</span><b>{x[1]}</b><p>{x[2]}</p><em>{x[3]}</em></div>)}</div></Panel></section>;
}

export function LifecyclePage(){
  const [horizon,setHorizon]=useState("12 meses");
  const milestones=[
    {version:"V17.9",period:"JUL Â· 2026",status:"ATUAL",title:"GovernanÃ§a operacional",owner:"PMO + Tecnologia",progress:98,tone:"yellow",value:"Uma carteira Ãºnica, auditÃ¡vel e explicÃ¡vel.",scope:["Central PMO e plano integrado","Sete fases com gates formais","DependÃªncias, evidÃªncias e handoffs"],gate:"Piloto operacional validado pelo PMO"},
    {version:"V18",period:"AGOâ€“SET Â· 2026",status:"PRÃ“XIMO",title:"OperaÃ§Ã£o conectada",owner:"TI + Dados",progress:24,tone:"cyan",value:"Fim das planilhas paralelas e atualizaÃ§Ã£o manual.",scope:["PostgreSQL e APIs reais","SSO Microsoft 365 + RBAC","ImportaÃ§Ã£o segura e notificaÃ§Ãµes"],gate:"Base integrada com 3 projetos-piloto"},
    {version:"V19",period:"OUTâ€“DEZ Â· 2026",status:"PLANEJADO",title:"InteligÃªncia preditiva",owner:"PMO + Genius AI",progress:8,tone:"purple",value:"Decidir antes que o atraso vire custo.",scope:["Simulador de impacto IA","PrevisÃ£o de gargalos e capacidade","Briefing executivo recomendado"],gate:"AcurÃ¡cia preditiva â‰¥ 80%"},
    {version:"V20",period:"JANâ€“MAR Â· 2027",status:"VISÃƒO",title:"ChÃ£o de fÃ¡brica vivo",owner:"AutomaÃ§Ã£o + IoT",progress:0,tone:"green",value:"TI e TA conectadas ao mesmo projeto.",scope:["Telemetria de CLPs e sensores","GÃªmeo digital de comissionamento","Falha fÃ­sica gera alerta P0"],gate:"Uma esteira piloto em produÃ§Ã£o"},
    {version:"V21",period:"ABRâ€“JUN Â· 2027",status:"NORTH STAR",title:"OperaÃ§Ã£o autÃ´noma assistida",owner:"Diretoria + OperaÃ§Ãµes",progress:0,tone:"blue",value:"O sistema recomenda, orquestra e aprende.",scope:["Workflows automÃ¡ticos","Playbooks de recuperaÃ§Ã£o","Benchmark de projetos e squads"],gate:"ReduÃ§Ã£o mensurÃ¡vel de atraso e retrabalho"}
  ];
  const visible=horizon==="90 dias"?milestones.slice(0,2):horizon==="6 meses"?milestones.slice(0,3):milestones;
  return <section className="page foundation-page lifecycle-page">
    <div className="release-hero roadmap-hero"><div><small>RELEASE ATUAL</small><span>V17.9</span></div><div><small>INVENTOPS Â· PRODUCT ROADMAP</small><h2>Da verdade operacional Ã  prevenÃ§Ã£o automÃ¡tica</h2><p>Um Ãºnico produto em cinco estÃ¡gios de maturidade. Primeiro tornamos a operaÃ§Ã£o confiÃ¡vel; depois conectamos dados, prevemos impacto e fechamos o ciclo com o chÃ£o de fÃ¡brica.</p></div><div className="roadmap-health"><RocketLaunch/><span><b>98%</b><small>ciclo atual</small></span></div></div>
    <div className="roadmap-command"><div><small>HORIZONTE DE DECISÃƒO</small><div>{["90 dias","6 meses","12 meses"].map(x=><button key={x} className={horizon===x?"active":""} onClick={()=>setHorizon(x)}>{x}</button>)}</div></div><span><CalendarBlank/><small>ÃšLTIMA REVISÃƒO</small><b>12 jul 2026</b></span><span><FlagCheckered/><small>PRÃ“XIMO GATE</small><b>Demo com diretoria</b></span><span><ShieldCheck/><small>TESE DO PRODUTO</small><b>Controlar â†’ Prever â†’ Agir</b></span></div>
    <div className="roadmap-board">{visible.map((m,i)=><article className={`roadmap-card ${m.tone}`} key={m.version}>
      <header><span>{String(i+1).padStart(2,"0")}</span><div><small>{m.period}</small><b>{m.version}</b></div><em>{m.status}</em></header>
      <div className="roadmap-card-body"><small>ERA ESTRATÃ‰GICA</small><h3>{m.title}</h3><p>{m.value}</p><div className="roadmap-owner"><UsersThree/><span><small>RESPONSÃVEL</small><b>{m.owner}</b></span></div><ul>{m.scope.map(x=><li key={x}><CheckCircle/>{x}</li>)}</ul></div>
      <footer><div><span><small>MATURIDADE</small><b>{m.progress}%</b></span><i><em style={{width:`${m.progress}%`}}/></i></div><p><FlagCheckered/><span><small>CRITÃ‰RIO DE SAÃDA</small><b>{m.gate}</b></span></p></footer>
    </article>)}</div>
    <div className="foundation-grid two-one roadmap-bottom"><Panel title="Valor liberado por etapa" subtitle="O roadmap mede resultado, nÃ£o apenas funcionalidades"><div className="value-ladder">{[["AGORA","Confiabilidade","Uma fonte oficial para projetos e decisÃµes"],["V18","EficiÃªncia","Menos cobranÃ§a manual e retrabalho de relatÃ³rio"],["V19","AntecipaÃ§Ã£o","Risco traduzido em prazo, capacidade e custo"],["V20+","Autonomia","Falha detectada, priorizada e tratada no fluxo"]].map((x,i)=><div key={x[0]}><span>{i+1}</span><small>{x[0]}</small><b>{x[1]}</b><p>{x[2]}</p></div>)}</div></Panel><Panel title="GovernanÃ§a do roadmap" subtitle="Como uma etapa avanÃ§a"><div className="roadmap-governance"><p><ShieldCheck/><span><b>Gate executivo</b><small>PatrocÃ­nio, prioridade e valor aprovados.</small></span></p><p><Database/><span><b>Gate tÃ©cnico</b><small>Dados, seguranÃ§a e integraÃ§Ã£o validados.</small></span></p><p><CheckSquare/><span><b>Gate operacional</b><small>Piloto aceito com evidÃªncia e responsÃ¡vel.</small></span></p><button className="primary" onClick={()=>setHorizon("12 meses")}>Ver visÃ£o completa<ArrowRight/></button></div></Panel></div>
  </section>;
}

export function PresentationPage({notify}){
  const profiles={
    Analista:{icon:CheckSquare,color:"cyan",promise:"Minha rotina, sem planilhas paralelas.",screens:["Minha OperaÃ§Ã£o","Entregas por Ãrea","EvidÃªncias"],focus:["Demandas vinculadas ao perfil","Prazo, dependÃªncia e handoff","Progresso sustentado por evidÃªncia"],script:"Para o analista, o InventOps centraliza a rotina e elimina planilhas paralelas. Cada demanda chega vinculada ao perfil corporativo, com prazo, evidÃªncia esperada e contexto do projeto. O analista atualiza a entrega e transforma trabalho tÃ©cnico em progresso confiÃ¡vel."},
    Gestor:{icon:UsersThree,color:"yellow",promise:"Distribuir, cobrar e desbloquear com contexto.",screens:["Central PMO","Plano integrado","Matriz RAID"],focus:["Fila Ãºnica de decisÃµes e cobranÃ§as","Atividades, responsÃ¡veis e evidÃªncias","Riscos com plano de resposta"],script:"Para o gestor, o InventOps reÃºne a carteira em uma Central PMO e detalha cada entrega no plano integrado. A fila mostra quem cobrar, enquanto o projeto distribui atividades com responsÃ¡vel, dependÃªncia e evidÃªncia. O briefing diÃ¡rio prepara a comunicaÃ§Ã£o para WhatsApp e Outlook."},
    Diretor:{icon:ChartLineUp,color:"purple",promise:"Decidir antes que o atraso vire custo.",screens:["Dashboard Executivo","Simulador de Impacto","Releases & Roadmap"],focus:["Health Score e decisÃµes do dia","CenÃ¡rios de prazo e capacidade","EvoluÃ§Ã£o do produto por valor"],script:"Para a diretoria, o InventOps traduz a carteira em decisÃµes. O dashboard aponta onde agir hoje, o simulador antecipa impactos entre projetos e o roadmap mostra como a plataforma evolui da V17.9, com governanÃ§a operacional por gates, para a prevenÃ§Ã£o automÃ¡tica no chÃ£o de fÃ¡brica."}
  };
  const [selected,setSelected]=useState("Diretor");
  const current=profiles[selected]; const Icon=current.icon;
  const copy=async()=>{try{await navigator.clipboard.writeText(current.script)}catch{}notify(`Roteiro ${selected} copiado para gravaÃ§Ã£o ou ElevenLabs.`)};
  return <section className="page foundation-page presentation-page"><div className="presentation-hero"><div><small>MODO APRESENTAÃ‡ÃƒO Â· DIRETORIA</small><h2>Um produto. TrÃªs nÃ­veis de valor.</h2><p>Roteiro visual pronto para demonstrar o InventOps pelo ponto de vista de quem executa, de quem coordena e de quem decide.</p></div><span><Play weight="fill"/><b>â‰ˆ 3 min</b><small>roteiro completo</small></span></div><div className="presentation-profiles">{Object.entries(profiles).map(([name,item])=>{const RoleIcon=item.icon;return <button key={name} className={`${selected===name?"active":""} ${item.color}`} onClick={()=>setSelected(name)}><RoleIcon/><span><small>VISÃƒO</small><b>{name}</b><p>{item.promise}</p></span><em>{selected===name?"Selecionado":"Abrir"}</em></button>})}</div><div className="presentation-stage"><article><header><span className={current.color}><Icon/></span><div><small>ROTEIRO Â· {selected.toUpperCase()}</small><h3>{current.promise}</h3></div><button className="primary" onClick={copy}><ClipboardText/>Copiar narraÃ§Ã£o</button></header><div className="presentation-route">{current.screens.map((screen,i)=><div key={screen}><span>{i+1}</span><div><small>TELA {i+1}</small><b>{screen}</b><p>{current.focus[i]}</p></div>{i<current.screens.length-1?<ArrowRight/>:null}</div>)}</div><blockquote>â€œ{current.script}â€</blockquote></article><aside><small>GUIA DE GRAVAÃ‡ÃƒO</small><h3>Direto, real e sem promessas falsas</h3><ul><li><CheckCircle/>Gravar as telas reais do InventOps.</li><li><CheckCircle/>Usar os perfis Analista, Gestor e Diretor.</li><li><CheckCircle/>Mostrar Outlook e WhatsApp como preparaÃ§Ã£o para envio.</li><li><CheckCircle/>Encerrar com o Roadmap V17.9 â†’ V21.</li></ul><div><ShieldCheck/><span><b>Branding oficial</b><small>Nome InventOps confirmado por Daiana. Logo final depende da validaÃ§Ã£o do Marketing.</small></span></div></aside></div></section>;
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
    demo:"Acessos da demonstração",
    demoTitle:"Perfis disponíveis após entrar",
    demoBody:"Admin · Diretoria · Gestor · Analista",
    demoFoot:"Ambiente demonstrativo — sem credenciais reais.",
    forgot:"Esqueci minha senha",
    enter:"Entrar no InventOps",
    or:"ou",
    microsoft:"Continuar com Microsoft / Azure AD",
    footer:"Conectando pessoas, processos e resultados.",
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
    demo:"Accesos de demostración",
    demoTitle:"Perfiles disponibles después de ingresar",
    demoBody:"Admin · Directoria · Gestor · Analista",
    demoFoot:"Entorno demostrativo — sin credenciales reales.",
    forgot:"Olvidé mi contraseña",
    enter:"Entrar en InventOps",
    or:"o",
    microsoft:"Continuar con Microsoft / Azure AD",
    footer:"Conectando personas, procesos y resultados.",
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
    demo:"Demo access",
    demoTitle:"Profiles available after sign-in",
    demoBody:"Admin · Executive · Manager · Analyst",
    demoFoot:"Demonstration environment — no real credentials.",
    forgot:"Forgot my password",
    enter:"Enter InventOps",
    or:"or",
    microsoft:"Continue with Microsoft / Azure AD",
    footer:"Connecting people, processes, and results.",
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
    steps:["Autenticando credenciais","Conectando departamentos","Sincronizando indicadores","Abrindo dashboard executivo"]
  },
  es:{
    preparing:"Preparando tu entorno",
    subtitle:"Autenticando perfil, sincronizando contexto y cargando tu visión operativa.",
    finalizing:"Consolidando contexto, validando permisos y abriendo tu visión ejecutiva.",
    steps:["Autenticando credenciales","Conectando departamentos","Sincronizando indicadores","Abriendo panel ejecutivo"]
  },
  en:{
    preparing:"Preparing your workspace",
    subtitle:"Authenticating your profile, syncing context, and loading your operational view.",
    finalizing:"Consolidating context, validating permissions, and opening your executive view.",
    steps:["Authenticating credentials","Connecting departments","Syncing indicators","Opening executive dashboard"]
  }
};

export function LoginScreen({onLogin}){
  const [email,setEmail]=useState("douglas.alves@invent-corp.com");
  const [password,setPassword]=useState("inventops2026");
  const [showDemo,setShowDemo]=useState(false);
  const [lang,setLang]=useState("pt");
  const [isSubmitting,setIsSubmitting]=useState(false);
  const [syncStep,setSyncStep]=useState(0);
  const [progress,setProgress]=useState(12);
  const [syncMessage,setSyncMessage]=useState("");
  const copy=LOGIN_TEXT[lang];
  const syncCopy=LOGIN_SYNC_TEXT[lang];
  const trustSignals=[
    {value:"14",label:copy.pulseA},
    {value:"342",label:copy.pulseB},
    {value:"1.247",label:copy.pulseC}
  ];
  const valueHighlights=[
    {icon:ShieldCheck,title:"Acesso governado",body:"Perfis, visões e ações alinhadas à responsabilidade de cada pessoa."},
    {icon:ClipboardText,title:"Operação rastreável",body:"Solicitações, projetos, decisões e evidências conectados na mesma linha."},
    {icon:Factory,title:"Leitura executiva viva",body:"O que mudou, o que trava e qual é a próxima ação entram já no primeiro acesso."}
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
        {LOGIN_DEPARTMENTS.map((department,index)=><span key={department} style={{"--i":index}}>{department.split("\n").map((part,partIndex)=><strong key={`${department}-${partIndex}`}>{part}</strong>)}</span>)}
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
        <div className="login-role-pills">
          <span>Admin</span>
          <span>Direx</span>
          <span>Gestor</span>
          <span>Analista</span>
        </div>
        <div className="login-trust-strip" aria-label="Indicadores da operação">
          {trustSignals.map(signal=><article key={signal.label}><b>{signal.value}</b><small>{signal.label}</small></article>)}
        </div>
        <label>{copy.email}<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoFocus disabled={isSubmitting}/></label>
        <label>{copy.password}<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required disabled={isSubmitting}/></label>
        <div className="login-options"><label><input type="checkbox" disabled={isSubmitting}/> {copy.keep}</label><button type="button" onClick={()=>setShowDemo(!showDemo)} disabled={isSubmitting}>{copy.demo}</button></div>
        {showDemo?<div className="demo-credentials"><b>{copy.demoTitle}</b><span>{copy.demoBody}</span><small>{copy.demoFoot}</small></div>:null}
        <div className="login-support-row"><span>{copy.forgot}</span></div>
        <button className="primary" type="submit" disabled={isSubmitting}>{isSubmitting?<><MonitorPlay/>Conectando...</>:<>{copy.enter}<ArrowRight/></>}</button>
        <div className="sso-divider"><span>{copy.or}</span></div>
        <button className="sso-button" type="button" onClick={()=>runLogin("douglas.alves@invent-corp.com")} disabled={isSubmitting}><span>M</span>{copy.microsoft}</button>
        <div className="login-assurance-row">
          <span><ShieldCheck/>SSO corporativo</span>
          <span><UsersThree/>Perfis validados</span>
          <span><MonitorPlay/>Acesso auditável</span>
        </div>
        <footer><ShieldCheck/>{copy.footer}</footer>
      </form>
    </section>
    {isSubmitting?<div className="login-transition-layer" role="status" aria-live="polite"><div className="login-transition-card"><div className="login-transition-mark"><img src={`${import.meta.env.BASE_URL}assets/icon.svg`} alt=""/><span><b>InventOps</b><small>ENTERPRISE</small></span></div><div className="login-transition-orb" aria-hidden="true"><i/><i/><i/></div><h3>{syncCopy.preparing}</h3><p>{syncMessage||syncCopy.subtitle}</p><div className="login-transition-progress"><i style={{width:`${progress}%`}}/></div><strong>{progress}%</strong><ul>{syncCopy.steps.map((step,index)=><li key={step} className={index<=syncStep?"done":""}><span>{index+1}</span><b>{step}</b></li>)}</ul></div></div>:null}
  </main>;
}

export function StatusReportModal({project,onClose,notify}){
  const text=`ðŸ“Š STATUS REPORT â€” ${project.name}\nðŸŸ¡ SaÃºde: ${project.health}/100 Â· Progresso: ${project.progress}%\nðŸ“ Fase atual: ${project.phase}/7\nðŸš© PrÃ³ximo marco: ${project.next} â€” ${project.date}\nâš ï¸ Ponto de atenÃ§Ã£o: ${project.blocker}\nâœ… PrÃ³xima aÃ§Ã£o: ${project.nextAction}\nðŸ‘¤ ResponsÃ¡vel: ${project.owner}`;
  const email=project.ownerEmail||`${(project.owner||"responsavel").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().replace(/\s+/g,".")}@invent-corp.com`;
  const register=channel=>notify(`Status Report preparado para ${channel} e registrado no histÃ³rico de comunicaÃ§Ãµes.`);
  const copy=async()=>{try{await navigator.clipboard.writeText(text)}catch{}register("cÃ³pia")};
  const whatsapp=()=>{window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank","noopener,noreferrer");register("WhatsApp")};
  const mail=()=>{const subject=`InventOps Â· Status Report Â· ${project.name}`;window.location.href=`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;register("e-mail corporativo")};
  return <div className="modal-layer" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><article className="status-report-modal communication-modal" role="dialog" aria-modal="true"><header><div><small>CENTRAL DE COMUNICAÃ‡ÃƒO</small><h2>Status Report Â· {project.name}</h2><p>Revise o conteÃºdo e escolha como deseja compartilhar.</p></div><button onClick={onClose} aria-label="Fechar"><XCircle/></button></header><pre>{text}</pre><div className="communication-recipient"><Envelope/><span><small>DESTINATÃRIO VINCULADO</small><b>{email}</b></span><em>Corporativo</em></div><div className="communication-actions"><button className="ghost" onClick={copy}><ClipboardText/>Copiar texto</button><button className="whatsapp" onClick={whatsapp}><WhatsappLogo/>Abrir WhatsApp</button><button className="primary" onClick={mail}><Envelope/>Abrir no Outlook</button></div><footer><ShieldCheck/>A demo prepara a comunicaÃ§Ã£o. O usuÃ¡rio revisa e confirma o envio no aplicativo escolhido.</footer></article></div>;
}

export function AccessDenied({setActive}){
  return <section className="page access-denied"><LockKey/><small>ACESSO RESTRITO Â· 403</small><h2>Este perfil nÃ£o pode acessar este mÃ³dulo.</h2><p>A polÃ­tica de acesso foi aplicada antes da abertura da pÃ¡gina. Solicite permissÃ£o a um administrador ou retorne ao dashboard.</p><button className="primary" onClick={()=>setActive("home")}>Voltar ao Dashboard</button></section>;
}


