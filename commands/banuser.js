const { SlashCommandBuilder } = require("@discordjs/builders");
const supabase = require("@supabase/supabase-js").createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const interactor = require("../utils/interactor");
const log = require("../utils/log");
const { ownerId } = require("../config.json");
const noblox = require("noblox.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banuser")
    .setDescription("Ban a user")
    .addStringOption((option) => {
      return option
        .setName("id")
        .setDescription("The Roblox ID of the user to ban")
        .setRequired(true);
    })

    .addStringOption((option) => {
      return option
        .setName("reason")
        .setDescription("Why the user is banned")
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
          message: "You do not have permission to ban a user.",
          ephemeral: true,
        })
      );
    }

    const username = await noblox.getUsernameFromId(id);

    const { error } = await supabase.from("bannedUsers").insert({
      userId: parseInt(id),
      username,
      reason: reason || "No reason provided.",
    });

    if (error) {
      if (error.code === "23505") {
        log.error("User is already banned");
        return interaction.reply(
          interactor.error({
            title: "Error",
            message: "User is already banned.",
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
          message: `Successfully banned user \`${id}\` (@${username}).`,
        })
      );
    }
  },
};
