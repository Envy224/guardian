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
    .setName("unbangroup")
    .setDescription("Unban a group")
    .addStringOption((option) => {
      return option
        .setName("id")
        .setDescription("The Roblox ID of the group to unban")
        .setRequired(true);
    }),
  async execute(interaction) {
    const id = interaction.options.getString("id");

    const { data: mod } = await supabase
      .from("moderators")
      .select("*")
      .eq("id", interaction.user.id);

    if (!mod) {
      return interaction.reply(
        interactor.error({
          title: "Error",
          message: "You do not have permission to unban a group.",
          ephemeral: true,
        })
      );
    }

    const { data: fetched, error: fetchError } = await supabase
      .from("bannedGroups")
      .select("id")
      .eq("id", id)
      .single();

    if (!fetched) {
      return interaction.reply(
        interactor.error({
          title: "Error",
          message: "This group is not banned.",
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
      const { error } = await supabase
        .from("bannedGroups")
        .delete()
        .eq("id", id);

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
            message: `Successfully unbanned group \`${id}\`.`,
          })
        );
      }
    }
  },
};
