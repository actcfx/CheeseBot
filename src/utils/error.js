const { EmbedBuilder } = require('discord.js');
const { developerId } = require('../../config/config.json');

async function interactionError(interaction, error) {
    const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('未知錯誤')
        .setDescription(`請洽管理員！`)
        .setFields(
            {name: '錯誤訊息', value: `\`\`\`bash${error}\`\`\``},
        )
        .setTimestamp();
    console.error(`└─ !ERROR! | ${error}\n   ├─ Interaction ID: ${interaction.id}\n   └─ User: ${interaction.user.tag}
    `);
    if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
    } else {
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
    const dmEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('未知錯誤')
        .addFields(
            { name: '錯誤訊息', value: `\`\`\`bash${error}\`\`\`` },
            { name: 'Interaction ID', value: interaction.id },
            { name: 'User', value: interaction.user.tag },
        )
    await interaction.client.users.fetch(developerId).then(user => {
        user.send({ embeds: [dmEmbed] });
    });
}

module.exports = {
    interactionError,
};