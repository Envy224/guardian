const chalk = require("chalk");

module.exports = function (message) {
  console.log(`${chalk.blue("Guardian")} | ${message}`);
};

module.exports.error = function (error) {
  console.error(`${chalk.red("Guardian")} | ${error}`);
};
