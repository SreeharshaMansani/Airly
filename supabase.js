const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;




/* "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJzYWl0ZWphQGdtYWlsLmNvbSIsImlhdCI6MTc3MzQxMTAyMiwiZXhwIjoxNzc0MDE1ODIyfQ.Z1gA5lDpnMbe2oFQ8O-h2ZedkQDo6EwbHEfqVowfNHA",*/