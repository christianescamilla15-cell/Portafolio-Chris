/**
 * MultiAgente WhatsApp Bot — whatsapp-web.js
 *
 * Session system:
 *   - Send #soporte to open a 5-minute support session
 *   - Any message (text or voice) within 5 min is processed
 *   - Without active session → asks to send #soporte
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const FormData = require('form-data');

const API_URL = process.env.API_URL || 'https://multiagente-api.onrender.com';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const SESSION_DURATION_MS = 5 * 60 * 1000; // 5 minutes

console.log('\n  MultiAgente WhatsApp Bot');
console.log(`  API: ${API_URL}\n`);

// Session store: phone → expiry timestamp
const sessions = new Map();

function isSessionActive(phone) {
    const expiry = sessions.get(phone);
    if (expiry && Date.now() < expiry) return true;
    sessions.delete(phone);
    return false;
}

function openSession(phone) {
    const expiry = Date.now() + SESSION_DURATION_MS;
    sessions.set(phone, expiry);
    return expiry;
}

function remainingMinutes(phone) {
    const expiry = sessions.get(phone) || 0;
    const remaining = Math.max(0, expiry - Date.now());
    return Math.ceil(remaining / 60000);
}

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './wa_session' }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-first-run',
        ],
    },
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/nicoli-hub/nicoli-hub/main/nicoli-hub-api',
    },
    webVersion: '2.3000.1017531758-alpha',
});

client.on('qr', (qr) => {
    console.log('  Escanea el QR con WhatsApp:\n');
    qrcode.generate(qr, { small: true });
    console.log('\n  WhatsApp > Dispositivos vinculados > Vincular\n');
});

client.on('ready', () => {
    console.log('  WhatsApp conectado! Listo para recibir mensajes.\n');
});

client.on('disconnected', (reason) => {
    console.log('  Disconnected:', reason);
});

client.on('message', async (msg) => {
    // Skip group messages and status
    if (msg.from === 'status@broadcast') return;
    if (msg.from.endsWith('@g.us')) return;

    const phone = '+' + msg.from.split('@')[0];
    let messageText = '';

    // ── Extract message content ──────────────────────────────────

    // Text message
    if (msg.body && !msg.hasMedia) {
        messageText = msg.body;
    }

    // Voice note
    else if (msg.hasMedia && msg.type === 'ptt') {
        // Voice notes need active session (can't type #soporte by voice)
        if (!isSessionActive(phone)) {
            await msg.reply(
                'Envia *#soporte* para iniciar una sesion de 5 minutos.\n' +
                'Despues podras enviar notas de voz.\n\n' +
                'Send *#soporte* to start a 5-minute session.'
            );
            return;
        }

        try {
            console.log(`  [VOICE] ${phone} - downloading...`);
            const media = await msg.downloadMedia();
            if (media && GROQ_API_KEY) {
                const audioBuffer = Buffer.from(media.data, 'base64');
                messageText = await transcribeAudio(audioBuffer);
                if (!messageText) {
                    await msg.reply('No se pudo transcribir el audio. Intenta con texto.');
                    return;
                }
                console.log(`  [VOICE] Transcribed (${messageText.length} chars): ${messageText.substring(0, 80)}`);
            } else {
                await msg.reply('Notas de voz no disponibles ahora. Intenta con texto.');
                return;
            }
        } catch (err) {
            console.error('  Voice error:', err.message);
            await msg.reply('Error procesando audio.');
            return;
        }
    }

    // Image/document
    else if (msg.hasMedia && (msg.type === 'image' || msg.type === 'document')) {
        if (isSessionActive(phone)) {
            await msg.reply(`Recibi tu archivo. Por ahora solo proceso texto y notas de voz. (${remainingMinutes(phone)}min restantes)`);
        }
        return;
    }

    // Other
    else {
        return;
    }

    if (!messageText.trim()) return;

    // ── Check for #soporte trigger ───────────────────────────────
    const lower = messageText.trim().toLowerCase();
    if (lower === '#soporte' || lower === '#support') {
        openSession(phone);
        console.log(`  [SESSION] ${phone} - opened for 5 minutes`);
        await msg.reply(
            '✅ *Sesion de soporte abierta por 5 minutos.*\n\n' +
            'Envia tu mensaje de texto o nota de voz ahora.\n' +
            'Puedo ayudarte con:\n' +
            '• Consultas de pagos y saldos\n' +
            '• Reportes tecnicos\n' +
            '• Reservaciones de amenidades\n' +
            '• Quejas y sugerencias\n\n' +
            '_Session open for 5 minutes. Send text or voice._'
        );
        return;
    }

    // ── Check active session ─────────────────────────────────────
    if (!isSessionActive(phone)) {
        await msg.reply(
            'Envia *#soporte* para iniciar una sesion de 5 minutos.\n\n' +
            'Send *#soporte* to start a 5-minute session.'
        );
        return;
    }

    const remaining = remainingMinutes(phone);
    console.log(`  [IN]  ${phone} (${remaining}min left): ${messageText.substring(0, 60)}`);

    // ── Process through MultiAgente API ──────────────────────────
    try {
        // Check if resident exists
        const lookupResp = await axios.get(
            `${API_URL}/api/residents/lookup/${encodeURIComponent(phone)}`,
            { timeout: 10000 }
        );

        if (!lookupResp.data?.found) {
            console.log(`  [SKIP] ${phone}: not a registered resident`);
            return;
        }

        console.log(`  [OK] Resident: ${lookupResp.data.resident.full_name} (${lookupResp.data.resident.unit_number})`);

        // Route through orchestrator
        const resp = await axios.post(`${API_URL}/api/residents/chat`, {
            message: messageText,
            phone: phone,
        }, { timeout: 30000 });

        const result = resp.data;
        const responseText = result.text || 'No pude procesar tu mensaje.';

        console.log(`  [OUT] ${result.agent || '?'}: ${responseText.substring(0, 60)}`);
        await msg.reply(`${responseText}\n\n_[${remaining}min restantes]_`);

    } catch (err) {
        console.error('  API error:', err.message);
        if (err.response?.status !== 404) {
            await msg.reply('Hubo un error. Intenta de nuevo.');
        }
    }
});

async function transcribeAudio(audioBuffer) {
    try {
        const form = new FormData();
        form.append('file', audioBuffer, { filename: 'audio.ogg', contentType: 'audio/ogg' });
        form.append('model', 'whisper-large-v3-turbo');
        form.append('language', 'es');
        form.append('response_format', 'text');

        const resp = await axios.post('https://api.groq.com/openai/v1/audio/transcriptions', form, {
            headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, ...form.getHeaders() },
            timeout: 30000,
        });
        return resp.data?.trim() || '';
    } catch (err) {
        console.error('  Whisper error:', err.message);
        return '';
    }
}

console.log('  Initializing...\n');
client.initialize();
