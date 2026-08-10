import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowSquareOut,
  CheckCircle,
  CheckSquare,
  ClipboardText,
  MapPin,
  PencilSimple,
  ShieldCheck,
  User,
  Warning,
  XCircle,
} from "@phosphor-icons/react";
import { StatusReportModal } from "./FoundationModules";
import { ProjectDeliveryMatrix } from "./ProjectDeliveryMatrix";
import { ProjectActivityPlanner } from "./ProjectActivityPlanner";
import { ProjectPhaseGates } from "./ProjectPhaseGates";

const defaultActivities = project => [
  {
    id: `${project.code}-1`,
    name: "Validar arquitetura e premissas técnicas",
    area: "EMC",
    owner: "Daiana",
    due: "15 jul",
    status: "Concluído",
    evidence: "Documento REV4",
  },
  {
    id: `${project.code}-2`,
    name: "Provisionar servidores e acessos",
    area: "INF",
    owner: "Ivan",
    due: "18 jul",
    status: "Em andamento",
    evidence: "Checklist 4/5",
  },
  {
    id: `${project.code}-3`,
    name: "Configurar VPN site-to-site",
    area: "INF",
    owner: "Jonathan",
    due: "19 jul",
    status: "Aguardando",
    evidence: "Ticket #3278268",
  },
  {
    id: `${project.code}-4`,
    name: "Executar testes de integração",
    area: "WCS",
    owner: "Matheus",
    due: "24 jul",
    status: "Não iniciado",
    evidence: "0/12 testes",
  },
  {
    id: `${project.code}-5`,
    name: "Preparar plano de Go Live",
    area: "IMP",
    owner: "Fabio",
    due: "26 jul",
    status: "Não iniciado",
    evidence: "Modelo pendente",
  },
];

const defaultAudit = project => [
  {
    id: 1,
    time: "11 jul · 21:38",
    actor: "Admin InventOps",
    action: "Atualizou o próximo marco",
    detail: `${project.next} · ${project.date}`,
    type: "alteração",
  },
  {
    id: 2,
    time: "11 jul · 20:54",
    actor: "Daiana Costa",
    action: "Anexou evidência técnica",
    detail: "Documento REV4 aprovado",
    type: "evidência",
  },
  {
    id: 3,
    time: "11 jul · 19:42",
    actor: "Sistema",
    action: "Recalculou o progresso",
    detail: `Resultado validado: ${project.progress}%`,
    type: "automação",
  },
  {
    id: 4,
    time: "10 jul · 17:15",
    actor: "PM",
    action: "Gerou Status Report",
    detail: "Comunicação preparada para diretoria",
    type: "comunicação",
  },
];

const emptyBlock = { blockCategory: "", blockOwner: "", unblockForecast: "" };
const corporateDirectory = {
  Daiana: "daiana.costa@invent-corp.com",
  "Daiana Costa": "daiana.costa@invent-corp.com",
};

const corporateEmail = name =>
  corporateDirectory[name] ||
  `${(name || "responsavel")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, ".")}@invent-corp.com`;

function Badge({ children, tone = "default" }) {
  return <span className={`pcm-badge ${tone}`}>{children}</span>;
}

const PCM_I18N={
  pt:{risk:"Risco",health:"SAÚDE",progress:"PROGRESSO",phase:"FASE",closeProject:"Fechar projeto",
   tabs:{sheet:"Ficha técnica",deliveries:"Entregas por área",phases:"Fases & Gates",activities:"Plano integrado",audit:"Histórico & comunicação"},sections:"Seções do projeto",
   sheetTag:"FICHA DO PROJETO",sheetTitle:"Informações de governança",editSheet:"Editar ficha",
   projectName:"Nome do projeto",client:"Cliente",location:"Localização",owner:"Responsável",status:"Status",riskLabel:"Risco",healthLabel:"Saúde",calculatedProgress:"Progresso calculado",
   statusOptions:["Em andamento","Bloqueado","Concluído","Stand-by"],riskOptions:["Baixo","Médio","Alto"],
   blockPlanRequired:"Plano de desbloqueio obrigatório",blockPlanNote:"Um projeto bloqueado não pode ser salvo sem dono, ação e previsão.",
   category:"Categoria",select:"Selecionar",categoryOptions:["Cliente","Hardware","Infraestrutura","Engenharia","Fornecedor"],resolutionOwner:"Dono da resolução",forecast:"Previsão",nextAction:"Próxima ação",
   cancel:"Cancelar",saveChanges:"Salvar alterações",
   pm:"PM",nextMilestone:"Próximo marco",
   explainableProgress:"PROGRESSO EXPLICÁVEL",withEvidence:"com evidência",
   evidenceLabels:["Entregáveis","Checklists","Commits válidos","Testes aprovados"],
   nextFollowUp:"PRÓXIMA COBRANÇA",unblockProject:"Desbloquear projeto",moveProject:"Mover o projeto",registerFollowUp:"Registrar cobrança",
   followUpAction:"Registrou uma cobrança",followUpToast:owner=>`Cobrança registrada para ${owner}.`,
   auditTag:"TRILHA DE AUDITORIA",auditTitle:"Histórico imutável do projeto",commsTag:"COMUNICAÇÕES",commsTitle:"Status Reports gerados",
   commsSeed:[["11 jul · 17:15","Diretoria · WhatsApp","Preparado"],["10 jul · 09:20","PM · E-mail HTML","Registrado"],["08 jul · 18:04","Equipe técnica · E-mail","Registrado"]],
   exportHistory:"Exportar histórico",exportToast:"Histórico de comunicações exportado com sucesso.",
   auditFooter:"Todas as alterações geram trilha de auditoria.",statusReport:"Status Report",openFull:"Abrir Central Completa",completeReview:"Concluir revisão",
   savedToast:"Projeto atualizado com validações de governança e registro de auditoria.",updatedSheetAction:"Atualizou a ficha do projeto",closedToast:"Projeto fechado. Alterações preservadas na sessão.",
   errName:"Informe o nome do projeto.",errOwner:"Defina o responsável.",errCategory:"Selecione a categoria do bloqueio.",errBlockOwner:"Defina o dono da resolução.",errNextAction:"Registre a próxima ação obrigatória.",errForecast:"Informe a previsão de desbloqueio.",now:"Agora"},
  es:{risk:"Riesgo",health:"SALUD",progress:"PROGRESO",phase:"FASE",closeProject:"Cerrar proyecto",
   tabs:{sheet:"Ficha técnica",deliveries:"Entregas por área",phases:"Fases y Gates",activities:"Plan integrado",audit:"Historial y comunicación"},sections:"Secciones del proyecto",
   sheetTag:"FICHA DEL PROYECTO",sheetTitle:"Información de gobernanza",editSheet:"Editar ficha",
   projectName:"Nombre del proyecto",client:"Cliente",location:"Ubicación",owner:"Responsable",status:"Estado",riskLabel:"Riesgo",healthLabel:"Salud",calculatedProgress:"Progreso calculado",
   statusOptions:["En curso","Bloqueado","Concluido","Stand-by"],riskOptions:["Bajo","Medio","Alto"],
   blockPlanRequired:"Plan de desbloqueo obligatorio",blockPlanNote:"Un proyecto bloqueado no puede guardarse sin dueño, acción y previsión.",
   category:"Categoría",select:"Seleccionar",categoryOptions:["Cliente","Hardware","Infraestructura","Ingeniería","Proveedor"],resolutionOwner:"Dueño de la resolución",forecast:"Previsión",nextAction:"Próxima acción",
   cancel:"Cancelar",saveChanges:"Guardar cambios",
   pm:"PM",nextMilestone:"Próximo hito",
   explainableProgress:"PROGRESO EXPLICABLE",withEvidence:"con evidencia",
   evidenceLabels:["Entregables","Checklists","Commits válidos","Pruebas aprobadas"],
   nextFollowUp:"PRÓXIMO RECLAMO",unblockProject:"Desbloquear proyecto",moveProject:"Mover el proyecto",registerFollowUp:"Registrar reclamo",
   followUpAction:"Registró un reclamo",followUpToast:owner=>`Reclamo registrado para ${owner}.`,
   auditTag:"RASTRO DE AUDITORÍA",auditTitle:"Historial inmutable del proyecto",commsTag:"COMUNICACIONES",commsTitle:"Status Reports generados",
   commsSeed:[["11 jul · 17:15","Dirección · WhatsApp","Preparado"],["10 jul · 09:20","PM · Correo HTML","Registrado"],["08 jul · 18:04","Equipo técnico · Correo","Registrado"]],
   exportHistory:"Exportar historial",exportToast:"Historial de comunicaciones exportado con éxito.",
   auditFooter:"Todos los cambios generan un rastro de auditoría.",statusReport:"Status Report",openFull:"Abrir Central Completa",completeReview:"Concluir revisión",
   savedToast:"Proyecto actualizado con validaciones de gobernanza y registro de auditoría.",updatedSheetAction:"Actualizó la ficha del proyecto",closedToast:"Proyecto cerrado. Cambios preservados en la sesión.",
   errName:"Indica el nombre del proyecto.",errOwner:"Define el responsable.",errCategory:"Selecciona la categoría del bloqueo.",errBlockOwner:"Define el dueño de la resolución.",errNextAction:"Registra la próxima acción obligatoria.",errForecast:"Indica la previsión de desbloqueo.",now:"Ahora"},
  en:{risk:"Risk",health:"HEALTH",progress:"PROGRESS",phase:"PHASE",closeProject:"Close project",
   tabs:{sheet:"Technical sheet",deliveries:"Deliveries by area",phases:"Phases & Gates",activities:"Integrated plan",audit:"History & communication"},sections:"Project sections",
   sheetTag:"PROJECT SHEET",sheetTitle:"Governance information",editSheet:"Edit sheet",
   projectName:"Project name",client:"Client",location:"Location",owner:"Owner",status:"Status",riskLabel:"Risk",healthLabel:"Health",calculatedProgress:"Calculated progress",
   statusOptions:["In progress","Blocked","Done","Stand-by"],riskOptions:["Low","Medium","High"],
   blockPlanRequired:"Unblock plan required",blockPlanNote:"A blocked project can't be saved without an owner, action and forecast.",
   category:"Category",select:"Select",categoryOptions:["Client","Hardware","Infrastructure","Engineering","Supplier"],resolutionOwner:"Resolution owner",forecast:"Forecast",nextAction:"Next action",
   cancel:"Cancel",saveChanges:"Save changes",
   pm:"PM",nextMilestone:"Next milestone",
   explainableProgress:"EXPLAINABLE PROGRESS",withEvidence:"with evidence",
   evidenceLabels:["Deliverables","Checklists","Valid commits","Approved tests"],
   nextFollowUp:"NEXT FOLLOW-UP",unblockProject:"Unblock project",moveProject:"Move the project",registerFollowUp:"Log follow-up",
   followUpAction:"Logged a follow-up",followUpToast:owner=>`Follow-up logged for ${owner}.`,
   auditTag:"AUDIT TRAIL",auditTitle:"Immutable project history",commsTag:"COMMUNICATIONS",commsTitle:"Status Reports generated",
   commsSeed:[["Jul 11 · 17:15","Leadership · WhatsApp","Prepared"],["Jul 10 · 09:20","PM · HTML e-mail","Logged"],["Jul 08 · 18:04","Technical team · E-mail","Logged"]],
   exportHistory:"Export history",exportToast:"Communication history exported successfully.",
   auditFooter:"Every change generates an audit trail.",statusReport:"Status Report",openFull:"Open Full Hub",completeReview:"Complete review",
   savedToast:"Project updated with governance validations and audit log.",updatedSheetAction:"Updated the project sheet",closedToast:"Project closed. Changes preserved in the session.",
   errName:"Enter the project name.",errOwner:"Set the owner.",errCategory:"Select the blocker category.",errBlockOwner:"Set the resolution owner.",errNextAction:"Log the mandatory next action.",errForecast:"Enter the unblock forecast.",now:"Now"},
};
export function ProjectControlModal({ project, onClose, onUpdate, onOpenFull, notify, lang="pt" }) {
  const t=PCM_I18N[lang]||PCM_I18N.pt;
  const [tab, setTab] = useState("sheet");
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [draft, setDraft] = useState(() => ({ ...emptyBlock, ...project }));
  const [activities] = useState(() => project.activities || defaultActivities(project));
  const [audit, setAudit] = useState(() => project.audit || defaultAudit(project));
  const [communicationOpen, setCommunicationOpen] = useState(false);

  const progressEvidence = useMemo(
    () => ({
      deliverables: Math.round(project.progress * 0.35),
      checklists: Math.round(project.progress * 0.25),
      commits: Math.round(project.progress * 0.2),
      tests: Math.round(project.progress * 0.2),
    }),
    [project.progress],
  );

  useEffect(() => {
    const close = event => event.key === "Escape" && onClose();
    document.addEventListener("keydown", close);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", close);
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  const record = (action, detail, type = "alteração") =>
    setAudit(current => [{ id: Date.now(), time: t.now, actor: "Admin InventOps", action, detail, type }, ...current]);

  const validate = () => {
    const next = {};
    if (!draft.name?.trim()) next.name = t.errName;
    if (!draft.owner?.trim()) next.owner = t.errOwner;

    if (draft.status === "Bloqueado") {
      if (!draft.blockCategory) next.blockCategory = t.errCategory;
      if (!draft.blockOwner?.trim()) next.blockOwner = t.errBlockOwner;
      if (!draft.nextAction?.trim()) next.nextAction = t.errNextAction;
      if (!draft.unblockForecast) next.unblockForecast = t.errForecast;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = () => {
    if (!validate()) return;

    const completedProject = draft.status === "Concluído";
    const updated = {
      ...project,
      ...draft,
      progress: completedProject ? 100 : Number(draft.progress),
      health: completedProject ? 100 : Number(draft.health),
      delayDays: completedProject ? 0 : project.delayDays || 0,
      activities,
      audit: [
        {
          id: Date.now(),
          time: t.now,
          actor: "Admin InventOps",
          action: t.updatedSheetAction,
          detail: `Status: ${draft.status} · Risco: ${draft.risk}`,
          type: "alteração",
        },
        ...audit,
      ],
    };

    onUpdate(updated);
    setAudit(updated.audit);
    setEditing(false);
    notify(t.savedToast);
  };

  return (
    <div className="pcm-layer" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <section className="pcm-shell" role="dialog" aria-modal="true" aria-labelledby="pcm-title">
        <header className="pcm-header">
          <div className="pcm-symbol">{project.name.slice(0, 2)}</div>
          <div className="pcm-heading">
            <span>
              <small>{project.code}</small>
              <Badge tone={project.status === "Bloqueado" ? "danger" : "cyan"}>{project.status}</Badge>
              <Badge tone={project.risk === "Alto" ? "danger" : project.risk === "Médio" ? "yellow" : "green"}>
                {t.risk} {project.risk}
              </Badge>
            </span>
            <h2 id="pcm-title">{project.name}</h2>
            <p>
              {project.client} <i /> <MapPin /> {project.location}
            </p>
          </div>
          <div className="pcm-header-metrics">
            <span>
              <small>{t.health}</small>
              <b>{project.health}/100</b>
            </span>
            <span>
              <small>{t.progress}</small>
              <b>{project.progress}%</b>
            </span>
            <span>
              <small>{t.phase}</small>
              <b>{project.phase}/7</b>
            </span>
          </div>
          <button className="pcm-close" onClick={onClose} aria-label={t.closeProject}>
            <XCircle />
          </button>
        </header>

        <nav className="pcm-tabs" aria-label={t.sections}>
          {[
            ["sheet", t.tabs.sheet],
            ["deliveries", t.tabs.deliveries],
            ["phases", t.tabs.phases],
            ["activities", t.tabs.activities],
            ["audit", t.tabs.audit],
          ].map(([id, label]) => (
            <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>
              {label}
              {id === "deliveries" ? <em>14</em> : null}
              {id === "phases" ? <em>7</em> : null}
              {id === "activities" ? <em>{project.activityPlan?.length || 42}</em> : null}
              {id === "audit" ? <em>{audit.length}</em> : null}
            </button>
          ))}
        </nav>

        <div className="pcm-content">
          {tab === "sheet" ? (
            <div className="pcm-sheet">
              <article className="pcm-main-card">
                <div className="pcm-section-title">
                  <div>
                    <small>{t.sheetTag}</small>
                    <h3>{t.sheetTitle}</h3>
                  </div>
                  {!editing ? (
                    <button className="ghost" onClick={() => setEditing(true)}>
                      <PencilSimple />
                      {t.editSheet}
                    </button>
                  ) : null}
                </div>

                {editing ? (
                  <div className="pcm-form">
                    <label className={errors.name ? "error" : ""}>
                      {t.projectName}
                      <input value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} />
                      <small>{errors.name}</small>
                    </label>
                    <label>
                      {t.client}
                      <input value={draft.client || ""} onChange={event => setDraft({ ...draft, client: event.target.value })} />
                    </label>
                    <label>
                      {t.location}
                      <input value={draft.location || ""} onChange={event => setDraft({ ...draft, location: event.target.value })} />
                    </label>
                    <label className={errors.owner ? "error" : ""}>
                      {t.owner}
                      <select value={draft.owner} onChange={event => setDraft({ ...draft, owner: event.target.value })}>
                        <option>Daiana Costa</option>
                        <option>Rodrigo Baruco</option>
                        <option>Admin InventOps</option>
                        <option>Ivan</option>
                      </select>
                      <small>{errors.owner}</small>
                    </label>
                    <label>
                      {t.status}
                      <select value={draft.status} onChange={event => setDraft({ ...draft, status: event.target.value })}>
                        <option>Em andamento</option>
                        <option>Bloqueado</option>
                        <option>Concluído</option>
                        <option>Stand-by</option>
                      </select>
                    </label>
                    <label>
                      {t.riskLabel}
                      <select value={draft.risk} onChange={event => setDraft({ ...draft, risk: event.target.value })}>
                        <option>Baixo</option>
                        <option>Médio</option>
                        <option>Alto</option>
                      </select>
                    </label>
                    <label>
                      {t.healthLabel}
                      <input type="number" min="0" max="100" value={draft.health} onChange={event => setDraft({ ...draft, health: event.target.value })} />
                    </label>
                    <label>
                      {t.calculatedProgress}
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={draft.status === "Concluído" ? 100 : draft.progress}
                        disabled={draft.status === "Concluído"}
                        onChange={event => setDraft({ ...draft, progress: event.target.value })}
                      />
                    </label>

                    {draft.status === "Bloqueado" ? (
                      <div className="pcm-block-fields">
                        <div>
                          <Warning />
                          <span>
                            <b>{t.blockPlanRequired}</b>
                            <small>{t.blockPlanNote}</small>
                          </span>
                        </div>
                        <label className={errors.blockCategory ? "error" : ""}>
                          {t.category}
                          <select value={draft.blockCategory} onChange={event => setDraft({ ...draft, blockCategory: event.target.value })}>
                            <option value="">{t.select}</option>
                            <option>Cliente</option>
                            <option>Hardware</option>
                            <option>Infraestrutura</option>
                            <option>Engenharia</option>
                            <option>Fornecedor</option>
                          </select>
                          <small>{errors.blockCategory}</small>
                        </label>
                        <label className={errors.blockOwner ? "error" : ""}>
                          {t.resolutionOwner}
                          <input value={draft.blockOwner} onChange={event => setDraft({ ...draft, blockOwner: event.target.value })} />
                          <small>{errors.blockOwner}</small>
                        </label>
                        <label className={errors.unblockForecast ? "error" : ""}>
                          {t.forecast}
                          <input type="date" value={draft.unblockForecast} onChange={event => setDraft({ ...draft, unblockForecast: event.target.value })} />
                          <small>{errors.unblockForecast}</small>
                        </label>
                        <label className={`wide ${errors.nextAction ? "error" : ""}`}>
                          {t.nextAction}
                          <textarea value={draft.nextAction} onChange={event => setDraft({ ...draft, nextAction: event.target.value })} />
                          <small>{errors.nextAction}</small>
                        </label>
                      </div>
                    ) : null}

                    <div className="pcm-form-actions">
                      <button
                        className="ghost"
                        onClick={() => {
                          setEditing(false);
                          setDraft({ ...emptyBlock, ...project });
                          setErrors({});
                        }}
                      >
                        {t.cancel}
                      </button>
                      <button className="primary" onClick={save}>
                        <CheckCircle />
                        {t.saveChanges}
                      </button>
                    </div>
                  </div>
                ) : (
                  <dl className="pcm-definition">
                    <div><dt>{t.client}</dt><dd>{project.client}</dd></div>
                    <div><dt>{t.location}</dt><dd>{project.location}</dd></div>
                    <div><dt>{t.owner}</dt><dd>{project.owner}</dd></div>
                    <div><dt>{t.pm}</dt><dd>{project.pm}</dd></div>
                    <div><dt>{t.nextMilestone}</dt><dd>{project.next} · {project.date}</dd></div>
                    <div><dt>{t.nextAction}</dt><dd>{project.nextAction}</dd></div>
                  </dl>
                )}
              </article>

              <aside className="pcm-side-column">
                <article>
                  <div className="pcm-section-title">
                    <div>
                      <small>{t.explainableProgress}</small>
                      <h3>{project.progress}% {t.withEvidence}</h3>
                    </div>
                    <ShieldCheck />
                  </div>
                  <div className="pcm-evidence-bars">
                    {[
                      [t.evidenceLabels[0], progressEvidence.deliverables, 35],
                      [t.evidenceLabels[1], progressEvidence.checklists, 25],
                      [t.evidenceLabels[2], progressEvidence.commits, 20],
                      [t.evidenceLabels[3], progressEvidence.tests, 20],
                    ].map(([name, value, weight]) => (
                      <span key={name}>
                        <small>{name}</small>
                        <b>{value}/{weight}</b>
                        <i><em style={{ width: `${Math.min(100, (value / weight) * 100)}%` }} /></i>
                      </span>
                    ))}
                  </div>
                </article>

                <article className={project.status === "Bloqueado" ? "pcm-alert-card" : ""}>
                  <div className="pcm-section-title">
                    <div>
                      <small>{t.nextFollowUp}</small>
                      <h3>{project.status === "Bloqueado" ? t.unblockProject : t.moveProject}</h3>
                    </div>
                    {project.status === "Bloqueado" ? <Warning /> : <CheckSquare />}
                  </div>
                  <p>{project.nextAction}</p>
                  <span><User />{project.owner}</span>
                  <button
                    className="primary"
                    onClick={() => {
                      record(t.followUpAction, project.nextAction, "comunicação");
                      notify(t.followUpToast(project.owner));
                    }}
                  >
                    {t.registerFollowUp}
                  </button>
                </article>
              </aside>
            </div>
          ) : null}

          {tab === "deliveries" ? <ProjectDeliveryMatrix project={project} onUpdate={onUpdate} notify={notify} lang={lang} /> : null}
          {tab === "phases" ? <ProjectPhaseGates project={project} onUpdate={onUpdate} notify={notify} lang={lang} /> : null}
          {tab === "activities" ? <ProjectActivityPlanner project={project} onUpdate={onUpdate} notify={notify} lang={lang} /> : null}

          {tab === "audit" ? (
            <div className="pcm-audit">
              <article>
                <div className="pcm-section-title">
                  <div>
                    <small>{t.auditTag}</small>
                    <h3>{t.auditTitle}</h3>
                  </div>
                  <ShieldCheck />
                </div>
                <div className="pcm-audit-list">
                  {audit.map(item => (
                    <div key={item.id}>
                      <span className={`type-${item.type}`}>{item.type}</span>
                      <div>
                        <b>{item.action}</b>
                        <p>{item.detail}</p>
                        <small>{item.actor} · {item.time}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <aside>
                <div className="pcm-section-title">
                  <div>
                    <small>{t.commsTag}</small>
                    <h3>{t.commsTitle}</h3>
                  </div>
                  <ClipboardText />
                </div>
                <div className="pcm-comms">
                  {t.commsSeed.map(([time,note,state])=><span key={time}><b>{time}</b><small>{note}</small><em>{state}</em></span>)}
                </div>
                <button className="ghost" onClick={() => notify(t.exportToast)}>
                  <ClipboardText />
                  {t.exportHistory}
                </button>
              </aside>
            </div>
          ) : null}
        </div>

        <footer className="pcm-footer">
          <span><ShieldCheck />{t.auditFooter}</span>
          <button className="ghost" onClick={() => setCommunicationOpen(true)}>
            <ClipboardText />
            {t.statusReport}
          </button>
          <button className="ghost" onClick={onOpenFull}>
            {t.openFull}
            <ArrowSquareOut />
          </button>
          <button
            className="primary"
            onClick={() => {
              onClose();
              notify(t.closedToast);
            }}
          >
            {t.completeReview}
            <ArrowRight />
          </button>
        </footer>
      </section>

      {communicationOpen ? (
        <StatusReportModal
          project={{ ...project, ownerEmail: project.ownerEmail || corporateEmail(project.owner) }}
          onClose={() => setCommunicationOpen(false)}
          notify={notify}
          lang={lang}
        />
      ) : null}
    </div>
  );
}
