import _ from 'lodash';
import hue from 'node-hue-api';

import { configExists, readConfig } from './config.js';
import { setup } from './setup.js';
import { status } from './status.js';
import { on } from './on.js';
import { off } from './off.js';
import { set } from './set.js';
import { version } from './version.js';

export const main = async (args) => {

  const params = _(args.slice(2))
    .map(x => x.trim().toLowerCase())
    .filter(x => x.length > 0)
    .value();

  if (_(params).isEmpty()) {
    if (!(await configExists())) {
      console.log('No config was found. Let\'s get you setup... ');
      return await setup();
    }

    const config = await readConfig();
    const api = new hue.HueApi(config.host, config.user);
    return await status(api);    
  }

  if (params[0] == '--version') {
    console.log('Deluxe ' + version);
    return;
  }

  if (params[0] == '--help') {
    console.log('Visit https://github.com/njlr/deluxe for usage. ');
    return;
  }

  if (params[0] == 'setup') {
    return await setup();
  }

  const config = await readConfig();
  const api = new hue.HueApi(config.host, config.user);

  if (params[0] == 'status') {
    return await status(api);
  }

  if (params[0] == 'on') {
    return await on(api, params.slice(1));
  }

  if (params[0] == 'off') {
    return await off(api, params.slice(1));
  }

  if (params[0] == 'set') {
    return await set(api, params.slice(1));
  }
  
  throw new Error('Unrecognized command ' + args.join(' '));
};
