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

        // Check if the user is the developer
        if (interaction.user.id !== developerId) {
            interaction.reply({ content: 'This command is only for the developer!', ephemeral: true });
            console.log('└─ [REPLY] | This command is only for the developer!');
            return;
        }

        // Get the type of error to test
        const errorType = interaction.options.getString('type');

        // Trigger the specified error type
        switch (errorType) {
            case 'reference':
                // Trigger a ReferenceError by using an undefined variable
                interaction.reply(undefinedVariable);
                break;
            case 'type':
                // Trigger a TypeError by accessing a property of null
                interaction.reply(null.property);
                break;
        }
    },
};