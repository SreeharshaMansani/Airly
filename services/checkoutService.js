const supabase = require('../supabase');
const { fetchIcalEvents, getCheckoutEvents } = require('./icalService');
const { sendWhatsApp } = require('./whatsappServices');

const checkCheckouts = async () => {
    console.log('🔄 Running checkout check:', new Date().toISOString());

    // Step 1 — Get all holdings
    const { data: holdings, error } = await supabase
        .from('holdings')
        .select(`
            id,
            name,
            ical_url,
            cleaner_id,
            cleaners (
                name,
                phone_number
            )
        `);

    console.log('📋 Holdings error:', error);
    console.log('📋 Total holdings found:', holdings?.length);

    if (error) {
        console.error('❌ Error fetching holdings:', error.message);
        return;
    }

    if (!holdings || holdings.length === 0) {
        console.log('⚠️ No holdings found in database');
        return;
    }

    // Current time window — now to next 1 hour
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    console.log(`⏰ Checking checkouts between ${now.toISOString()} and ${oneHourLater.toISOString()}`);

    // Step 2 — Loop through each holding
    for (const holding of holdings) {
        try {
            console.log(`\n📍 Processing holding: ${holding.name}`);

            // Check ical_url exists
            if (!holding.ical_url) {
                console.log(`⚠️ No iCal URL for ${holding.name} — skipping`);
                continue;
            }

            // Check cleaner assigned
            if (!holding.cleaners) {
                console.log(`⚠️ No cleaner assigned to ${holding.name} — skipping`);
                continue;
            }

            // Step 3 — Fetch and parse ical
            console.log(`📡 Fetching iCal for ${holding.name}...`);
            const events = await fetchIcalEvents(holding.ical_url);
            console.log(`📦 Raw events count:`, Object.keys(events).length);

            const checkouts = getCheckoutEvents(events);
            console.log(`📅 Parsed checkouts:`, checkouts);

            if (checkouts.length === 0) {
                console.log(`⚠️ No checkout events for ${holding.name}`);
                continue;
            }

            // Step 4 — Check if checkout is within next 1 hour
            for (const checkout of checkouts) {
                const checkoutDate = new Date(checkout.checkout);
                console.log(`🔍 Checkout date: ${checkoutDate}`);

                if (checkoutDate >= now && checkoutDate <= oneHourLater) {
                    console.log(`✅ Checkout within next hour at ${holding.name}!`);

                    const cleaner = holding.cleaners;
                    const message =
                        `Hi ${cleaner.name}! 🏠\n\n` +
                        `Cleaning required soon at *${holding.name}*\n` +
                        `Guest checkout: ${checkoutDate.toLocaleTimeString()}\n\n` +
                        `Please confirm your availability.`;

                    console.log(`📱 Sending WhatsApp to ${cleaner.name} (${cleaner.phone_number})`);
                    await sendWhatsApp(`+${cleaner.phone_number}`, message);

                } else {
                    console.log(`⏭️ Checkout not within next hour — skipping`);
                }
            }
        } catch (err) {
            console.error(`❌ Error processing ${holding.name}:`, err.message);
            console.error(err.stack);
        }
    }

    console.log('\n✅ Checkout check complete');
};

module.exports = { checkCheckouts };