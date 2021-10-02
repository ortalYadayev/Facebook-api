import * as crypto from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import * as os from 'os';
import * as path from 'path';

const envFilePath = path.resolve(__dirname, '../../.env');

const setEnvValue = (key: string, value: string) => {
  const envVars = readFileSync(envFilePath, 'utf-8').split(os.EOL);
  const targetLine = envVars.find((line) => line.split('=')[0] === key);
  if (targetLine) {
    const targetLineIndex = envVars.indexOf(targetLine);
    envVars.splice(targetLineIndex, 1, `${key}=${value}`);
  } else {
    envVars.push(`${key}=${value}`);
  }

  writeFileSync(envFilePath, envVars.join(os.EOL));
};

setEnvValue('JWT_SECRET', crypto.randomBytes(64).toString('hex'));
