import assert from 'node:assert';
import { test } from 'vitest'
import { createWorkspace, createProject } from '../src/lib/store';

test('workspace ID includes 9-char random segment', () => {
  const workspace = createWorkspace('Test Workspace');
  const workspaceRandom = workspace.id.split('-').pop()!;
  assert.strictEqual(workspaceRandom.length, 9);
})

test('project ID includes 9-char random segment', () => {
  const workspace = createWorkspace('Test Workspace');
  const project = createProject({
    workspaceId: workspace.id,
    name: 'Test Project',
    slug: 'test-project',
    status: 'draft',
  });
  const projectRandom = project.id.split('-').pop()!;
  assert.strictEqual(projectRandom.length, 9);
})

