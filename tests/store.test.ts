import assert from 'node:assert';

import { createWorkspace, createProject } from '../src/lib/store';

// Ensure workspace IDs include a 9-character random segment
const workspace = createWorkspace('Test Workspace');
const workspaceRandom = workspace.id.split('-').pop()!;
assert.strictEqual(workspaceRandom.length, 9);

// Ensure project IDs include a 9-character random segment
const project = createProject({
  workspaceId: workspace.id,
  name: 'Test Project',
  slug: 'test-project',
  status: 'draft',
});
const projectRandom = project.id.split('-').pop()!;
assert.strictEqual(projectRandom.length, 9);

