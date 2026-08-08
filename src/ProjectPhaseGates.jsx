import { useMemo, useState } from "react";
import {
  ArrowRight, CheckCircle, Clock, FileText, FlagCheckered, LockKey,
  ShieldCheck, User, Warning
} from "@phosphor-icons/react";

const definitions = [
  {name:"Kickoff",purpose:"Autorizar o início com escopo, responsáveis e governança definidos.",criteria:[["COM","Escopo contratado e premissas registradas","Proposta técnica aprovada"],["PMO","Termo de abertura publicado","Termo de abertura assinado"],["PCP","Cronograma macro validado","Baseline inicial"]]},
  {name:"Levantamento",purpose:"Congelar requisitos suficientes para engenharias e software avançarem.",criteria:[["EMC","Levantamento mecânico validado","Pacote de levantamento"],["EEL","Premissas elétricas aprovadas","Memorial elétrico"],["ESP","Fluxos funcionais aceitos pelo cliente","Especificação funcional"]]},
  {name:"Provisionamento",purpose:"Garantir materiais, ambiente e capacidade para execução.",criteria:[["CMP","Itens críticos contratados","Pedidos emitidos"],["INF","Arquitetura e conectividade aprovadas","Checklist de infraestrutura"],["PCP","Capacidade das equipes confirmada","Plano mestre nivelado"]]},
  {name:"Implantação",purpose:"Confirmar equipamentos montados e prontidão de campo.",criteria:[["PRD","Lotes críticos produzidos","Inspeção de qualidade"],["MON","Montagem eletromecânica liberada","Checklist de montagem"],["IMP","Plano de implantação validado","Plano de cutover"]]},
  {name:"Homologação",purpose:"Comprovar o funcionamento integrado antes do Go Live.",criteria:[["WCS","Integrações homologadas","Relatório de testes"],["PLC","Automação aprovada em SAT","Aceite técnico PLC"],["IMP","Pendências críticas zeradas","Checklist de prontidão"]]},
  {name:"Go Live",purpose:"Autorizar entrada em produção com contingência e suporte definidos.",criteria:[["IMP","Plano de virada aprovado","Ata de Go/No-Go"],["PMO","Riscos residuais aceitos","Registro de decisão"],["POS","Hypercare e escala confirmados","Plano de hypercare"]]},
  {name:"Encerramento",purpose:"Formalizar aceite, lições aprendidas e transição para sustentação.",criteria:[["POS","Transição para suporte concluída","Termo de transição"],["PMO","Lições aprendidas registradas","Ata de encerramento"],["COM","Aceite final do cliente arquivado","Termo de aceite final"]]}
];

const deliveryJourney = [
  { id:"login", label:"Login", state:"done" },
  { id:"home", label:"Home", state:"done" },
  { id:"pmo", label:"PMO", state:"done" },
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
    decidedBy:phaseIndex+1<project.phase?"PMO · Rodrigo Baruco":"—",
    decidedAt:phaseIndex+1<project.phase?`${Math.min(phaseIndex+3,7)} ago · 16:40`:"—",
    criteria:phase.criteria.map(([area,title,expected], criterionIndex) => ({
      id:`${project.code}-G${phaseIndex+1}-C${criterionIndex+1}`,
      area,
      title,
      expected,
      status:phaseIndex+1<project.phase?"Aprovado":phaseIndex+1===project.phase&&criterionIndex<2?"Aprovado":phaseIndex+1===project.phase?"Pendente":"Planejado",
      evidence:phaseIndex+1<project.phase||phaseIndex+1===project.phase&&criterionIndex<2?expected:"Pendente",
      owner:area==="PMO"?"Rodrigo Baruco":area==="INF"||area==="IMP"?"Douglas Alves":area==="WCS"?"Marcelo Sanches":"Gestor da área"
    }))
  }));
}

export function ProjectPhaseGates({project,onUpdate,notify}){
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
      "Evidência registrada e enviada para validação."
    );
  };

  const approveCriterion=(criterion)=>{
    if(criterion.evidence==="Pendente"){
      notify("Registre a evidência antes de aprovar o critério.");
      return;
    }
    const next=gates.map((gate)=>gate.id===selected.id?{...gate,criteria:gate.criteria.map((item)=>item.id===criterion.id?{...item,status:"Aprovado"}:item)}:gate);
    persist(next,"Critério aprovado pelo PMO com trilha de decisão.");
  };

  const approveGate=()=>{
    if(selected.number!==project.phase){
      notify("Somente o gate da fase atual pode ser aprovado.");
      return;
    }
    if(selected.criteria.some((item)=>item.status!=="Aprovado")){
      notify("O gate permanece bloqueado: existem critérios sem aprovação.");
      return;
    }
    const next=gates.map((gate)=>gate.id===selected.id?{...gate,status:"Aprovado",decidedBy:"PMO · Rodrigo Baruco",decidedAt:"Agora"}:gate);
    setGates(next);
    onUpdate({...project,phase:Math.min(7,project.phase+1),phaseGates:next});
    notify(`Gate ${selected.number} aprovado. Projeto avançou para a próxima fase.`);
  };

  return <div className="ppg">
    <section className="ppg-hero">
      <div>
        <small>GATES DE GOVERNANÇA</small>
        <h3>Fase só avança quando o critério de saída está provado.</h3>
        <p>Percentual não aprova gate. A decisão exige evidência, responsável e registro do PMO.</p>
      </div>
      <span><ShieldCheck/><small>FASE ATUAL</small><b>{project.phase}/7 · {definitions[project.phase-1].name}</b><em>{summary.pending} critérios pendentes</em></span>
    </section>

    <article className="journey-checklist">
      <header>
        <div>
          <small>SEQUÊNCIA DE ENTREGA</small>
          <h3>Régua de avanço do InventOps</h3>
        </div>
        <span>Governança já faz parte da jornada visível do produto</span>
      </header>
      <div>
        {deliveryJourney.map((step)=><section key={step.id} className={step.state}>
          <i>{step.state==="done"?<CheckCircle weight="fill"/>:step.state==="active"?<FlagCheckered weight="fill"/>:<Clock weight="fill"/>}</i>
          <div>
            <small>{step.state==="done"?"CHECK":step.state==="active"?"ATUAL":"PRÓXIMO"}</small>
            <b>{step.label}</b>
            <p>{step.state==="active"?"Regras de passagem e aprovação do projeto em foco agora.":step.state==="next"?"Última camada: fechamento executivo e publicação.":"Etapa já consolidada na jornada principal."}</p>
          </div>
        </section>)}
      </div>
    </article>

    <div className="ppg-rail">{gates.map((gate)=><button key={gate.id} className={`${gate.status.toLowerCase().replace(" ","-")} ${selected.id===gate.id?"selected":""}`} onClick={()=>setSelectedGateId(gate.id)}>
      <span>{gate.status==="Aprovado"?<CheckCircle weight="fill"/>:gate.number}</span><div><small>FASE {gate.number}</small><b>{gate.name}</b></div><em>{gate.status}</em>{gate.number<7?<ArrowRight/>:null}
    </button>)}</div>

    <div className="ppg-workspace">
      <article className="ppg-gate">
        <header><div><small>GATE {selected.number} · {selected.status.toUpperCase()}</small><h3>{selected.name}</h3><p>{selected.purpose}</p></div><span><b>{readiness}%</b><small>prontidão</small></span></header>
        <div className="ppg-progress"><i><em style={{width:`${readiness}%`}}/></i><span>{approved}/{selected.criteria.length} critérios aprovados</span></div>
        <div className="ppg-criteria">{selected.criteria.map((criterion)=><section key={criterion.id} className={criterion.status.toLowerCase().replace(" ","-")}>
          <header><span>{criterion.area}</span><div><b>{criterion.title}</b><small><User/>{criterion.owner}</small></div><em>{criterion.status}</em></header>
          <dl><div><dt>Evidência esperada</dt><dd>{criterion.expected}</dd></div><div><dt>Evidência registrada</dt><dd className={criterion.evidence==="Pendente"?"pending":""}>{criterion.evidence}</dd></div></dl>
          <footer><button className="ghost" disabled={selected.status==="Aprovado"||criterion.status==="Aprovado"} onClick={()=>registerEvidence(criterion)}><FileText/>Registrar evidência</button><button className="primary" disabled={selected.status==="Aprovado"||criterion.status==="Aprovado"} onClick={()=>approveCriterion(criterion)}><CheckCircle/>Aprovar critério</button></footer>
        </section>)}</div>
      </article>

      <aside className="ppg-decision">
        <header><FlagCheckered/><div><small>DECISÃO DO GATE</small><h3>{selected.status==="Aprovado"?"Gate aprovado":"Aguardando critérios"}</h3></div></header>
        {selected.status==="Aprovado"
          ? <div className="ppg-approved"><CheckCircle weight="fill"/><p><b>Decisão registrada</b><span>{selected.decidedBy}</span><small>{selected.decidedAt}</small></p></div>
          : <div className="ppg-block"><Warning/><p><b>{selected.criteria.length-approved} critérios impedem o avanço</b><span>O projeto continua executando atividades paralelas, mas não muda de fase.</span></p></div>}
        <dl><div><dt><Clock/>Revisão</dt><dd>{selected.number===project.phase?"Diária":"Por gate"}</dd></div><div><dt><LockKey/>Regra</dt><dd>100% dos critérios aprovados</dd></div><div><dt><ShieldCheck/>Aprovador</dt><dd>PMO responsável</dd></div></dl>
        <button className="primary" disabled={selected.status==="Aprovado"} onClick={approveGate}><FlagCheckered/>{selected.status==="Aprovado"?"Gate concluído":"Aprovar gate e avançar"}</button>
        <footer><ShieldCheck/>A decisão gera histórico auditável no projeto.</footer>
      </aside>
    </div>
  </div>;
}
