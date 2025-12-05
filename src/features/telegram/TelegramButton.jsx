import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';

// URL relativa a tu Vercel Function
const TELEGRAM_API_ENDPOINT = '/api/telegram-services'; 

const TelegramButton = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchLastFiveMessages = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Llama a tu Vercel Function (que a su vez llama a Telegram)
            const response = await fetch(TELEGRAM_API_ENDPOINT); 

            if (!response.ok) {
                // Si la Vercel Function devuelve un error (ej: 500)
                const errorData = await response.json();
                throw new Error(errorData.error || `Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            setMessages(data); 

        } catch (err) {
            console.error('Error al obtener los mensajes:', err);
            setError(`No se pudieron cargar los mensajes: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={fetchLastFiveMessages} 
                disabled={loading}
            >
                {loading ? 'Cargando...' : 'Obtener Últimos 5 Mensajes'}
            </Button>
            
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

            {messages.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Mensajes Recientes:</Typography>
                    <ul>
                        {messages.map((msg) => (
                            <li key={msg.id}>
                                <strong>{msg.date}:</strong> {msg.text}
                            </li>
                        ))}
                    </ul>
                </Box>
            )}
        </Box>
    );
};

export default TelegramButton;