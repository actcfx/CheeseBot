const { EmbedBuilder } = require('discord.js');
const { developerId } = require('../../config/config.json');

// Function to handle interaction errors
async function interactionError(interaction, error) {
    // Create an embed message for the error
    const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('未知錯誤')
        .setDescription('請洽管理員！')
        .setFields(
            { name: '錯誤訊息', value: `\`\`\`bash${error}\`\`\`` },
        )
        .setTimestamp();

    console.error(`└─ !ERROR! | ${error}\n   ├─ Interaction ID: ${interaction.id}\n   └─ User: ${interaction.user.tag}`);

    // Check if the interaction has already been replied to or deferred
    if (interaction.replied || interaction.deferred) {
        // Follow up with the error embed if already replied or deferred
        await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
    } else {
        // Reply with the error embed if not already replied or deferred
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // Create an embed message for the developer
    const dmEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('未知錯誤')
        .addFields(
            { name: '錯誤訊息', value: `\`\`\`bash${error}\`\`\`` },
            { name: 'Interaction ID', value: interaction.id },
            { name: 'User', value: interaction.user.tag },
        );

    // Send the error embed to the developer via DM
    await interaction.client.users.fetch(developerId).then(user => {
        user.send({ embeds: [dmEmbed] });
    });
}

module.exports = {
    interactionError,
};