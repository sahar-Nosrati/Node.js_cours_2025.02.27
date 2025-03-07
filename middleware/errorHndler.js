const {logEvent} = require("./logEvent"); 

const erroHandler = (err, req, res, next) => {

logEvent(`${err.name} ${err.message}`, "errLog.txt"); 
  console.error(err.stack);
  res.status(500).send(err.message);
}

module.exports = erroHandler;