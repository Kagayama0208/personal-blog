import * as migration_20260602_004706_initial from './20260602_004706_initial';

export const migrations = [
  {
    up: migration_20260602_004706_initial.up,
    down: migration_20260602_004706_initial.down,
    name: '20260602_004706_initial'
  },
];
