import { useMemo, useState } from "react";
import {
  ArrowRight, ArrowsLeftRight, BellRinging, CalendarBlank, CheckCircle,
  ClipboardText, ClockCountdown, CopySimple, Envelope, Eye, FileText, Funnel,
  ShieldCheck, User, UsersThree, Warning, WhatsappLogo, XCircle
} from "@phosphor-icons/react";
import { createProjectDeliveries } from "./ProjectDeliveryMatrix";

const focus = {
  TITANO:{area:"PLC",priority:"Hoje",decision:"Confirmar a janela de testes SAT após a estabilização do Sensor X.",waitedBy:"Implantação e operação do cliente",sla:"Hoje · 18:00"},
  QUELUZ:{area:"ESP",priority:"Handoff",decision:"Validar a especificação funcional para liberar o fechamento das regras WCS.",waitedBy:"WCS e PM do Gate GL1",sla:"Hoje · 16:30"},
  "MARKET PERU":{area:"INF",priority:"Crítico",decision:"Escalar VPN e range IP /24 com o cliente e fixar uma data de aceite.",waitedBy:"WCS, Homologação e cronograma de exportação",sla:"SLA · 07:35"},
  NAVEPARK:{area:"INF",priority:"Crítico",decision:"Aprovar a topologia Oracle KVM ou registrar a alternativa técnica.",waitedBy:"WCS e ambiente HML",sla:"SLA · 11:20"},
  BP:{area:"IMP",priority:"Handoff",decision:"Confirmar a equipe de campo e a prontidão para o Go Live.",waitedBy:"Operação e Pós-vendas",sla:"18 jul"},
  "MARKET CHILE":{area:"EMC",priority:"Planejado",decision:"Liberar o próximo lote mecânico sem aguardar o encerramento das demais frentes.",waitedBy:"Produção e Montagem",sla:"19 jul"}
};

function buildQueue(projects){
  return projects.map(project=>{
    const config=focus[project.name]||focus.TITANO;
    const delivery=createProjectDeliveries(project).find(item=>item.area===config.area);
    return {...delivery,...config,project:project.name,projectCode:project.code,projectStatus:project.status,risk:project.risk,followed:false};
  }).sort((a,b)=>{
    const weight={Crítico:0,Hoje:1,Handoff:2,Planejado:3};
    return weight[a.priority]-weight[b.priority];
  });
}

const handoffs = [
  {project:"QUELUZ",from:"ESP",to:"WCS",label:"Especificação funcional",state:"Aguardando aceite",tone:"waiting"},
  {project:"TITANO",from:"PLC",to:"IMP",label:"Testes SAT",state:"Em execução",tone:"active"},
  {project:"BP",from:"IMP",to:"POS",label:"Prontidão de Go Live",state:"Previsto 18 jul",tone:"planned"},
  {project:"MARKET CHILE",from:"EMC",to:"PRD",label:"Lote mecânico 02",state:"Liberado por lote",tone:"done"}
];

const journeySteps = [
  { id:"login", label:"Login", status:"done" },
  { id:"home", label:"Home", status:"done" },
  { id:"pm", label:"PM", status:"active" },
  { id:"infra", label:"Infra", status:"next" },
  { id:"executive", label:"Executive", status:"next" }
];

const PM_I18N={
  pt:{journeyDetails:{login:"Experiência inicial já repaginada e validada.",home:"Dashboard principal já elevado para a nova régua visual.",pm:"Tela atual em fechamento com fila única, briefing e handoffs.",infra:"Próxima frente: Mission Control e enforcement operacional.",executive:"Fechamento visual da camada diretiva e narrativa final."},
   followUpToast:owner=>`Cobrança registrada para ${owner}. A Central PM foi atualizada.`,
   emailSubject:(project,area)=>`InventOps · ${project} · ${area} · decisão pendente`,
   emailBody:(o)=>`Olá, ${o.owner}.\n\nO PM registrou uma ação de governança para a entrega abaixo.\n\nProjeto: ${o.project}\nÁrea: ${o.department}\nEntrega: ${o.delivery}\nDecisão necessária: ${o.decision}\nPrazo/SLA: ${o.sla}\nEvidência atual: ${o.evidence}\n\nPor favor, atualize a entrega e registre a evidência no InventOps.`,
   emailToast:email=>`Atualização preparada para ${email}.`,
   briefing:(m)=>`📍 INVENTOPS · BRIEFING PM
Atualização da carteira · 18/07/2026

🔴 DECISÕES PRIORITÁRIAS
• MARKET PERU · Escalar VPN e range IP /24 com o cliente. SLA em curso.
• NAVEPARK · Aprovar topologia Oracle KVM ou registrar alternativa técnica.
• TITANO · Confirmar janela de testes SAT após estabilização do Sensor X.

🔄 HANDOFFS
• QUELUZ · ESP → WCS · especificação funcional aguardando aceite.
• BP · IMP → POS · prontidão de Go Live prevista para 18/07.

📊 CARTEIRA
• ${m.projects} projetos · ${m.deliveries} entregas mapeadas.
• ${m.attention} cobranças prioritárias ainda abertas.
• 100% das ações possuem responsável corporativo.

Fonte: InventOps · dados rastreáveis por projeto, área e evidência.`,
   briefingToast:"Briefing PM copiado para a área de transferência.",
   heroTag:"CENTRAL DE GOVERNANÇA · PM",heroTitle:"Uma fila única para mover a carteira inteira.",heroBody:"O InventOps cruza entregas, dependências e evidências dos projetos e mostra exatamente quem cobrar, por quê e quem está esperando.",
   integrityTag:"INTEGRIDADE DA CARTEIRA",integrityValue:"100% com responsável",integrityNote:"nenhuma cobrança sem contexto",genBriefing:"Gerar briefing do dia",
   journeyTag:"SEQUÊNCIA DE ENTREGA",journeyTitle:"O que já está validado e o que vem agora",journeyPace:"Ritmo atual: tela a tela, sem pular etapa",check:"CHECK",closing:"EM FECHAMENTO",
   mapped:"ENTREGAS MAPEADAS",mappedNote:p=>`${p} projetos × 14 áreas`,priorityFollowups:"COBRANÇAS PRIORITÁRIAS",priorityNote:"impactam marcos da carteira",inProgress:"HANDOFFS EM CURSO",inProgressNote:"áreas passando o bastão",noOwner:"SEM RESPONSÁVEL",noOwnerNote:"governança íntegra",
   filters:{all:"Todos",attention:"Atenção",handoffs:"Handoffs",planned:"Planejado",validating:"Em validação"},recalculated:"Carteira recalculada com as últimas evidências",
   dailyRitual:"RITUAL DIÁRIO DO PM",queueTitle:"Fila de governança",visibleActions:n=>`${n} ações visíveis`,
   colPriority:"Prioridade / projeto",colDelivery:"Entrega que precisa andar",colArea:"Área e responsável",colDue:"Prazo / SLA",colState:"Estado",followed:"Acompanhada",baseDue:d=>`Prazo base ${d}`,
   emptyTitle:"Nenhuma ação neste filtro.",emptyBody:"A governança está íntegra para este recorte.",
   decisionOf:"DECISÃO DO PM",realDependency:"Dependência real",blockedNote:"Bloqueio materializado no projeto.",monitoredNote:"Monitorada sem impedir frentes paralelas.",whoWaiting:"Quem está esperando",waitingNote:"O handoff será registrado ao liberar a entrega.",evidenceAvailable:"Evidência disponível",currentProgress:p=>`Progresso atual: ${p}%.`,responsible:"Responsável",
   openProject:"Abrir projeto",prepareEmail:"Preparar e-mail",followUpRegistered:"Cobrança registrada",registerFollowUp:"Registrar cobrança",contextFooter:"A ação fica vinculada ao projeto, à área e ao responsável.",
   flowTag:"FLUXO ENTRE ÁREAS",radarTitle:"Radar de handoffs",radarBody:"O fim do "+"“"+"alguém sabe se ficou pronto?"+"”",
   commTag:"COMUNICAÇÃO OPERACIONAL",briefingTitle:"Briefing diário do PM",briefingReview:"Revise antes de compartilhar. O InventOps nunca envia automaticamente.",close:"Fechar briefing",
   recipients:"DESTINATÁRIOS SUGERIDOS",recipientsValue:"PM, gestores das áreas e diretoria",mandatoryReview:"revisão obrigatória",copyText:"Copiar texto",openWhatsapp:"Abrir WhatsApp",openOutlook:"Abrir Outlook",briefingFooter:"O conteúdo permanece vinculado à fonte oficial da carteira.",
   mailSubjectBriefing:"InventOps · Briefing PM · 18/07/2026"},
  es:{journeyDetails:{login:"Experiencia inicial ya rediseñada y validada.",home:"Dashboard principal ya elevado a la nueva regla visual.",pm:"Pantalla actual en cierre con fila única, briefing y handoffs.",infra:"Próximo frente: Mission Control y enforcement operativo.",executive:"Cierre visual de la capa directiva y narrativa final."},
   followUpToast:owner=>`Reclamo registrado para ${owner}. La Central PM se actualizó.`,
   emailSubject:(project,area)=>`InventOps · ${project} · ${area} · decisión pendiente`,
   emailBody:(o)=>`Hola, ${o.owner}.\n\nEl PM registró una acción de gobernanza para la entrega abajo.\n\nProyecto: ${o.project}\nÁrea: ${o.department}\nEntrega: ${o.delivery}\nDecisión necesaria: ${o.decision}\nPlazo/SLA: ${o.sla}\nEvidencia actual: ${o.evidence}\n\nPor favor, actualiza la entrega y registra la evidencia en InventOps.`,
   emailToast:email=>`Actualización preparada para ${email}.`,
   briefing:(m)=>`📍 INVENTOPS · BRIEFING PM
Actualización de la cartera · 18/07/2026

🔴 DECISIONES PRIORITARIAS
• MARKET PERU · Escalar VPN y rango IP /24 con el cliente. SLA en curso.
• NAVEPARK · Aprobar topología Oracle KVM o registrar alternativa técnica.
• TITANO · Confirmar ventana de pruebas SAT tras estabilización del Sensor X.

🔄 HANDOFFS
• QUELUZ · ESP → WCS · especificación funcional esperando aceite.
• BP · IMP → POS · disponibilidad de Go Live prevista para 18/07.

📊 CARTERA
• ${m.projects} proyectos · ${m.deliveries} entregas mapeadas.
• ${m.attention} reclamos prioritarios aún abiertos.
• 100% de las acciones tienen responsable corporativo.

Fuente: InventOps · datos rastreables por proyecto, área y evidencia.`,
   briefingToast:"Briefing PM copiado al portapapeles.",
   heroTag:"CENTRAL DE GOBERNANZA · PM",heroTitle:"Una fila única para mover toda la cartera.",heroBody:"InventOps cruza entregas, dependencias y evidencias de los proyectos y muestra exactamente a quién reclamar, por qué y quién está esperando.",
   integrityTag:"INTEGRIDAD DE LA CARTERA",integrityValue:"100% con responsable",integrityNote:"ningún reclamo sin contexto",genBriefing:"Generar briefing del día",
   journeyTag:"SECUENCIA DE ENTREGA",journeyTitle:"Qué ya está validado y qué viene ahora",journeyPace:"Ritmo actual: pantalla a pantalla, sin saltar etapas",check:"LISTO",closing:"EN CIERRE",
   mapped:"ENTREGAS MAPEADAS",mappedNote:p=>`${p} proyectos × 14 áreas`,priorityFollowups:"RECLAMOS PRIORITARIOS",priorityNote:"impactan hitos de la cartera",inProgress:"HANDOFFS EN CURSO",inProgressNote:"áreas pasando el testigo",noOwner:"SIN RESPONSABLE",noOwnerNote:"gobernanza íntegra",
   filters:{all:"Todos",attention:"Atención",handoffs:"Handoffs",planned:"Planificado",validating:"En validación"},recalculated:"Cartera recalculada con las últimas evidencias",
   dailyRitual:"RITUAL DIARIO DEL PM",queueTitle:"Fila de gobernanza",visibleActions:n=>`${n} acciones visibles`,
   colPriority:"Prioridad / proyecto",colDelivery:"Entrega que necesita avanzar",colArea:"Área y responsable",colDue:"Plazo / SLA",colState:"Estado",followed:"Acompañada",baseDue:d=>`Plazo base ${d}`,
   emptyTitle:"Ninguna acción en este filtro.",emptyBody:"La gobernanza está íntegra para este recorte.",
   decisionOf:"DECISIÓN DEL PM",realDependency:"Dependencia real",blockedNote:"Bloqueo materializado en el proyecto.",monitoredNote:"Monitoreada sin impedir frentes paralelos.",whoWaiting:"Quién está esperando",waitingNote:"El handoff se registrará al liberar la entrega.",evidenceAvailable:"Evidencia disponible",currentProgress:p=>`Progreso actual: ${p}%.`,responsible:"Responsable",
   openProject:"Abrir proyecto",prepareEmail:"Preparar correo",followUpRegistered:"Reclamo registrado",registerFollowUp:"Registrar reclamo",contextFooter:"La acción queda vinculada al proyecto, al área y al responsable.",
   flowTag:"FLUJO ENTRE ÁREAS",radarTitle:"Radar de handoffs",radarBody:"El fin del "+"“"+"¿alguien sabe si ya quedó listo?"+"”",
   commTag:"COMUNICACIÓN OPERATIVA",briefingTitle:"Briefing diario del PM",briefingReview:"Revisa antes de compartir. InventOps nunca envía automáticamente.",close:"Cerrar briefing",
   recipients:"DESTINATARIOS SUGERIDOS",recipientsValue:"PM, gestores de las áreas y dirección",mandatoryReview:"revisión obligatoria",copyText:"Copiar texto",openWhatsapp:"Abrir WhatsApp",openOutlook:"Abrir Outlook",briefingFooter:"El contenido permanece vinculado a la fuente oficial de la cartera.",
   mailSubjectBriefing:"InventOps · Briefing PM · 18/07/2026"},
  en:{journeyDetails:{login:"Initial experience already redesigned and validated.",home:"Main dashboard already elevated to the new visual bar.",pm:"Current screen closing with single queue, briefing and handoffs.",infra:"Next front: Mission Control and operational enforcement.",executive:"Visual closing of the leadership layer and final narrative."},
   followUpToast:owner=>`Follow-up logged for ${owner}. Central PM updated.`,
   emailSubject:(project,area)=>`InventOps · ${project} · ${area} · pending decision`,
   emailBody:(o)=>`Hi ${o.owner}.\n\nPM registered a governance action for the delivery below.\n\nProject: ${o.project}\nArea: ${o.department}\nDelivery: ${o.delivery}\nDecision needed: ${o.decision}\nDue/SLA: ${o.sla}\nCurrent evidence: ${o.evidence}\n\nPlease update the delivery and log the evidence in InventOps.`,
   emailToast:email=>`Update prepared for ${email}.`,
   briefing:(m)=>`📍 INVENTOPS · PM BRIEFING
Portfolio update · 07/18/2026

🔴 PRIORITY DECISIONS
• MARKET PERU · Escalate VPN and /24 IP range with the client. SLA in progress.
• NAVEPARK · Approve Oracle KVM topology or log the technical alternative.
• TITANO · Confirm SAT test window after Sensor X stabilization.

🔄 HANDOFFS
• QUELUZ · ESP → WCS · functional spec awaiting acceptance.
• BP · IMP → POS · Go Live readiness expected for 07/18.

📊 PORTFOLIO
• ${m.projects} projects · ${m.deliveries} mapped deliveries.
• ${m.attention} priority follow-ups still open.
• 100% of actions have a corporate owner.

Source: InventOps · traceable data by project, area and evidence.`,
   briefingToast:"PM briefing copied to clipboard.",
   heroTag:"GOVERNANCE CENTER · PM",heroTitle:"One single queue to move the whole portfolio.",heroBody:"InventOps cross-references deliveries, dependencies and evidence and shows exactly who to follow up with, why, and who's waiting.",
   integrityTag:"PORTFOLIO INTEGRITY",integrityValue:"100% with owner",integrityNote:"no follow-up without context",genBriefing:"Generate today's briefing",
   journeyTag:"DELIVERY SEQUENCE",journeyTitle:"What's already validated and what's next",journeyPace:"Current pace: screen by screen, no skipping steps",check:"CHECK",closing:"CLOSING",
   mapped:"MAPPED DELIVERIES",mappedNote:p=>`${p} projects × 14 areas`,priorityFollowups:"PRIORITY FOLLOW-UPS",priorityNote:"impact portfolio milestones",inProgress:"HANDOFFS IN PROGRESS",inProgressNote:"areas passing the baton",noOwner:"NO OWNER",noOwnerNote:"governance intact",
   filters:{all:"All",attention:"Attention",handoffs:"Handoffs",planned:"Planned",validating:"Validating"},recalculated:"Portfolio recalculated with the latest evidence",
   dailyRitual:"PM'S DAILY RITUAL",queueTitle:"Governance queue",visibleActions:n=>`${n} visible actions`,
   colPriority:"Priority / project",colDelivery:"Delivery that needs to move",colArea:"Area and owner",colDue:"Due / SLA",colState:"State",followed:"Followed up",baseDue:d=>`Base due ${d}`,
   emptyTitle:"No action in this filter.",emptyBody:"Governance is intact for this slice.",
   decisionOf:"PM'S DECISION",realDependency:"Real dependency",blockedNote:"Blocker materialized on the project.",monitoredNote:"Monitored without blocking parallel fronts.",whoWaiting:"Who's waiting",waitingNote:"The handoff will be logged once the delivery is released.",evidenceAvailable:"Available evidence",currentProgress:p=>`Current progress: ${p}%.`,responsible:"Owner",
   openProject:"Open project",prepareEmail:"Prepare e-mail",followUpRegistered:"Follow-up logged",registerFollowUp:"Log follow-up",contextFooter:"The action stays linked to the project, the area and the owner.",
   flowTag:"FLOW BETWEEN AREAS",radarTitle:"Handoff radar",radarBody:"The end of "+"“"+"does anyone know if it's ready?"+"”",
   commTag:"OPERATIONAL COMMUNICATION",briefingTitle:"PM's daily briefing",briefingReview:"Review before sharing. InventOps never sends automatically.",close:"Close briefing",
   recipients:"SUGGESTED RECIPIENTS",recipientsValue:"PM, area managers and leadership",mandatoryReview:"mandatory review",copyText:"Copy text",openWhatsapp:"Open WhatsApp",openOutlook:"Open Outlook",briefingFooter:"The content stays linked to the portfolio's official source.",
   mailSubjectBriefing:"InventOps · PM Briefing · 07/18/2026"},
};

export function PmControlTower({projects,onOpenProject,notify,lang="pt"}){
  const t=PM_I18N[lang]||PM_I18N.pt;
  const [queue,setQueue]=useState(()=>buildQueue(projects));
  const [filter,setFilter]=useState("all");
  const [selectedId,setSelectedId]=useState(()=>buildQueue(projects)[0]?.id);
  const [briefingOpen,setBriefingOpen]=useState(false);
  const matchFilter=(item,f)=>f==="all"?true:f==="attention"?["Crítico","Hoje"].includes(item.priority):f==="handoffs"?item.priority==="Handoff":f==="validating"?item.status==="Em validação":f==="planned"?item.priority==="Planejado":true;
  const filtered=queue.filter(item=>matchFilter(item,filter));
  const selected=queue.find(item=>item.id===selectedId)||queue[0];
  const metrics=useMemo(()=>({
    projects:projects.length,
    deliveries:projects.reduce((total,project)=>total+createProjectDeliveries(project).length,0),
    attention:queue.filter(item=>["Crítico","Hoje"].includes(item.priority)&&!item.followed).length,
    handoffs:queue.filter(item=>item.priority==="Handoff").length
  }),[projects,queue]);

  const chooseFilter=option=>{
    setFilter(option);
    const candidates=queue.filter(item=>matchFilter(item,option));
    if(candidates.length&&!candidates.some(item=>item.id===selectedId))setSelectedId(candidates[0].id);
  };
  const followUp=()=>{
    setQueue(current=>current.map(item=>item.id===selected.id?{...item,followed:true}:item));
    notify(t.followUpToast(selected.owner));
  };
  const openEmail=()=>{
    const subject=t.emailSubject(selected.project,selected.area);
    const body=t.emailBody(selected);
    window.location.href=`mailto:${selected.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    notify(t.emailToast(selected.email));
  };
  const openProject=()=>{
    const project=projects.find(item=>item.code===selected.projectCode);
    if(project)onOpenProject(project);
  };
  const briefing=t.briefing(metrics);
  const copyBriefing=async()=>{
    await navigator.clipboard.writeText(briefing);
    notify(t.briefingToast);
  };

  return <section className="page pm-page">
    <div className="pm-hero">
      <div><small>{t.heroTag}</small><h2>{t.heroTitle}</h2><p>{t.heroBody}</p></div>
      <div className="pm-hero-side"><span><ShieldCheck/><small>{t.integrityTag}</small><b>{t.integrityValue}</b><em>{t.integrityNote}</em></span><button className="primary" onClick={()=>setBriefingOpen(true)}><ClipboardText/>{t.genBriefing}</button></div>
    </div>

    <article className="journey-checklist">
      <header>
        <div>
          <small>{t.journeyTag}</small>
          <h3>{t.journeyTitle}</h3>
        </div>
        <span>{t.journeyPace}</span>
      </header>
      <div>
        {journeySteps.map(step=><section key={step.id} className={step.status}>
          <i>{step.status==="done"?<CheckCircle weight="fill"/>:step.status==="active"?<BellRinging weight="fill"/>:<ClockCountdown weight="fill"/>}</i>
          <div>
            <small>{step.status==="done"?t.check:t.closing}</small>
            <b>{step.label}</b>
            <p>{t.journeyDetails[step.id]}</p>
          </div>
        </section>)}
      </div>
    </article>

    <div className="pm-metrics">
      <article><span><FileText/></span><div><small>{t.mapped}</small><b>{metrics.deliveries}</b><em>{t.mappedNote(metrics.projects)}</em></div></article>
      <article className="attention"><span><Warning/></span><div><small>{t.priorityFollowups}</small><b>{metrics.attention}</b><em>{t.priorityNote}</em></div></article>
      <article><span><ArrowsLeftRight/></span><div><small>{t.inProgress}</small><b>{metrics.handoffs}</b><em>{t.inProgressNote}</em></div></article>
      <article><span><UsersThree/></span><div><small>{t.noOwner}</small><b>0</b><em>{t.noOwnerNote}</em></div></article>
    </div>

    <div className="pm-toolbar">
      <div><Funnel/>{Object.entries(t.filters).map(([key,label])=><button key={key} className={filter===key?"active":""} onClick={()=>chooseFilter(key)}>{label}</button>)}</div>
      <p><span/> {t.recalculated}</p>
    </div>

    <div className="pm-workspace">
      <article className="pm-queue">
        <header><div><small>{t.dailyRitual}</small><h3>{t.queueTitle}</h3></div><span>{t.visibleActions(filtered.length)}</span></header>
        <div className="pm-table">
          <div className="pm-table-head"><span>{t.colPriority}</span><span>{t.colDelivery}</span><span>{t.colArea}</span><span>{t.colDue}</span><span>{t.colState}</span></div>
          {filtered.length?filtered.map(item=><button key={item.id} className={`${selected.id===item.id?"selected":""} ${item.followed?"followed":""}`} onClick={()=>setSelectedId(item.id)}>
            <span><em className={item.priority.toLowerCase()}>{item.followed?t.followed:item.priority}</em><b>{item.project}</b><small>{item.projectCode}</small></span>
            <span><b>{item.delivery}</b><small>{item.decision}</small></span>
            <span><i>{item.area}</i><b>{item.owner}</b><small>{item.email}</small></span>
            <span><ClockCountdown/><b>{item.sla}</b><small>{t.baseDue(item.due)}</small></span>
            <span><strong>{item.progress}%</strong><small>{item.status}</small></span>
          </button>):<div className="pm-empty"><CheckCircle/><b>{t.emptyTitle}</b><small>{t.emptyBody}</small></div>}
        </div>
      </article>

      <aside className="pm-context">
        <header><span>{selected.area}</span><div><small>{selected.project} · {selected.department}</small><h3>{selected.delivery}</h3></div><em className={selected.priority.toLowerCase()}>{selected.followed?t.followed:selected.priority}</em></header>
        <section className="pm-decision"><BellRinging/><div><small>{t.decisionOf}</small><p>{selected.decision}</p></div></section>
        <dl>
          <div><dt><Warning/>{t.realDependency}</dt><dd><b>{selected.dependency}</b><small>{selected.projectStatus==="Bloqueado"?t.blockedNote:t.monitoredNote}</small></dd></div>
          <div><dt><UsersThree/>{t.whoWaiting}</dt><dd><b>{selected.waitedBy}</b><small>{t.waitingNote}</small></dd></div>
          <div><dt><FileText/>{t.evidenceAvailable}</dt><dd><b>{selected.evidence}</b><small>{t.currentProgress(selected.progress)}</small></dd></div>
          <div><dt><User/>{t.responsible}</dt><dd><b>{selected.owner}</b><small>{selected.email}</small></dd></div>
        </dl>
        <div className="pm-context-actions"><button className="ghost" onClick={openProject}><Eye/>{t.openProject}</button><button className="ghost" onClick={openEmail}><Envelope/>{t.prepareEmail}</button><button className="primary" disabled={selected.followed} onClick={followUp}><CheckCircle/>{selected.followed?t.followUpRegistered:t.registerFollowUp}</button></div>
        <footer><ShieldCheck/>{t.contextFooter}</footer>
      </aside>
    </div>

    <article className="pm-handoffs">
      <header><div><small>{t.flowTag}</small><h3>{t.radarTitle}</h3></div><p>{t.radarBody}</p></header>
      <div>{handoffs.map(item=><section className={item.tone} key={`${item.project}-${item.from}`}>
        <small>{item.project}</small><div><span>{item.from}</span><ArrowRight/><span>{item.to}</span></div><b>{item.label}</b><em>{item.state}</em>
      </section>)}</div>
    </article>

    {briefingOpen?<div className="modal-layer" onMouseDown={event=>event.target===event.currentTarget&&setBriefingOpen(false)}>
      <article className="pm-briefing" role="dialog" aria-modal="true" aria-labelledby="pm-briefing-title">
        <header><div><small>{t.commTag}</small><h2 id="pm-briefing-title">{t.briefingTitle}</h2><p>{t.briefingReview}</p></div><button onClick={()=>setBriefingOpen(false)} aria-label={t.close}><XCircle/></button></header>
        <div className="pm-briefing-recipient"><Envelope/><span><small>{t.recipients}</small><b>{t.recipientsValue}</b></span><em>{t.mandatoryReview}</em></div>
        <pre>{briefing}</pre>
        <div className="pm-briefing-actions">
          <button className="ghost" onClick={copyBriefing}><CopySimple/>{t.copyText}</button>
          <a className="whatsapp" href={`https://wa.me/?text=${encodeURIComponent(briefing)}`} target="_blank" rel="noopener noreferrer"><WhatsappLogo/>{t.openWhatsapp}</a>
          <a className="primary" href={`mailto:?subject=${encodeURIComponent(t.mailSubjectBriefing)}&body=${encodeURIComponent(briefing)}`}><Envelope/>{t.openOutlook}</a>
        </div>
        <footer><ShieldCheck/>{t.briefingFooter}</footer>
      </article>
    </div>:null}
  </section>;
}
