//! This command is only for admin users

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Bulk delete messages')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to delete')
                .setRequired(true)
                .setMinValue(1)
        ),
    async execute(interaction) {
        const limit = interaction.options.getInteger('amount');

        const messages = await interaction.channel.bulkDelete(limit, true);
        if (messages.size === 0) {
            return await interaction.reply('No messages were deleted', { ephemeral: true });
        } else if (messages.size === limit) {
            return await interaction.reply(`Deleted ${messages.size} messages`, { ephemeral: true });
        } else {
            return await interaction.reply(`Deleted ${messages.size} messages, ${limit} can't delete`, { ephemeral: true });
        }
    }
};
