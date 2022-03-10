const { SlashCommandBuilder } = require("@discordjs/builders");
const supabase = require("@supabase/supabase-js").createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const interactor = require("../utils/interactor");
const log = require("../utils/log");
const { ownerId } = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addmod")
    .setDescription("Add a new moderator")
    .addStringOption((option) => {
      return option
        .setName("id")
        .setDescription("The Discord ID of the new moderator")
        .setRequired(true);
    }),
  async execute(interaction) {
    const id = interaction.options.getString("id");

    if (interaction.member.user.id !== ownerId) {
      return interaction.reply(
        interactor.error({
          title: "Error",
          message: "You must be the owner to add a moderator.",
          ephemeral: true,
        })
      );
    }

    const { error } = await supabase.from("moderators").insert({
      id,
    });

    if (error) {
      if (error.code === "23505") {
        log.error("User is already a moderator");
        return interaction.reply(
          interactor.error({
            title: "Error",
            message: "User is already a moderator.",
            ephemeral: true,
          })
        );
      } else {
        log.error(error.message);
        return interaction.reply(
          interactor.error({
            title: "Error",
            message:
              "There was an error running this command. If you are an administrator, check your logs.",
            ephemeral: true,
          })
        );
      }
    } else {
      return interaction.reply(
        interactor.success({
          title: "Success",
          message: `Successfully add \`${id}\` as a moderator.`,
        })
      );
    }
  },
};
