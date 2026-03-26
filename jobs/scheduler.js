const cron = require('node-cron');
const { checkCheckouts } = require('../services/checkoutService');

// Run every 1 hour
const startScheduler = () => {
    console.log('⏰ Scheduler started');

    // Run immediately on startup
    checkCheckouts();

    // Then every 1 hour
    cron.schedule('0 * * * *', () => {
        checkCheckouts();
    });
};

module.exports = { startScheduler };