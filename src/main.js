const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');

const { isTesting, token, testToken, clientId } = require('../config/config.json');
const { interactionError } = require('./utils/error');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ]
});
client.commands = new Collection();

const loadCommands = (commandsPath) => {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    const commands = [];

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            console.log(`[LOAD]     | \`${command.data.name}\` is loaded.`);
        } else {
            console.warn(`/WARNING/  - ${file} does not have the required data and execute properties.`);
        }
    }
    console.log('----------------------------------------');

    return commands;
};

const loadEvents = (eventsPath) => {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
};

const registerCommands = async (commands) => {
    const rest = new REST().setToken(testToken);

    try {
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
    } catch (error) {
        console.error(error);
    }
};

const init = async () => {
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);
    let commands = [];

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        commands = commands.concat(loadCommands(commandsPath));
    }

    await registerCommands(commands);

    loadEvents(path.join(__dirname, 'events'));

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`!ERROR!    - No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            interactionError(interaction, error);
        }
    });

    client.login(isTesting ? testToken : token);
};

init();