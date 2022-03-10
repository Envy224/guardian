const axios = require("axios");

async function getGroupInfo(id) {
  try {
    const response = await axios.get(
      `https://groups.roblox.com/v1/groups/${id}`
    );
    return response.data;
  } catch (error) {
    return console.error(error);
  }
}

async function getGroupEmblem(id) {
  try {
    const response = await axios.get(
      `https://thumbnails.roblox.com/v1/groups/icons?groupIds=${id}&size=150x150&format=Png&isCircular=false`
    );
    return encodeURI(response.data.data[0].imageUrl);
  } catch (error) {
    console.error(error);
    return "https://cliygedkozuuwlaozdvb.supabase.in/storage/v1/object/public/public/no-icon";
  }
}

module.exports = {
  getGroupInfo,
  getGroupEmblem,
};
