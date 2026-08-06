import { createManagedSubcriber } from '@bemedev/subscriber';
import { SubscriberBaseClass } from '@bemedev/subscriber/base';

describe('ManagedSubscriber and SubscriberBaseClass Tests', () => {
  const fn = vi.fn();
  const sub = createManagedSubcriber(fn);

  test('#01 => sub ins instancof SubscriberBaseClass', () => {
    expect(sub).toBeInstanceOf(SubscriberBaseClass);
  });

  test('#02 => sub state is active initially', () => {
    expect(sub.state).toBe('active');
  });

  test('#03 => fn is not called initially', () => {
    expect(fn).not.toHaveBeenCalled();
  });

  test('#04 => call fn with value 10', () => {
    sub.fn(10);
    expect(fn).toHaveBeenCalledWith(10);
  });

  test('#05 => sub state can be paused with close', () => {
    sub.close();
    expect(sub.state).toBe('paused');
  });

  test('#06 => sub state can be re-opened with open', () => {
    sub.open();
    expect(sub.state).toBe('active');
  });

  test('#07 => sub can be unsubscribed', () => {
    sub.unsubscribe();
    expect(sub.state).toBe('inactive');
  });

  test('#08 => sub can be disposed', () => {
    sub.dispose();
    expect(sub.state).toBe('disposed');
  });
});
