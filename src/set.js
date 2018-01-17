import _ from 'lodash';
import chroma from 'chroma-js';
import hue from 'node-hue-api';

import { namesToLightIds } from './names-to-light-ids.js';
import { googleToHex } from './google-to-hex.js';

export const set = async (api, args) => {
  if (_(args).size() < 2) {
    throw new Error('Expected a list of lights and a color');
  }

  const lights = await namesToLightIds(api, args.slice(0, -1));

  const colorString = args[args.length - 1];
  const color = await (async () => {
    try {
      return chroma(colorString);
    } catch (error) {
      return chroma(await googleToHex(colorString));
    }
  })();

  const [ h, s, l] = color.hsl();
  return await Promise.all(lights.map(light => {
    const state = hue.lightState.create()
    .on()
    .hsl(h, s * 100, l * 100);
    return api.setLightState(light, state);
  }));
};
