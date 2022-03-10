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
    .setName("removemod")
    .setDescription("Remove a moderator")
    .addStringOption((option) => {
      return option
        .setName("id")
        .setDescription("The Discord ID of the moderator")
        .setRequired(true);
    }),
  async execute(interaction) {
    const id = interaction.options.getString("id");

    if (interaction.member.user.id !== ownerId) {
      return interaction.reply(
        interactor.error({
          title: "Error",
          message: "You must be the owner to remove a moderator.",
          ephemeral: true,
        })
      );
    }

    const { data: fetched, error: fetchError } = await supabase
      .from("moderators")
      .select("*")
      .eq("id", id)
      .single();

    if (!fetched) {
      return interaction.reply(
        interactor.error({
          title: "Error",
          message: "This user is not a moderator.",
        })
      );
    } else if (fetched.owner == true) {
      return interaction.reply(
        interactor.error({
          title: "Error",
          message: "You cannot demote yourself.",
        })
      );
    }

    if (fetchError) {
      log.error(error.message);
      return interaction.reply(
        interactor.error({
          title: "Error",
          message:
            "There was an error running this command. If you are an administrator, check your logs.",
          ephemeral: true,
        })
      );
    } else {
      const { error } = await supabase.from("moderators").delete().eq("id", id);

      if (error) {
        log.error(error.message);
        return interaction.reply(
          interactor.error({
            title: "Error",
            message:
              "There was an error running this command. If you are an administrator, check your logs.",
            ephemeral: true,
          })
        );
      } else {
        return interaction.reply(
          interactor.success({
            title: "Success",
            message: `Successfully removed moderator \`${id}\`.`,
          })
        );
      }
    }
  },
};
