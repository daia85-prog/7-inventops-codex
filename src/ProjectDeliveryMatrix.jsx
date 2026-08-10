import { useMemo, useState } from "react";
import {
  ArrowRight,
  Buildings,
  CheckCircle,
  Clock,
  Envelope,
  FileText,
  LinkSimple,
  User,
  Warning,
} from "@phosphor-icons/react";

const directory = {
  COM: ["Comercial / Concept", "André Mota"],
  PM: ["PM / Governança", "Rodrigo Baruco"],
  PCP: ["Planejamento e Controle", "Weslley Silva"],
  CMP: ["Compras / Importação", "Claudia Duarte"],
  EMC: ["Engenharia Mecânica", "Gustavo Pereira"],
  EEL: ["Engenharia Elétrica", "Gustavo Pereira"],
  PRD: ["Produção", "Flavio Moreno"],
  MON: ["Montagem", "Rojekson Souza"],
  INF: ["Infraestrutura de TI", "Admin Invent"],
  ESP: ["Especificação de Software", "Thomas"],
  WCS: ["WCS Velox", "Marcelo Sanches"],
  IMP: ["Implantação", "Daniel"],
  PLC: ["Automação / PLC", "Gustavo Pereira"],
  POS: ["Pós-vendas", "Caique Fracaro"],
};

const template = [
  ["COM", "Escopo comercial validado", "Concluída", "100%", "12 jul", "Proposta técnica aprovada", "—", "PM recebe premissas contratuais"],
  ["PM", "Baseline e governança do projeto", "Em andamento", "82%", "15 jul", "Termo de abertura REV3", "Escopo comercial validado", "PCP consolida o plano mestre"],
  ["PCP", "Plano mestre integrado", "Em andamento", "68%", "18 jul", "Cronograma com 7 fases", "Baseline aprovada", "Compras e engenharias trabalham em paralelo"],
  ["CMP", "Itens críticos contratados", "Em risco", "54%", "22 jul", "8 de 12 pedidos emitidos", "Lista crítica de materiais", "Produção recebe os componentes"],
  ["EMC", "Desenhos mecânicos liberados", "Em paralelo", "76%", "19 jul", "Pacote CAD REV4", "Premissas técnicas", "Produção inicia lotes liberados"],
  ["EEL", "Diagramas elétricos liberados", "Em paralelo", "71%", "19 jul", "Diagrama unifilar REV2", "Premissas técnicas", "Montagem recebe painéis"],
  ["PRD", "Equipamentos produzidos", "Em andamento", "61%", "26 jul", "14 de 23 conjuntos finalizados", "Desenhos liberados por lote", "Montagem recebe lotes concluídos"],
  ["MON", "Montagem eletromecânica", "Em andamento", "47%", "30 jul", "Checklist 31 de 66", "Lotes liberados por Produção", "PLC inicia parametrização local"],
  ["INF", "Ambiente e conectividade disponíveis", "Aguardando", "80%", "20 jul", "Checklist 4 de 5", "Liberação de VPN pelo cliente", "WCS acessa ambiente homologado"],
  ["ESP", "Especificação funcional aprovada", "Em validação", "88%", "18 jul", "Documento funcional REV5", "Fluxos do cliente validados", "WCS conclui regras de negócio"],
  ["WCS", "Integrações e software homologados", "Em paralelo", "64%", "25 jul", "12 commits válidos e 7 testes", "Ambiente INF + especificação", "Implantação recebe versão homologada"],
  ["IMP", "Plano e prontidão de implantação", "Planejada", "35%", "29 jul", "Plano de cutover REV1", "Infra e montagem mínimas", "PLC e operação executam comissionamento"],
  ["PLC", "Programa e testes de automação", "Em paralelo", "58%", "27 jul", "21 de 36 testes aprovados", "Painéis montados por lote", "IMP recebe aceite de automação"],
  ["POS", "Transição para sustentação", "Planejada", "12%", "05 ago", "Plano de hypercare iniciado", "Go-live aprovado", "Operação entra em hypercare"],
];

const tones = {
  Concluída: "done",
  "Em andamento": "active",
  "Em paralelo": "parallel",
  Aguardando: "waiting",
  "Em risco": "risk",
  Planejada: "planned",
  "Em validação": "validation",
};

const emailFor = name =>
  `${name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ".")}@invent-corp.com`;

export function createProjectDeliveries(project) {
  if (project.departmentDeliveries?.length) return project.departmentDeliveries;

  return template.map(([area, delivery, status, progress, due, evidence, dependency, handoff], index) => {
    const [department, owner] = directory[area];
    const projectOffset = (project.progress || 64) - 64;
    const adjustedProgress = Math.max(4, Math.min(100, Number(progress.replace("%", "")) + projectOffset));
    const isProjectBlocker =
      project.status === "Bloqueado" &&
      ((project.name === "MARKET PERU" && area === "INF") || (project.name === "NAVEPARK" && area === "INF"));

    return {
      id: `${project.code}-${area}`,
      area,
      department,
      owner,
      email: emailFor(owner),
      delivery,
      status: isProjectBlocker ? "Em risco" : status,
      progress: isProjectBlocker ? Math.min(adjustedProgress, 42) : adjustedProgress,
      due,
      evidence,
      dependency,
      handoff,
      updated: index < 4 ? "Hoje" : index < 10 ? "Ontem" : "Planejado",
    };
  });
}

const PDM_I18N={
  pt:{statusLabels:{Concluída:"Concluída","Em andamento":"Em andamento","Em paralelo":"Em paralelo",Aguardando:"Aguardando","Em risco":"Em risco",Planejada:"Planejada","Em validação":"Em validação"},
   filters:{Todas:"Todas","Em andamento":"Em andamento","Em paralelo":"Em paralelo",Atenção:"Atenção",Planejada:"Planejada"},
   heroTag:"CONTROLE MATRICIAL DO PROJETO",heroTitle:"Entregas por área, sem perder o trabalho paralelo",heroBody:"Cada área responde por uma entrega verificável. Uma atividade só bloqueia outra quando existe dependência técnica real.",connectedAreas:"áreas conectadas",
   avgProgress:"PROGRESSO MÉDIO",completed:"CONCLUÍDAS",withEvidence:"com evidência",inExecution:"EM EXECUÇÃO",includesParallel:"inclui paralelo",needAttention:"EXIGEM ATENÇÃO",riskOrWait:"risco ou espera",
   evidenceSustained:"Atualização sustentada por evidência técnica",due:"Prazo",
   department:"department",progressProven:"progresso comprovado",owner:"Responsável",deliveryDue:"Prazo da entrega",updatedAt:u=>`Atualizado ${u}`,realDependency:"Dependência real",parallelNote:"Não impede outras frentes de avançarem.",monitoredByPm:"Monitorada pelo PM.",currentEvidence:"Evidência atual",evidenceSource:"Fonte do percentual apresentado.",
   nextHandoff:"PRÓXIMO HANDOFF",chargeEmail:"Cobrar por e-mail",registerEvidence:"Registrar evidência",completeDelivery:"Concluir entrega",
   updatedToday:"Hoje",updatedYesterday:"Ontem",updatedPlanned:"Planejado",
   evidencePrompt:"Qual evidência foi registrada?",noEvidence:"Sem evidência",evidenceRegisteredToast:"Evidência registrada e vinculada à entrega.",registerFirstToast:"Registre uma evidência antes de concluir a entrega.",completedToast:"Entrega concluída com evidência e trilha de auditoria.",chargeToast:email=>`Cobrança preparada para ${email}.`},
  es:{statusLabels:{Concluída:"Concluida","Em andamento":"En curso","Em paralelo":"En paralelo",Aguardando:"Esperando","Em risco":"En riesgo",Planejada:"Planificada","Em validação":"En validación"},
   filters:{Todas:"Todas","Em andamento":"En curso","Em paralelo":"En paralelo",Atenção:"Atención",Planejada:"Planificada"},
   heroTag:"CONTROL MATRICIAL DEL PROYECTO",heroTitle:"Entregas por área, sin perder el trabajo paralelo",heroBody:"Cada área responde por una entrega verificable. Una actividad solo bloquea otra cuando existe una dependencia técnica real.",connectedAreas:"áreas conectadas",
   avgProgress:"PROGRESO PROMEDIO",completed:"CONCLUIDAS",withEvidence:"con evidencia",inExecution:"EN EJECUCIÓN",includesParallel:"incluye paralelo",needAttention:"REQUIEREN ATENCIÓN",riskOrWait:"riesgo o espera",
   evidenceSustained:"Actualización sustentada por evidencia técnica",due:"Plazo",
   department:"department",progressProven:"progreso comprobado",owner:"Responsable",deliveryDue:"Plazo de la entrega",updatedAt:u=>`Actualizado ${u}`,realDependency:"Dependencia real",parallelNote:"No impide que otros frentes avancen.",monitoredByPm:"Monitoreada por el PM.",currentEvidence:"Evidencia actual",evidenceSource:"Fuente del porcentaje presentado.",
   nextHandoff:"PRÓXIMO HANDOFF",chargeEmail:"Reclamar por correo",registerEvidence:"Registrar evidencia",completeDelivery:"Concluir entrega",
   updatedToday:"Hoy",updatedYesterday:"Ayer",updatedPlanned:"Planificado",
   evidencePrompt:"¿Qué evidencia fue registrada?",noEvidence:"Sin evidencia",evidenceRegisteredToast:"Evidencia registrada y vinculada a la entrega.",registerFirstToast:"Registra una evidencia antes de concluir la entrega.",completedToast:"Entrega concluida con evidencia y trazabilidad de auditoría.",chargeToast:email=>`Reclamo preparado para ${email}.`},
  en:{statusLabels:{Concluída:"Done","Em andamento":"In progress","Em paralelo":"In parallel",Aguardando:"Waiting","Em risco":"At risk",Planejada:"Planned","Em validação":"In validation"},
   filters:{Todas:"All","Em andamento":"In progress","Em paralelo":"In parallel",Atenção:"Attention",Planejada:"Planned"},
   heroTag:"PROJECT MATRIX CONTROL",heroTitle:"Deliveries by area, without losing parallel work",heroBody:"Each area is accountable for a verifiable delivery. One activity only blocks another when a real technical dependency exists.",connectedAreas:"connected areas",
   avgProgress:"AVERAGE PROGRESS",completed:"COMPLETED",withEvidence:"with evidence",inExecution:"IN EXECUTION",includesParallel:"includes parallel",needAttention:"NEED ATTENTION",riskOrWait:"risk or wait",
   evidenceSustained:"Update backed by technical evidence",due:"Due",
   department:"department",progressProven:"proven progress",owner:"Owner",deliveryDue:"Delivery due",updatedAt:u=>`Updated ${u}`,realDependency:"Real dependency",parallelNote:"Doesn't block other fronts from advancing.",monitoredByPm:"Monitored by PM.",currentEvidence:"Current evidence",evidenceSource:"Source of the shown percentage.",
   nextHandoff:"NEXT HANDOFF",chargeEmail:"Follow up by e-mail",registerEvidence:"Register evidence",completeDelivery:"Complete delivery",
   updatedToday:"Today",updatedYesterday:"Yesterday",updatedPlanned:"Planned",
   evidencePrompt:"What evidence was registered?",noEvidence:"No evidence",evidenceRegisteredToast:"Evidence registered and linked to the delivery.",registerFirstToast:"Register evidence before completing the delivery.",completedToast:"Delivery completed with evidence and audit trail.",chargeToast:email=>`Follow-up prepared for ${email}.`},
};
export function ProjectDeliveryMatrix({ project, onUpdate, notify, lang="pt" }) {
  const t=PDM_I18N[lang]||PDM_I18N.pt;
  const [deliveries, setDeliveries] = useState(() => createProjectDeliveries(project));
  const [filter, setFilter] = useState("Todas");
  const [selectedId, setSelectedId] = useState(() => createProjectDeliveries(project)[0].id);

  const selected = deliveries.find(item => item.id === selectedId) || deliveries[0];
  const filtered =
    filter === "Todas"
      ? deliveries
      : deliveries.filter(item => (filter === "Atenção" ? ["Em risco", "Aguardando"].includes(item.status) : item.status === filter));

  const summary = useMemo(
    () => ({
      completed: deliveries.filter(item => item.status === "Concluída").length,
      running: deliveries.filter(item => ["Em andamento", "Em paralelo", "Em validação"].includes(item.status)).length,
      attention: deliveries.filter(item => ["Em risco", "Aguardando"].includes(item.status)).length,
      average: Math.round(deliveries.reduce((sum, item) => sum + item.progress, 0) / deliveries.length),
    }),
    [deliveries],
  );

  const persist = (next, message) => {
    setDeliveries(next);
    onUpdate({ ...project, departmentDeliveries: next });
    notify(message);
  };

  const updateSelected = (changes, message) => {
    persist(
      deliveries.map(item => (item.id === selected.id ? { ...item, ...changes, updated: "Agora" } : item)),
      message,
    );
  };

  const chooseFilter = option => {
    setFilter(option);
    const candidates =
      option === "Todas"
        ? deliveries
        : deliveries.filter(item => (option === "Atenção" ? ["Em risco", "Aguardando"].includes(item.status) : item.status === option));

    if (candidates.length && !candidates.some(item => item.id === selectedId)) {
      setSelectedId(candidates[0].id);
    }
  };

  const updatedLabel = u => u === "Hoje" ? t.updatedToday : u === "Ontem" ? t.updatedYesterday : t.updatedPlanned;

  const registerEvidence = () => {
    const evidence = window.prompt(t.evidencePrompt, selected.evidence === "Sem evidência" ? "" : selected.evidence);
    if (!evidence?.trim()) return;
    updateSelected(
      { evidence: evidence.trim(), status: selected.status === "Planejada" ? "Em validação" : selected.status },
      t.evidenceRegisteredToast,
    );
  };

  const conclude = () => {
    if (!selected.evidence || selected.evidence === "Sem evidência") {
      notify(t.registerFirstToast);
      return;
    }
    updateSelected({ status: "Concluída", progress: 100 }, t.completedToast);
  };

  const email = () => {
    const subject = `InventOps · ${project.code} · ${selected.area} · ${selected.delivery}`;
    const body = `Olá, ${selected.owner}.\n\nA entrega abaixo está vinculada ao seu perfil no InventOps.\n\nProjeto: ${project.name}\nÁrea: ${selected.department}\nEntrega: ${selected.delivery}\nPrazo: ${selected.due}\nStatus: ${selected.status}\nDependência real: ${selected.dependency}\nEvidência atual: ${selected.evidence}\n\nPor favor, atualize a evolução e registre a evidência no InventOps.`;
    window.location.href = `mailto:${selected.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    notify(t.chargeToast(selected.email));
  };

  return (
    <div className="pdm">
      <section className="pdm-hero">
        <div>
          <small>{t.heroTag}</small>
          <h3>{t.heroTitle}</h3>
          <p>{t.heroBody}</p>
        </div>
        <span>
          <Buildings />
          <b>{deliveries.length}</b>
          <small>{t.connectedAreas}</small>
        </span>
      </section>

      <section className="pdm-summary">
        <article>
          <small>{t.avgProgress}</small>
          <b>{summary.average}%</b>
          <i><em style={{ width: `${summary.average}%` }} /></i>
        </article>
        <article>
          <small>{t.completed}</small>
          <b>{summary.completed}</b>
          <span className="success"><CheckCircle />{t.withEvidence}</span>
        </article>
        <article>
          <small>{t.inExecution}</small>
          <b>{summary.running}</b>
          <span><Clock />{t.includesParallel}</span>
        </article>
        <article className={summary.attention ? "attention" : ""}>
          <small>{t.needAttention}</small>
          <b>{summary.attention}</b>
          <span><Warning />{t.riskOrWait}</span>
        </article>
      </section>

      <div className="pdm-toolbar">
        <div>
          {["Todas", "Em andamento", "Em paralelo", "Atenção", "Planejada"].map(option => (
            <button key={option} className={filter === option ? "active" : ""} onClick={() => chooseFilter(option)}>
              {t.filters[option]}
            </button>
          ))}
        </div>
        <p><span /> {t.evidenceSustained}</p>
      </div>

      <div className="pdm-workspace">
        <section className="pdm-grid" aria-label="Entregas das áreas">
          {filtered.map(item => (
            <button
              className={`pdm-card ${tones[item.status]} ${selected.id === item.id ? "selected" : ""}`}
              key={item.id}
              onClick={() => setSelectedId(item.id)}
            >
              <header>
                <span>{item.area}</span>
                <em>{t.statusLabels[item.status]||item.status}</em>
              </header>
              <h4>{item.delivery}</h4>
              <p><User />{item.owner}</p>
              <div>
                <i><em style={{ width: `${item.progress}%` }} /></i>
                <b>{item.progress}%</b>
              </div>
              <footer>
                <small>{t.due} {item.due}</small>
                <small>{updatedLabel(item.updated)}</small>
              </footer>
            </button>
          ))}
        </section>

        <aside className="pdm-detail">
          <header>
            <span>{selected.area}</span>
            <div>
              <small>{selected.department}</small>
              <h3>{selected.delivery}</h3>
            </div>
            <em className={tones[selected.status]}>{t.statusLabels[selected.status]||selected.status}</em>
          </header>

          <div className="pdm-detail-progress">
            <span>
              <b>{selected.progress}%</b>
              <small>{t.progressProven}</small>
            </span>
            <i><em style={{ width: `${selected.progress}%` }} /></i>
          </div>

          <dl>
            <div>
              <dt><User />{t.owner}</dt>
              <dd>
                <b>{selected.owner}</b>
                <small>{selected.email}</small>
              </dd>
            </div>
            <div>
              <dt><Clock />{t.deliveryDue}</dt>
              <dd>
                <b>{selected.due}</b>
                <small>{t.updatedAt(updatedLabel(selected.updated).toLowerCase())}</small>
              </dd>
            </div>
            <div>
              <dt><LinkSimple />{t.realDependency}</dt>
              <dd>
                <b>{selected.dependency}</b>
                <small>{selected.status === "Em paralelo" ? t.parallelNote : t.monitoredByPm}</small>
              </dd>
            </div>
            <div>
              <dt><FileText />{t.currentEvidence}</dt>
              <dd>
                <b>{selected.evidence}</b>
                <small>{t.evidenceSource}</small>
              </dd>
            </div>
          </dl>

          <div className="pdm-handoff">
            <small>{t.nextHandoff}</small>
            <p>{selected.handoff}</p>
            <ArrowRight />
          </div>

          <div className="pdm-actions">
            <button className="ghost" onClick={email}>
              <Envelope />
              {t.chargeEmail}
            </button>
            <button className="ghost" onClick={registerEvidence}>
              <FileText />
              {t.registerEvidence}
            </button>
            <button className="primary" onClick={conclude}>
              <CheckCircle />
              {t.completeDelivery}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
