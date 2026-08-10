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

export function ProjectDeliveryMatrix({ project, onUpdate, notify }) {
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

  const registerEvidence = () => {
    const evidence = window.prompt("Qual evidência foi registrada?", selected.evidence === "Sem evidência" ? "" : selected.evidence);
    if (!evidence?.trim()) return;
    updateSelected(
      { evidence: evidence.trim(), status: selected.status === "Planejada" ? "Em validação" : selected.status },
      "Evidência registrada e vinculada à entrega.",
    );
  };

  const conclude = () => {
    if (!selected.evidence || selected.evidence === "Sem evidência") {
      notify("Registre uma evidência antes de concluir a entrega.");
      return;
    }
    updateSelected({ status: "Concluída", progress: 100 }, "Entrega concluída com evidência e trilha de auditoria.");
  };

  const email = () => {
    const subject = `InventOps · ${project.code} · ${selected.area} · ${selected.delivery}`;
    const body = `Olá, ${selected.owner}.\n\nA entrega abaixo está vinculada ao seu perfil no InventOps.\n\nProjeto: ${project.name}\nÁrea: ${selected.department}\nEntrega: ${selected.delivery}\nPrazo: ${selected.due}\nStatus: ${selected.status}\nDependência real: ${selected.dependency}\nEvidência atual: ${selected.evidence}\n\nPor favor, atualize a evolução e registre a evidência no InventOps.`;
    window.location.href = `mailto:${selected.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    notify(`Cobrança preparada para ${selected.email}.`);
  };

  return (
    <div className="pdm">
      <section className="pdm-hero">
        <div>
          <small>CONTROLE MATRICIAL DO PROJETO</small>
          <h3>Entregas por área, sem perder o trabalho paralelo</h3>
          <p>Cada área responde por uma entrega verificável. Uma atividade só bloqueia outra quando existe dependência técnica real.</p>
        </div>
        <span>
          <Buildings />
          <b>{deliveries.length}</b>
          <small>áreas conectadas</small>
        </span>
      </section>

      <section className="pdm-summary">
        <article>
          <small>PROGRESSO MÉDIO</small>
          <b>{summary.average}%</b>
          <i><em style={{ width: `${summary.average}%` }} /></i>
        </article>
        <article>
          <small>CONCLUÍDAS</small>
          <b>{summary.completed}</b>
          <span className="success"><CheckCircle />com evidência</span>
        </article>
        <article>
          <small>EM EXECUÇÃO</small>
          <b>{summary.running}</b>
          <span><Clock />inclui paralelo</span>
        </article>
        <article className={summary.attention ? "attention" : ""}>
          <small>EXIGEM ATENÇÃO</small>
          <b>{summary.attention}</b>
          <span><Warning />risco ou espera</span>
        </article>
      </section>

      <div className="pdm-toolbar">
        <div>
          {["Todas", "Em andamento", "Em paralelo", "Atenção", "Planejada"].map(option => (
            <button key={option} className={filter === option ? "active" : ""} onClick={() => chooseFilter(option)}>
              {option}
            </button>
          ))}
        </div>
        <p><span /> Atualização sustentada por evidência técnica</p>
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
                <em>{item.status}</em>
              </header>
              <h4>{item.delivery}</h4>
              <p><User />{item.owner}</p>
              <div>
                <i><em style={{ width: `${item.progress}%` }} /></i>
                <b>{item.progress}%</b>
              </div>
              <footer>
                <small>Prazo {item.due}</small>
                <small>{item.updated}</small>
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
            <em className={tones[selected.status]}>{selected.status}</em>
          </header>

          <div className="pdm-detail-progress">
            <span>
              <b>{selected.progress}%</b>
              <small>progresso comprovado</small>
            </span>
            <i><em style={{ width: `${selected.progress}%` }} /></i>
          </div>

          <dl>
            <div>
              <dt><User />Responsável</dt>
              <dd>
                <b>{selected.owner}</b>
                <small>{selected.email}</small>
              </dd>
            </div>
            <div>
              <dt><Clock />Prazo da entrega</dt>
              <dd>
                <b>{selected.due}</b>
                <small>Atualizado {selected.updated.toLowerCase()}</small>
              </dd>
            </div>
            <div>
              <dt><LinkSimple />Dependência real</dt>
              <dd>
                <b>{selected.dependency}</b>
                <small>{selected.status === "Em paralelo" ? "Não impede outras frentes de avançarem." : "Monitorada pelo PM."}</small>
              </dd>
            </div>
            <div>
              <dt><FileText />Evidência atual</dt>
              <dd>
                <b>{selected.evidence}</b>
                <small>Fonte do percentual apresentado.</small>
              </dd>
            </div>
          </dl>

          <div className="pdm-handoff">
            <small>PRÓXIMO HANDOFF</small>
            <p>{selected.handoff}</p>
            <ArrowRight />
          </div>

          <div className="pdm-actions">
            <button className="ghost" onClick={email}>
              <Envelope />
              Cobrar por e-mail
            </button>
            <button className="ghost" onClick={registerEvidence}>
              <FileText />
              Registrar evidência
            </button>
            <button className="primary" onClick={conclude}>
              <CheckCircle />
              Concluir entrega
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
