import { defineProject } from '@bemedev/dev-utils/vitest-extended';

export default defineProject({
  test: {
    name: 'project1',
    typecheck: { enabled: true, ignoreSourceErrors: false },
  },
});
