import { useState } from 'react';
import {
  AudioLines,
  Cable,
  CircleAlert,
  Info,
  Keyboard,
  Monitor,
  Network,
  RadioTower,
  RotateCcw,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { Button, DemoTag, Dialog, NotConnected, Panel, Segmented, Switch } from '../components/ui.tsx';
import { INTEGRATIONS, STREAMDECK_MAPPING, type Integration, type IntegrationId } from '../data/integrations.ts';
import { createInitialState } from '../data/sample.ts';
import { testConnection, type ConnectionState } from '../integrations/adapters.ts';
import { useStore } from '../state/store.tsx';
import type { Settings } from '../state/types.ts';

const ICONS: Record<IntegrationId, LucideIcon> = {
  zoom: Video,
  streamdeck: Keyboard,
  osc: Network,
  ndi: Monitor,
  srt: RadioTower,
  sdi: Cable,
  audio: AudioLines,
};

export function IntegrationDialog({ integration, onClose }: { integration: Integration | null; onClose: () => void }) {
  return (
    <Dialog open={!!integration} onClose={onClose} title={integration ? integration.name : ''} size="lg">
      {integration && (
        <>
          <div className="row">
            {integration.status === 'demo' ? <DemoTag>Demo</DemoTag> : <NotConnected />}
            <span className="subtle">{integration.category}</span>
          </div>
          <p>{integration.summary}</p>
          <section className="detail-section">
            <h3 className="eyebrow">Was der Prototyp heute macht</h3>
            <ul className="rules">
              {integration.today.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
          <section className="detail-section">
            <h3 className="eyebrow">Was eine echte Verbindung voraussetzt</h3>
            <dl className="requirements">
              {integration.requires.map((r) => (
                <div key={r.label}>
                  <dt>{r.label}</dt>
                  <dd>{r.text}</dd>
                </div>
              ))}
            </dl>
          </section>
          {integration.id === 'streamdeck' && (
            <section className="detail-section">
              <h3 className="eyebrow">Geplante Belegung (15 Tasten)</h3>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Taste</th>
                      <th scope="col">Aktion</th>
                      <th scope="col">Anzeige auf der Taste</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STREAMDECK_MAPPING.map((m) => (
                      <tr key={m.key}>
                        <th scope="row">{m.key}</th>
                        <td>{m.action}</td>
                        <td className="subtle">{m.feedback}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          <section className="detail-section">
            <h3 className="eyebrow">Vor der Umsetzung klären</h3>
            <ul className="rules">
              {integration.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </section>
          <p className="callout callout--info">
            <Info size={16} aria-hidden /> Angaben vor einer Umsetzung mit der aktuellen Dokumentation des Herstellers abgleichen. Kontorechte,
            Lizenzen und Hardware können sich je nach Tarif unterscheiden.
          </p>
        </>
      )}
    </Dialog>
  );
}

function IntegrationCard({ integration, onDetails }: { integration: Integration; onDetails: () => void }) {
  const [test, setTest] = useState<ConnectionState | null>(null);
  const Icon = ICONS[integration.id];
  return (
    <article className="int-card" aria-labelledby={`int-${integration.id}`}>
      <header className="int-card__head">
        <span className="int-card__icon">
          <Icon size={20} aria-hidden />
        </span>
        <div className="int-card__titles">
          <h3 id={`int-${integration.id}`}>{integration.name}</h3>
          <span className="subtle">{integration.category}</span>
        </div>
      </header>
      <div className="row">{integration.status === 'demo' ? <DemoTag>Demo</DemoTag> : <NotConnected />}</div>
      <p className="int-card__summary">{integration.summary}</p>
      {test?.status === 'fehler' && (
        <p className="callout callout--danger" role="alert">
          <CircleAlert size={16} aria-hidden /> {test.message}
        </p>
      )}
      <footer className="int-card__foot">
        <Button size="sm" icon={Info} onClick={onDetails}>
          Details
        </Button>
        <Button
          size="sm"
          variant="ghost"
          loading={test?.status === 'verbindet'}
          disabled={test?.status === 'verbindet'}
          onClick={async () => {
            setTest({ status: 'verbindet' });
            setTest(await testConnection(integration.name));
          }}
        >
          {test?.status === 'verbindet' ? 'Prüft …' : 'Verbindung testen'}
        </Button>
      </footer>
    </article>
  );
}

export function IntegrationsView() {
  const { state, dispatch, notify } = useStore();
  const [detail, setDetail] = useState<Integration | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const s = state.settings;
  const set = (patch: Partial<Settings>) => dispatch({ type: 'settings/update', patch });

  return (
    <div className="view">
      <header className="view__head">
        <div className="view__titles">
          <span className="eyebrow">Integrationen und Einstellungen</span>
          <h1 className="view__title">Integrationen</h1>
          <p className="view__lead">
            Keine dieser Verbindungen ist im Prototyp aktiv. Die Karten zeigen, welche offiziell unterstützte Schnittstelle, Berechtigung, Lizenz oder
            Hardware eine echte Anbindung bräuchte.
          </p>
        </div>
      </header>

      <div className="int-grid">
        {INTEGRATIONS.map((i) => (
          <IntegrationCard key={i.id} integration={i} onDetails={() => setDetail(i)} />
        ))}
      </div>

      <div className="settings-grid">
        <Panel eyebrow="Einstellungen" title="Bedienung">
          <div className="stack">
            <Switch
              checked={s.autoDemo}
              onChange={(v) => set({ autoDemo: v })}
              label="Live-Simulation"
              description="Erzeugt alle paar Sekunden Chat-Beiträge, Handzeichen, Reaktionen und Sprecherwechsel."
            />
            <Switch
              checked={s.lowerHandOnSpotlight}
              onChange={(v) => set({ lowerHandOnSpotlight: v })}
              label="Hand beim Spotlight automatisch senken"
              description="Aus empfohlen: So bleibt die Person in der Liste und ein zweiter Klick nimmt das Spotlight zurück."
            />
            <Switch
              checked={s.shortcuts}
              onChange={(v) => set({ shortcuts: v })}
              label="Tastenkürzel für Aktionen"
              description="N, M, G, U, K, W, H, X, R und S. Alt + 1 bis 7 wechselt immer den Bereich."
            />
            <Segmented<number>
              label="Höchstens im Spotlight"
              value={s.maxSpotlight}
              onChange={(maxSpotlight) => set({ maxSpotlight })}
              options={[1, 2, 4, 6, 9].map((n) => ({ value: n, label: String(n) }))}
            />
            <Segmented<Settings['motion']>
              label="Bewegung"
              value={s.motion}
              onChange={(motion) => set({ motion })}
              options={[
                { value: 'system', label: 'Wie System' },
                { value: 'reduziert', label: 'Reduziert' },
                { value: 'normal', label: 'Normal' },
              ]}
            />
          </div>
        </Panel>

        <Panel eyebrow="Architektur" title="Integrationsgrenzen">
          <ul className="rules">
            <li>Alle Bereiche lesen einen gemeinsamen Zustand: Veranstaltung, Teilnehmende, Chat, Spotlight und eingeblendete Grafik.</li>
            <li>Bedienaktionen laufen über lokale Befehle. Später ersetzt ein Adapter die Demo-Befehle, ohne die Oberfläche zu ändern.</li>
            <li>
              Vorgesehene Adapter: <code>MeetingAdapter</code> (Konferenzplattform), <code>ControllerAdapter</code> (Tastenfeld) und{' '}
              <code>OutputAdapter</code> (Video- und Audioausgänge).
            </li>
            <li>Chat-Auswertung bleibt im Browser. Es werden keine Daten an Dritte gesendet.</li>
          </ul>
        </Panel>

        <Panel eyebrow="Demo" title="Beispieldaten">
          <div className="stack">
            <p className="muted">Setzt Teilnehmende, Chat, Umfrage, Karte, Wortwolke und Steuerpult auf den Ausgangszustand zurück.</p>
            <Button icon={RotateCcw} variant="danger" onClick={() => setResetOpen(true)}>
              Demo-Daten zurücksetzen
            </Button>
          </div>
        </Panel>
      </div>

      <IntegrationDialog integration={detail} onClose={() => setDetail(null)} />
      <Dialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Demo-Daten zurücksetzen?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setResetOpen(false)}>
              Abbrechen
            </Button>
            <Button
              variant="danger-solid"
              icon={RotateCcw}
              onClick={() => {
                dispatch({ type: 'demo/replace', state: createInitialState() });
                setResetOpen(false);
                notify('Demo-Daten zurückgesetzt', 'info');
              }}
            >
              Zurücksetzen
            </Button>
          </>
        }
      >
        <p>Alle Änderungen in dieser Sitzung gehen verloren. Es gibt keine gespeicherten Daten außerhalb dieses Browserfensters.</p>
      </Dialog>
    </div>
  );
}
