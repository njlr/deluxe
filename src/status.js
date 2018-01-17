import _ from 'lodash';
import namer from 'color-namer';

import { xyToRgb } from './xy-to-rgb.js';

export const status = async api => {

  const [ { lights }, groups ] = await Promise.all([ 
    api.lights(),
    api.groups(),
  ]);

  const stateToRgb = state => {
    if (!state.on) {
      return [ 0, 0, 0 ];
    }
    if (state.xy) {
      return xyToRgb(state.xy[0], state.xy[1], state.bri);
    }
    return [ state.bri, state.bri, state.bri ];
  };

  const rgbToName = colorString => {
    const names = namer(colorString, { pick: [ 'pantone' ] }).pantone || []; 
    if (_(names).isEmpty()) {
      return null;
    }
    return names[0].name;
  };

  const groupsToShow = _(groups)
    .filter(x => x.type.toLowerCase() == 'room' && !_(x.lights).isEmpty())
    .orderBy(x => x.id)
    .value();

  for (const group of groupsToShow) {
    console.log(group.name);
    for (const lightId of _(group.lights).uniq().orderBy(x => x).value()) {
      const light = _(lights)
        .filter(x => Number(x.id) == Number(lightId))
        .first();
      const rgb = stateToRgb(light.state);
      const colorString = 'rgb(' + rgb.join(', ') + ')';
      const colorName = rgbToName(colorString) || colorString;
      console.log(
        (light.state.on ? '💡' : '❌') + ' ' + 
        light.id + ' ' + 
        light.name.trim() + 
        (light.state.on ? ' (' + colorName + ')' : '')
      );
    }
    console.log();
  }

  const ungroupedLights = _(lights).filter(light => 
    !_(groups).some(group => 
      _(group.lights).includes(light.id)))
      .orderBy(x => x.id)
      .value();

  if (_(ungroupedLights).some()) {
    console.log('Ungrouped');
    for (const light of ungroupedLights) {
      const rgb = stateToRgb(light.state);
      const colorString = 'rgb(' + rgb.join(', ') + ')';
      const colorName = rgbToName(colorString) || colorString;
      console.log(
        (light.state.on ? '💡' : '❌') + ' ' + 
        light.id + ' ' + 
        light.name.trim() + 
        (light.state.on ? ' (' + colorName + ')' : '')
      );
    }
  }
};
