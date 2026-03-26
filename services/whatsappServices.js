const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
});

let isReady = false;  // ← track connection state

client.on('qr', (qr) => {
    console.log('📱 Scan QR code:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp connected!');
    isReady = true;  // ← mark as ready
});

client.on('auth_failure', () => {
    console.error('❌ WhatsApp auth failed');
});

client.initialize();

const sendWhatsApp = async (phone, message) => {
    try {
        // Wait until WhatsApp is ready
        if (!isReady) {
            console.log('⏳ Waiting for WhatsApp to connect...');
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (isReady) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 1000);  // check every second
            });
        }

        const formatted = phone.replace(/\D/g, '');  // remove non digits
        await client.sendMessage(`${formatted}@c.us`, message);
        console.log(`✅ WhatsApp sent to ${phone}`);
    } catch (err) {
        console.error(`❌ WhatsApp failed:`, err.message);
    }
};

module.exports = { sendWhatsApp, client };