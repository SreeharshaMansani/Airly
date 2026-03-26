// test-ical.js
const nodeIcal = require('node-ical');

const test = async () => {
    try {
        console.log('Testing URL 1...');
        const events1 = await nodeIcal.async.fromURL('http://localhost:3000/calendar');
        console.log('✅ URL 1 events:', JSON.stringify(events1, null, 2));
    } catch (err) {
        console.error('❌ URL 1 failed:', err.message);
    }

    try {
        console.log('Testing URL 2...');
        const events2 = await nodeIcal.async.fromURL('http://localhost:3000/files/send2');
        console.log('✅ URL 2 events:', JSON.stringify(events2, null, 2));
    } catch (err) {
        console.error('❌ URL 2 failed:', err.message);
    }
};

test();