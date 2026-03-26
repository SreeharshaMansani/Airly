const nodeIcal = require('node-ical');

const fetchIcalEvents = async (url) => {
    const events = await nodeIcal.async.fromURL(url);
    return events;
};

const getCheckoutEvents = (events) => {
    const checkouts = [];

    for (const key in events) {
        const event = events[key];

        // skip non VEVENT types
        if (event.type !== 'VEVENT') continue;

        console.log('📅 Event found:', {
            summary: event.summary,
            checkin: event.start,
            checkout: event.end,
        });

        // ✅ just push — no error variable here
        checkouts.push({
            summary: event.summary,
            checkin: event.start,
            checkout: event.end,
        });
    }

    return checkouts;  // ✅ make sure this is here
};

module.exports = { fetchIcalEvents, getCheckoutEvents };