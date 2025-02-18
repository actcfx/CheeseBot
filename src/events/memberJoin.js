const { Events, EmbedBuilder } = require('discord.js');

const { isTesting } = require('../../config/config.json');
const { guildId } = require('../../config/discord.json');
const { welcomeChannelId } = require('../../config/discord.json');
const { chatChannelId } = require('../../config/discord.json');

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    execute(member) {
        if (member.guild.id !== guildId) return;
        if (isTesting) return;

        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
        const chatChannel = member.guild.channels.cache.get(chatChannelId);
        const welcomeEmbed = new EmbedBuilder()
            .setColor('#FFF7DC')
            .setTitle('🎉歡迎光臨')
            .setDescription(`**🔰新手須知**\n請詳閱 <#978707952640872548> 以了解社群規範！\n同時可以透過 <#978708014695600188> 熟悉各頻道功能，\n並請按照 <#1171733942752251934> 的指示來完成後續的入群手續！\n\n**💮身分組領取**\n可透過 <#1160492926862884934> 開啟色色區、內鬼爆料討論區、模組討論區哦！\n並且可從 <#1079677816192372817> 、 <#1148320230418948227> 中設定您的遊戲個人資訊。\n\n**🎮遊戲疑雜**\n另外有任何遊戲疑問可在 <#1070424932850352178> 、 <#1135198693511925790> 進行詢問，\n若您是為原神玩家遇上打不過的秘境或BOSS也可於 <#978924406745210900> 發布委託，\n而對於自身帳號發展上有疑慮的話，也可善用 <#1227305343730712646> 進行看號健檢，\n也敬請參閱 <#1208768532545015848> 、 <#1208037588297060362> 、 <#1208037000830263326> 來解答成就、寶箱解謎上的問題。`)
            .setImage('https://media.discordapp.net/attachments/1230603666558423091/1230933383593590945/433120374_1114725173177159_7991377838873626676_n.jpg?ex=663c5f4c&is=663b0dcc&hm=8dcb609c355aa6cf994ef960e0f707db798e7b582d2ad20237a9b910e9981890&format=webp&width=687&height=297&')
            .setTimestamp();

        console.log(`[EVENT] | ${member.user.tag} has joined the server.`);
        welcomeChannel.send({ content: `<@${member.id}>`, embeds: [welcomeEmbed] });
        chatChannel.send(`<@${member.id}> 向著星辰與深淵 歡迎來到原神夏洛特亞洲討論區`);
    }
}