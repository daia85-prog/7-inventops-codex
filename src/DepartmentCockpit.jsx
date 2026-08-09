import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Buildings,
  CalendarBlank,
  ChatCircleText,
  CheckCircle,
  ClockCountdown,
  ClipboardText,
  Envelope,
  HandPalm,
  PaperPlaneTilt,
  Sparkle,
  UsersThree,
  Warning,
  XCircle,
} from "@phosphor-icons/react";

export const AREAS = [
  { code: "COM", nome: "Comercial / Concept", gestor: "André Mota" },
  { code: "PMO", nome: "PMO", gestor: "Rodrigo Baruco" },
  { code: "PCP", nome: "PCP", gestor: "Weslley Silva" },
  { code: "CMP", nome: "Compras / Importação", gestor: "Claudia Duarte" },
  { code: "EMC", nome: "Eng. Mecânica", gestor: "Gustavo Pereira" },
  { code: "EEL", nome: "Eng. Elétrica", gestor: "Gustavo Pereira" },
  { code: "PRD", nome: "Produção", gestor: "Flavio Moreno" },
  { code: "MON", nome: "Montagem", gestor: "Rojekson Souza" },
  { code: "INF", nome: "Infraestrutura", gestor: "Admin Invent" },
  { code: "ESP", nome: "Espec. de Software", gestor: "Thomas" },
  { code: "WCS", nome: "WCS Velox", gestor: "Marcelo Sanches" },
  { code: "IMP", nome: "Implantação", gestor: "Daniel" },
  { code: "PLC", nome: "PLC", gestor: "Gustavo Pereira" },
  { code: "POS", nome: "Pós-vendas", gestor: "Caique Fracaro" },
];

const areaName = (code) => (AREAS.find((a) => a.code === code) || {}).nome || code;

const cockpitJourney = [
  { id: "login", label: "Login", state: "done", detail: "Acesso corporativo e perfis validados." },
  { id: "home", label: "Home", state: "done", detail: "Panorama executivo conectado às áreas reais." },
  { id: "pmo", label: "PMO", state: "done", detail: "Fila única e briefing operacional publicados." },
  { id: "departamentos", label: "Departamentos", state: "active", detail: "Esteiras reais de Implantação e DevOps em operação assistida." },
  { id: "executive", label: "Diretoria", state: "next", detail: "Próxima etapa: leitura consolidada para decisão." },
];

const PILOT_DEPARTMENTS = {
  INF: {
    source: "base operacional InventOps",
    focal: "Admin Invent",
    deliveries: [
      { id: "inf-1", project: "QUELUZ", title: "Ambiente HML liberado para o GL1", to: "WCS", due: "hoje", status: "pronto" },
      { id: "inf-2", project: "NAVEPARK", title: "VMs Oracle KVM + topologia de rede", to: "IMP", due: "14/08", status: "andamento" },
      { id: "inf-3", project: "MARKET PERU", title: "VPN site-to-site + range IP /24", to: "WCS", due: "12/08", status: "aguardando" },
      { id: "inf-4", project: "TITANO", title: "Servidor SaaS AWS provisionado", to: "WCS", due: "09/08", status: "done", doneAt: "09/08 · 16:12" },
    ],
    waiting: [
      { from: "CMP", project: "TITANO", what: "Hardware do Sensor X (pedido #4411)", side: "Invent", age: "2 dias" },
      { from: "Cliente", project: "MARKET PERU", what: "Confirmação do range IP /24 e VPN", side: "Cliente", age: "12 dias" },
      { from: "COM", project: "BR SUPPLY", what: "Data firme do kickoff técnico", side: "Invent", age: "1 dia" },
    ],
    waitedBy: [
      { dept: "IMP", project: "NAVEPARK", what: "Acessos e VMs para montar o ambiente HML" },
      { dept: "WCS", project: "QUELUZ", what: "Ambiente HML para iniciar os testes do GL1" },
      { dept: "ESP", project: "BR SUPPLY", what: "Definição de servidor (cliente × Invent)" },
    ],
    tracks: [
      {
        id: "queluz",
        label: "QUELUZ",
        summary: "Infra pronta para o GL1 e liberando o WCS para testes.",
        handoff: "Passagem para WCS Velox",
        items: [
          { label: "Provisionar ambiente HML", done: true },
          { label: "Liberar conectividade entre áreas", done: true },
          { label: "Validar acessos para teste integrado", done: false },
          { label: "Confirmar janela de teste com WCS", done: false },
        ],
      },
      {
        id: "navepark",
        label: "NAVEPARK",
        summary: "Infraestrutura preparando base para implantação.",
        handoff: "Passagem para Implantação",
        items: [
          { label: "Fechar topologia Oracle KVM", done: true },
          { label: "Publicar checklist de provisionamento", done: true },
          { label: "Entregar VMs e acessos ao time de campo", done: false },
          { label: "Registrar evidência do ambiente homologado", done: false },
        ],
      },
    ],
  },
  IMP: {
    source: "extraído do Planner dos times",
    focal: "Daniel",
    deliveries: [
      { id: "imp-peter2", project: "PROJETO PETER 2", title: "Passagem de bastão ao time de Pós-Vendas — Final", to: "POS", due: "22/06/2026", status: "andamento", progress: "6/10", origin: "Planner" },
      { id: "imp-queluz", project: "PROJETO QUELUZ — Fase 1", title: "Passagem de bastão ao time de Pós-Vendas — Final", to: "POS", due: "30/07/2026", status: "andamento", progress: "8/10", origin: "Planner" },
    ],
    waiting: [
      { from: "ESP", project: "QUELUZ — Fase 1", what: "Descritivo funcional aprovado e alinhamento final DEV + Implantação", side: "Invent", age: "3 dias" },
      { from: "Cliente", project: "PROJETO PETER 2", what: "Validação final do ambiente para concluir a esteira de implantação", side: "Cliente", age: "5 dias" },
    ],
    waitedBy: [
      { dept: "POS", project: "PROJETO PETER 2", what: "Receber o bastão final após fechamento da esteira" },
      { dept: "POS", project: "QUELUZ — Fase 1", what: "Receber o bastão final após conferência e go-live" },
    ],
    tracks: [
      {
        id: "peter2",
        label: "PROJETO PETER 2",
        summary: "Projeto em atraso, com 6 de 10 checkpoints concluídos na esteira real.",
        handoff: "Passagem de bastão ao time de Pós-Vendas — Final",
        items: [
          { label: "Alinhamento com Documentação — Descritivo Funcional", done: true },
          { label: "Alinhamento com Desenvolvimento — Funcionalidades e Telas", done: true },
          { label: "Planilha de Script de Testes (Padrão)", done: true },
          { label: "Acesso VPN ao Servidor — Remoto", done: true },
          { label: "Mapeamento de IPs para Equipamentos", done: true },
          { label: "Alinhamento da disposição elétrica do Atop/Displays", done: true },
          { label: "Configuração de Equipamentos", done: false },
          { label: "Mapeamento de pontos de decisão", done: false },
          { label: "Treinamento sistêmico e operacional", done: false },
          { label: "Relatório do projeto após go-live", done: false },
        ],
      },
      {
        id: "queluz",
        label: "PROJETO QUELUZ — Fase 1",
        summary: "Projeto urgente com 8 de 10 checkpoints já registrados no Planner.",
        handoff: "Passagem de bastão ao time de Pós-Vendas — Final",
        items: [
          { label: "Alinhamento com Documentação — Descritivo Funcional", done: true },
          { label: "Alinhamento com Desenvolvimento — Funcionalidades e Telas", done: true },
          { label: "Planilha de Script de Testes (Padrão)", done: true },
          { label: "Acesso VPN ao Servidor — Remoto", done: true },
          { label: "Mapeamento de IPs para Equipamentos", done: false },
          { label: "Alinhamento da disposição elétrica do Atop/Displays", done: true },
          { label: "Configuração de Equipamentos", done: true },
          { label: "Mapeamento de LEDs e Endereços", done: true },
          { label: "Testes WCS com cliente e pedidos", done: true },
          { label: "Relatório do projeto após go-live", done: false },
        ],
      },
    ],
  },
  ESP: {
    source: "extraído do Planner dos times",
    focal: "Thomas",
    deliveries: [
      { id: "esp-peter2", project: "PETER 2", title: "Passagem de Bastão (DEV + Implantação)", to: "IMP", due: "20/07/2026", status: "done", doneAt: "20/07 · 09:00", progress: "6/6", origin: "Planner" },
      { id: "esp-queluz", project: "QUELUZ — Fase 2", title: "Passagem de Bastão (DEV + Implantação)", to: "IMP", due: "28/08/2026", status: "andamento", progress: "4/6", origin: "Planner" },
    ],
    waiting: [
      { from: "Cliente", project: "QUELUZ — Fase 2", what: "Aprovação do descritivo funcional apresentado", side: "Cliente", age: "4 dias" },
      { from: "EMC", project: "QUELUZ — Fase 2", what: "Alinhamento final de layout para fechar a especificação", side: "Invent", age: "2 dias" },
    ],
    waitedBy: [
      { dept: "IMP", project: "QUELUZ — Fase 2", what: "Receber o bastão DEV para seguir com a implantação" },
      { dept: "WCS", project: "QUELUZ — Fase 2", what: "Regras funcionais aprovadas para continuar a configuração" },
    ],
    tracks: [
      {
        id: "esp-peter2",
        label: "PETER 2",
        summary: "Fluxo concluído e bastão já entregue para Implantação.",
        handoff: "Passagem de Bastão (DEV + Implantação)",
        items: [
          { label: "Kick Off do Projeto", done: true },
          { label: "Alinhamento com engenharia sobre layout", done: true },
          { label: "Escrever Descritivo Funcional", done: true },
          { label: "Apresentação ao Cliente", done: true },
          { label: "Aprovação do Descritivo Funcional", done: true },
          { label: "Bastão entregue à Implantação", done: true },
        ],
      },
      {
        id: "esp-queluz",
        label: "QUELUZ — Fase 2",
        summary: "Projeto em andamento com 4 de 6 checkpoints concluídos.",
        handoff: "Passagem de Bastão (DEV + Implantação)",
        items: [
          { label: "Kick Off do Projeto", done: true },
          { label: "Alinhamento com engenharia sobre layout", done: true },
          { label: "Escrever Descritivo Funcional", done: true },
          { label: "Apresentação ao Cliente", done: true },
          { label: "Aprovação do Descritivo Funcional", done: false },
          { label: "Bastão entregue à Implantação", done: false },
        ],
      },
    ],
  },
};

const FEED_SEED = [
  { t: "09/08 · 16:12", from: "INF", to: "WCS", txt: "Servidor SaaS AWS do TITANO liberado — DEV pode iniciar a instalação" },
  { t: "08/08 · 11:47", from: "CMP", to: "PRD", txt: "Materiais do QUELUZ entregues na produção" },
  { t: "05/08 · 09:20", from: "COM", to: "PMO", txt: "BR SUPPLY assinado — kickoff autorizado" },
];

const CHAT_SEED = [
  { t: "09/08 - 16:20", author: "InventAI", role: "Governança", txt: "Toda passagem de bastão precisa deixar resumo, responsável, pendência aberta e próxima ação." },
  { t: "09/08 - 15:55", author: "Daniel", role: "Implantacao", txt: "Checklist do Planner revisado. Falta evidenciar o que bloqueia a passagem final para Pos-vendas." },
  { t: "09/08 - 15:40", author: "Thomas", role: "Especificação / DevOps", txt: "Quando o descritivo for aprovado, eu sinalizo prontidão para Implantação seguir sem ruído." },
];

const SAMPLE_PROJECTS = ["TITANO", "QUELUZ", "MARKET PERU", "NAVEPARK", "BP", "MARKET CHILE"];
const PRIORITY_DEPTS = ["INF", "IMP", "ESP"];

function sampleFor(code) {
  const i = AREAS.findIndex((a) => a.code === code);
  const next = AREAS[(i + 1) % AREAS.length].code;
  const prev = AREAS[(i + AREAS.length - 1) % AREAS.length].code;
  return {
    deliveries: [
      { id: `${code}-1`, project: SAMPLE_PROJECTS[i % 6], title: `Entrega da etapa de ${areaName(code)}`, to: next, due: "18/08", status: "andamento" },
      { id: `${code}-2`, project: SAMPLE_PROJECTS[(i + 2) % 6], title: `Checklist de handoff para ${areaName(next)}`, to: next, due: "25/08", status: "pronto" },
    ],
    waiting: [
      { from: prev, project: SAMPLE_PROJECTS[(i + 1) % 6], what: `Conclusão da etapa de ${areaName(prev)}`, side: "Invent", age: "3 dias" },
    ],
    waitedBy: [
      { dept: next, project: SAMPLE_PROJECTS[i % 6], what: `Insumos da etapa de ${areaName(code)}` },
    ],
    tracks: [],
  };
}

const STATUS_LABEL = {
  pronto: "Pronto p/ concluir",
  andamento: "Em andamento",
  aguardando: "Aguardando terceiro",
  done: "Concluído",
};

function makeStamp() {
  const now = new Date();
  const hh = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return { hh, stamp: `hoje - ${hh}` };
}

function readStoredCockpitState(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function DepartmentCockpit({ notify, imported = [], initialDept = "IMP", currentUser = { name: "Admin", role: "Admin", dept: "ADM" } }) {
  const [dept, setDept] = useState(initialDept);
  const [doneMap, setDoneMap] = useState({});
  const [feed, setFeed] = useState(FEED_SEED);
  const [selectedTrack, setSelectedTrack] = useState("");
  const [handoffMap, setHandoffMap] = useState({});
  const [handoffReviewMap, setHandoffReviewMap] = useState({});
  const [trackDoneMap, setTrackDoneMap] = useState({});
  const [chargeMap, setChargeMap] = useState({});
  const [readyMap, setReadyMap] = useState({});
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState(CHAT_SEED);
  const [loadedStateKey, setLoadedStateKey] = useState("");
  const area = AREAS.find((a) => a.code === dept);
  const pilotConfig = PILOT_DEPARTMENTS[dept];
  const isPilot = Boolean(pilotConfig);
  const storageKey = `inventops-cockpit-state-${dept}`;

  const base = useMemo(
    () => (isPilot ? pilotConfig : sampleFor(dept)),
    [dept, isPilot, pilotConfig]
  );
  const priorityAreas = AREAS.filter((item) => PRIORITY_DEPTS.includes(item.code));

  const importedHere = imported.filter((d) => d.dept === dept).map((d, i) => ({
    id: `imp-${dept}-${i}`,
    project: d.project,
    title: d.title,
    to: d.to || "PMO",
    due: d.due || "a definir",
    status: "andamento",
    origin: "Kickoff Nexus",
  }));

  const deliveries = [...importedHere, ...base.deliveries].map((x) =>
    doneMap[x.id] ? { ...x, status: "done", doneAt: doneMap[x.id] } : x
  );
  const open = deliveries.filter((d) => d.status !== "done");
  const tracks = useMemo(() => (base.tracks || []).map((track) => ({
    ...track,
    items: track.items.map((item) => ({
      ...item,
      done: trackDoneMap[`${track.id}::${item.label}`] ?? item.done,
    })),
  })), [base.tracks, trackDoneMap]);
  const activeTrack = tracks.find((track) => track.id === selectedTrack) || tracks[0] || null;
  const pilotSummary = useMemo(() => tracks.map((track) => {
    const done = track.items.filter((item) => item.done).length;
    const total = track.items.length;
    return { id: track.id, label: track.label, handoff: track.handoff, done, total, percent: total ? Math.round((done / total) * 100) : 0 };
  }), [tracks]);

  useEffect(() => {
    setDept(initialDept);
    setSelectedTrack("");
  }, [initialDept]);

  useEffect(() => {
    const stored = readStoredCockpitState(storageKey);
    setDoneMap(stored?.doneMap || {});
    setFeed(stored?.feed || FEED_SEED);
    setHandoffMap(stored?.handoffMap || {});
    setHandoffReviewMap(stored?.handoffReviewMap || {});
    setTrackDoneMap(stored?.trackDoneMap || {});
    setChargeMap(stored?.chargeMap || {});
    setReadyMap(stored?.readyMap || {});
    setChatLog(stored?.chatLog || CHAT_SEED);
    setChatMessage("");
    setLoadedStateKey(storageKey);
  }, [storageKey]);

  useEffect(() => {
    if (loadedStateKey !== storageKey) return;
    const snapshot = {
      doneMap,
      feed,
      handoffMap,
      handoffReviewMap,
      trackDoneMap,
      chargeMap,
      readyMap,
      chatLog,
    };
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
    } catch {}
  }, [loadedStateKey, storageKey, doneMap, feed, handoffMap, handoffReviewMap, trackDoneMap, chargeMap, readyMap, chatLog]);

  const conclude = (item) => {
    const now = new Date();
    const hh = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const stamp = `hoje · ${hh}`;
    setDoneMap((m) => ({ ...m, [item.id]: stamp }));
    setChatLog((current) => [{ t: stamp, author: pilotConfig?.focal || area.gestor, role: area.nome, txt: `Conclui ${item.title} e notifiquei ${areaName(item.to)}. Projeto: ${item.project}.` }, ...current]);
    setFeed((f) => [{ t: stamp, from: dept, to: item.to, txt: `${item.title} (${item.project}) — liberado` }, ...f]);
    notify(`${areaName(item.to)} notificada: ${item.title} do ${item.project} está pronto. ✓ ${hh}`);
  };

  const copyTrackSummary = async () => {
    if (!activeTrack) return;
    const text = `${area.nome} · ${activeTrack.label}\n${activeTrack.summary}\n${activeTrack.items.map((item)=>`${item.done ? "✓" : "•"} ${item.label}`).join("\n")}\nHandoff: ${activeTrack.handoff}`;
    try { await navigator.clipboard.writeText(text); } catch {}
    const { stamp } = makeStamp();
    setFeed((current) => [{ t: stamp, from: dept, to: "PMO", txt: `Resumo operacional copiado: ${activeTrack.label} - ${activeTrack.handoff}` }, ...current]);
    notify(`Resumo de ${activeTrack.label} preparado para Daniel/Thomas revisar.`);
  };

  const trackCompleted = activeTrack ? activeTrack.items.every((item) => item.done) : false;
  const trackHandoffDone = activeTrack ? Boolean(handoffMap[activeTrack.id]) : false;
  const handoffReview = activeTrack ? handoffReviewMap[activeTrack.id] : null;
  const nextDependency = base.waiting[0];
  const nextConsumer = base.waitedBy[0];
  const nextDelivery = open[0] || deliveries[0];

  const registerCharge = () => {
    if (!activeTrack) return;
    const pending = activeTrack.items.filter((item) => !item.done).map((item) => item.label);
    const target = base.waiting[0];
    const { stamp } = makeStamp();
    if (target) {
      setFeed((current) => [{ t: stamp, from: dept, to: target.from === "Cliente" ? "Cliente" : target.from, txt: `Cobrança registrada em ${activeTrack.label}: ${target.what}` }, ...current]);
      setChatLog((current) => [{ t: stamp, author: pilotConfig?.focal || area.gestor, role: area.nome, txt: `Cobrei ${target.from === "Cliente" ? "cliente" : areaName(target.from)} sobre ${activeTrack.label}: ${target.what}` }, ...current]);
      notify(`Cobrança registrada para ${target.from === "Cliente" ? "cliente" : areaName(target.from)} sobre ${activeTrack.label}.`);
      return;
    }
    setFeed((current) => [{ t: stamp, from: dept, to: "PMO", txt: `Cobrança interna em ${activeTrack.label}: ${pending[0] || "sem pendência aberta"}` }, ...current]);
    setChatLog((current) => [{ t: stamp, author: pilotConfig?.focal || area.gestor, role: area.nome, txt: `Registrei cobrança para destravar ${activeTrack.label}: ${pending[0] || "sem pendência aberta"}.` }, ...current]);
    notify(`Cobrança registrada para destravar ${activeTrack.label}: ${pending[0] || "sem pendência aberta"}.`);
  };

  const pingWaiting = (waitingItem, index) => {
    const now = new Date();
    const hh = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const stamp = `hoje · ${hh}`;
    const key = `${dept}-waiting-${index}`;
    setChargeMap((current) => ({ ...current, [key]: stamp }));
    setChatLog((current) => [{ t: stamp, author: pilotConfig?.focal || area.gestor, role: area.nome, txt: `Cobrança enviada para ${waitingItem.from === "Cliente" ? "cliente" : areaName(waitingItem.from)}: ${waitingItem.what}` }, ...current]);
    setFeed((current) => [{ t: stamp, from: dept, to: waitingItem.from === "Cliente" ? "Cliente" : waitingItem.from, txt: `Cobrança registrada: ${waitingItem.what}` }, ...current]);
    notify(`Cobrança enviada sobre ${waitingItem.project}.`);
  };

  const signalReady = (waitingItem, index) => {
    const now = new Date();
    const hh = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const stamp = `hoje · ${hh}`;
    const key = `${dept}-waited-${index}`;
    setReadyMap((current) => ({ ...current, [key]: stamp }));
    setChatLog((current) => [{ t: stamp, author: pilotConfig?.focal || area.gestor, role: area.nome, txt: `Prontidão sinalizada para ${areaName(waitingItem.dept)}: ${waitingItem.what}` }, ...current]);
    setFeed((current) => [{ t: stamp, from: dept, to: waitingItem.dept, txt: `Área sinalizou prontidão: ${waitingItem.what}` }, ...current]);
    notify(`Prontidão sinalizada para ${areaName(waitingItem.dept)}.`);
  };

  const advanceTrack = () => {
    if (!activeTrack) return;
    const nextItem = activeTrack.items.find((item) => !item.done);
    if (!nextItem) {
      notify(`${activeTrack.label} já está com todos os checkpoints concluídos.`);
      return;
    }
    const { stamp } = makeStamp();
    setTrackDoneMap((current) => ({ ...current, [`${activeTrack.id}::${nextItem.label}`]: true }));
    setFeed((current) => [{ t: stamp, from: dept, to: dept, txt: `Checkpoint concluido em ${activeTrack.label}: ${nextItem.label}` }, ...current]);
    setChatLog((current) => [{ t: stamp, author: pilotConfig?.focal || area.gestor, role: area.nome, txt: `Checkpoint registrado: ${activeTrack.label} - ${nextItem.label}.` }, ...current]);
    notify(`Checkpoint concluído em ${activeTrack.label}: ${nextItem.label}.`);
  };

  const confirmHandoff = () => {
    if (!activeTrack || !trackCompleted || trackHandoffDone) return;
    const now = new Date();
    const hh = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const stamp = `hoje · ${hh}`;
    setHandoffMap((current) => ({ ...current, [activeTrack.id]: stamp }));
    setHandoffReviewMap((current) => ({ ...current, [activeTrack.id]: { status: "accepted", stamp } }));
    setChatLog((current) => [{ t: stamp, author: "InventAI", role: "Governanca", txt: `Handoff confirmado com checklist completo: ${activeTrack.label}. Evidencia vinculada a linha do tempo.` }, ...current]);
    setFeed((current) => [{ t: stamp, from: dept, to: activeTrack.handoff.replace("Passagem para ", "").replace("Passagem de bastão ao time de ", ""), txt: `${activeTrack.label} confirmou ${activeTrack.handoff}` }, ...current]);
    notify(`Handoff confirmado em ${activeTrack.label}.`);
  };

  const requestHandoffAdjustment = () => {
    if (!activeTrack || trackHandoffDone) return;
    const { stamp } = makeStamp();
    const pending = activeTrack.items.filter((item) => !item.done).map((item) => item.label);
    const reason = pending[0] || "validacao manual solicitada antes do aceite final";
    setHandoffReviewMap((current) => ({ ...current, [activeTrack.id]: { status: "adjustment", stamp, reason } }));
    setChatLog((current) => [{ t: stamp, author: pilotConfig?.focal || area.gestor, role: area.nome, txt: `Solicitei ajuste antes do handoff de ${activeTrack.label}: ${reason}.` }, ...current]);
    setFeed((current) => [{ t: stamp, from: dept, to: "PMO", txt: `Ajuste solicitado antes do aceite: ${activeTrack.label} - ${reason}` }, ...current]);
    notify(`Ajuste registrado para ${activeTrack.label}. O handoff ainda não foi aceito.`);
  };

  const sendChatMessage = (event) => {
    event.preventDefault();
    const msg = chatMessage.trim();
    if (!msg) return;
    const { stamp } = makeStamp();
    const author = pilotConfig?.focal || area.gestor;
    setChatLog((current) => [{ t: stamp, author, role: area.nome, txt: msg }, ...current]);
    setFeed((current) => [{ t: stamp, from: dept, to: "Historico", txt: `Comentario operacional registrado por ${author}: ${msg}` }, ...current]);
    setChatMessage("");
    notify(`Mensagem registrada no histórico de ${area.nome}.`);
  };

  return (
    <section className="page cockpit-page">
      <div className="pilot-focus-strip">
        {priorityAreas.map((item) => {
          const activePilot = dept === item.code;
          const pilotData = PILOT_DEPARTMENTS[item.code];
          return (
            <button key={item.code} className={activePilot ? "active" : ""} onClick={() => { setDept(item.code); setSelectedTrack(""); }}>
              <small>ÁREA EM OPERAÇÃO</small>
              <b>{item.nome}</b>
              <p>{pilotData?.focal || item.gestor} · {pilotData ? "esteira ativa" : "preparando entrada"}</p>
              <span>{activePilot ? "visão ativa" : "abrir área"}</span>
            </button>
          );
        })}
      </div>

      <div className="cockpit-picker" role="tablist" aria-label="Escolha o departamento">
        {AREAS.map((a) => (
          <button key={a.code} role="tab" aria-selected={dept === a.code} className={dept === a.code ? "active" : ""} onClick={() => { setDept(a.code); setSelectedTrack(""); }}>
            <b>{a.code}</b>
            <small>{a.nome}</small>
          </button>
        ))}
      </div>

      <div className="cockpit-head">
        <div>
          <h2>{area.nome}</h2>
          <p>
            Gestor: <b>{area.gestor}</b>
            {isPilot ? (
              <span className="pilot-tag">
                <Sparkle size={13} weight="fill" />
                operação assistida · {pilotConfig.source} · ponto focal {pilotConfig.focal} · sessão {currentUser.name}
              </span>
            ) : (
              <span className="sample-tag">área aguardando ativação operacional</span>
            )}
          </p>
        </div>
        <div className="cockpit-kpis">
          <span><b>{open.length}</b><small>entregas abertas</small></span>
          <span><b>{base.waiting.length}</b><small>aguardando de outros</small></span>
          <span><b>{base.waitedBy.length}</b><small>esperam por mim</small></span>
          <span><b>{feed.filter((f) => f.t.startsWith("hoje")).length}</b><small>handoffs hoje</small></span>
        </div>
      </div>

      <div className="cockpit-priority-row">
        <article>
          <small>PRÓXIMO DESBLOQUEIO</small>
          <b>{nextDependency ? nextDependency.what : "Sem bloqueio crítico aberto"}</b>
          <p>{nextDependency ? `${nextDependency.project} · aguardando ${nextDependency.from === "Cliente" ? "cliente" : areaName(nextDependency.from)}` : "A área está livre para seguir com a próxima etapa."}</p>
        </article>
        <article>
          <small>PRÓXIMO HANDOFF</small>
          <b>{nextDelivery ? nextDelivery.title : "Nenhuma entrega pendente"}</b>
          <p>{nextDelivery ? `${nextDelivery.project} · destino ${areaName(nextDelivery.to)}` : "Todas as entregas atuais já estão concluídas."}</p>
        </article>
        <article>
          <small>QUEM ESTÁ ESPERANDO</small>
          <b>{nextConsumer ? areaName(nextConsumer.dept) : "Sem fila de espera"}</b>
          <p>{nextConsumer ? `${nextConsumer.project} · ${nextConsumer.what}` : "Nenhuma outra área depende deste módulo agora."}</p>
        </article>
      </div>

      <article className="journey-checklist cockpit-journey">
        <header>
          <div>
            <small>SEQUÊNCIA DE ENTREGA</small>
            <h3>Onde estamos na jornada do produto</h3>
          </div>
          <span>{isPilot ? `${area.nome} está usando a regra real da área` : "Área aguardando ativação operacional"}</span>
        </header>
        <div>
          {cockpitJourney.map((step) => (
            <section key={step.id} className={step.state}>
              <i>{step.state === "done" ? <CheckCircle weight="fill" /> : step.state === "active" ? <Sparkle weight="fill" /> : <ClockCountdown weight="fill" />}</i>
              <div>
                <small>{step.state === "done" ? "CHECK" : step.state === "active" ? "ATUAL" : "PRÓXIMO"}</small>
                <b>{step.label}</b>
                <p>{step.detail}</p>
              </div>
            </section>
          ))}
        </div>
      </article>

      <div className="cockpit-grid">
        <article>
          <div className="section-heading"><b><CheckCircle /> Minhas entregas</b><span>O que este departamento deve ao fluxo.</span></div>
          <div className="cockpit-list">
            {deliveries.map((d) => (
              <div key={d.id} className={`hand-card ${d.status}`}>
                <header>
                  <small>{d.project}</small>
                  {d.origin ? <em className="origin-tag">⇪ {d.origin}</em> : null}
                  <span className={`hstatus ${d.status}`}>{STATUS_LABEL[d.status]}{d.progress ? ` · ${d.progress}` : ""}{d.status === "done" && d.doneAt ? ` ✓ ${d.doneAt}` : ""}</span>
                </header>
                <h3>{d.title}</h3>
                <footer>
                  <span><CalendarBlank />{d.due}</span>
                  <span><ArrowRight /> próxima área: <b>{areaName(d.to)}</b></span>
                  {d.status !== "done" ? (
                    <button className="conclude" onClick={() => conclude(d)} disabled={d.status === "aguardando"} title={d.status === "aguardando" ? "Aguardando terceiro — não dá pra concluir ainda" : "Marca como concluído e avisa a próxima área com carimbo de hora"}>
                      <PaperPlaneTilt />Concluir e notificar
                    </button>
                  ) : (
                    <span className="done-stamp"><CheckCircle weight="fill" />bastão passado</span>
                  )}
                </footer>
              </div>
            ))}
          </div>
        </article>

        <article>
          <div className="section-heading"><b><ClockCountdown /> Aguardando de outros</b><span>De quem é a bola que me trava.</span></div>
          <div className="cockpit-list">
            {base.waiting.map((w, i) => (
              <div key={i} className="hand-card waitrow">
                <header><small>{w.project}</small><span className={`side-tag ${w.side === "Cliente" ? "cli" : "inv"}`}>{w.side}</span></header>
                <h3>{w.what}</h3>
                <footer>
                  <span><Buildings />de: <b>{w.from === "Cliente" ? "Cliente" : areaName(w.from)}</b></span>
                  <span><Warning />{w.age} esperando</span>
                  {chargeMap[`${dept}-waiting-${i}`] ? <span className="mini-state done"><CheckCircle />{chargeMap[`${dept}-waiting-${i}`]}</span> : null}
                  <button className="ghost-mini" onClick={() => pingWaiting(w, i)}><Envelope />Cobrar</button>
                </footer>
              </div>
            ))}
          </div>
        </article>

        <article>
          <div className="section-heading"><b><UsersThree /> Esperam por mim</b><span>Quem depende deste departamento agora.</span></div>
          <div className="cockpit-list">
            {base.waitedBy.map((w, i) => (
              <div key={i} className="hand-card waitedrow">
                <header><small>{w.project}</small><span className="side-tag inv">{areaName(w.dept)}</span></header>
                <h3>{w.what}</h3>
                <footer>
                  <span><HandPalm />o bastão está com a gente</span>
                  {readyMap[`${dept}-waited-${i}`] ? <span className="mini-state done"><CheckCircle />{readyMap[`${dept}-waited-${i}`]}</span> : null}
                  <button className="ghost-mini" onClick={() => signalReady(w, i)}><PaperPlaneTilt />Sinalizar prontidão</button>
                </footer>
              </div>
            ))}
          </div>
        </article>
      </div>

      {activeTrack ? (
        <article className="cockpit-track">
          <div className="section-heading">
            <b><Sparkle /> Esteira operacional real</b>
            <span>Checklist do Planner incorporado sem alterar a regra do time.</span>
          </div>
          <div className="cockpit-track-pulse">
            {pilotSummary.map((item) => (
              <article key={item.id} className={activeTrack.id === item.id ? "active" : ""}>
                <small>PROJETO</small>
                <b>{item.label}</b>
                <span>{item.done}/{item.total} checkpoints</span>
                <em>{item.percent}% da esteira</em>
              </article>
            ))}
          </div>
          <div className="cockpit-track-tabs">
            {tracks.map((track) => (
              <button key={track.id} className={activeTrack.id === track.id ? "active" : ""} onClick={() => setSelectedTrack(track.id)}>
                <b>{track.label}</b>
                <small>{track.handoff}</small>
              </button>
            ))}
          </div>
          <div className="cockpit-track-body">
            <div className="cockpit-track-summary">
              <small>PROJETO OPERACIONAL</small>
              <h3>{activeTrack.label}</h3>
              <p>{activeTrack.summary}</p>
              <span>{activeTrack.handoff}</span>
              <div className={`handoff-gate ${trackHandoffDone ? "accepted" : handoffReview?.status === "adjustment" ? "adjustment" : "open"}`}>
                {trackHandoffDone ? <CheckCircle weight="fill" /> : handoffReview?.status === "adjustment" ? <XCircle weight="fill" /> : <ClockCountdown weight="fill" />}
                <div>
                  <small>GATE DE ACEITE</small>
                  <b>{trackHandoffDone ? `Aceito em ${handoffMap[activeTrack.id]}` : handoffReview?.status === "adjustment" ? `Ajuste solicitado em ${handoffReview.stamp}` : "Aguardando checklist completo"}</b>
                  <p>{trackHandoffDone ? "Bastão liberado com evidência e histórico." : handoffReview?.status === "adjustment" ? handoffReview.reason : "O sistema não considera a passagem concluída apenas porque está visível."}</p>
                </div>
              </div>
              <div className="cockpit-track-actions">
                <button className="ghost cockpit-track-action" type="button" onClick={copyTrackSummary}><ClipboardText />Copiar resumo</button>
                <button className="ghost cockpit-track-action" type="button" onClick={advanceTrack} disabled={trackCompleted}><CheckCircle />Concluir próximo checkpoint</button>
                <button className="ghost cockpit-track-action" type="button" onClick={registerCharge}><Envelope />Registrar cobrança</button>
                <button className="ghost cockpit-track-action" type="button" onClick={requestHandoffAdjustment} disabled={trackHandoffDone}><XCircle />Solicitar ajuste</button>
                <button className="ghost cockpit-track-action" type="button" onClick={confirmHandoff} disabled={!trackCompleted || trackHandoffDone}><PaperPlaneTilt />{trackHandoffDone ? "Handoff confirmado" : "Confirmar handoff"}</button>
              </div>
            </div>
            <div className="cockpit-track-list">
              {activeTrack.items.map((item) => (
                <div key={item.label} className={`track-step ${item.done ? "done" : ""}`}>
                  <i>{item.done ? <CheckCircle weight="fill" /> : <ClockCountdown weight="fill" />}</i>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </article>
      ) : null}

      <article className="cockpit-chat">
        <div className="section-heading">
          <b><ChatCircleText /> Chat operacional</b>
          <span>Contexto, decisões e dúvidas ficam ligados à mesma área e viram histórico auditável.</span>
        </div>
        <div className="chat-list">
          {chatLog.slice(0, 5).map((msg, index) => (
            <div key={`${msg.t}-${msg.author}-${index}`} className={msg.author === "InventAI" ? "ai" : ""}>
              <header>
                <b>{msg.author}</b>
                <span>{msg.role} - {msg.t}</span>
              </header>
              <p>{msg.txt}</p>
            </div>
          ))}
        </div>
        <form className="chat-compose" onSubmit={sendChatMessage}>
          <input
            value={chatMessage}
            onChange={(event) => setChatMessage(event.target.value)}
            placeholder={`Registrar decisao, duvida ou contexto de ${area.nome}...`}
            aria-label="Mensagem operacional"
          />
          <button type="submit"><PaperPlaneTilt />Registrar no histórico</button>
        </form>
      </article>

      <article className="cockpit-feed">
        <div className="section-heading"><b>Linha do tempo dos handoffs</b><span>Quem passou o bastão, para quem e quando — o fim do “alguém sabe se ficou pronto?”</span></div>
        <div className="feed-list">
          {feed.map((f, i) => (
            <div key={i} className={i === 0 && f.t.startsWith("hoje") ? "fresh" : ""}>
              <span className="feed-time">{f.t}</span>
              <span className="feed-route"><b>{f.from}</b><ArrowRight /><b>{f.to}</b></span>
              <p>{f.txt}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
