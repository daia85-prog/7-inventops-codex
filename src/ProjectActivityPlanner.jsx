import { useMemo, useState } from "react";
import {
  CheckCircle,
  Clock,
  Envelope,
  FileText,
  Funnel,
  LinkSimple,
  Plus,
  ShieldCheck,
  User,
  XCircle,
} from "@phosphor-icons/react";
import { createProjectDeliveries } from "./ProjectDeliveryMatrix";

const taskCatalog = {
  COM: ["Confirmar escopo contratado", "Registrar premissas e exclusões", "Realizar handoff comercial"],
  PMO: ["Publicar baseline do projeto", "Validar responsáveis das áreas", "Conduzir gate de governança"],
  PCP: ["Consolidar cronograma integrado", "Nivelar capacidade das equipes", "Publicar janela dos marcos"],
  CMP: ["Emitir pedidos dos itens críticos", "Confirmar datas com fornecedores", "Atualizar mapa de recebimento"],
  EMC: ["Liberar desenhos por lote", "Validar lista de materiais", "Aprovar revisão mecânica"],
  EEL: ["Liberar diagramas elétricos", "Validar lista de painéis", "Aprovar revisão elétrica"],
  PRD: ["Programar ordens de produção", "Finalizar conjuntos liberados", "Registrar inspeção de qualidade"],
  MON: ["Montar conjuntos mecânicos", "Executar montagem elétrica", "Validar checklist de montagem"],
  INF: ["Aprovar arquitetura do ambiente", "Provisionar servidores e acessos", "Validar VPN e conectividade"],
  ESP: ["Consolidar fluxos funcionais", "Validar regras com o cliente", "Publicar especificação aprovada"],
  WCS: ["Implementar regras de negócio", "Executar testes de integração", "Publicar versão homologada"],
  IMP: ["Publicar plano de cutover", "Confirmar equipe de campo", "Validar prontidão de Go Live"],
  PLC: ["Parametrizar programa do CLP", "Executar testes de automação", "Registrar aceite técnico"],
  POS: ["Preparar plano de hypercare", "Transferir conhecimento", "Formalizar transição para suporte"],
};

function createPlan(project) {
  if (project.activityPlan?.length) return project.activityPlan;

  return createProjectDeliveries(project).flatMap((delivery, areaIndex) =>
    taskCatalog[delivery.area].map((name, taskIndex) => {
      const firstDone = delivery.progress >= 65 && taskIndex === 0;
      const status =
        delivery.status === "Concluída" || firstDone
          ? "Concluída"
          : taskIndex === 0
            ? "Em andamento"
            : taskIndex === 1 && delivery.progress >= 55
              ? "Em andamento"
              : "Não iniciada";

      const dependencyType =
        ["INF", "CMP"].includes(delivery.area) && taskIndex === 2
          ? "Externa"
          : delivery.area === "PLC" && taskIndex === 1
            ? "Bloqueante"
            : "Paralela";

      return {
        id: `${project.code}-${delivery.area}-${taskIndex + 1}`,
        wbs: `${areaIndex + 1}.${taskIndex + 1}`,
        area: delivery.area,
        department: delivery.department,
        delivery: delivery.delivery,
        name,
        owner: delivery.owner,
        email: delivery.email,
        due: delivery.due,
        status,
        dependencyType,
        dependency: taskIndex === 0 ? delivery.dependency : `Conclusão da atividade ${areaIndex + 1}.${taskIndex}`,
        evidence: status === "Concluída" ? delivery.evidence : "Pendente",
        impact: taskIndex === 2 ? `Libera o handoff: ${delivery.handoff}` : `Sustenta a entrega "${delivery.delivery}".`,
      };
    }),
  );
}

export function ProjectActivityPlanner({ project, onUpdate, notify }) {
  const deliveries = createProjectDeliveries(project);
  const [plan, setPlan] = useState(() => createPlan(project));
  const [filter, setFilter] = useState("Todas");
  const [area, setArea] = useState("Todas");
  const [selectedId, setSelectedId] = useState(() => createPlan(project)[0]?.id);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ name: "", area: "INF", due: "25 jul", dependencyType: "Paralela" });

  const filtered = plan.filter(
    item =>
      (area === "Todas" || item.area === area) &&
      (
        filter === "Todas" ||
        (filter === "Bloqueantes" && item.dependencyType === "Bloqueante") ||
        (filter === "Em andamento" && item.status === "Em andamento") ||
        (filter === "Sem evidência" && item.evidence === "Pendente") ||
        (filter === "Concluídas" && item.status === "Concluída")
      ),
  );

  const selected = filtered.find(item => item.id === selectedId) || filtered[0] || plan[0];
  const metrics = useMemo(
    () => ({
      total: plan.length,
      done: plan.filter(item => item.status === "Concluída").length,
      running: plan.filter(item => item.status === "Em andamento").length,
      blockers: plan.filter(item => item.dependencyType === "Bloqueante" && item.status !== "Concluída").length,
    }),
    [plan],
  );

  const persist = (next, message) => {
    setPlan(next);
    onUpdate({ ...project, activityPlan: next });
    notify(message);
  };

  const selectFilter = option => {
    setFilter(option);
    const candidates = plan.filter(
      item =>
        (area === "Todas" || item.area === area) &&
        (
          option === "Todas" ||
          (option === "Bloqueantes" && item.dependencyType === "Bloqueante") ||
          (option === "Em andamento" && item.status === "Em andamento") ||
          (option === "Sem evidência" && item.evidence === "Pendente") ||
          (option === "Concluídas" && item.status === "Concluída")
        ),
    );

    if (candidates.length && !candidates.some(item => item.id === selectedId)) {
      setSelectedId(candidates[0].id);
    }
  };

  const selectArea = code => {
    setArea(code);
    const candidate = plan.find(
      item =>
        (code === "Todas" || item.area === code) &&
        (
          filter === "Todas" ||
          (filter === "Bloqueantes" && item.dependencyType === "Bloqueante") ||
          (filter === "Em andamento" && item.status === "Em andamento") ||
          (filter === "Sem evidência" && item.evidence === "Pendente") ||
          (filter === "Concluídas" && item.status === "Concluída")
        ),
    );
    if (candidate) setSelectedId(candidate.id);
  };

  const addTask = event => {
    event.preventDefault();
    if (!draft.name.trim()) return;

    const delivery = deliveries.find(item => item.area === draft.area);
    const count = plan.filter(item => item.area === draft.area).length;

    const next = [
      ...plan,
      {
        id: `${project.code}-${draft.area}-${Date.now()}`,
        wbs: `${deliveries.findIndex(item => item.area === draft.area) + 1}.${count + 1}`,
        area: draft.area,
        department: delivery.department,
        delivery: delivery.delivery,
        name: draft.name.trim(),
        owner: delivery.owner,
        email: delivery.email,
        due: draft.due,
        status: "Não iniciada",
        dependencyType: draft.dependencyType,
        dependency: "Definida na criação da atividade",
        evidence: "Pendente",
        impact: `Sustenta a entrega "${delivery.delivery}".`,
      },
    ];

    persist(next, `Atividade criada e vinculada a ${delivery.owner}.`);
    setCreating(false);
    setDraft({ name: "", area: "INF", due: "25 jul", dependencyType: "Paralela" });
  };

  const registerEvidence = () => {
    const value = window.prompt("Descreva a evidência registrada:", selected.evidence === "Pendente" ? "" : selected.evidence);
    if (!value?.trim()) return;
    persist(
      plan.map(item =>
        item.id === selected.id
          ? { ...item, evidence: value.trim(), status: item.status === "Não iniciada" ? "Em andamento" : item.status }
          : item,
      ),
      "Evidência vinculada à atividade.",
    );
  };

  const conclude = () => {
    if (selected.evidence === "Pendente") {
      notify("Registre a evidência antes de concluir a atividade.");
      return;
    }
    persist(plan.map(item => (item.id === selected.id ? { ...item, status: "Concluída" } : item)), "Atividade concluída com evidência auditável.");
  };

  const prepareEmail = () => {
    const subject = `InventOps · ${project.code} · ${selected.area} · ${selected.name}`;
    const body = `Olá, ${selected.owner}.\n\nAtividade vinculada ao seu perfil no InventOps.\n\nProjeto: ${project.name}\nEntrega: ${selected.delivery}\nAtividade: ${selected.name}\nPrazo: ${selected.due}\nDependência: ${selected.dependencyType} · ${selected.dependency}\nEvidência esperada: ${selected.evidence}\n\nPor favor, atualize a execução no InventOps.`;
    window.location.href = `mailto:${selected.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    notify(`Atualização preparada para ${selected.email}.`);
  };

  return (
    <div className="pap">
      <section className="pap-hero">
        <div>
          <small>PLANO INTEGRADO DO PROJETO</small>
          <h3>Da entrega da área até a atividade executável.</h3>
          <p>As equipes trabalham em paralelo, mas cada tarefa mantém responsável, dependência, prazo e evidência.</p>
        </div>
        <button className="primary" onClick={() => setCreating(true)}>
          <Plus />
          Nova atividade
        </button>
      </section>

      <div className="pap-metrics">
        <span><small>ATIVIDADES</small><b>{metrics.total}</b><em>14 áreas conectadas</em></span>
        <span><small>CONCLUÍDAS</small><b>{metrics.done}</b><em>com evidência</em></span>
        <span><small>EM EXECUÇÃO</small><b>{metrics.running}</b><em>trabalho ativo</em></span>
        <span className={metrics.blockers ? "danger" : ""}><small>BLOQUEANTES</small><b>{metrics.blockers}</b><em>exigem decisão</em></span>
      </div>

      <div className="pap-controls">
        <div>
          <Funnel />
          {["Todas", "Em andamento", "Bloqueantes", "Sem evidência", "Concluídas"].map(option => (
            <button key={option} className={filter === option ? "active" : ""} onClick={() => selectFilter(option)}>
              {option}
            </button>
          ))}
        </div>
        <label>
          Área
          <select value={area} onChange={event => selectArea(event.target.value)}>
            <option>Todas</option>
            {deliveries.map(item => (
              <option key={item.area}>{item.area}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="pap-workspace">
        <article className="pap-list">
          <header>
            <span>WBS / atividade</span>
            <span>Área</span>
            <span>Responsável</span>
            <span>Dependência</span>
            <span>Prazo</span>
            <span>Status</span>
          </header>

          {filtered.map(item => (
            <button key={item.id} className={selected.id === item.id ? "selected" : ""} onClick={() => setSelectedId(item.id)}>
              <span>
                <small>{item.wbs} · {item.delivery}</small>
                <b>{item.name}</b>
              </span>
              <span>
                <i>{item.area}</i>
                <small>{item.department}</small>
              </span>
              <span>
                <User />
                <b>{item.owner}</b>
                <small>{item.email}</small>
              </span>
              <span>
                <em className={item.dependencyType.toLowerCase()}>{item.dependencyType}</em>
                <small>{item.dependency}</small>
              </span>
              <span>
                <Clock />
                <b>{item.due}</b>
              </span>
              <span>
                <strong>{item.status}</strong>
                <small>{item.evidence === "Pendente" ? "sem evidência" : "com evidência"}</small>
              </span>
            </button>
          ))}
        </article>

        <aside className="pap-detail">
          <header>
            <span>{selected.area}</span>
            <div>
              <small>{selected.wbs} · {selected.department}</small>
              <h3>{selected.name}</h3>
            </div>
            <em>{selected.status}</em>
          </header>

          <section>
            <small>POR QUE ESTA ATIVIDADE IMPORTA</small>
            <p>{selected.impact}</p>
          </section>

          <dl>
            <div>
              <dt><User />Responsável</dt>
              <dd><b>{selected.owner}</b><small>{selected.email}</small></dd>
            </div>
            <div>
              <dt><LinkSimple />Dependência</dt>
              <dd><b>{selected.dependencyType}</b><small>{selected.dependency}</small></dd>
            </div>
            <div>
              <dt><FileText />Evidência</dt>
              <dd><b>{selected.evidence}</b><small>Obrigatória para concluir.</small></dd>
            </div>
          </dl>

          <div>
            <button className="ghost" onClick={prepareEmail}>
              <Envelope />
              Preparar e-mail
            </button>
            <button className="ghost" onClick={registerEvidence}>
              <FileText />
              Registrar evidência
            </button>
            <button className="primary" disabled={selected.status === "Concluída"} onClick={conclude}>
              <CheckCircle />
              {selected.status === "Concluída" ? "Concluída" : "Concluir atividade"}
            </button>
          </div>

          <footer><ShieldCheck />Toda alteração atualiza o projeto e preserva a rastreabilidade.</footer>
        </aside>
      </div>

      {creating ? (
        <div className="modal-layer" onMouseDown={event => event.target === event.currentTarget && setCreating(false)}>
          <form className="pap-create" onSubmit={addTask}>
            <header>
              <div>
                <small>NOVA ATIVIDADE</small>
                <h2>Distribuir trabalho com contexto</h2>
              </div>
              <button type="button" onClick={() => setCreating(false)} aria-label="Fechar nova atividade">
                <XCircle />
              </button>
            </header>

            <label className="wide">
              Atividade
              <input
                autoFocus
                value={draft.name}
                onChange={event => setDraft({ ...draft, name: event.target.value })}
                placeholder="Ex.: Validar checklist de conectividade"
              />
            </label>
            <label>
              Área
              <select value={draft.area} onChange={event => setDraft({ ...draft, area: event.target.value })}>
                {deliveries.map(item => (
                  <option key={item.area}>{item.area}</option>
                ))}
              </select>
            </label>
            <label>
              Prazo
              <input value={draft.due} onChange={event => setDraft({ ...draft, due: event.target.value })} />
            </label>
            <label>
              Tipo de dependência
              <select value={draft.dependencyType} onChange={event => setDraft({ ...draft, dependencyType: event.target.value })}>
                <option>Paralela</option>
                <option>Bloqueante</option>
                <option>Externa</option>
              </select>
            </label>

            <div className="pap-owner-preview">
              <User />
              <span>
                <small>RESPONSÁVEL AUTOMÁTICO</small>
                <b>{deliveries.find(item => item.area === draft.area)?.owner}</b>
                <em>{deliveries.find(item => item.area === draft.area)?.email}</em>
              </span>
            </div>

            <footer>
              <button type="button" className="ghost" onClick={() => setCreating(false)}>Cancelar</button>
              <button className="primary">
                <Plus />
                Criar e vincular
              </button>
            </footer>
          </form>
        </div>
      ) : null}
    </div>
  );
}
