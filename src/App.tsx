import React, { useCallback, useEffect, useMemo, useState } from 'react';

const DEFAULT_GATEWAY = 'http://192.168.1.1:7331';

const statFallback = {
  uptime: '2d 14h',
  tasksRunning: 12,
  tasksQueued: 34,
  avgLatency: '320ms',
  dataProcessed: '128 GB',
  alerts: 2,
};

const taskTemplates = [
  {
    name: 'Social Media Sprint',
    description: '30 dni publikacji + plan stories + CTA dla marki osobistej.',
    tags: ['marketing', 'social', 'content'],
  },
  {
    name: 'Lead Magnet Launch',
    description: 'Generowanie leadów, landing page, automatyzacja maili.',
    tags: ['growth', 'email', 'automation'],
  },
  {
    name: 'Product Feedback Loop',
    description: 'Zbiórka opinii, analiza sentimentu, raport dla zespołu.',
    tags: ['research', 'product', 'insights'],
  },
  {
    name: 'Customer Support Boost',
    description: 'Inteligentna klasyfikacja zgłoszeń i priorytety.',
    tags: ['support', 'operations'],
  },
];

const taskBoard = [
  {
    title: 'Automatyzacja kampanii “Nowy kurs”',
    owner: 'Marketing',
    status: 'In Progress',
    due: 'Dziś 16:00',
    progress: 68,
  },
  {
    title: 'Analiza trendów z TikTok',
    owner: 'Growth Lab',
    status: 'Queued',
    due: 'Jutro 09:00',
    progress: 32,
  },
  {
    title: 'Monitoring opinii klientów',
    owner: 'Customer Success',
    status: 'Running',
    due: 'Dziś 18:30',
    progress: 81,
  },
  {
    title: 'Raport konkurencji Q3',
    owner: 'Product',
    status: 'Draft',
    due: 'Za 2 dni',
    progress: 12,
  },
];

const chartSeries = [
  { label: 'Automations', value: 78 },
  { label: 'Engagement', value: 64 },
  { label: 'Revenue', value: 52 },
  { label: 'Retention', value: 88 },
];

const featureCards = [
  {
    title: 'Live OpenMold Sync',
    detail: 'Bieżące logi, statystyki oraz monitoring tasków w czasie rzeczywistym.',
  },
  {
    title: 'Task Manager 2.0',
    detail: 'Priorytety, właściciele, SLA oraz automatyczne przypomnienia.',
  },
  {
    title: 'AI Playbooks',
    detail: 'Zestawy zadań gotowe dla social media, kampanii i researchu.',
  },
  {
    title: 'SaaS-grade Analytics',
    detail: 'Nowoczesne KPI, health score, wykresy i trendy w jednym miejscu.',
  },
];

const quickActions = [
  'Uruchom kampanię IG Reels',
  'Wygeneruj checklistę sprzedażową',
  'Skanuj opinie klientów z ostatnich 24h',
  'Zaplanuj 7-dniowy sprint treści',
];

const initialChat = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content:
      'Cześć! Jestem OpenMold Bot. Wyślij mi prompt, a zsynchronizuję się z Twoim agentem.',
    time: '08:00',
  },
];

const formatTime = (date: Date) =>
  date.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  });

function App() {
  const [gateway, setGateway] = useState(DEFAULT_GATEWAY);
  const [status, setStatus] = useState<'online' | 'offline' | 'syncing'>('syncing');
  const [stats, setStats] = useState(statFallback);
  const [logs, setLogs] = useState<string[]>([
    'Łączenie z OpenMold…',
    'Oczekiwanie na pierwsze logi z bota.',
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState(initialChat);
  const [isSending, setIsSending] = useState(false);
  const [lastSync, setLastSync] = useState('—');

  const fetchOpenMoldData = useCallback(async () => {
    setStatus('syncing');
    try {
      const [statusRes, statsRes, logsRes] = await Promise.all([
        fetch(`${gateway}/status`),
        fetch(`${gateway}/stats`),
        fetch(`${gateway}/logs?limit=6`),
      ]);

      if (statusRes.ok) {
        setStatus('online');
      } else {
        setStatus('offline');
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats({
          uptime: data.uptime ?? statFallback.uptime,
          tasksRunning: data.tasksRunning ?? statFallback.tasksRunning,
          tasksQueued: data.tasksQueued ?? statFallback.tasksQueued,
          avgLatency: data.avgLatency ?? statFallback.avgLatency,
          dataProcessed: data.dataProcessed ?? statFallback.dataProcessed,
          alerts: data.alerts ?? statFallback.alerts,
        });
      }

      if (logsRes.ok) {
        const data = await logsRes.json();
        if (Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
      }

      setLastSync(formatTime(new Date()));
    } catch (error) {
      setStatus('offline');
      setLogs((prev) =>
        prev.length > 1 ? prev : [...prev, 'Nie udało się połączyć z OpenMold.']
      );
      setLastSync(formatTime(new Date()));
    }
  }, [gateway]);

  useEffect(() => {
    fetchOpenMoldData();
    const interval = window.setInterval(fetchOpenMoldData, 15000);
    return () => window.clearInterval(interval);
  }, [fetchOpenMoldData]);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!chatInput.trim()) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: chatInput.trim(),
      time: formatTime(new Date()),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsSending(true);

    try {
      const response = await fetch(`${gateway}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error('Chat request failed');
      }

      const data = await response.json();
      const reply =
        data.reply ??
        data.message ??
        'OpenMold: wiadomość dostarczona. Czekam na dalsze instrukcje.';

      setChatMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply,
          time: formatTime(new Date()),
        },
      ]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content:
            'Nie udało się wysłać wiadomości do OpenMold. Sprawdź połączenie i gateway.',
          time: formatTime(new Date()),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const statusBadge = useMemo(() => {
    if (status === 'online') {
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
    if (status === 'syncing') {
      return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  }, [status]);

  const statusLabel =
    status === 'online'
      ? 'Online'
      : status === 'syncing'
      ? 'Synchronizacja'
      : 'Offline';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900 to-indigo-950/60 p-8 shadow-[0_0_80px_rgba(79,70,229,0.2)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">
                OpenMold Ops Suite
              </p>
              <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
                Nowoczesny dashboard sterowania botem OpenMold
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-300">
                Open-source panel do lokalnej orkiestracji zadań, statystyk i komunikacji z
                botem. Wszystkie dane są pobierane bezpośrednio z Twojego gateway.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm">
              <div className="flex items-center justify-between gap-6">
                <span className="text-slate-400">Status gateway</span>
                <span className={`rounded-full border px-3 py-1 text-xs ${statusBadge}`}>
                  {statusLabel}
                </span>
              </div>
              <div className="flex items-center justify-between gap-6 text-slate-300">
                <span>Ostatnia synchronizacja</span>
                <span>{lastSync}</span>
              </div>
              <div className="text-xs text-slate-400">Domyślny gateway: {DEFAULT_GATEWAY}</div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {featureCards.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
              >
                <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{feature.detail}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: 'Uptime', value: stats.uptime },
                { label: 'Aktywne taski', value: stats.tasksRunning },
                { label: 'Taski w kolejce', value: stats.tasksQueued },
                { label: 'Średnia latencja', value: stats.avgLatency },
                { label: 'Przetworzone dane', value: stats.dataProcessed },
                { label: 'Aktywne alerty', value: stats.alerts },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Nowoczesne statystyki</h2>
                  <p className="text-sm text-slate-400">
                    Trendy wzrostu i performance w ujęciu tygodniowym.
                  </p>
                </div>
                <button className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-xs text-indigo-200">
                  Eksportuj raport
                </button>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                {chartSeries.map((series) => (
                  <div
                    key={series.label}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                  >
                    <p className="text-sm text-slate-300">{series.label}</p>
                    <div className="h-2 w-full rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400"
                        style={{ width: `${series.value}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400">{series.value}% celu</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Task manager</h2>
                  <p className="text-sm text-slate-400">
                    Zarządzaj pipeline zadań i monitoruj postęp w czasie rzeczywistym.
                  </p>
                </div>
                <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white">
                  Dodaj task
                </button>
              </div>
              <div className="mt-6 grid gap-4">
                {taskBoard.map((task) => (
                  <div
                    key={task.title}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-white">{task.title}</h3>
                        <p className="text-sm text-slate-400">
                          {task.owner} · Termin: {task.due}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                        {task.status}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-slate-800">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <h2 className="text-lg font-semibold">Połączenie z OpenMold</h2>
              <p className="mt-2 text-sm text-slate-400">
                Ustaw lokalny gateway i zsynchronizuj dane z botem bezpośrednio z sieci LAN.
              </p>
              <form
                className="mt-4 flex flex-col gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  fetchOpenMoldData();
                }}
              >
                <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Gateway URL
                </label>
                <input
                  className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400"
                  value={gateway}
                  onChange={(event) => setGateway(event.target.value)}
                  placeholder={DEFAULT_GATEWAY}
                />
                <button
                  type="submit"
                  className="rounded-2xl border border-indigo-500/40 bg-indigo-500/20 px-4 py-3 text-sm font-semibold text-indigo-100"
                >
                  Odśwież połączenie
                </button>
              </form>
              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <h3 className="text-sm font-semibold text-white">Instrukcja połączenia</h3>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-400">
                  <li>Uruchom OpenMold Bot lokalnie w sieci.</li>
                  <li>Upewnij się, że API odpowiada na {DEFAULT_GATEWAY}.</li>
                  <li>Wpisz gateway powyżej, kliknij „Odśwież połączenie”.</li>
                  <li>Sprawdź, czy status zmienił się na Online.</li>
                </ol>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Live logi bota</h2>
                <span className="text-xs text-slate-500">Ostatnie {logs.length} wpisów</span>
              </div>
              <div className="mt-4 space-y-3">
                {logs.map((log, index) => (
                  <div
                    key={`${log}-${index}`}
                    className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300"
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <h2 className="text-lg font-semibold">Szybkie akcje</h2>
              <div className="mt-4 grid gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-indigo-400/60 hover:text-white"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Biblioteka templatek</h2>
              <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white">
                Nowy template
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Gotowe playbooki do uruchamiania powtarzalnych zadań.
            </p>
            <div className="mt-4 grid gap-4">
              {taskTemplates.map((template) => (
                <div
                  key={template.name}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                >
                  <h3 className="text-base font-semibold text-white">{template.name}</h3>
                  <p className="mt-2 text-sm text-slate-400">{template.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Chat z OpenMold Bot</h2>
              <span className="text-xs text-slate-500">Połączony z {gateway}</span>
            </div>
            <div className="mt-4 max-h-[360px] space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col gap-2 rounded-2xl border border-white/10 p-3 text-sm ${
                    message.role === 'user'
                      ? 'ml-auto bg-indigo-500/20 text-indigo-50'
                      : 'bg-slate-900/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{message.role === 'user' ? 'Ty' : 'OpenMold Bot'}</span>
                    <span>{message.time}</span>
                  </div>
                  <p>{message.content}</p>
                </div>
              ))}
            </div>
            <form className="mt-4 flex flex-col gap-3" onSubmit={handleSend}>
              <textarea
                className="min-h-[90px] rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400"
                placeholder="Napisz prompt do OpenMold…"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
              />
              <button
                type="submit"
                disabled={isSending}
                className="rounded-2xl border border-emerald-500/40 bg-emerald-500/20 px-4 py-3 text-sm font-semibold text-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSending ? 'Wysyłanie…' : 'Wyślij do OpenMold'}
              </button>
            </form>
          </div>
        </section>

        <footer className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-400">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>
              Projekt open source. Dashboard działa lokalnie i nigdy nie wysyła danych poza
              Twoją sieć.
            </p>
            <div className="flex gap-4 text-xs text-slate-500">
              <span>Licencja MIT</span>
              <span>Wersja 0.9.0</span>
              <span>Status API: {statusLabel}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
