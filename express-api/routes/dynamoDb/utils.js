execute = function (err, data, res, next) {
  if (err) {
    console.log('error in execute', err)
    res.status(500)
    res.json(err);
  }
  else {
    res.json(data);
  }
};

tryCatch = async function (action, res) {
  try {
    return action();
  }
  catch (err) {
    console.log(err);
    res.status(500)
    res.json(err);
  }
};

sOrBlank = (field) => field ? field.S : '';
nOrBlank = (field) => field ? field.N : '';

mapItem = (raw, map, skipCount) => {
  if (!raw) return {};
  let items = Array.isArray(raw) ? raw : raw.Items;
  if (!items && raw.Attributes) {
    items = [raw.Attributes];
  }
  if (!items) return {};

  return items.slice(skipCount ?? 0).map(i => map(i));
}

module.exports = {
  execute: execute,
  tryCatch: tryCatch,
  sOrBlank: sOrBlank,
  nOrBlank: nOrBlank,
  mapItem: mapItem
};
