import _ from 'lodash';

export const namesToLightIds = async (api, names) => {
  if (_(names).every(x => Number.isSafeInteger(Number(x)))) {
    return _(names).map(x => Number(x)).uniq().value();
  }
  const { lights } = await api.lights();
  if (_(names).some(x => x.trim().toLowerCase() == 'all')) {
    return _(lights).map(x => x.id).uniq().value();
  }
  const groups = await api.groups();
  return _(names).map(x => {
    if (!Number.isSafeInteger(x)) {
      const rooms = _(groups)
        .filter(room => room.name.trim().toLowerCase() == x.trim().toLowerCase())
        .uniq()
        .value();
      if (!_(rooms).isEmpty()) {
        const room = _(rooms).first();
        return room.lights.map(x => Number(x));
      }
      const candidates = _(lights)
        .filter(light => light.name.trim().toLowerCase() == x.trim().toLowerCase())
        .uniq()
        .value();
      if (_(candidates).isEmpty()) {
        throw new Error('Unknown light "' + x + '"');
      }
      return Number(_(candidates).first().id);
    }
    return Number(x);
  })
  .uniq()
  .value();
};
