import {
  createManagedSubcriber,
  createSubscriber,
  defaultSelector,
  normalEquals,
} from '@bemedev/subscriber';
import { testFunctions } from '../fixtures';

describe('TESTS', () => {
  testFunctions(
    createManagedSubcriber,
    createSubscriber,
    defaultSelector,
    normalEquals,
  );
});
