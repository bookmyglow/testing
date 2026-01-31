const statusBadgeStyles: Record<string, string> = {
  Online: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/30',
  Warning: 'bg-amber-500/10 text-amber-200 border-amber-500/30',
  Offline: 'bg-rose-500/10 text-rose-200 border-rose-500/30',
};

const services = [
  { name: 'Gateway', status: 'Online', uptime: '99.98%', latency: '48ms', region: 'EU-West' },
  { name: 'Command Bus', status: 'Online', uptime: '99.91%', latency: '64ms', region: 'US-East' },
  { name: 'Realtime Sync', status: 'Warning', uptime: '96.20%', latency: '142ms', region: 'APAC' },
  { name: 'Event Store', status: 'Online', uptime: '99.74%', latency: '72ms', region: 'EU-Central' },
  { name: 'Media Processor', status: 'Offline', uptime: '88.30%', latency: '—', region: 'US-West' },
];

const activities = [
  {
    title: 'Alerting rule updated',
    detail: 'Latency threshold set to 150ms for realtime sync.',
    time: '2 min ago',
  },
  {
    title: 'New scenario deployed',
    detail: 'Openmolt BOT onboarding guide v3 published.',
    time: '23 min ago',
  },
  {
    title: 'Storage checkpoint created',
    detail: 'Event store snapshot saved for Q2 audit.',
    time: '1 hr ago',
  },
  {
    title: 'Security scan complete',
    detail: 'No critical issues detected in container fleet.',
    time: '4 hr ago',
  },
];

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-6 py-8">
        <aside className="hidden w-64 flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-900/40 lg:flex">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Openmolt</p>
            <h1 className="mt-2 text-2xl font-semibold">BOT Console</h1>
            <p className="mt-2 text-sm text-slate-400">
              Monitoruj, steruj i optymalizuj automatyzacje w czasie rzeczywistym.
            </p>
          </div>
          <nav className="flex flex-col gap-2 text-sm">
            {[
              'Dashboard',
              'Scenariusze',
              'Zdarzenia',
              'Automatyzacje',
              'Zasoby',
              'Raporty',
              'Ustawienia',
            ].map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-xl border border-transparent px-3 py-2 text-left text-slate-200 transition hover:border-slate-700 hover:bg-slate-800/60"
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Status systemu</p>
            <p className="mt-2 text-lg font-semibold text-emerald-200">99.94% SLA</p>
            <p className="mt-1 text-xs text-slate-400">Ostatnia przerwa: 12 dni temu</p>
          </div>
        </aside>

        <main className="flex-1 space-y-8">
          <header className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950 p-6 shadow-lg shadow-slate-900/50">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Pulpit dowodzenia</p>
                <h2 className="mt-2 text-3xl font-semibold">Openmolt BOT</h2>
                <p className="mt-2 max-w-xl text-sm text-slate-300">
                  Scentralizowane centrum operacyjne dla Twojego bota. Monitoruj wydajność, scenariusze
                  i zgodność z SLA w czasie rzeczywistym.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  Eksportuj dane
                </button>
                <button
                  type="button"
                  className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Uruchom scenariusz
                </button>
              </div>
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Aktywne scenariusze', value: '28', delta: '+3 od wczoraj' },
              { label: 'Przetworzone zdarzenia', value: '128 402', delta: '+12% tydzień/tydzień' },
              { label: 'Średnia latencja', value: '62 ms', delta: '-18% vs. 24h' },
              { label: 'Kolejka zadań', value: '412', delta: 'Najwyższa: 610' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm shadow-slate-900/40"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                <p className="mt-4 text-3xl font-semibold">{item.value}</p>
                <p className="mt-2 text-sm text-slate-400">{item.delta}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Infrastruktura usług</h3>
                  <p className="text-sm text-slate-400">Monitoring krytycznych komponentów Openmolt BOT.</p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-slate-700 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300"
                >
                  Aktualizuj
                </button>
              </div>
              <div className="mt-6 space-y-4">
                {services.map((service) => (
                  <div
                    key={service.name}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3"
                  >
                    <div>
                      <p className="text-base font-medium">{service.name}</p>
                      <p className="text-xs text-slate-500">Region: {service.region}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                      <span className={`rounded-full border px-3 py-1 text-xs ${statusBadgeStyles[service.status]}`}>
                        {service.status}
                      </span>
                      <span>Uptime: {service.uptime}</span>
                      <span>Latency: {service.latency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-lg font-semibold">Priorytety dzisiaj</h3>
              <p className="text-sm text-slate-400">Najważniejsze zadania dla zespołu operacyjnego.</p>
              <ul className="mt-6 space-y-4 text-sm text-slate-200">
                {[
                  'Ustabilizować opóźnienia dla Realtime Sync.',
                  'Zaktualizować szablony scenariuszy supportowych.',
                  'Przeprowadzić testy awaryjne regionu US-West.',
                  'Włączyć automatyczną analizę sentymentu.',
                ].map((task) => (
                  <li key={task} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-lg font-semibold">Aktywność w czasie rzeczywistym</h3>
              <p className="text-sm text-slate-400">Najnowsze zdarzenia oraz zmiany w systemie.</p>
              <div className="mt-6 space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.title}
                    className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
                  >
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <p className="font-medium text-slate-100">{activity.title}</p>
                      <span className="text-xs uppercase text-slate-500">{activity.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{activity.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-lg font-semibold">Zespół operatorów</h3>
              <p className="text-sm text-slate-400">Dyżury i dostępność kluczowych osób.</p>
              <div className="mt-6 space-y-4">
                {[
                  { name: 'Alicja Nowak', role: 'Koordynacja scenariuszy', status: 'On duty' },
                  { name: 'Mateusz Zieliński', role: 'SRE / infrastruktura', status: 'On call' },
                  { name: 'Klaudia Wrona', role: 'Automatyzacje AI', status: 'On duty' },
                ].map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-100">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.role}</p>
                    </div>
                    <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                      {member.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
