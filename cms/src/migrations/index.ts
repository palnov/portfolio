import * as migration_20260903_194255_initial from './20260903_194255_initial';
import * as migration_20260903_195033_add_content_labels from './20260903_195033_add_content_labels';

export const migrations = [
  {
    up: migration_20260903_194255_initial.up,
    down: migration_20260903_194255_initial.down,
    name: '20260903_194255_initial',
  },
  {
    up: migration_20260903_195033_add_content_labels.up,
    down: migration_20260903_195033_add_content_labels.down,
    name: '20260903_195033_add_content_labels'
  },
];
