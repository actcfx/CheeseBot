const fs = require('node:fs'); // File system module
const path = require('node:path'); // Path module
const { Client, Collection, Events, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js'); // Discord.js library

const { isTesting, token, testToken, clientId } = require('../config/config.json'); // Configuration variables
const { interactionError } = require('./utils/error'); // Error handling utility

// Create a new Discord client instance with specified intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ]
});
client.commands = new Collection(); // Collection to store commands

// Function to load commands from the specified path
const loadCommands = (commandsPath) => {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Get all command files
    const commands = [];

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath); // Load command file
        if ('data' in command && 'execute' in command) { // Check if command has required properties
            client.commands.set(command.data.name, command); // Add command to collection
            commands.push(command.data.toJSON()); // Add command data to commands array
            console.log(`[LOAD]     | \`${command.data.name}\` is loaded.`);
        } else {
            console.warn(`/WARNING/  - ${file} does not have the required data and execute properties.`);
        }
    }
    console.log('----------------------------------------');

    return commands; // Return loaded commands
};

// Function to load events from the specified path
const loadEvents = (eventsPath) => {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js')); // Get all event files

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath); // Load event file
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args)); // Register one-time event
        } else {
            client.on(event.name, (...args) => event.execute(...args)); // Register recurring event
        }
    }
};

// Function to register commands with Discord API
const registerCommands = async (commands) => {
    const rest = new REST().setToken(testToken); // Create REST client with test token

    try {
        await rest.put(
            Routes.applicationCommands(clientId), // Register commands for the application
            { body: commands },
        );
    } catch (error) {
        console.error(error); // Log any errors
    }
};

// Initialization function
const init = async () => {
    const foldersPath = path.join(__dirname, 'commands'); // Path to commands folder
    const commandFolders = fs.readdirSync(foldersPath); // Get all command folders
    let commands = [];

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        commands = commands.concat(loadCommands(commandsPath)); // Load commands from each folder
    }

    await registerCommands(commands); // Register all loaded commands

    loadEvents(path.join(__dirname, 'events')); // Load events

    // Event listener for interactions
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return; // Ignore non-command interactions

        const command = interaction.client.commands.get(interaction.commandName); // Get the command

        if (!command) {
            console.error(`!ERROR!    - No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction); // Execute the command
        } catch (error) {
            interactionError(interaction, error); // Handle any errors
        }
    });

    client.login(isTesting ? testToken : token); // Log in to Discord with the appropriate token
};

init(); // Start the bot