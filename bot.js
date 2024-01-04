const TelegramBot = require('node-telegram-bot-api');
const token = '6803758601:AAElEGATfQ32PVKUZvdzOSRhoXwuYLe_BvA'; 
const bot = new TelegramBot(token, { polling: true });

const users = {}; 

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    // Check if user exists in the users object, if not, ask for details
    if (!users[userId]) {
        users[userId] = { name: '', roomNumber: '', matricNumber: '' };

        // Ask for user details
        bot.sendMessage(chatId, 'Hi! Pleasure to make your acquantance.\nWhat is your name?');
    } else {
        // Handle user's input based on their state
        handleUserInput(chatId, userId, msg.text);
    }
});

// Function to handle user input
function handleUserInput(chatId, userId, userInput) {
    const user = users[userId];

    if (!user.name) {
        // If name is not set, store name and ask for room number
        user.name = userInput;
        bot.sendMessage(chatId, `Nice to meet you, ${user.name}! What is your room number?`);
    } else if (!user.roomNumber) {
        // If room number is not set, store room number and ask for matric number
        user.roomNumber = userInput;
        bot.sendMessage(chatId, `Got it! What is your matric number, ${user.name}?`);
    } else if (!user.matricNumber) {
        // If matric number is not set, store matric number and display options
        user.matricNumber = userInput;
        displayOptions(chatId);
    } else {
        // User has completed the details, handle options
        handleOptions(chatId, userId, userInput);
    }
}

// Function to display options to the user
function displayOptions(chatId) {
    const options = [
        'Events in the school',
        'Information about roll call',
        'Hostel lock time for chapel service',
        'Events of the hall'
    ];

    const keyboard = {
        reply_markup: {
            keyboard: options.map(option => [{ text: option }]),
            resize_keyboard: true,
            one_time_keyboard: true
        }
    };

    bot.sendMessage(chatId, 'Please select an option:', keyboard);
}

// Function to handle user's selected option
function handleOptions(chatId, userId, selectedOption) {
    // Implement logic to provide information based on the selected option
    let responseText = '';

    const user = users[userId];

    switch (selectedOption) {
        case 'Events in the school':
            responseText = 'Here are the upcoming events in the school...'; // Add relevant information
            break;
        case 'Information about roll call':
            responseText = 'Roll call is scheduled for 9pm to 10pm'; // Add relevant information
            break;
        case 'Hostel lock time for chapel service':
            responseText = 'The hostel will be locked for chapel service 15 minutes before the commencement of service'; // Add relevant information
            break;
        case 'Events of the hall':
            responseText = 'Upcoming events in the hall include...'; // Add relevant information
            break;
        case 'Thank you, I am done':
            responseText = `Glad I could be of assistance, ${user.name}! Do come again.`;
            // Reset user's state
            delete users[userId];
            // Display options again
            displayOptions(chatId);
            return; // Exit the function to avoid the default "Glad I could be of help, do come by next time."
        default:
            responseText = 'Glad I could be of help, do come by next time.';
    }

    // Send the response to the user
    bot.sendMessage(chatId, responseText);

    // Display options again with the "Thank you, I am done" button
    const additionalOptions = [
        'Events in the school', 
        'Information about roll call', 
        'Hostel lock time for chapel service', 
        'Events of the hall', 
        'Thank you, I am done'];
    const additionalKeyboard = {
        reply_markup: {
            keyboard: [additionalOptions.map(option => ({ text: option }))],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    };

    bot.sendMessage(chatId, 'Please select an option:', additionalKeyboard);
}
