//! This command is only for the developer

const { SlashCommandBuilder } = require('discord.js');
const { developerId } = require('../../../config/config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('error_test')
        .setDescription('Only for developer.')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type of error to test')
                .setRequired(true)
                .addChoices(
                    { name: 'Reference Error', value: 'reference' },
                    { name: 'Type Error', value: 'type' },
                )),
    async execute(interaction) {
        console.log(`[/COMMAND] | <${interaction.user.tag}> executed the error_test command.`);
        if (interaction.user.id !== developerId) {
            interaction.reply({ content: 'This command is only for the developer!', ephemeral: true });
            console.log('└─ [REPLY] | This command is only for the developer!');
            return;
        }

        const errorType = interaction.options.getString('type');

        switch (errorType) {
            case 'reference':
                interaction.reply(undefinedVariable);
                break;
            case 'type':
                interaction.reply(null.property);
                break;
        }
    },
};