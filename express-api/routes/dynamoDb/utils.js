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

module.exports = {
  execute: execute,
  tryCatch: tryCatch
};