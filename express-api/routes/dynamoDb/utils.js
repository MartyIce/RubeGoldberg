execute = function (err, data, res) {
    if (err) {
      console.log(err)
      res.status(err['$metadata'].httpStatusCode)
      res.json(err);
    }
    else res.json(data);
  };

module.exports = {
    execute: execute
};