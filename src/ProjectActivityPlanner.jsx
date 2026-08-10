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
  PM: ["Publicar baseline do projeto", "Validar responsáveis das áreas", "Conduzir gate de governança"],
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

const PAP_I18N={
  pt:{statusLabels:{"Não iniciada":"Não iniciada","Em andamento":"Em andamento",Concluída:"Concluída"},depLabels:{Externa:"Externa",Bloqueante:"Bloqueante",Paralela:"Paralela"},
   filters:{Todas:"Todas","Em andamento":"Em andamento",Bloqueantes:"Bloqueantes","Sem evidência":"Sem evidência",Concluídas:"Concluídas"},
   heroTag:"PLANO INTEGRADO DO PROJETO",heroTitle:"Da entrega da área até a atividade executável.",heroBody:"As equipes trabalham em paralelo, mas cada tarefa mantém responsável, dependência, prazo e evidência.",newActivity:"Nova atividade",
   activities:"ATIVIDADES",areasConnected:"14 áreas conectadas",completed:"CONCLUÍDAS",withEvidence:"com evidência",inExecution:"EM EXECUÇÃO",activeWork:"trabalho ativo",blocking:"BLOQUEANTES",requireDecision:"exigem decisão",
   area:"Área",all:"Todas",colWbs:"WBS / atividade",colArea:"Área",colOwner:"Responsável",colDependency:"Dependência",colDue:"Prazo",colStatus:"Status",noEvidence:"sem evidência",hasEvidence:"com evidência",
   whyMatters:"POR QUE ESTA ATIVIDADE IMPORTA",owner:"Responsável",dependency:"Dependência",evidence:"Evidência",mandatoryToClose:"Obrigatória para concluir.",
   prepareEmail:"Preparar e-mail",registerEvidence:"Registrar evidência",done:"Concluída",completeActivity:"Concluir atividade",auditFooter:"Toda alteração atualiza o projeto e preserva a rastreabilidade.",
   newActivityTag:"NOVA ATIVIDADE",newActivityTitle:"Distribuir trabalho com contexto",close:"Fechar nova atividade",activity:"Atividade",activityPlaceholder:"Ex.: Validar checklist de conectividade",due:"Prazo",depType:"Tipo de dependência",
   autoOwner:"RESPONSÁVEL AUTOMÁTICO",cancel:"Cancelar",createAndLink:"Criar e vincular",
   dependencyText:(area,taskIndex)=>`Conclusão da atividade ${area}.${taskIndex}`,impactHandoff:handoff=>`Libera o handoff: ${handoff}`,impactSupport:delivery=>`Sustenta a entrega "${delivery}".`,createdOnActivity:"Definida na criação da atividade",
   evidencePrompt:"Descreva a evidência registrada:",evidenceLinkedToast:"Evidência vinculada à atividade.",registerFirstToast:"Registre a evidência antes de concluir a atividade.",completedToast:"Atividade concluída com evidência auditável.",createdToast:owner=>`Atividade criada e vinculada a ${owner}.`,updateToast:email=>`Atualização preparada para ${email}.`},
  es:{statusLabels:{"Não iniciada":"No iniciada","Em andamento":"En curso",Concluída:"Concluida"},depLabels:{Externa:"Externa",Bloqueante:"Bloqueante",Paralela:"Paralela"},
   filters:{Todas:"Todas","Em andamento":"En curso",Bloqueantes:"Bloqueantes","Sem evidência":"Sin evidencia",Concluídas:"Concluidas"},
   heroTag:"PLAN INTEGRADO DEL PROYECTO",heroTitle:"De la entrega del área a la actividad ejecutable.",heroBody:"Los equipos trabajan en paralelo, pero cada tarea mantiene responsable, dependencia, plazo y evidencia.",newActivity:"Nueva actividad",
   activities:"ACTIVIDADES",areasConnected:"14 áreas conectadas",completed:"CONCLUIDAS",withEvidence:"con evidencia",inExecution:"EN EJECUCIÓN",activeWork:"trabajo activo",blocking:"BLOQUEANTES",requireDecision:"requieren decisión",
   area:"Área",all:"Todas",colWbs:"WBS / actividad",colArea:"Área",colOwner:"Responsable",colDependency:"Dependencia",colDue:"Plazo",colStatus:"Estado",noEvidence:"sin evidencia",hasEvidence:"con evidencia",
   whyMatters:"POR QUÉ ESTA ACTIVIDAD IMPORTA",owner:"Responsable",dependency:"Dependencia",evidence:"Evidencia",mandatoryToClose:"Obligatoria para concluir.",
   prepareEmail:"Preparar correo",registerEvidence:"Registrar evidencia",done:"Concluida",completeActivity:"Concluir actividad",auditFooter:"Todo cambio actualiza el proyecto y preserva la trazabilidad.",
   newActivityTag:"NUEVA ACTIVIDAD",newActivityTitle:"Distribuir trabajo con contexto",close:"Cerrar nueva actividad",activity:"Actividad",activityPlaceholder:"Ej.: Validar checklist de conectividad",due:"Plazo",depType:"Tipo de dependencia",
   autoOwner:"RESPONSABLE AUTOMÁTICO",cancel:"Cancelar",createAndLink:"Crear y vincular",
   dependencyText:(area,taskIndex)=>`Conclusión de la actividad ${area}.${taskIndex}`,impactHandoff:handoff=>`Libera el handoff: ${handoff}`,impactSupport:delivery=>`Sustenta la entrega "${delivery}".`,createdOnActivity:"Definida al crear la actividad",
   evidencePrompt:"Describe la evidencia registrada:",evidenceLinkedToast:"Evidencia vinculada a la actividad.",registerFirstToast:"Registra la evidencia antes de concluir la actividad.",completedToast:"Actividad concluida con evidencia auditable.",createdToast:owner=>`Actividad creada y vinculada a ${owner}.`,updateToast:email=>`Actualización preparada para ${email}.`},
  en:{statusLabels:{"Não iniciada":"Not started","Em andamento":"In progress",Concluída:"Done"},depLabels:{Externa:"External",Bloqueante:"Blocking",Paralela:"Parallel"},
   filters:{Todas:"All","Em andamento":"In progress",Bloqueantes:"Blocking","Sem evidência":"No evidence",Concluídas:"Completed"},
   heroTag:"INTEGRATED PROJECT PLAN",heroTitle:"From the area's delivery to the executable activity.",heroBody:"Teams work in parallel, but every task keeps an owner, dependency, due date and evidence.",newActivity:"New activity",
   activities:"ACTIVITIES",areasConnected:"14 connected areas",completed:"COMPLETED",withEvidence:"with evidence",inExecution:"IN EXECUTION",activeWork:"active work",blocking:"BLOCKING",requireDecision:"require decision",
   area:"Area",all:"All",colWbs:"WBS / activity",colArea:"Area",colOwner:"Owner",colDependency:"Dependency",colDue:"Due",colStatus:"Status",noEvidence:"no evidence",hasEvidence:"with evidence",
   whyMatters:"WHY THIS ACTIVITY MATTERS",owner:"Owner",dependency:"Dependency",evidence:"Evidence",mandatoryToClose:"Mandatory to close.",
   prepareEmail:"Prepare e-mail",registerEvidence:"Register evidence",done:"Done",completeActivity:"Complete activity",auditFooter:"Every change updates the project and preserves traceability.",
   newActivityTag:"NEW ACTIVITY",newActivityTitle:"Distribute work with context",close:"Close new activity",activity:"Activity",activityPlaceholder:"E.g.: Validate connectivity checklist",due:"Due",depType:"Dependency type",
   autoOwner:"AUTOMATIC OWNER",cancel:"Cancel",createAndLink:"Create and link",
   dependencyText:(area,taskIndex)=>`Completion of activity ${area}.${taskIndex}`,impactHandoff:handoff=>`Releases the handoff: ${handoff}`,impactSupport:delivery=>`Supports the delivery "${delivery}".`,createdOnActivity:"Set when the activity was created",
   evidencePrompt:"Describe the registered evidence:",evidenceLinkedToast:"Evidence linked to the activity.",registerFirstToast:"Register evidence before completing the activity.",completedToast:"Activity completed with auditable evidence.",createdToast:owner=>`Activity created and linked to ${owner}.`,updateToast:email=>`Update prepared for ${email}.`},
};
export function ProjectActivityPlanner({ project, onUpdate, notify, lang="pt" }) {
  const t=PAP_I18N[lang]||PAP_I18N.pt;
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

    persist(next, t.createdToast(delivery.owner));
    setCreating(false);
    setDraft({ name: "", area: "INF", due: "25 jul", dependencyType: "Paralela" });
  };

  const registerEvidence = () => {
    const value = window.prompt(t.evidencePrompt, selected.evidence === "Pendente" ? "" : selected.evidence);
    if (!value?.trim()) return;
    persist(
      plan.map(item =>
        item.id === selected.id
          ? { ...item, evidence: value.trim(), status: item.status === "Não iniciada" ? "Em andamento" : item.status }
          : item,
      ),
      t.evidenceLinkedToast,
    );
  };

  const conclude = () => {
    if (selected.evidence === "Pendente") {
      notify(t.registerFirstToast);
      return;
    }
    persist(plan.map(item => (item.id === selected.id ? { ...item, status: "Concluída" } : item)), t.completedToast);
  };

  const prepareEmail = () => {
    const subject = `InventOps · ${project.code} · ${selected.area} · ${selected.name}`;
    const body = `Olá, ${selected.owner}.\n\nAtividade vinculada ao seu perfil no InventOps.\n\nProjeto: ${project.name}\nEntrega: ${selected.delivery}\nAtividade: ${selected.name}\nPrazo: ${selected.due}\nDependência: ${selected.dependencyType} · ${selected.dependency}\nEvidência esperada: ${selected.evidence}\n\nPor favor, atualize a execução no InventOps.`;
    window.location.href = `mailto:${selected.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    notify(t.updateToast(selected.email));
  };

  return (
    <div className="pap">
      <section className="pap-hero">
        <div>
          <small>{t.heroTag}</small>
          <h3>{t.heroTitle}</h3>
          <p>{t.heroBody}</p>
        </div>
        <button className="primary" onClick={() => setCreating(true)}>
          <Plus />
          {t.newActivity}
        </button>
      </section>

      <div className="pap-metrics">
        <span><small>{t.activities}</small><b>{metrics.total}</b><em>{t.areasConnected}</em></span>
        <span><small>{t.completed}</small><b>{metrics.done}</b><em>{t.withEvidence}</em></span>
        <span><small>{t.inExecution}</small><b>{metrics.running}</b><em>{t.activeWork}</em></span>
        <span className={metrics.blockers ? "danger" : ""}><small>{t.blocking}</small><b>{metrics.blockers}</b><em>{t.requireDecision}</em></span>
      </div>

      <div className="pap-controls">
        <div>
          <Funnel />
          {["Todas", "Em andamento", "Bloqueantes", "Sem evidência", "Concluídas"].map(option => (
            <button key={option} className={filter === option ? "active" : ""} onClick={() => selectFilter(option)}>
              {t.filters[option]}
            </button>
          ))}
        </div>
        <label>
          {t.area}
          <select value={area} onChange={event => selectArea(event.target.value)}>
            <option value="Todas">{t.all}</option>
            {deliveries.map(item => (
              <option key={item.area}>{item.area}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="pap-workspace">
        <article className="pap-list">
          <header>
            <span>{t.colWbs}</span>
            <span>{t.colArea}</span>
            <span>{t.colOwner}</span>
            <span>{t.colDependency}</span>
            <span>{t.colDue}</span>
            <span>{t.colStatus}</span>
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
                <em className={item.dependencyType.toLowerCase()}>{t.depLabels[item.dependencyType]||item.dependencyType}</em>
                <small>{item.dependency}</small>
              </span>
              <span>
                <Clock />
                <b>{item.due}</b>
              </span>
              <span>
                <strong>{t.statusLabels[item.status]||item.status}</strong>
                <small>{item.evidence === "Pendente" ? t.noEvidence : t.hasEvidence}</small>
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
            <em>{t.statusLabels[selected.status]||selected.status}</em>
          </header>

          <section>
            <small>{t.whyMatters}</small>
            <p>{selected.impact}</p>
          </section>

          <dl>
            <div>
              <dt><User />{t.owner}</dt>
              <dd><b>{selected.owner}</b><small>{selected.email}</small></dd>
            </div>
            <div>
              <dt><LinkSimple />{t.dependency}</dt>
              <dd><b>{t.depLabels[selected.dependencyType]||selected.dependencyType}</b><small>{selected.dependency}</small></dd>
            </div>
            <div>
              <dt><FileText />{t.evidence}</dt>
              <dd><b>{selected.evidence}</b><small>{t.mandatoryToClose}</small></dd>
            </div>
          </dl>

          <div>
            <button className="ghost" onClick={prepareEmail}>
              <Envelope />
              {t.prepareEmail}
            </button>
            <button className="ghost" onClick={registerEvidence}>
              <FileText />
              {t.registerEvidence}
            </button>
            <button className="primary" disabled={selected.status === "Concluída"} onClick={conclude}>
              <CheckCircle />
              {selected.status === "Concluída" ? t.done : t.completeActivity}
            </button>
          </div>

          <footer><ShieldCheck />{t.auditFooter}</footer>
        </aside>
      </div>

      {creating ? (
        <div className="modal-layer" onMouseDown={event => event.target === event.currentTarget && setCreating(false)}>
          <form className="pap-create" onSubmit={addTask}>
            <header>
              <div>
                <small>{t.newActivityTag}</small>
                <h2>{t.newActivityTitle}</h2>
              </div>
              <button type="button" onClick={() => setCreating(false)} aria-label={t.close}>
                <XCircle />
              </button>
            </header>

            <label className="wide">
              {t.activity}
              <input
                autoFocus
                value={draft.name}
                onChange={event => setDraft({ ...draft, name: event.target.value })}
                placeholder={t.activityPlaceholder}
              />
            </label>
            <label>
              {t.area}
              <select value={draft.area} onChange={event => setDraft({ ...draft, area: event.target.value })}>
                {deliveries.map(item => (
                  <option key={item.area}>{item.area}</option>
                ))}
              </select>
            </label>
            <label>
              {t.due}
              <input value={draft.due} onChange={event => setDraft({ ...draft, due: event.target.value })} />
            </label>
            <label>
              {t.depType}
              <select value={draft.dependencyType} onChange={event => setDraft({ ...draft, dependencyType: event.target.value })}>
                <option value="Paralela">{t.depLabels.Paralela}</option>
                <option value="Bloqueante">{t.depLabels.Bloqueante}</option>
                <option value="Externa">{t.depLabels.Externa}</option>
              </select>
            </label>

            <div className="pap-owner-preview">
              <User />
              <span>
                <small>{t.autoOwner}</small>
                <b>{deliveries.find(item => item.area === draft.area)?.owner}</b>
                <em>{deliveries.find(item => item.area === draft.area)?.email}</em>
              </span>
            </div>

            <footer>
              <button type="button" className="ghost" onClick={() => setCreating(false)}>{t.cancel}</button>
              <button className="primary">
                <Plus />
                {t.createAndLink}
              </button>
            </footer>
          </form>
        </div>
      ) : null}
    </div>
  );
}
