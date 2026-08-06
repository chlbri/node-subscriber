import {
  createManagedSubscriber,
  createSubscriber,
} from '@bemedev/subscriber/managed';
import { testFunctions } from '../fixtures';

describe('TESTS', () => {
  describe('#01 => Existence', () => {
    testFunctions(createManagedSubscriber, createSubscriber);
  });

  test('#02 => "createManagedSubscriber" and "createSubscriber" should be equals', () => {
    expect(createManagedSubscriber).toBe(createSubscriber);
  });
});
