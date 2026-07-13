import pg from 'pg';

const SUPABASE_DB_URL = 'postgresql://postgres:anusripvc202@db.ttjywwxethwoqgtcvzno.supabase.co:5432/postgres';

async function run() {
  const pgClient = new pg.Client({ connectionString: SUPABASE_DB_URL });
  await pgClient.connect();
  
  try {
    console.log('Seeding mock messages in Supabase...');

    // Clear existing messages first to avoid duplicates
    await pgClient.query('DELETE FROM messages');

    const photographerId = 'prof-1783936493675'; // Nikhil
    const client1Id = 'prof-1783938818743'; // Jaideep
    const client2Id = 'prof-1783939784896'; // Anu

    const messages = [
      // Session with Jaideep
      {
        _id: 'm-seed-1',
        sessionId: `sess-${client1Id}-${photographerId}`,
        senderId: client1Id,
        recipientId: photographerId,
        text: 'Hi Nikhil, is the equipment ready?',
        time: '10:00 AM'
      },
      {
        _id: 'm-seed-2',
        sessionId: `sess-${client1Id}-${photographerId}`,
        senderId: photographerId,
        recipientId: client1Id,
        text: 'Yes Jaideep, all gears are packed and verified.',
        time: '10:05 AM'
      },
      {
        _id: 'm-seed-3',
        sessionId: `sess-${client1Id}-${photographerId}`,
        senderId: client1Id,
        recipientId: photographerId,
        text: 'Looking forward to our shoot next Saturday!',
        time: '10:06 AM'
      },
      // Session with Anu
      {
        _id: 'm-seed-4',
        sessionId: `sess-${client2Id}-${photographerId}`,
        senderId: client2Id,
        recipientId: photographerId,
        text: 'Hello! Do you cover fashion events?',
        time: '09:12 AM'
      },
      {
        _id: 'm-seed-5',
        sessionId: `sess-${client2Id}-${photographerId}`,
        senderId: photographerId,
        recipientId: client2Id,
        text: 'Yes, I cover catalog shoots and fashion events.',
        time: '09:30 AM'
      },
      {
        _id: 'm-seed-6',
        sessionId: `sess-${client2Id}-${photographerId}`,
        senderId: client2Id,
        recipientId: photographerId,
        text: 'Could you please share your catalog starting prices?',
        time: '09:31 AM'
      }
    ];

    for (const m of messages) {
      await pgClient.query(`
        INSERT INTO messages ("_id", "sessionId", "senderId", "recipientId", "text", "time")
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [m._id, m.sessionId, m.senderId, m.recipientId, m.text, m.time]);
    }

    console.log('✅ Mock messages seeded successfully!');

    // Show row count
    const res = await pgClient.query('SELECT count(*) FROM messages');
    console.log(`Total messages in DB: ${res.rows[0].count}`);

  } catch (err) {
    console.error('❌ Error seeding messages:', err);
  } finally {
    await pgClient.end();
  }
}
run();
