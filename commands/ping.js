const { SlashCommandBuilder } = require("@discordjs/builders");
const interactor = require("../utils/interactor");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with API Latency"),
  async execute(interaction) {
    const sent = await interaction.reply(
      interactor({ message: "Pinging...", fetchReply: true })
    );

    interaction.editReply(
      interactor({
        message: `Latency is \`${
          sent.createdTimestamp - interaction.createdTimestamp
        }\`ms`,
        title: "🏓 Pong!",
      })
    );
  },
};
