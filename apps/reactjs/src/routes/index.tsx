import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import {
  createSubscriber,
  type SubscriberState,
  type Subscriber,
} from '@bemedev/subscriber';

import { counter$, counterActions } from '#/lib/store';

const StateChip = ({ state }: { state: SubscriberState }) => {
  const cls = {
    active: 'chip-active',
    paused: 'chip-paused',
    inactive: 'chip-inactive',
    disposed: 'chip-disposed',
  }[state];
  return (
    <span className={`state-chip ${cls}`}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'currentColor',
          display: 'inline-block',
          opacity: state === 'active' ? 1 : 0.5,
        }}
      />
      {state}
    </span>
  );
};

export const Route = createFileRoute('/')({
  component: () => {
    const [subState, setSubState] = useState<SubscriberState>('active');
    const [count, setCount] = useState(0);
    const [step, setStep] = useState(1);
    const doubled = count * 2;

    const subRef = useRef<Subscriber<{
      count: number;
      step: number;
    }> | null>(null);

    useEffect(() => {
      const sub = createSubscriber(counter$).subscribe(
        ({ count, step }) => {
          setSubState(sub.state as SubscriberState);
          setCount(count);
          setStep(step);
        },
      );
      subRef.current = sub;

      setSubState(sub.state as SubscriberState);
      return () => {
        sub.dispose();
      };
    }, []);

    // Bump animation
    const [bump, setBump] = useState(false);
    const prevCount = useRef(count);
    useEffect(() => {
      if (count !== prevCount.current) {
        setBump(true);
        prevCount.current = count;
        const t = setTimeout(() => setBump(false), 260);
        return () => clearTimeout(t);
      }
    }, [count]);

    const isActive = subState === 'active';
    const isPaused = subState === 'paused';
    const isInactive = subState === 'inactive';

    return (
      <div className='page'>
        {/* ── Header ── */}
        <header className='header'>
          <div className='badge'>
            <span className='badge-dot' />
            @bemedev/react-subscriber
          </div>
          <h1>Reactive Subscriber</h1>
          <p>
            Live demo using{' '}
            <strong style={{ color: 'var(--accent)' }}>
              useSubscriber
            </strong>{' '}
            + RxJS BehaviorSubject via TanStack Router
          </p>
        </header>

        {/* ── Main counter ── */}
        <div className='card'>
          <div className='card-title'>Live Value</div>
          <div className='counter-display'>
            <div className={`counter-value${bump ? ' bump' : ''}`}>
              {count}
            </div>
            <div className='counter-label'>current count</div>
          </div>
          <div className='divider' />
          <div className='stat-row'>
            <div className='stat'>
              <div className='stat-label'>Count × 2</div>
              <div className='stat-value'>{doubled ?? 0}</div>
            </div>
            <div className='stat'>
              <div className='stat-label'>Step size</div>
              <div className='stat-value'>{step}</div>
            </div>
          </div>
        </div>

        {/* ── Counter controls ── */}
        <div className='card'>
          <div className='card-title'>Counter Actions</div>
          <div className='btn-grid'>
            <button
              className='btn btn-primary'
              onClick={counterActions.increment}
            >
              + Increment
            </button>
            <button
              className='btn btn-primary'
              onClick={counterActions.decrement}
            >
              − Decrement
            </button>
            <button
              className='btn btn-muted'
              onClick={counterActions.reset}
              style={{ gridColumn: 'span 2' }}
            >
              ↺ Reset
            </button>
          </div>
          <div className='divider' />
          <div className='step-control'>
            <span className='step-label'>Step</span>
            <input
              className='step-input'
              type='range'
              min={1}
              max={100}
              value={step}
              onChange={e =>
                counterActions.setStep(Number(e.target.value))
              }
            />
            <span className='step-value'>{step}</span>
          </div>
        </div>

        {/* ── Subscriber lifecycle ── */}
        <div className='card'>
          <div className='card-title'>Subscriber Lifecycle</div>
          <div className='state-row' style={{ marginBottom: '1rem' }}>
            <span
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
              }}
            >
              State:
            </span>
            <StateChip state={subState} />
          </div>
          <div className='btn-grid'>
            <button
              className='btn btn-warning'
              disabled={!isActive}
              onClick={() => {
                subRef.current?.close();
                setSubState('paused');
              }}
            >
              ⏸ Pause
            </button>
            <button
              className='btn btn-success'
              disabled={!isPaused}
              onClick={() => {
                subRef.current?.open();
                setSubState('active');
              }}
            >
              ▶ Resume
            </button>
            <button
              className='btn btn-danger'
              disabled={isInactive || subState === 'disposed'}
              onClick={() => {
                subRef.current?.unsubscribe();
                setSubState('inactive');
              }}
            >
              ⏹ Unsubscribe
            </button>
            <button
              className='btn btn-success'
              disabled={!isInactive}
              onClick={() => {
                subRef.current?.reSubscribe();
                setSubState('active');
              }}
            >
              ↻ Resubscribe
            </button>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className='footer'>
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
