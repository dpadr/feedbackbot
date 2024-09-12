const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');

const app = express();
const port = process.env.PORT || 0;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

app.use(express.json());

app.post('/send-feedback', async (req, res) => {
  const { feedback, user } = req.body;

  try {
    // Ensure bot is logged in
    if (!client.isReady()) {
      await client.login(process.env.DISCORD_BOT_TOKEN);
    }

    // Send feedback to Discord channel
    const channel = await client.channels.fetch(process.env.DISCORD_FEEDBACK_CHANNEL_ID);
    await channel.send({
      embeds: [{
        title: 'New Feedback',
        description: feedback,
        author: { name: user.name, icon_url: user.image },
        footer: { text: `User ID: ${user.id}` },
        timestamp: new Date(),
      }]
    });

    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

app.get('/', (req, res) => {
  res.send('Discord Feedback Bot is running!');
});

const server = app.listen(port, () => {
  const actualPort = server.address().port;
  console.log(`Discord Feedback Bot listening at http://localhost:${actualPort}`);
});

// Keep the bot alive
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);