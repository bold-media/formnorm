import * as migration_20250116_013014 from './20250116_013014';
import * as migration_20250127_230228 from './20250127_230228';
import * as migration_20250210_164918 from './20250210_164918';
import * as migration_20250319_143646 from './20250319_143646';
import * as migration_20250320_151055 from './20250320_151055';

export const migrations = [
  {
    up: migration_20250116_013014.up,
    down: migration_20250116_013014.down,
    name: '20250116_013014',
  },
  {
    up: migration_20250127_230228.up,
    down: migration_20250127_230228.down,
    name: '20250127_230228',
  },
  {
    up: migration_20250210_164918.up,
    down: migration_20250210_164918.down,
    name: '20250210_164918',
  },
  {
    up: migration_20250319_143646.up,
    down: migration_20250319_143646.down,
    name: '20250319_143646',
  },
  {
    up: migration_20250320_151055.up,
    down: migration_20250320_151055.down,
    name: '20250320_151055'
  },
];
