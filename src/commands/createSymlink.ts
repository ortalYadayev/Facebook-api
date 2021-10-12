import * as path from 'path';
import * as fs from 'fs';

const createSymlink = (target: string, newPath: string) => {
  fs.symlink(target, newPath, (error) => {
    if (!error) {
      return;
    }

    throw new Error(JSON.stringify(error));
  });
};

createSymlink(
  path.resolve(__dirname, '../public'),
  path.resolve(__dirname, '../../public'),
);
