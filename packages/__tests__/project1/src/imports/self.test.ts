import { createSubscriber } from '@bemedev/subscriber/subscriber';
import { testFunctions } from '../fixtures';

describe('TESTS', () => testFunctions(createSubscriber));
