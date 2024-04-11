const express = require('express');
const app = express();

app.get('/', (req, res) => {

    res.send('Server Works!');
    require('dotenv').config();

    const TelegramBot = require('node-telegram-bot-api');

    const token = process.env.TELEGRAM_KEY; // Replace with your own bot token
    const bot = new TelegramBot(token, {
        polling: true
    });

    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const messageText = msg.text;

        if (messageText === '/start') {
            // Display menu options when user starts the bot
            const menuMessage = `
Bemvindo Mai iha Bot Klima Atual:
=============================================
Halo Favor Hatama Munisipiu nia naran hodi asessu kondisaun klima atual:
    `;
            bot.sendMessage(chatId, menuMessage);
        } else if (messageText) {
            bot.sendMessage(chatId, parseUrl(messageText));
        } else {
            // Show menu message for any other input
            const errorMessage = `
Opsaun Invalidu
=============================================
Halo Favor Hatama Munisipiu nia naran hodi asessu kondisaun klima atual:
    `;
            bot.sendMessage(chatId, errorMessage);
        }



        async function parseUrl(city) {
            const axios = require('axios');

            try {
                const res = await axios.get('https://weather-api-timor-leste-production.up.railway.app/api/klima/' + city);

                const jsonData = JSON.stringify(res.data);

                function parseDataAndReturn(jsonData) {
                    // Parse the JSON string to an object
                    const parsedData = JSON.parse(jsonData);

                    // Extracting the properties
                    const id = parsedData.data.id;
                    const munisipiu = parsedData.data.munisipiu;
                    const tempu = parsedData.data.tempu;
                    const temperatura_2m = parsedData.data.temperatura_2m;
                    const umidade_2m = parsedData.data.umidade_2m;
                    const presipitasaun = parsedData.data.presipitasaun;
                    const udan = parsedData.data.udan;
                    const kodigu_klima = parsedData.data.kodigu_klima;
                    const kalohan_taka = parsedData.data.kalohan_taka;
                    const presaun_tasi = parsedData.data.presaun_tasi;
                    const presaun_rai = parsedData.data.presaun_rai;
                    const velosidade_anin_10m = parsedData.data.velosidade_anin_10m;

                    function parseDataKlima(kodigu_klima) {

                        switch (kodigu_klima) {
                            case 0:
                                return '☀️ ' + 'Lalehan Naroman'
                            case 1:
                            case 2:
                            case 3:
                                return '⛅ ' + 'Naroman Naton, Kalohan, Kalohan nakukun uitoan';
                            case 45:
                            case 48:
                                return '☁️ ' + 'Abu-Abu taka';
                            case 51:
                            case 53:
                            case 55:
                                return '🌦️ ' + "Udan Piska: Kamaan, Moderada, Intensidade aas";
                            case 56:
                            case 57:
                                return '🌦️ ' + "Udan Piska Malirin: Kamaan, Moderada, Intensidade aas";

                            case 61:
                            case 63:
                            case 65:
                                return '🌧️ ' + "Udan: Kamaan, Moderada, Intensidade aas";

                            case 66:
                            case 67:
                                return '🌧️ ' + "Udan Malirin: Kamaan, Moderada, Intensidade aas";

                            case 71:
                            case 73:
                            case 75:
                                return '☃️ ' + "Neve: Kamaan, Moderada, Intensidade aas";

                            case 77:
                                return '⛄ ' + "Neve Piska";

                            case 80:
                            case 81:
                            case 82:
                                return '🌧️ ' + "Udan maka'as: Kamaan, Moderada, Maka'as";

                            case 85:
                            case 86:
                                return '❄️ ' + "Udan Neve: Kamaan, Maka'as";

                            case 95:
                                return '🌩️ ' + "Railakan: kamaan, maka'as";

                            case 96:
                            case 99:
                                return '⛈️ ' + "Railakan ho Udan Es: Kama'an no Maka'as";
                            default:
                                return 'Nothing'; // Handle default case

                        }
                    }

                    // Construct a string with the extracted properties in a more formatted manner
                    return `
Kondisaun Klima Atual
=============================================
Munisipiu: **${munisipiu.replace(/^\w/, (c) => c.toUpperCase())}**
Tempu: **${tempu}**
Temperatura: **${temperatura_2m}**
Kondisaun Klima: **${parseDataKlima(kodigu_klima)}**
Umidade: **${umidade_2m}**
Presipitasaun: **${presipitasaun}**
Udan: **${udan}**
Kalohan Taka: **${kalohan_taka}**
Presaun Tasi: **${presaun_tasi}**
Presaun Rai: **${presaun_rai}**
Velosidade Anin 10m: **${velosidade_anin_10m}**
Nasaun: **Timor-Leste**
${'https://cdn.britannica.com/33/61833-050-302C6C05/East-Timor.jpg'}
`.trim();
                }

                const weatherInfo = parseDataAndReturn(jsonData);
                return bot.sendMessage(chatId, weatherInfo);
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    console.error('Error fetching weather data:', error);
                    return bot.sendMessage(chatId, "Dadus la existe halo favor hanehan '/start' ou hakerek naran munisipiu ho los");
                } else {
                    console.error('Error fetching weather data:', error);
                    return bot.sendMessage(chatId, "Komesa Chatbot ho ketik '/start'");
                }
            }
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});