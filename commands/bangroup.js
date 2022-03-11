const { SlashCommandBuilder } = require("@discordjs/builders");
const supabase = require("@supabase/supabase-js").createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const log = require("../utils/log");
const { ownerId } = require("../config.json");
const interactor = require("../utils/interactor");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bangroup")
    .setDescription("Ban a group and all their members")
    .addStringOption((option) => {
      return option
        .setName("id")
        .setDescription("The ID of the group to ban")
        .setRequired(true);
    })

    .addStringOption((option) => {
      return option
        .setName("reason")
        .setDescription("Why this group is banned")
        .setRequired(false);
    }),
  async execute(interaction) {
    const id = interaction.options.getString("id");
    const reason = interaction.options.getString("reason");

    const { data: mod } = await supabase
      .from("moderators")
      .select("*")
      .eq("id", interaction.user.id);

    if (!mod) {
      return interaction.reply(
        interactor.error({
          title: "Error",
          message: "You do not have permission to ban a group.",
          ephemeral: true,
        })
      );
    }

    const { error } = await supabase.from("bannedgroups").insert({
      id: parseInt(id),
      reason: reason || "No reason provided.",
    });

    if (error) {
      if (error.code === "23505") {
        log.error("Group already banned");
        return interaction.reply(
          interactor.error({
            title: "Error",
            message: "Group is already banned",
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
          message: `Successfully banned group \`${id}\``,
        })
      );
    }
  },
};
