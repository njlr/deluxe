import _ from 'lodash';
import hue from 'node-hue-api';

import { namesToLightIds } from './names-to-light-ids.js';

export const off = async (api, args) => {

  const lights = await namesToLightIds(api, args);

  const state = hue.lightState.create().off();

  await Promise.all(lights.map(light => {
    return api.setLightState(light, state);
  }));
};
