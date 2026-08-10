import { useMemo, useState } from "react";
import {
  ArrowRight, CheckCircle, Clock, FileText, FlagCheckered, LockKey,
  ShieldCheck, User, Warning
} from "@phosphor-icons/react";

const definitions = [
  {name:"Kickoff",purpose:"Autorizar o início com escopo, responsáveis e governança definidos.",criteria:[["COM","Escopo contratado e premissas registradas","Proposta técnica aprovada"],["PM","Termo de abertura publicado","Termo de abertura assinado"],["PCP","Cronograma macro validado","Baseline inicial"]]},
  {name:"Levantamento",purpose:"Congelar requisitos suficientes para engenharias e software avançarem.",criteria:[["EMC","Levantamento mecânico validado","Pacote de levantamento"],["EEL","Premissas elétricas aprovadas","Memorial elétrico"],["ESP","Fluxos funcionais aceitos pelo cliente","Especificação funcional"]]},
  {name:"Provisionamento",purpose:"Garantir materiais, ambiente e capacidade para execução.",criteria:[["CMP","Itens críticos contratados","Pedidos emitidos"],["INF","Arquitetura e conectividade aprovadas","Checklist de infraestrutura"],["PCP","Capacidade das equipes confirmada","Plano mestre nivelado"]]},
  {name:"Implantação",purpose:"Confirmar equipamentos montados e prontidão de campo.",criteria:[["PRD","Lotes críticos produzidos","Inspeção de qualidade"],["MON","Montagem eletromecânica liberada","Checklist de montagem"],["IMP","Plano de implantação validado","Plano de cutover"]]},
  {name:"Homologação",purpose:"Comprovar o funcionamento integrado antes do Go Live.",criteria:[["WCS","Integrações homologadas","Relatório de testes"],["PLC","Automação aprovada em SAT","Aceite técnico PLC"],["IMP","Pendências críticas zeradas","Checklist de prontidão"]]},
  {name:"Go Live",purpose:"Autorizar entrada em produção com contingência e suporte definidos.",criteria:[["IMP","Plano de virada aprovado","Ata de Go/No-Go"],["PM","Riscos residuais aceitos","Registro de decisão"],["POS","Hypercare e escala confirmados","Plano de hypercare"]]},
  {name:"Encerramento",purpose:"Formalizar aceite, lições aprendidas e transição para sustentação.",criteria:[["POS","Transição para suporte concluída","Termo de transição"],["PM","Lições aprendidas registradas","Ata de encerramento"],["COM","Aceite final do cliente arquivado","Termo de aceite final"]]}
];

const deliveryJourney = [
  { id:"login", label:"Login", state:"done" },
  { id:"home", label:"Home", state:"done" },
  { id:"pm", label:"PM", state:"done" },
  { id:"infra", label:"Infra", state:"done" },
  { id:"gates", label:"Gates", state:"active" },
  { id:"executive", label:"Executive", state:"next" }
];

function initialGates(project){
  if(project.phaseGates?.length) return project.phaseGates;
  return definitions.map((phase, phaseIndex) => ({
    id:`${project.code}-G${phaseIndex+1}`,
    number:phaseIndex+1,
    name:phase.name,
    purpose:phase.purpose,
    status:phaseIndex+1<project.phase?"Aprovado":phaseIndex+1===project.phase?"Em validação":"Planejado",
    decidedBy:phaseIndex+1<project.phase?"PM · Rodrigo Baruco":"—",
    decidedAt:phaseIndex+1<project.phase?`${Math.min(phaseIndex+3,7)} ago · 16:40`:"—",
    criteria:phase.criteria.map(([area,title,expected], criterionIndex) => ({
      id:`${project.code}-G${phaseIndex+1}-C${criterionIndex+1}`,
      area,
      title,
      expected,
      status:phaseIndex+1<project.phase?"Aprovado":phaseIndex+1===project.phase&&criterionIndex<2?"Aprovado":phaseIndex+1===project.phase?"Pendente":"Planejado",
      evidence:phaseIndex+1<project.phase||phaseIndex+1===project.phase&&criterionIndex<2?expected:"Pendente",
      owner:area==="PM"?"Rodrigo Baruco":area==="INF"?"Admin Invent":area==="IMP"?"Daniel":area==="ESP"?"Thomas":area==="WCS"?"Marcelo Sanches":"Gestor da área"
    }))
  }));
}

const PPG_I18N={
  pt:{statusLabels:{Aprovado:"Aprovado","Em validação":"Em validação",Planejado:"Planejado",Pendente:"Pendente"},
   heroTag:"GATES DE GOVERNANÇA",heroTitle:"Fase só avança quando o critério de saída está provado.",heroBody:"Percentual não aprova gate. A decisão exige evidência, responsável e registro do PM.",currentPhase:"FASE ATUAL",pendingCriteria:n=>`${n} critérios pendentes`,
   journeyTag:"SEQUÊNCIA DE ENTREGA",journeyTitle:"Régua de avanço do InventOps",journeySub:"Governança já faz parte da jornada visível do produto",check:"CHECK",current:"ATUAL",next:"PRÓXIMO",
   activeDetail:"Regras de passagem e aprovação do projeto em foco agora.",nextDetail:"Última camada: fechamento executivo e publicação.",doneDetail:"Etapa já consolidada na jornada principal.",
   phase:"FASE",readiness:"prontidão",criteriaApproved:(a,t)=>`${a}/${t} critérios aprovados`,
   expectedEvidence:"Evidência esperada",registeredEvidence:"Evidência registrada",registerEvidence:"Registrar evidência",approveCriterion:"Aprovar critério",
   gateDecision:"DECISÃO DO GATE",gateApproved:"Gate aprovado",awaitingCriteria:"Aguardando critérios",decisionRegistered:"Decisão registrada",criteriaBlock:n=>`${n} critérios impedem o avanço`,parallelNote:"O projeto continua executando atividades paralelas, mas não muda de fase.",
   review:"Revisão",daily:"Diária",perGate:"Por gate",rule:"Regra",ruleValue:"100% dos critérios aprovados",approver:"Aprovador",approverValue:"PM responsável",gateDone:"Gate concluído",approveGateBtn:"Aprovar gate e avançar",auditFooter:"A decisão gera histórico auditável no projeto.",
   evidenceRegisteredToast:"Evidência registrada e enviada para validação.",registerFirstToast:"Registre a evidência antes de aprovar o critério.",criterionApprovedToast:"Critério aprovado pelo PM com trilha de decisão.",onlyCurrentGateToast:"Somente o gate da fase atual pode ser aprovado.",gateBlockedToast:"O gate permanece bloqueado: existem critérios sem aprovação.",gateApprovedToast:n=>`Gate ${n} aprovado. Projeto avançou para a próxima fase.`,now:"Agora"},
  es:{statusLabels:{Aprovado:"Aprobado","Em validação":"En validación",Planejado:"Planificado",Pendente:"Pendiente"},
   heroTag:"GATES DE GOBERNANZA",heroTitle:"La fase solo avanza cuando el criterio de salida está probado.",heroBody:"El porcentaje no aprueba el gate. La decisión exige evidencia, responsable y registro del PM.",currentPhase:"FASE ACTUAL",pendingCriteria:n=>`${n} criterios pendientes`,
   journeyTag:"SECUENCIA DE ENTREGA",journeyTitle:"Regla de avance de InventOps",journeySub:"La gobernanza ya forma parte del recorrido visible del producto",check:"LISTO",current:"ACTUAL",next:"PRÓXIMO",
   activeDetail:"Reglas de paso y aprobación del proyecto en foco ahora.",nextDetail:"Última capa: cierre ejecutivo y publicación.",doneDetail:"Etapa ya consolidada en el recorrido principal.",
   phase:"FASE",readiness:"disponibilidad",criteriaApproved:(a,t)=>`${a}/${t} criterios aprobados`,
   expectedEvidence:"Evidencia esperada",registeredEvidence:"Evidencia registrada",registerEvidence:"Registrar evidencia",approveCriterion:"Aprobar criterio",
   gateDecision:"DECISIÓN DEL GATE",gateApproved:"Gate aprobado",awaitingCriteria:"Esperando criterios",decisionRegistered:"Decisión registrada",criteriaBlock:n=>`${n} criterios impiden el avance`,parallelNote:"El proyecto sigue ejecutando actividades paralelas, pero no cambia de fase.",
   review:"Revisión",daily:"Diaria",perGate:"Por gate",rule:"Regla",ruleValue:"100% de los criterios aprobados",approver:"Aprobador",approverValue:"PM responsable",gateDone:"Gate concluido",approveGateBtn:"Aprobar gate y avanzar",auditFooter:"La decisión genera historial auditable en el proyecto.",
   evidenceRegisteredToast:"Evidencia registrada y enviada a validación.",registerFirstToast:"Registra la evidencia antes de aprobar el criterio.",criterionApprovedToast:"Criterio aprobado por el PM con trazabilidad de decisión.",onlyCurrentGateToast:"Solo se puede aprobar el gate de la fase actual.",gateBlockedToast:"El gate permanece bloqueado: hay criterios sin aprobar.",gateApprovedToast:n=>`Gate ${n} aprobado. El proyecto avanzó a la próxima fase.`,now:"Ahora"},
  en:{statusLabels:{Aprovado:"Approved","Em validação":"In validation",Planejado:"Planned",Pendente:"Pending"},
   heroTag:"GOVERNANCE GATES",heroTitle:"A phase only advances when the exit criterion is proven.",heroBody:"A percentage doesn't approve a gate. The decision requires evidence, an owner and a PM record.",currentPhase:"CURRENT PHASE",pendingCriteria:n=>`${n} pending criteria`,
   journeyTag:"DELIVERY SEQUENCE",journeyTitle:"InventOps' advancement ruler",journeySub:"Governance is already part of the product's visible journey",check:"CHECK",current:"CURRENT",next:"NEXT",
   activeDetail:"Passage and approval rules for the project currently in focus.",nextDetail:"Last layer: executive closing and publication.",doneDetail:"Stage already consolidated in the main journey.",
   phase:"PHASE",readiness:"readiness",criteriaApproved:(a,t)=>`${a}/${t} criteria approved`,
   expectedEvidence:"Expected evidence",registeredEvidence:"Registered evidence",registerEvidence:"Register evidence",approveCriterion:"Approve criterion",
   gateDecision:"GATE DECISION",gateApproved:"Gate approved",awaitingCriteria:"Awaiting criteria",decisionRegistered:"Decision recorded",criteriaBlock:n=>`${n} criteria block progress`,parallelNote:"The project keeps running parallel activities, but doesn't change phase.",
   review:"Review",daily:"Daily",perGate:"Per gate",rule:"Rule",ruleValue:"100% of criteria approved",approver:"Approver",approverValue:"Responsible PM",gateDone:"Gate completed",approveGateBtn:"Approve gate and advance",auditFooter:"The decision generates an auditable history on the project.",
   evidenceRegisteredToast:"Evidence registered and sent for validation.",registerFirstToast:"Register the evidence before approving the criterion.",criterionApprovedToast:"Criterion approved by the PM with a decision trail.",onlyCurrentGateToast:"Only the current phase's gate can be approved.",gateBlockedToast:"The gate stays blocked: there are unapproved criteria.",gateApprovedToast:n=>`Gate ${n} approved. The project advanced to the next phase.`,now:"Now"},
};

export function ProjectPhaseGates({project,onUpdate,notify,lang="pt"}){
  const t=PPG_I18N[lang]||PPG_I18N.pt;
  const [gates,setGates]=useState(()=>initialGates(project));
  const [selectedGateId,setSelectedGateId]=useState(()=>initialGates(project)[Math.max(0,project.phase-1)].id);
  const selected=gates.find((gate)=>gate.id===selectedGateId)||gates[0];
  const approved=selected.criteria.filter((item)=>item.status==="Aprovado").length;
  const readiness=Math.round((approved/selected.criteria.length)*100);
  const currentGate=gates.find((gate)=>gate.number===project.phase);
  const summary=useMemo(()=>({
    approved:gates.filter((g)=>g.status==="Aprovado").length,
    pending:currentGate?.criteria.filter((c)=>c.status!=="Aprovado").length||0
  }),[gates,currentGate]);

  const persist=(next,message)=>{
    setGates(next);
    onUpdate({...project,phaseGates:next});
    notify(message);
  };

  const registerEvidence=(criterion)=>{
    const value=`${criterion.expected} · anexado agora`;
    persist(
      gates.map((gate)=>gate.id===selected.id?{...gate,criteria:gate.criteria.map((item)=>item.id===criterion.id?{...item,evidence:value,status:"Em validação"}:item)}:gate),
      t.evidenceRegisteredToast
    );
  };

  const approveCriterion=(criterion)=>{
    if(criterion.evidence==="Pendente"){
      notify(t.registerFirstToast);
      return;
    }
    const next=gates.map((gate)=>gate.id===selected.id?{...gate,criteria:gate.criteria.map((item)=>item.id===criterion.id?{...item,status:"Aprovado"}:item)}:gate);
    persist(next,t.criterionApprovedToast);
  };

  const approveGate=()=>{
    if(selected.number!==project.phase){
      notify(t.onlyCurrentGateToast);
      return;
    }
    if(selected.criteria.some((item)=>item.status!=="Aprovado")){
      notify(t.gateBlockedToast);
      return;
    }
    const next=gates.map((gate)=>gate.id===selected.id?{...gate,status:"Aprovado",decidedBy:"PM · Rodrigo Baruco",decidedAt:t.now}:gate);
    setGates(next);
    onUpdate({...project,phase:Math.min(7,project.phase+1),phaseGates:next});
    notify(t.gateApprovedToast(selected.number));
  };

  return <div className="ppg">
    <section className="ppg-hero">
      <div>
        <small>{t.heroTag}</small>
        <h3>{t.heroTitle}</h3>
        <p>{t.heroBody}</p>
      </div>
      <span><ShieldCheck/><small>{t.currentPhase}</small><b>{project.phase}/7 · {definitions[project.phase-1].name}</b><em>{t.pendingCriteria(summary.pending)}</em></span>
    </section>

    <article className="journey-checklist">
      <header>
        <div>
          <small>{t.journeyTag}</small>
          <h3>{t.journeyTitle}</h3>
        </div>
        <span>{t.journeySub}</span>
      </header>
      <div>
        {deliveryJourney.map((step)=><section key={step.id} className={step.state}>
          <i>{step.state==="done"?<CheckCircle weight="fill"/>:step.state==="active"?<FlagCheckered weight="fill"/>:<Clock weight="fill"/>}</i>
          <div>
            <small>{step.state==="done"?t.check:step.state==="active"?t.current:t.next}</small>
            <b>{step.label}</b>
            <p>{step.state==="active"?t.activeDetail:step.state==="next"?t.nextDetail:t.doneDetail}</p>
          </div>
        </section>)}
      </div>
    </article>

    <div className="ppg-rail">{gates.map((gate)=><button key={gate.id} className={`${gate.status.toLowerCase().replace(" ","-")} ${selected.id===gate.id?"selected":""}`} onClick={()=>setSelectedGateId(gate.id)}>
      <span>{gate.status==="Aprovado"?<CheckCircle weight="fill"/>:gate.number}</span><div><small>{t.phase} {gate.number}</small><b>{gate.name}</b></div><em>{t.statusLabels[gate.status]||gate.status}</em>{gate.number<7?<ArrowRight/>:null}
    </button>)}</div>

    <div className="ppg-workspace">
      <article className="ppg-gate">
        <header><div><small>{t.phase} {selected.number} · {(t.statusLabels[selected.status]||selected.status).toUpperCase()}</small><h3>{selected.name}</h3><p>{selected.purpose}</p></div><span><b>{readiness}%</b><small>{t.readiness}</small></span></header>
        <div className="ppg-progress"><i><em style={{width:`${readiness}%`}}/></i><span>{t.criteriaApproved(approved,selected.criteria.length)}</span></div>
        <div className="ppg-criteria">{selected.criteria.map((criterion)=><section key={criterion.id} className={criterion.status.toLowerCase().replace(" ","-")}>
          <header><span>{criterion.area}</span><div><b>{criterion.title}</b><small><User/>{criterion.owner}</small></div><em>{t.statusLabels[criterion.status]||criterion.status}</em></header>
          <dl><div><dt>{t.expectedEvidence}</dt><dd>{criterion.expected}</dd></div><div><dt>{t.registeredEvidence}</dt><dd className={criterion.evidence==="Pendente"?"pending":""}>{criterion.evidence}</dd></div></dl>
          <footer><button className="ghost" disabled={selected.status==="Aprovado"||criterion.status==="Aprovado"} onClick={()=>registerEvidence(criterion)}><FileText/>{t.registerEvidence}</button><button className="primary" disabled={selected.status==="Aprovado"||criterion.status==="Aprovado"} onClick={()=>approveCriterion(criterion)}><CheckCircle/>{t.approveCriterion}</button></footer>
        </section>)}</div>
      </article>

      <aside className="ppg-decision">
        <header><FlagCheckered/><div><small>{t.gateDecision}</small><h3>{selected.status==="Aprovado"?t.gateApproved:t.awaitingCriteria}</h3></div></header>
        {selected.status==="Aprovado"
          ? <div className="ppg-approved"><CheckCircle weight="fill"/><p><b>{t.decisionRegistered}</b><span>{selected.decidedBy}</span><small>{selected.decidedAt}</small></p></div>
          : <div className="ppg-block"><Warning/><p><b>{t.criteriaBlock(selected.criteria.length-approved)}</b><span>{t.parallelNote}</span></p></div>}
        <dl><div><dt><Clock/>{t.review}</dt><dd>{selected.number===project.phase?t.daily:t.perGate}</dd></div><div><dt><LockKey/>{t.rule}</dt><dd>{t.ruleValue}</dd></div><div><dt><ShieldCheck/>{t.approver}</dt><dd>{t.approverValue}</dd></div></dl>
        <button className="primary" disabled={selected.status==="Aprovado"} onClick={approveGate}><FlagCheckered/>{selected.status==="Aprovado"?t.gateDone:t.approveGateBtn}</button>
        <footer><ShieldCheck/>{t.auditFooter}</footer>
      </aside>
    </div>
  </div>;
}
