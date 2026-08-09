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
    actor: "PMO",
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

export function ProjectControlModal({ project, onClose, onUpdate, onOpenFull, notify }) {
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
    setAudit(current => [{ id: Date.now(), time: "Agora", actor: "Admin InventOps", action, detail, type }, ...current]);

  const validate = () => {
    const next = {};
    if (!draft.name?.trim()) next.name = "Informe o nome do projeto.";
    if (!draft.owner?.trim()) next.owner = "Defina o responsável.";

    if (draft.status === "Bloqueado") {
      if (!draft.blockCategory) next.blockCategory = "Selecione a categoria do bloqueio.";
      if (!draft.blockOwner?.trim()) next.blockOwner = "Defina o dono da resolução.";
      if (!draft.nextAction?.trim()) next.nextAction = "Registre a próxima ação obrigatória.";
      if (!draft.unblockForecast) next.unblockForecast = "Informe a previsão de desbloqueio.";
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
          time: "Agora",
          actor: "Admin InventOps",
          action: "Atualizou a ficha do projeto",
          detail: `Status: ${draft.status} · Risco: ${draft.risk}`,
          type: "alteração",
        },
        ...audit,
      ],
    };

    onUpdate(updated);
    setAudit(updated.audit);
    setEditing(false);
    notify("Projeto atualizado com validações de governança e registro de auditoria.");
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
                Risco {project.risk}
              </Badge>
            </span>
            <h2 id="pcm-title">{project.name}</h2>
            <p>
              {project.client} <i /> <MapPin /> {project.location}
            </p>
          </div>
          <div className="pcm-header-metrics">
            <span>
              <small>SAÚDE</small>
              <b>{project.health}/100</b>
            </span>
            <span>
              <small>PROGRESSO</small>
              <b>{project.progress}%</b>
            </span>
            <span>
              <small>FASE</small>
              <b>{project.phase}/7</b>
            </span>
          </div>
          <button className="pcm-close" onClick={onClose} aria-label="Fechar projeto">
            <XCircle />
          </button>
        </header>

        <nav className="pcm-tabs" aria-label="Seções do projeto">
          {[
            ["sheet", "Ficha técnica"],
            ["deliveries", "Entregas por área"],
            ["phases", "Fases & Gates"],
            ["activities", "Plano integrado"],
            ["audit", "Histórico & comunicação"],
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
                    <small>FICHA DO PROJETO</small>
                    <h3>Informações de governança</h3>
                  </div>
                  {!editing ? (
                    <button className="ghost" onClick={() => setEditing(true)}>
                      <PencilSimple />
                      Editar ficha
                    </button>
                  ) : null}
                </div>

                {editing ? (
                  <div className="pcm-form">
                    <label className={errors.name ? "error" : ""}>
                      Nome do projeto
                      <input value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} />
                      <small>{errors.name}</small>
                    </label>
                    <label>
                      Cliente
                      <input value={draft.client || ""} onChange={event => setDraft({ ...draft, client: event.target.value })} />
                    </label>
                    <label>
                      Localização
                      <input value={draft.location || ""} onChange={event => setDraft({ ...draft, location: event.target.value })} />
                    </label>
                    <label className={errors.owner ? "error" : ""}>
                      Responsável
                      <select value={draft.owner} onChange={event => setDraft({ ...draft, owner: event.target.value })}>
                        <option>Daiana Costa</option>
                        <option>Rodrigo Baruco</option>
                        <option>Admin InventOps</option>
                        <option>Ivan</option>
                      </select>
                      <small>{errors.owner}</small>
                    </label>
                    <label>
                      Status
                      <select value={draft.status} onChange={event => setDraft({ ...draft, status: event.target.value })}>
                        <option>Em andamento</option>
                        <option>Bloqueado</option>
                        <option>Concluído</option>
                        <option>Stand-by</option>
                      </select>
                    </label>
                    <label>
                      Risco
                      <select value={draft.risk} onChange={event => setDraft({ ...draft, risk: event.target.value })}>
                        <option>Baixo</option>
                        <option>Médio</option>
                        <option>Alto</option>
                      </select>
                    </label>
                    <label>
                      Saúde
                      <input type="number" min="0" max="100" value={draft.health} onChange={event => setDraft({ ...draft, health: event.target.value })} />
                    </label>
                    <label>
                      Progresso calculado
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
                            <b>Plano de desbloqueio obrigatório</b>
                            <small>Um projeto bloqueado não pode ser salvo sem dono, ação e previsão.</small>
                          </span>
                        </div>
                        <label className={errors.blockCategory ? "error" : ""}>
                          Categoria
                          <select value={draft.blockCategory} onChange={event => setDraft({ ...draft, blockCategory: event.target.value })}>
                            <option value="">Selecionar</option>
                            <option>Cliente</option>
                            <option>Hardware</option>
                            <option>Infraestrutura</option>
                            <option>Engenharia</option>
                            <option>Fornecedor</option>
                          </select>
                          <small>{errors.blockCategory}</small>
                        </label>
                        <label className={errors.blockOwner ? "error" : ""}>
                          Dono da resolução
                          <input value={draft.blockOwner} onChange={event => setDraft({ ...draft, blockOwner: event.target.value })} />
                          <small>{errors.blockOwner}</small>
                        </label>
                        <label className={errors.unblockForecast ? "error" : ""}>
                          Previsão
                          <input type="date" value={draft.unblockForecast} onChange={event => setDraft({ ...draft, unblockForecast: event.target.value })} />
                          <small>{errors.unblockForecast}</small>
                        </label>
                        <label className={`wide ${errors.nextAction ? "error" : ""}`}>
                          Próxima ação
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
                        Cancelar
                      </button>
                      <button className="primary" onClick={save}>
                        <CheckCircle />
                        Salvar alterações
                      </button>
                    </div>
                  </div>
                ) : (
                  <dl className="pcm-definition">
                    <div><dt>Cliente</dt><dd>{project.client}</dd></div>
                    <div><dt>Localização</dt><dd>{project.location}</dd></div>
                    <div><dt>Responsável</dt><dd>{project.owner}</dd></div>
                    <div><dt>PMO</dt><dd>{project.pmo}</dd></div>
                    <div><dt>Próximo marco</dt><dd>{project.next} · {project.date}</dd></div>
                    <div><dt>Próxima ação</dt><dd>{project.nextAction}</dd></div>
                  </dl>
                )}
              </article>

              <aside className="pcm-side-column">
                <article>
                  <div className="pcm-section-title">
                    <div>
                      <small>PROGRESSO EXPLICÁVEL</small>
                      <h3>{project.progress}% com evidência</h3>
                    </div>
                    <ShieldCheck />
                  </div>
                  <div className="pcm-evidence-bars">
                    {[
                      ["Entregáveis", progressEvidence.deliverables, 35],
                      ["Checklists", progressEvidence.checklists, 25],
                      ["Commits válidos", progressEvidence.commits, 20],
                      ["Testes aprovados", progressEvidence.tests, 20],
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
                      <small>PRÓXIMA COBRANÇA</small>
                      <h3>{project.status === "Bloqueado" ? "Desbloquear projeto" : "Mover o projeto"}</h3>
                    </div>
                    {project.status === "Bloqueado" ? <Warning /> : <CheckSquare />}
                  </div>
                  <p>{project.nextAction}</p>
                  <span><User />{project.owner}</span>
                  <button
                    className="primary"
                    onClick={() => {
                      record("Registrou uma cobrança", project.nextAction, "comunicação");
                      notify(`Cobrança registrada para ${project.owner}.`);
                    }}
                  >
                    Registrar cobrança
                  </button>
                </article>
              </aside>
            </div>
          ) : null}

          {tab === "deliveries" ? <ProjectDeliveryMatrix project={project} onUpdate={onUpdate} notify={notify} /> : null}
          {tab === "phases" ? <ProjectPhaseGates project={project} onUpdate={onUpdate} notify={notify} /> : null}
          {tab === "activities" ? <ProjectActivityPlanner project={project} onUpdate={onUpdate} notify={notify} /> : null}

          {tab === "audit" ? (
            <div className="pcm-audit">
              <article>
                <div className="pcm-section-title">
                  <div>
                    <small>TRILHA DE AUDITORIA</small>
                    <h3>Histórico imutável do projeto</h3>
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
                    <small>COMUNICAÇÕES</small>
                    <h3>Status Reports gerados</h3>
                  </div>
                  <ClipboardText />
                </div>
                <div className="pcm-comms">
                  <span><b>11 jul · 17:15</b><small>Diretoria · WhatsApp</small><em>Preparado</em></span>
                  <span><b>10 jul · 09:20</b><small>PMO · E-mail HTML</small><em>Registrado</em></span>
                  <span><b>08 jul · 18:04</b><small>Equipe técnica · E-mail</small><em>Registrado</em></span>
                </div>
                <button className="ghost" onClick={() => notify("Histórico de comunicações exportado com sucesso.")}>
                  <ClipboardText />
                  Exportar histórico
                </button>
              </aside>
            </div>
          ) : null}
        </div>

        <footer className="pcm-footer">
          <span><ShieldCheck />Todas as alterações geram trilha de auditoria.</span>
          <button className="ghost" onClick={() => setCommunicationOpen(true)}>
            <ClipboardText />
            Status Report
          </button>
          <button className="ghost" onClick={onOpenFull}>
            Abrir Central Completa
            <ArrowSquareOut />
          </button>
          <button
            className="primary"
            onClick={() => {
              onClose();
              notify("Projeto fechado. Alterações preservadas na sessão.");
            }}
          >
            Concluir revisão
            <ArrowRight />
          </button>
        </footer>
      </section>

      {communicationOpen ? (
        <StatusReportModal
          project={{ ...project, ownerEmail: project.ownerEmail || corporateEmail(project.owner) }}
          onClose={() => setCommunicationOpen(false)}
          notify={notify}
        />
      ) : null}
    </div>
  );
}
