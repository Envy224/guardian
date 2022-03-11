require("dotenv").config();
const express = require("express");
const supabase = require("@supabase/supabase-js").createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const log = require("./utils/log");
const registerCommands = require("./utils/register-commands");
const interactor = require("./utils/interactor");
const { activity, ownerId } = require("./config.json");
const { getGroupInfo, getGroupEmblem } = require("./utils/groups");
const realtime = require("./realtime");

const client = new Client({ intents: Intents.FLAGS.GUILDS });
const commands = [];

client.once("ready", async () => {
  client.user.setActivity(activity.text, {
    type: activity.type,
  });

  await supabase
    .from("moderators")
    .update({ owner: false })
    .match({ owner: true });
  await supabase.from("moderators").upsert({ id: ownerId, owner: true });

  client.commands = new Collection();

  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  }

  await registerCommands(commands);
  await realtime(client);

  log(`Bot launched as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply(
      interactor.error({
        title: "Error",
        message: "There was an error while executing this command!",
        ephemeral: true,
      })
    );
  }
});

const router = express.Router();

router.get("/users/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("bannedUsers")
    .select()
    .eq("userId", req.params.id)
    .single();

  if (error) {
    throw new Error(error.message);
  } else {
    res.json(data);
  }
});

router.get("/groups/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("bannedgroups")
    .select()
    .eq("id", req.params.id)
    .single();

  if (error) {
    throw new Error(error.message);
  } else {
    res.json(data);
  }
});

// // eslint-disable-next-line no-unused-vars
// async function pushAllUsers() {
//   const { body } = await supabase.from("bannedusers").select();

//   for (const b of body) {
//     const embed = {
//       title: b.username,
//       url: `https://www.roblox.com/users/${b.userId}/profile`,
//       thumbnail: {
//         url: `https://www.roblox.com/headshot-thumbnail/image?userId=${b.userId}&width=420&height=420&format=png`,
//       },
//       fields: [
//         {
//           name: "Username",
//           value: b.username,
//         },
//         {
//           name: "Tag",
//           value: b.tag,
//         },
//         {
//           name: "Reason",
//           value: b.reason,
//         },
//         {
//           name: "IDs",
//           value: `Roblox: \`${b.userid}\`\nDiscord: \`${b.discordId}\``,
//         },
//         {
//           name: "Appealable",
//           value: `\`${b.appealable}\``,
//         },
//       ],
//       timestamp: b.timestamp,
//       footer: {
//         text: "© 2021 North Technologies",
//         icon_url:
//           "https://qwesedpgitnehpycbbka.supabase.in/storage/v1/object/sign/Public/north-logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJQdWJsaWMvbm9ydGgtbG9nby5wbmciLCJpYXQiOjE2MjkwNDk2MjAsImV4cCI6MTk0NDQwOTYyMH0.7dS3m_3g08dF2ftyTKiBgtIMSMTNE_AzDpPjcnPOITY",
//       },
//     };

//     client.channels.cache.get(process.env.CHANNEL).send({ embed });
//   }
// }

// // eslint-disable-next-line no-unused-vars
// async function pushAllGroups() {
//   const { body } = await supabase.from("bannedGroups").select();

//   for (const b of body) {
//     const groupInfo = await getGroupInfo(b.id);
//     const embed = {
//       title: groupInfo.name,
//       url: `https://www.roblox.com/groups/${b.id}/group`,
//       thumbnail: {
//         url: await getGroupEmblem(b.id),
//       },
//       fields: [
//         {
//           name: "Group Name",
//           value: groupInfo.name,
//         },
//         {
//           name: "Description",
//           value: groupInfo.description,
//         },
//         {
//           name: "Shout",
//           value: groupInfo.shout.body,
//         },
//         {
//           name: "Members",
//           value: groupInfo.memberCount,
//         },
//         {
//           name: "Owner",
//           value: groupInfo.owner.username,
//         },
//         {
//           name: "Reason",
//           value: b.reason,
//         },
//         {
//           name: "ID",
//           value: `\`${b.id}\``,
//         },
//         {
//           name: "Appealable",
//           value: `\`${b.appealable}\``,
//         },
//       ],
//       timestamp: b.timestamp,
//       footer: {
//         text: "© 2021 North Technologies",
//         icon_url:
//           "https://qwesedpgitnehpycbbka.supabase.in/storage/v1/object/sign/Public/north-logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJQdWJsaWMvbm9ydGgtbG9nby5wbmciLCJpYXQiOjE2MjkwNDk2MjAsImV4cCI6MTk0NDQwOTYyMH0.7dS3m_3g08dF2ftyTKiBgtIMSMTNE_AzDpPjcnPOITY",
//       },
//     };

//     client.channels.cache.get(process.env.CHANNEL).send({ embed });
//   }
// }

module.exports = router;
module.exports.discord = client;
client.login(process.env.DISCORD_TOKEN);
