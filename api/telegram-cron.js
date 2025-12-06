import axios from 'axios';
// Importamos el cliente de Supabase que acabamos de configurar
import { supabase } from "src/utils/supabase";

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
    
    // 1. Preparar los datos para la inserción
    const dataToInsert = updates
      .filter(update => update.message)
      .map(update => ({
          // Mapeamos el message_id (clave única para la comprobación)
          message_id: update.message.message_id, 
          // El campo 'link' y 'extract' no están en el objeto 'update.message' por defecto,
          // así que los inicializamos a NULL o a valores por defecto, según tu lógica.
          link: update.message.text || null, // Usamos el texto del mensaje como "link" temporal o si contiene el link real.
          extract: false, // Asumimos que aún no se ha extraído la receta
      }));

    if (dataToInsert.length > 0) {
      // 2. ALMACENAR EN LA BASE DE DATOS con Upsert (Inserción Condicional)
      
      const { data, error, count } = await supabase
        .from('RecipesExtract')
        .upsert(dataToInsert, { 
            // Esta línea es la clave: le dice a Supabase que, si encuentra 
            // un conflicto con la columna 'message_id', simplemente lo ignore.
            onConflict: 'message_id',
            ignoreDuplicates: true
        })
        .select(); 

      if (error) {
        throw new Error(`Error de Supabase: ${error.message}`);
      }
      
      const insertedCount = data ? data.length : 0;
      
      // 3. LOG DE VERIFICACIÓN (Para el log de Vercel)
      console.log('✅ Tarea Cron ejecutada. Mensajes obtenidos.');
      console.log(`📝 Intentos de inserción: ${dataToInsert.length}. Nuevos mensajes insertados: ${insertedCount}`);
      dataToInsert.forEach(item => console.log(`[ID: ${item.message_id}] ${item.link ? item.link.substring(0, 50) + '...' : '[Sin Texto]'}`));

      // 4. (Opcional) Confirmar mensajes a Telegram actualizando el offset
      // ... (código para actualizar el offset)
    } else {
        console.log('✅ Tarea Cron ejecutada. No hay mensajes válidos para procesar.');
    }

    res.status(200).json({ status: 'Success', message: 'Cron job finished and data processed.' });

  } catch (error) {
    console.error('❌ Error fatal en el Cron Job:', error.message);
    res.status(500).json({ status: 'Error', message: error.message });
  }
}