const cron = require('node-cron');
const { checkCheckouts } = require('../services/checkoutService');

// Run every 1 hour
const startScheduler = () => {
    console.log('⏰ Scheduler started');

    // Run immediately on startup (wrapped in try-catch)
    (async () => {
        try {
            await checkCheckouts();
        } catch (error) {
            console.error('❌ Initial checkout check failed:', error.message);
        }
    })();

    // Then every 1 hour
    cron.schedule('0 * * * *', async () => {
        try {
            await checkCheckouts();
        } catch (error) {
            console.error('❌ Scheduled checkout check failed:', error.message);
        }
    });
};

module.exports = { startScheduler };