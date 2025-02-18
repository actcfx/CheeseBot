const { Events } = require('discord.js');

const { isTesting } = require('../../config/config.json');
const { guildId } = require('../../config/discord.json');
const { leaveChannelId } = require('../../config/discord.json');

module.exports = {
    name: Events.GuildMemberRemove,
    once: false,
    execute(member) {
        if (isTesting) return;
        if (member.guild.id !== guildId) return;

        const leaveChannel = member.guild.channels.cache.get(leaveChannelId);
        console.log(`[EVENT]    | ${member.user.tag} has left the server.`);
        leaveChannel.send(`${member.user.tag} has left the server.`);

        try {
            member.send(`感謝您曾在 《原神崩鐵討論群》夏洛特亞洲遊戲討論站 的參與！\n希望您能夠抽空填寫此問券，\n用以了解您退出群組的動機，\n並會藉由這機會來改善群組。\n\nhttps://forms.gle/YZi74hfSCS1o8XH28 \n\n預祝您能夠再次蒞臨！`)
            console.log(`[DM]       | Sent DM to ${member.user.tag}.`);
        } catch {
            console.log(`/WARNING/  - Failed to send DM to ${member.user.tag}.`);
        }
    }
};