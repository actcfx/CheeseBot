const { Events, EmbedBuilder } = require('discord.js');

const { guildId } = require('../../config/discord.json');
const { deleteMessageChannelId } = require('../../config/discord.json');
const { deleteAttachmentChannelId } = require('../../config/discord.json');

module.exports = {
    name: Events.MessageDelete,
    once: false, // Indicates that this event will run multiple times
    execute(message) {
        if (message.guildId !== guildId) return;
        if (message.author.bot) return;

        const deleteMessageChannel = message.guild.channels.cache.get(deleteMessageChannelId);
        const deleteAttachmentChannel = message.guild.channels.cache.get(deleteAttachmentChannelId);

        // Create an embed message for the deleted message
        const deleteMessageEmbed = new EmbedBuilder()
            .setColor("#FC9A66")
            .setTitle("訊息刪除")
            .addFields(
                { name: "作者", value: `<@${message.author.id}>`, inline: false },
                { name: "頻道", value: `<#${message.channel.id}>`, inline: false }
            )
            .setTimestamp();

        // Add the content of the deleted message to the embed if it exists
        if (message.content) {
            deleteMessageEmbed.addFields(
                { name: "內容", value: message.content, inline: false }
            );
        }

        // If there are attachments, add them to the embed and send them to the attachment channel
        if (message.attachments.size > 0) {
            for (const attachment of message.attachments.values()) {
                try {
                    deleteMessageEmbed.addFields(
                        { name: "附件", value: attachment.url, inline: false }
                    );
                    deleteAttachmentChannel.send({ content: attachment.url });
                } catch { }
            }
        }

        console.log(`[EVENT]    | A message by ${message.author.tag} was deleted.`);

        // Send the embed message to the delete message channel and log the message link
        deleteMessageChannel.send({ embeds: [deleteMessageEmbed] }).then(sentMessage => {
            const deleteMessageLink = sentMessage.url;
            console.log(`└─ [LINK]  | ${deleteMessageLink}`);
        });
    },
};