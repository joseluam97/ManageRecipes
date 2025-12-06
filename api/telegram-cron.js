import axios from 'axios/dist/node/axios.cjs';

// Importamos el cliente de Supabase que acabamos de configurar
import { supabase } from "../src/utils/supabase";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; 
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  try {
    const response = await axios.post(TELEGRAM_API_URL, {
      limit: 20,
      timeout: 30
    });

    const updates = response.data.result;

    for (const update of updates) {
      console.log(`Mensaje ID: ${update.message.message_id}, Texto: ${update.message.text}`);

      // Check if message text exists
      if (!update.message || !update.message.text) {
        console.log("El mensaje no contiene texto. Saltando...");
        continue;
      }

      // Check if link is created already
      const { data: existingLink, error: fetchError } = await supabase
        .from('RecipesExtract')
        .select('*')
        .eq('message_id', update.message.message_id)
        .single();

      if (existingLink) {
        console.log("El enlace ya ha sido procesado. Saltando...");
        continue;
      }

      let link_proccessed = {
        message_id: update.message.message_id,
        link: update.message.text || null,
        extract: false,
      };

      // Hacer el insert en Supabase
      const { data, error } = await supabase
        .from('RecipesExtract')
        .insert([link_proccessed])
        .select()
        .single();

      if (error) {
        console.log("ERROR:");
        console.log(error.message);
        throw new Error(`Error de Supabase: ${error.message}`);
      }
      
      console.log("Mensaje enviado:", data);

    }

    res.status(200).json({ status: 'Success', message: 'Cron job finished and data processed.' });

  } catch (error) {
    console.error('❌ Error fatal en el Cron Job:', error.message);
    res.status(500).json({ status: 'Error', message: error.message });
  }
}