import { useMemo, useState } from "react";
import {
  ArrowRight, ArrowsLeftRight, BellRinging, CalendarBlank, CheckCircle,
  ClipboardText, ClockCountdown, CopySimple, Envelope, Eye, FileText, Funnel,
  ShieldCheck, User, UsersThree, Warning, WhatsappLogo, XCircle
} from "@phosphor-icons/react";
import { createProjectDeliveries } from "./ProjectDeliveryMatrix";

const focus = {
  TITANO:{area:"PLC",priority:"Hoje",decision:"Confirmar a janela de testes SAT após a estabilização do Sensor X.",waitedBy:"Implantação e operação do cliente",sla:"Hoje · 18:00"},
  QUELUZ:{area:"ESP",priority:"Handoff",decision:"Validar a especificação funcional para liberar o fechamento das regras WCS.",waitedBy:"WCS e PMO do Gate GL1",sla:"Hoje · 16:30"},
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

export function PmoControlTower({projects,onOpenProject,notify}){
  const [queue,setQueue]=useState(()=>buildQueue(projects));
  const [filter,setFilter]=useState("Todos");
  const [selectedId,setSelectedId]=useState(()=>buildQueue(projects)[0]?.id);
  const [briefingOpen,setBriefingOpen]=useState(false);
  const filtered=filter==="Todos"?queue:queue.filter(item=>
    filter==="Atenção"?["Crítico","Hoje"].includes(item.priority):
    filter==="Handoffs"?item.priority==="Handoff":
    filter==="Em validação"?item.status==="Em validação":
    item.priority===filter
  );
  const selected=queue.find(item=>item.id===selectedId)||queue[0];
  const metrics=useMemo(()=>({
    projects:projects.length,
    deliveries:projects.reduce((total,project)=>total+createProjectDeliveries(project).length,0),
    attention:queue.filter(item=>["Crítico","Hoje"].includes(item.priority)&&!item.followed).length,
    handoffs:queue.filter(item=>item.priority==="Handoff").length
  }),[projects,queue]);

  const chooseFilter=option=>{
    setFilter(option);
    const candidates=option==="Todos"?queue:queue.filter(item=>
      option==="Atenção"?["Crítico","Hoje"].includes(item.priority):
      option==="Handoffs"?item.priority==="Handoff":
      option==="Em validação"?item.status==="Em validação":
      item.priority===option
    );
    if(candidates.length&&!candidates.some(item=>item.id===selectedId))setSelectedId(candidates[0].id);
  };
  const followUp=()=>{
    setQueue(current=>current.map(item=>item.id===selected.id?{...item,followed:true}:item));
    notify(`Cobrança registrada para ${selected.owner}. A Central PMO foi atualizada.`);
  };
  const openEmail=()=>{
    const subject=`InventOps · ${selected.project} · ${selected.area} · decisão pendente`;
    const body=`Olá, ${selected.owner}.\n\nO PMO registrou uma ação de governança para a entrega abaixo.\n\nProjeto: ${selected.project}\nÁrea: ${selected.department}\nEntrega: ${selected.delivery}\nDecisão necessária: ${selected.decision}\nPrazo/SLA: ${selected.sla}\nEvidência atual: ${selected.evidence}\n\nPor favor, atualize a entrega e registre a evidência no InventOps.`;
    window.location.href=`mailto:${selected.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    notify(`Atualização preparada para ${selected.email}.`);
  };
  const openProject=()=>{
    const project=projects.find(item=>item.code===selected.projectCode);
    if(project)onOpenProject(project);
  };
  const briefing=`📍 INVENTOPS · BRIEFING PMO
Atualização da carteira · 18/07/2026

🔴 DECISÕES PRIORITÁRIAS
• MARKET PERU · Escalar VPN e range IP /24 com o cliente. SLA em curso.
• NAVEPARK · Aprovar topologia Oracle KVM ou registrar alternativa técnica.
• TITANO · Confirmar janela de testes SAT após estabilização do Sensor X.

🔄 HANDOFFS
• QUELUZ · ESP → WCS · especificação funcional aguardando aceite.
• BP · IMP → POS · prontidão de Go Live prevista para 18/07.

📊 CARTEIRA
• ${metrics.projects} projetos · ${metrics.deliveries} entregas mapeadas.
• ${metrics.attention} cobranças prioritárias ainda abertas.
• 100% das ações possuem responsável corporativo.

Fonte: InventOps · dados rastreáveis por projeto, área e evidência.`;
  const copyBriefing=async()=>{
    await navigator.clipboard.writeText(briefing);
    notify("Briefing PMO copiado para a área de transferência.");
  };

  return <section className="page pmo-page">
    <div className="pmo-hero">
      <div><small>CENTRAL DE GOVERNANÇA · PMO</small><h2>Uma fila única para mover a carteira inteira.</h2><p>O InventOps cruza entregas, dependências e evidências dos projetos e mostra exatamente quem cobrar, por quê e quem está esperando.</p></div>
      <div className="pmo-hero-side"><span><ShieldCheck/><small>INTEGRIDADE DA CARTEIRA</small><b>100% com responsável</b><em>nenhuma cobrança sem contexto</em></span><button className="primary" onClick={()=>setBriefingOpen(true)}><ClipboardText/>Gerar briefing do dia</button></div>
    </div>

    <div className="pmo-metrics">
      <article><span><FileText/></span><div><small>ENTREGAS MAPEADAS</small><b>{metrics.deliveries}</b><em>{metrics.projects} projetos × 14 áreas</em></div></article>
      <article className="attention"><span><Warning/></span><div><small>COBRANÇAS PRIORITÁRIAS</small><b>{metrics.attention}</b><em>impactam marcos da carteira</em></div></article>
      <article><span><ArrowsLeftRight/></span><div><small>HANDOFFS EM CURSO</small><b>{metrics.handoffs}</b><em>áreas passando o bastão</em></div></article>
      <article><span><UsersThree/></span><div><small>SEM RESPONSÁVEL</small><b>0</b><em>governança íntegra</em></div></article>
    </div>

    <div className="pmo-toolbar">
      <div><Funnel/>{["Todos","Atenção","Handoffs","Planejado","Em validação"].map(option=><button key={option} className={filter===option?"active":""} onClick={()=>chooseFilter(option)}>{option}</button>)}</div>
      <p><span/> Carteira recalculada com as últimas evidências</p>
    </div>

    <div className="pmo-workspace">
      <article className="pmo-queue">
        <header><div><small>RITUAL DIÁRIO DO PMO</small><h3>Fila de governança</h3></div><span>{filtered.length} ações visíveis</span></header>
        <div className="pmo-table">
          <div className="pmo-table-head"><span>Prioridade / projeto</span><span>Entrega que precisa andar</span><span>Área e responsável</span><span>Prazo / SLA</span><span>Estado</span></div>
          {filtered.length?filtered.map(item=><button key={item.id} className={`${selected.id===item.id?"selected":""} ${item.followed?"followed":""}`} onClick={()=>setSelectedId(item.id)}>
            <span><em className={item.priority.toLowerCase()}>{item.followed?"Acompanhada":item.priority}</em><b>{item.project}</b><small>{item.projectCode}</small></span>
            <span><b>{item.delivery}</b><small>{item.decision}</small></span>
            <span><i>{item.area}</i><b>{item.owner}</b><small>{item.email}</small></span>
            <span><ClockCountdown/><b>{item.sla}</b><small>Prazo base {item.due}</small></span>
            <span><strong>{item.progress}%</strong><small>{item.status}</small></span>
          </button>):<div className="pmo-empty"><CheckCircle/><b>Nenhuma ação neste filtro.</b><small>A governança está íntegra para este recorte.</small></div>}
        </div>
      </article>

      <aside className="pmo-context">
        <header><span>{selected.area}</span><div><small>{selected.project} · {selected.department}</small><h3>{selected.delivery}</h3></div><em className={selected.priority.toLowerCase()}>{selected.followed?"Acompanhada":selected.priority}</em></header>
        <section className="pmo-decision"><BellRinging/><div><small>DECISÃO DO PMO</small><p>{selected.decision}</p></div></section>
        <dl>
          <div><dt><Warning/>Dependência real</dt><dd><b>{selected.dependency}</b><small>{selected.projectStatus==="Bloqueado"?"Bloqueio materializado no projeto.":"Monitorada sem impedir frentes paralelas."}</small></dd></div>
          <div><dt><UsersThree/>Quem está esperando</dt><dd><b>{selected.waitedBy}</b><small>O handoff será registrado ao liberar a entrega.</small></dd></div>
          <div><dt><FileText/>Evidência disponível</dt><dd><b>{selected.evidence}</b><small>Progresso atual: {selected.progress}%.</small></dd></div>
          <div><dt><User/>Responsável</dt><dd><b>{selected.owner}</b><small>{selected.email}</small></dd></div>
        </dl>
        <div className="pmo-context-actions"><button className="ghost" onClick={openProject}><Eye/>Abrir projeto</button><button className="ghost" onClick={openEmail}><Envelope/>Preparar e-mail</button><button className="primary" disabled={selected.followed} onClick={followUp}><CheckCircle/>{selected.followed?"Cobrança registrada":"Registrar cobrança"}</button></div>
        <footer><ShieldCheck/>A ação fica vinculada ao projeto, à área e ao responsável.</footer>
      </aside>
    </div>

    <article className="pmo-handoffs">
      <header><div><small>FLUXO ENTRE ÁREAS</small><h3>Radar de handoffs</h3></div><p>O fim do “alguém sabe se ficou pronto?”</p></header>
      <div>{handoffs.map(item=><section className={item.tone} key={`${item.project}-${item.from}`}>
        <small>{item.project}</small><div><span>{item.from}</span><ArrowRight/><span>{item.to}</span></div><b>{item.label}</b><em>{item.state}</em>
      </section>)}</div>
    </article>

    {briefingOpen?<div className="modal-layer" onMouseDown={event=>event.target===event.currentTarget&&setBriefingOpen(false)}>
      <article className="pmo-briefing" role="dialog" aria-modal="true" aria-labelledby="pmo-briefing-title">
        <header><div><small>COMUNICAÇÃO OPERACIONAL</small><h2 id="pmo-briefing-title">Briefing diário do PMO</h2><p>Revise antes de compartilhar. O InventOps nunca envia automaticamente.</p></div><button onClick={()=>setBriefingOpen(false)} aria-label="Fechar briefing"><XCircle/></button></header>
        <div className="pmo-briefing-recipient"><Envelope/><span><small>DESTINATÁRIOS SUGERIDOS</small><b>PMO, gestores das áreas e diretoria</b></span><em>revisão obrigatória</em></div>
        <pre>{briefing}</pre>
        <div className="pmo-briefing-actions">
          <button className="ghost" onClick={copyBriefing}><CopySimple/>Copiar texto</button>
          <a className="whatsapp" href={`https://wa.me/?text=${encodeURIComponent(briefing)}`} target="_blank" rel="noopener noreferrer"><WhatsappLogo/>Abrir WhatsApp</a>
          <a className="primary" href={`mailto:?subject=${encodeURIComponent("InventOps · Briefing PMO · 18/07/2026")}&body=${encodeURIComponent(briefing)}`}><Envelope/>Abrir Outlook</a>
        </div>
        <footer><ShieldCheck/>O conteúdo permanece vinculado à fonte oficial da carteira.</footer>
      </article>
    </div>:null}
  </section>;
}
