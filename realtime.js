const supabase = require("@supabase/supabase-js").createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const config = require("./config.json");
const log = require("./utils/log");
const { getGroupInfo, getGroupEmblem } = require("./utils/groups");

module.exports = async function (client) {
  log("Realtime client started");

  await supabase
    .from("bannedUsers")
    .on("INSERT", async () => {
      console.log("Insert!");
    })
    .subscribe();

  await supabase
    .from("bannedUsers")
    .on("INSERT", async (payload) => {
      const embed = {
        title: payload.new.username,
        url: `https://www.roblox.com/users/${payload.new.userId}/profile`,
        color: config.embed.color || undefined,
        thumbnail: {
          url: `https://www.roblox.com/headshot-thumbnail/image?userId=${payload.new.userId}&width=420&height=420&format=png`,
        },
        fields: [
          {
            name: "Username",
            value: payload.new.username,
          },

          {
            name: "Reason",
            value: payload.new.reason,
          },
          {
            name: "ID",
            value: `\`${payload.new.userId.toString()}\``,
          },
        ],
        timestamp: payload.new.timestamp,
        footer: {
          text: "Powered by North Guardian",
          iconURL: "https://avatars.githubusercontent.com/u/89674791?s=200&v=4",
        },
      };

      const message = await client.channels.cache
        .get(config.blacklistsChannelId)
        .send({ embeds: [embed] });

      const { error } = await supabase
        .from("bannedUsers")
        .update({ messageId: message.id })
        .eq("userId", payload.new.userId);

      if (error) {
        throw new Error(error.message);
      }
    })
    .subscribe();

  await supabase
    .from("bannedGroups")
    .on("INSERT", async (payload) => {
      const groupInfo = await getGroupInfo(payload.new.id);
      const embed = {
        title: groupInfo.name,
        url: `https://www.roblox.com/groups/${payload.new.id}/group`,
        color: config.embed.color || undefined,
        thumbnail: {
          url: await getGroupEmblem(payload.new.id),
        },
        fields: [
          {
            name: "Group Name",
            value: groupInfo.name,
          },
          {
            name: "Description",
            value: groupInfo.description || "No description available",
          },
          {
            name: "Shout",
            value: groupInfo.shout ? groupInfo.shout.body + "." : "No shout",
          },
          {
            name: "Members",
            value: groupInfo.memberCount.toString(),
          },
          {
            name: "Owner",
            value: `@${groupInfo.owner.username}`,
          },
          {
            name: "Reason",
            value: payload.new.reason,
          },
          {
            name: "ID",
            value: `\`${payload.new.id.toString()}\``,
          },
        ],
        timestamp: payload.new.timestamp,
        footer: {
          text: "Powered by North Guardian",
          iconURL: "https://avatars.githubusercontent.com/u/89674791?s=200&v=4",
        },
      };

      const message = await client.channels.cache
        .get(config.blacklistsChannelId)
        .send({ embeds: [embed] });

      const { error } = await supabase
        .from("bannedGroups")
        .update({ messageId: message.id })
        .eq("id", payload.new.id);

      if (error) {
        throw new Error(error.message);
      }
    })
    .subscribe();

  // PLEASE IGNORE THIS. FOR SOME REASON IT DOES NOT WORK.

  // await supabase
  //   .from("bannedUsers")
  //   .on("DELETE", async (payload) => {
  //     const channel = client.channels.cache.get(config.blacklistsChannelId);
  //     const message = await channel.messages.fetch(payload.old.messageId);

  //     message.delete();
  //   })
  //   .subscribe();

  // await supabase
  //   .from("bannedGroups")
  //   .on("DELETE", async (payload) => {
  //     const channel = client.channels.cache.get(config.blacklistsChannelId);
  //     const message = await channel.messages.fetch(payload.old.messageId);

  //     message.delete();
  //   })
  //   .subscribe();
};
