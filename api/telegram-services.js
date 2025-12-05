// Este archivo actúa como tu endpoint de Backend en Vercel

const axios = require('axios');

// Vercel inyecta automáticamente las variables de entorno aquí
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// La función principal que maneja la petición
export default async function (req, res) {
    // Verificar si el token y el chat ID están configurados
    if (!BOT_TOKEN || !CHAT_ID) {
        res.status(500).json({ error: 'Configuración del token de Telegram faltante.' });
        return;
    }

    try {
        // 1. Llamada a la API de Telegram. 'limit=5' para los últimos 5 mensajes.
        const response = await axios.get(`${API_URL}/getUpdates`, {
            params: {
                limit: 5,
            }
        });

        const updates = response.data.result;

        // 2. Procesamiento y filtrado de los mensajes
        const filteredMessages = updates
            .filter(update => {
                // Filtra para asegurar que el mensaje es del CHAT_ID que especificaste
                const chatId = update.message ? update.message.chat.id : null;
                return chatId && chatId.toString() === CHAT_ID.toString();
            })
            .map(update => ({
                id: update.update_id,
                // Puedes adaptar qué contenido quieres mostrar (texto, foto, etc.)
                text: update.message ? update.message.text : 'Mensaje no textual/no compatible',
                date: new Date((update.message ? update.message.date : 0) * 1000).toLocaleString()
            }))
            .reverse(); // Opcional: invierte para que el mensaje más reciente quede al final

        // 3. Respuesta exitosa a tu componente React
        res.status(200).json(filteredMessages);

    } catch (error) {
        console.error('Error fetching Telegram updates:', error.message);
        // Respuesta de error al componente React
        res.status(500).json({ 
            error: 'Error al comunicarse con Telegram.',
            details: error.response ? error.response.data : error.message
        });
    }
}