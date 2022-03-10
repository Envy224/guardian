const { embed } = require("../config.json");

module.exports = function (props) {
  if (embed.enabled) {
    return {
      embeds: [
        {
          title: props.title ? props.title : undefined,
          description: props.message,
          color: embed.color || undefined,
          footer: {
            text: "Powered by North Guardian",
            iconURL:
              "https://avatars.githubusercontent.com/u/89674791?s=200&v=4",
          },
        },
      ],
      fetchReply: props.fetchReply ? true : false,
      ephemeral: props.ephermal ? true : false,
    };
  } else {
    return {
      content: `${props.title ? `${props.title} | ` : ""}${props.message}`,
      fetchReply: props.fetchReply ? true : false,
      ephemeral: props.ephermal ? true : false,
    };
  }
};

module.exports.success = function (props) {
  if (embed.enabled) {
    return {
      embeds: [
        {
          title: props.title ? props.title : undefined,
          description: props.message,
          color: "#3da560",
          footer: {
            text: "Powered by North Guardian",
            iconURL:
              "https://avatars.githubusercontent.com/u/89674791?s=200&v=4",
          },
        },
      ],
      fetchReply: props.fetchReply ? true : false,
      ephemeral: props.ephermal ? true : false,
    };
  } else {
    return {
      content: `${props.title ? `${props.title} | ` : ""}${props.message}`,
      fetchReply: props.fetchReply ? true : false,
      ephemeral: props.ephermal ? true : false,
    };
  }
};

module.exports.error = function (props) {
  if (embed.enabled) {
    return {
      embeds: [
        {
          title: props.title ? props.title : undefined,
          description: props.message,
          color: "#ec4145",
          footer: {
            text: "Powered by North Guardian",
            iconURL:
              "https://avatars.githubusercontent.com/u/89674791?s=200&v=4",
          },
        },
      ],
      fetchReply: props.fetchReply ? true : false,
      ephemeral: props.ephermal ? true : false,
    };
  } else {
    return {
      content: `${props.title ? `${props.title} | ` : ""}${props.message}`,
      fetchReply: props.fetchReply ? true : false,
      ephemeral: props.ephermal ? true : false,
    };
  }
};
