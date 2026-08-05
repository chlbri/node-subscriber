import {
  createSubscriber,
  type SubscriberState,
} from '@bemedev/subscriber';
import { createFileRoute } from '@tanstack/solid-router';
import { createEffect, createSignal, onCleanup } from 'solid-js';
import { counter$, counterActions } from '#/lib/store';

const StateChip = (props: { state: SubscriberState }) => {
  const cls = () =>
    ({
      active: 'chip-active',
      paused: 'chip-paused',
      inactive: 'chip-inactive',
      disposed: 'chip-disposed',
    })[props.state];

  return (
    <span class={`state-chip ${cls()}`}>
      <span
        style={{
          width: '6px',
          height: '6px',
          'border-radius': '50%',
          background: 'currentColor',
          display: 'inline-block',
          opacity: props.state === 'active' ? '1' : '0.5',
        }}
      />
      {props.state}
    </span>
  );
};

export const Route = createFileRoute('/')({
  component: () => {
    // ── Manual subscriber for lifecycle control ─────────────────────────────
    const [subState, setSubState] =
      createSignal<SubscriberState>('active');

    const [count, setCount] = createSignal(0);
    const [step, setStep] = createSignal(1);
    const doubled = () => count() * 2;
    const builder = createSubscriber(counter$);

    const sub = builder.subscribe(({ count, step }) => {
      setCount(count);
      setStep(step);
    });

    onCleanup(sub.dispose);

    // ── Bump animation on count change ──────────────────────────────────────
    const [bump, setBump] = createSignal(false);
    let prevCount = 0;
    createEffect(() => {
      const c = count();
      if (c !== prevCount) {
        prevCount = c;
        setBump(true);
        const t = setTimeout(() => setBump(false), 260);
        onCleanup(() => clearTimeout(t));
      }
    });

    const isActive = () => subState() === 'active';
    const isPaused = () => subState() === 'paused';
    const isInactive = () => subState() === 'inactive';

    return (
      <div class='page'>
        {/* ── Header ── */}
        <header class='header'>
          <div class='badge'>
            <span class='badge-dot' />
            @bemedev/solid-subscriber
          </div>
          <h1>Reactive Subscriber</h1>
          <p>
            Live demo using{' '}
            <strong style={{ color: 'var(--accent)' }}>
              createSubscriberSignal
            </strong>{' '}
            + RxJS BehaviorSubject via TanStack Router
          </p>
        </header>

        {/* ── Main counter ── */}
        <div class='card'>
          <div class='card-title'>Live Value</div>
          <div class='counter-display'>
            <div class={`counter-value${bump() ? ' bump' : ''}`}>
              {count()}
            </div>
            <div class='counter-label'>current count</div>
          </div>
          <div class='divider' />
          <div class='stat-row'>
            <div class='stat'>
              <div class='stat-label'>Count * 2</div>
              <div class='stat-value'>{doubled() ?? 0}</div>
            </div>
            <div class='stat'>
              <div class='stat-label'>Step size</div>
              <div class='stat-value'>{step()}</div>
            </div>
          </div>
        </div>

        {/* ── Counter controls ── */}
        <div class='card'>
          <div class='card-title'>Counter Actions</div>
          <div class='btn-grid'>
            <button
              class='btn btn-primary'
              onClick={counterActions.increment}
            >
              + Increment
            </button>
            <button
              class='btn btn-primary'
              onClick={counterActions.decrement}
            >
              − Decrement
            </button>
            <button
              class='btn btn-muted'
              onClick={counterActions.reset}
              style={{ 'grid-column': 'span 2' }}
            >
              ↺ Reset
            </button>
          </div>
          <div class='divider' />
          <div class='step-control'>
            <span class='step-label'>Step</span>
            <input
              class='step-input'
              type='range'
              min={1}
              max={100}
              value={step()}
              onInput={e =>
                counterActions.setStep(Number(e.currentTarget.value))
              }
            />
            <span class='step-value'>{step()}</span>
          </div>
        </div>

        {/* ── Subscriber lifecycle ── */}
        <div class='card'>
          <div class='card-title'>Subscriber Lifecycle</div>
          <div class='state-row' style={{ 'margin-bottom': '1rem' }}>
            <span
              style={{
                'font-size': '0.8rem',
                color: 'var(--text-secondary)',
              }}
            >
              State:
            </span>
            <StateChip state={subState()} />
          </div>
          <div class='btn-grid'>
            <button
              class='btn btn-warning'
              disabled={!isActive()}
              onClick={() => {
                sub?.close();
                setSubState('paused');
              }}
            >
              ⏸ Pause
            </button>
            <button
              class='btn btn-success'
              disabled={!isPaused()}
              onClick={() => {
                sub?.open();
                setSubState('active');
              }}
            >
              ▶ Resume
            </button>
            <button
              class='btn btn-danger'
              disabled={isInactive() || subState() === 'disposed'}
              onClick={() => {
                sub?.unsubscribe();
                setSubState('inactive');
              }}
            >
              ⏹ Unsubscribe
            </button>
            <button
              class='btn btn-success'
              disabled={!isInactive()}
              onClick={() => {
                sub?.reSubscribe();
                setSubState('active');
              }}
            >
              ↻ Resubscribe
            </button>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer class='footer'>
          Powered by{' '}
          <a
            href='https://github.com/chlbri/node-subscriber'
            target='_blank'
            rel='noreferrer'
          >
            @bemedev/subscriber
          </a>{' '}
          ·{' '}
          <a
            href='https://tanstack.com/router'
            target='_blank'
            rel='noreferrer'
          >
            TanStack Router
          </a>
        </footer>
      </div>
    );
  },
});
