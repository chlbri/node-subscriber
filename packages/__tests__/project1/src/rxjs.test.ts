import { createSubscriber, normalEquals } from '@bemedev/subscriber';
import { Subject } from 'rxjs';

describe('TESTS', () => {
  describe('#01 => RxJS workflow Tests', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const fn3 = vi.fn();
    const alwaysTrue = () => true;
    const sub1 = createSubscriber(fn1);
    const sub2 = createSubscriber(fn2);
    const sub3 = createSubscriber(fn3, alwaysTrue);
    const subject$ = new Subject<number>();
    let renewedSub1: typeof sub1 | undefined;

    test('#00 => initial fn1', () => expect(fn1).not.toHaveBeenCalled());
    test('#01 => initial fn2', () => expect(fn2).not.toHaveBeenCalled());
    test('#02 => initial fn3', () => expect(fn3).not.toHaveBeenCalled());
    test('#03 => sub1 eq', () => expect(sub1.equals).toBe(normalEquals));
    test('#04 => sub2 eq', () => expect(sub2.equals).toBe(normalEquals));
    test('#05 => sub3.equals', () => expect(sub3.equals).toBe(alwaysTrue));
    test('#06 => sub1 idle', () => expect(sub1.state).toBe('idle'));
    test('#07 => sub2 idle', () => expect(sub2.state).toBe('idle'));
    test('#08 => sub3 idle', () => expect(sub3.state).toBe('idle'));
    test('#09 => "sub1" subscribe', () => sub1.subscribe(subject$));
    test('#10 => "sub2" subscribe', () => sub2.subscribe(subject$));
    test('#11 => "sub3" subscribe', () => sub3.subscribe(subject$));
    test('#12 => sub1 active', () => expect(sub1.state).toBe('active'));
    test('#13 => sub2 active', () => expect(sub2.state).toBe('active'));
    test('#14 => sub3 active', () => expect(sub3.state).toBe('active'));
    test('#15 => emit value 1', () => subject$.next(1));

    test('#16 => fn1 called 1 time', () => {
      expect(fn1).toHaveBeenCalledTimes(1);
    });

    test('#17 => fn2 called 1 time', () => {
      expect(fn2).toHaveBeenCalledTimes(1);
    });

    test('#18 => fn3 called 1 time', () => {
      expect(fn3).toHaveBeenCalledTimes(1);
    });

    test('#19 => emit 1 again', () => subject$.next(1));

    test('#20 => fn1 called 1 time', () => {
      expect(fn1).toHaveBeenCalledTimes(1);
    });

    test('#21 => fn2 called 1 time', () => {
      expect(fn2).toHaveBeenCalledTimes(1);
    });

    test('#22 => fn3 called 1 time', () => {
      expect(fn3).toHaveBeenCalledTimes(1);
    });

    test('#23 => emit value 2', () => subject$.next(2));

    test('#24 => fn1 called 2 times', () => {
      expect(fn1).toHaveBeenCalledTimes(2);
    });

    test('#25 => fn2 called 2 times', () => {
      expect(fn2).toHaveBeenCalledTimes(2);
    });

    test('#26 => fn3 called 1 time', () => {
      expect(fn3).toHaveBeenCalledTimes(1);
    });

    test('#27 => close sub1', sub1.close);
    test('#28 => sub1 paused', () => expect(sub1.state).toBe('paused'));
    test('#29 => close sub1 again', sub1.close);
    test('#30 => sub1 paused', () => expect(sub1.state).toBe('paused'));
    test('#31 => emit 3 while paused', () => subject$.next(3));

    test('#32 => fn1 called 2 times', () => {
      expect(fn1).toHaveBeenCalledTimes(2);
    });

    test('#33 => fn2 called 3 times', () => {
      expect(fn2).toHaveBeenCalledTimes(3);
    });

    test('#34 => open sub1', sub1.open);
    test('#35 => open sub1 again', sub1.open);
    test('#36 => emit 4 after open', () => subject$.next(4));

    test('#37 => fn1 called 3 times', () => {
      expect(fn1).toHaveBeenCalledTimes(3);
    });

    test('#38 => fn1 4', () => expect(fn1).toHaveBeenLastCalledWith(4));
    test('#39 => unsubscribe sub1', sub1.unsubscribe);
    test('#40 => sub1 inact', () => expect(sub1.state).toBe('inactive'));
    test('#41 => emit 5 after unsub', () => subject$.next(5));

    test('#42 => fn1 called 3 times', () => {
      expect(fn1).toHaveBeenCalledTimes(3);
    });

    test('#43 => open sub1', sub1.open);
    test('#44 => sub1 inact', () => expect(sub1.state).toBe('inactive'));
    test('#45 => close sub1', sub1.close);
    test('#46 => sub1 inact', () => expect(sub1.state).toBe('inactive'));

    test('#47 => fn1 called 3 times', () => {
      expect(fn1).toHaveBeenCalledTimes(3);
    });

    test('#48 => renew sub1', () => (renewedSub1 = sub1.renew));
    test('#49 => sub defined', () => expect(renewedSub1).toBeDefined());

    test('#50 => sub active', () => {
      expect(renewedSub1?.state).toBe('active');
    });

    test('#51 => renewedSub1 eq', () => {
      expect(renewedSub1?.equals).toBe(normalEquals);
    });

    test('#52 => emit 6 to renewed sub', () => subject$.next(6));

    test('#53 => fn1 called 4 times', () => {
      expect(fn1).toHaveBeenCalledTimes(4);
    });

    test('#54 => fn2 called 6 times', () => {
      expect(fn2).toHaveBeenCalledTimes(6);
    });

    test('#55 => fn3 called 1 time', () => {
      expect(fn3).toHaveBeenCalledTimes(1);
    });

    test('#56 => fn1 6', () => expect(fn1).toHaveBeenLastCalledWith(6));
    test('#57 => dispose sub1', sub1.dispose);
    test('#58 => sub1 disp', () => expect(sub1.state).toBe('disposed'));

    test('#59 => sub1 not inactive', () => {
      expect(sub1.isNotInactive).toBe(false);
    });

    test('#60 => sub1 equals undefined', () => {
      expect(sub1.equals).toBeUndefined();
    });

    test('#61 => sub1 rn undef', () => expect(sub1.renew).toBeUndefined());
    test('#62 => dispose sub2', sub2[Symbol.dispose]);
    test('#63 => sub2 disp', () => expect(sub2.state).toBe('disposed'));

    test('#64 => sub2 not inactive', () => {
      expect(sub2.isNotInactive).toBe(false);
    });

    test('#65 => sub2 equals undefined', () => {
      expect(sub2.equals).toBeUndefined();
    });

    test('#66 => sub2 rn undef', () => expect(sub2.renew).toBeUndefined());
    test('#67 => dispose sub3', sub3[Symbol.asyncDispose]);
    test('#68 => sub3 disp', () => expect(sub3.state).toBe('disposed'));

    test('#69 => sub3 not inactive', () => {
      expect(sub3.isNotInactive).toBe(false);
    });

    test('#70 => sub3 equals undefined', () => {
      expect(sub3.equals).toBeUndefined();
    });

    test('#71 => sub3 rn undef', () => expect(sub3.renew).toBeUndefined());
    test('#72 => emit 7 after dispose', () => subject$.next(7));

    test('#73 => fn1 called 5 times', () => {
      expect(fn1).toHaveBeenCalledTimes(5);
    });

    test('#74 => fn2 called 6 times', () => {
      expect(fn2).toHaveBeenCalledTimes(6);
    });

    test('#75 => fn3 called 1 time', () => {
      expect(fn3).toHaveBeenCalledTimes(1);
    });
  });

  describe('#02 => Renew coverage', () => {
    const fn1 = vi.fn();
    const sub1 = createSubscriber(fn1);
    const sub2 = sub1.renew;

    test('#01 => sub', () => expect(sub1.__subscribable).toBeUndefined());
    test('#02 => state', () => expect(sub1.state).not.toBe('disposed'));
    test('#03 => sub2 defined', () => expect(sub2).toBeDefined());

    test('#04 => sub2 no sub', () => {
      expect(sub2?.__subscribable).toBeUndefined();
    });
  });
});
