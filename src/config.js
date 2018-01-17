import path from 'path';
import fs from 'mz/fs';
import mkdirp from 'mkdirp';

const mkdirpAsync = (dir, opts) => new Promise((resolve, reject) => {
  mkdirp(dir, opts, (error, result) => {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  });
});

const getConfigPath = () => {
  const isWindows = process.env.APPDATA || false;
  if (isWindows) {
    return path.resolve(process.env.APPDATA, 'Deluxe', 'config.json');
  }
  return path.resolve(process.env.HOME, '.deluxe', 'config.json');
};

export const writeConfig = async config => {
  const configPath = getConfigPath();
  await mkdirpAsync(path.dirname(configPath));
  const serialized = JSON.stringify(config, 2, null);
  return await fs.writeFile(configPath, serialized);
};

export const readConfig = async () => {
  const configPath = getConfigPath();  
  return JSON.parse(await fs.readFile(configPath));
};

export const configExists = async () => {
  const configPath = getConfigPath();  
  return await fs.exists(configPath);  
};
