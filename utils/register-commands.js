const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { applicationId, guildId } = require("../config.json");
const log = require("./log");
require("dotenv").config();

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

module.exports = async function (commands) {
  try {
    log("Started refreshing application (/) commands");

    await rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
      body: commands,
    });

    log("Successfully reloaded application (/) commands");
  } catch (error) {
    console.error(error);
  }
};
