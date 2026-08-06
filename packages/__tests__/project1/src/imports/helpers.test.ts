import {
  defaultSelector,
  normalEquals,
} from '@bemedev/subscriber/helpers';
import { testFunctions } from '../fixtures';

describe('TESTS', () => testFunctions(normalEquals, defaultSelector));
