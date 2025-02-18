const { Events, EmbedBuilder } = require('discord.js');

const { guildId } = require('../../config/discord.json');
const { deleteMessageChannelId } = require('../../config/discord.json');
const { deleteAttachmentChannelId } = require('../../config/discord.json');

module.exports = {
    name: Events.MessageDelete,
    once: false,
    execute(message) {
        if (message.guildId !== guildId) return;
        if (message.author.bot) return;

        const deleteMessageChannel = message.guild.channels.cache.get(deleteMessageChannelId);
        const deleteAttachmentChannel = message.guild.channels.cache.get(deleteAttachmentChannelId);
        const deleteMessageEmbed = new EmbedBuilder()
            .setColor("#FC9A66")
            .setTitle("訊息刪除")
            .addFields(
                { name: "作者", value: `<@${message.author.id}>`, inline: false },
                { name: "頻道", value: `<#${message.channel.id}>`, inline: false }
            )
            .setTimestamp();

        if (message.content) {
            deleteMessageEmbed.addFields(
                { name: "內容", value: message.content, inline: false }
            );
        }

        if (message.attachments.size > 0) {
            for (const attachment of message.attachments.values()) {
                try {
                    deleteMessageEmbed.addFields(
                        {name: "附件", value: attachment.url, inline: false}
                    )
                    deleteAttachmentChannel.send({ content: attachment.url });
                } catch { }
            }
        }

        console.log(`[EVENT]    | A message by ${message.author.tag} was deleted.`);
        deleteMessageChannel.send({ embeds: [deleteMessageEmbed] }).then(sentMessage => {
            const deleteMessageLink = sentMessage.url;
            console.log(`└─ [LINK]  | ${deleteMessageLink}`);
        });
    },
};