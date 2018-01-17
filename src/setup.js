import _ from 'lodash';
import hue from 'node-hue-api';
import readline from 'readline';
import os from 'os';

import { writeConfig, configExists } from './config.js';

const requestInput = validator => new Promise((resolve, reject) => {
  const rl = readline.createInterface(process.stdin, process.stdout);
  rl.setPrompt('> ');
  rl.prompt();
  rl.on('line', (line) => {
    if (validator(line)) {
      rl.close();
      resolve(line);
    } else {
      console.log('Invalid input');
      rl.prompt();
    }
  });
});

const waitForEnterKey = async () => {
  const validator = () => true;
  return await requestInput(validator);
};

const selectBridge = async bridges => {

  if (_(bridges).isEmpty()) {
    throw new Error('No bridges were found');
  }

  if (_(bridges).size() == 1) {
    const bridge = _(bridges).first();
    console.log('Found ' + bridge.id + ' at ' + bridge.ipaddress);
    return bridge;
  }

  console.log(bridges.length + ' bridges were found: ');  

  for (const [ bridge, i ] of _(bridges).map((x, i) => [ x, i ])) {
    console.log('[' + (i + 1) + '] ' + bridge.id + ' at ' + bridge.ipaddress);
  }

  console.log('Which bridge would you like to use? ');

  const validator = line => {
    const n = Number(line) - 1;
    return !Number.isNaN(n) && 
      Number.isSafeInteger(n) && 
      n >= 0 && 
      n < bridges.length;
  };

  const i = Number(await requestInput(validator)) - 1;

  return bridges[i];
};

export const setup = async () => {

  // 0. Check for an existing config
  if (await configExists()) {
    console.log('A config file already exists. ');
    console.log('Are you sure you would like to continue? [Y/N]');
    const validator = () => true;
    const input = await requestInput(validator);
    if (!_([ 'yes', 'y' ]).includes(input.trim().toLowerCase())) {
      return;
    }
  }

  // 1. Search for bridges
  console.log('Searching for bridges... ');

  const bridges = await hue.nupnpSearch();

  // 2. Select a bridge
  const bridge = await selectBridge(bridges);

  // 3. Register a user
  console.log('Press the link button on your Philips Hue bridge. ');
  
  const api = new hue.HueApi();

  const user = await (async () => {
    while (true) {    
      try {

        console.log('Press enter when ready... ');
    
        await waitForEnterKey();
    
        const host = bridge.ipaddress;
        const userDescription = 'deluxe#' + os.hostname();
        
        console.log('Registering user ' + userDescription + ' to ' + host + '... ');  
      
        return await api.registerUser(host, userDescription);
      } catch (error) {
        // Link button not pressed
        if (error.type == 101) {
          console.log('The link button was not pressed! ');
          console.log('You might need to hold it down for a second. ');
        } else {
          throw error;
        }
      }
    }
  })();

  console.log('Registered new user ' + user);

  // 4. Write the config
  console.log('Saving configuration... ');

  await writeConfig({
    host: bridge.ipaddress,
    user,
  });
};
