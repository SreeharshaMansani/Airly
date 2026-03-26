require('dotenv').config();
const supabase = require('./supabase');
const { checkCheckouts } = require('./services/checkoutService');

async function testMessageSending() {
    console.log('Setting up test data...');

    // Assume a user exists, or create one
    // For simplicity, use existing user id 7 from previous test

    const userId = 7;

    // Create a test cleaner
    const cleanerData = {
        user_id: userId,
        name: 'Test Cleaner',
        phone_number: '+1234567890', // Use a test number
        street: '123 Clean St',
        city: 'Clean City',
        state: 'CC',
        country: 'Test',
        zip: '12345'
    };

    const { data: cleaner, error: cleanerError } = await supabase
        .from('cleaners')
        .insert(cleanerData)
        .select()
        .single();

    if (cleanerError) {
        console.error('Error creating cleaner:', cleanerError.message);
        return;
    }

    console.log('Cleaner created:', cleaner.id);

    // Create a test holding with iCal URL that has a checkout tomorrow
    // Use the test iCal URL from test_ical.js, but modify to have tomorrow's checkout
    // For simplicity, use a URL that has events

    const holdingData = {
        user_id: userId,
        name: 'Test Holding',
        street: '123 Hold St',
        city: 'Hold City',
        state: 'HC',
        country: 'Test',
        zip: '12345',
        ical_url: 'https://calendar.google.com/calendar/ical/en.usa%23holiday%40group.v.calendar.google.com/public/basic.ics',
        cleaner_id: cleaner.id
    };

    const { data: holding, error: holdingError } = await supabase
        .from('holdings')
        .insert(holdingData)
        .select()
        .single();

    if (holdingError) {
        console.error('Error creating holding:', holdingError.message);
        return;
    }

    console.log('Holding created:', holding.id);

    // Now run checkCheckouts
    console.log('Running checkCheckouts...');
    await checkCheckouts();

    console.log('Test complete. Check for WhatsApp message sent.');
}

testMessageSending().catch(console.error);