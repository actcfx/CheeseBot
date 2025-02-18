const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(message) {
        if (!message.content.startsWith('%') || message.author.bot) return;

        const args = message.content.slice(1).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === 'ping') {
            console.log(`[%COMMAND] | <${message.author.tag}> executed the ping command.`);

            if (message.client.ws.ping === -1) {
                message.reply('Ping: N/A');
                console.log('└─ [REPLY] | Ping: N/A');
            } else {
                message.reply(`Ping: ${message.client.ws.ping}ms`);
                console.log(`└─ [REPLY] | Ping: ${message.client.ws.ping}ms`);
            }
        }
    },
};