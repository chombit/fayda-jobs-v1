# Telegram Bot Setup Guide for Fayda Jobs

## 🚀 Automatic Job Posting to Telegram Channel

This guide will help you set up automatic job posting from your Fayda Jobs website to your Telegram channel.

## 📋 Prerequisites

1. **Telegram Account**: You need a Telegram account
2. **Telegram Channel**: Your channel should be created (@faydajobs)
3. **Bot Token**: Get from BotFather on Telegram
4. **Admin Rights**: You must be admin of the channel

## 🔧 Step-by-Step Setup

### 1. Create Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/start` to BotFather
3. Send `/newbot` to create a new bot
4. Choose a name for your bot (e.g., "Fayda Jobs Bot")
5. Choose a username (must end in `bot`, e.g., "faydajobs_bot")
6. **Save the bot token** - it looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

### 2. Add Bot to Your Channel

1. Go to your Telegram channel (@faydajobs)
2. Go to **Channel Settings** → **Administrators**
3. Click **Add Admin**
4. Search for your bot username (e.g., @faydajobs_bot)
5. Give the bot these permissions:
   - ✅ Post Messages
   - ✅ Edit Messages
   - ✅ Delete Messages
   - ✅ Invite Users via Link

### 3. Configure Environment Variables

Add these to your `.env` file:

```bash
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHANNEL_ID=@faydajobs
```

### 4. Test the Bot

Run this test command to verify everything works:

```bash
# Test Telegram connection
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/getMe"
```

Or use the built-in test function by adding this temporarily to any page:

```javascript
import { testTelegramConnection, sendTestJobPost } from "@/lib/telegram-bot";

// Test connection
const isConnected = await testTelegramConnection();
console.log("Telegram connected:", isConnected);

// Send test post
const testSent = await sendTestJobPost();
console.log("Test post sent:", testSent);
```

## 📝 What Gets Posted to Telegram

When a job is created on your website, this limited information gets posted:

```
🔥 NEW JOB OPPORTUNITY

📋 Senior Software Engineer
🏢 Tech Company Ethiopia
📍 Addis Ababa
💼 Full-time
📂 IT Jobs

👇 Apply Now - Click Below 👇

🔗 View Full Details & Apply
📱 Join @faydajobs for more opportunities!
🌐 faydajobs.com
```

## 🎯 Benefits

1. **Traffic Generation**: Limited info drives users to click and visit your website
2. **Instant Notifications**: Jobs appear immediately in Telegram
3. **Professional Format**: Clean, consistent formatting with emojis
4. **Call-to-Action**: Direct buttons to apply and browse more jobs
5. **Mobile Optimized**: Perfect for Telegram mobile users

## 🔍 How It Works

1. **Job Created** → Admin posts a job on your website
2. **Database Save** → Job is saved to Supabase database
3. **Telegram Post** → Bot automatically posts to @faydajobs
4. **User Clicks** → User clicks "Apply Now" button
5. **Website Visit** → User lands on your job page to apply

## 🛠️ Troubleshooting

### Bot Not Posting
- Check bot token in `.env` file
- Verify bot is admin of channel
- Ensure bot has posting permissions

### Channel ID Issues
- Use `@channelname` for public channels
- Use `-1001234567890` for private channels
- Test with `/getme` endpoint first

### Formatting Issues
- Telegram supports Markdown formatting
- Emojis make posts more engaging
- Keep posts concise for better engagement

## 🚀 Advanced Features

### Custom Message Templates
Edit `formatJobPostForTelegram()` in `src/lib/telegram-bot.ts` to customize:

- Message formatting
- Emoji choices
- Button text
- Additional information

### Scheduled Posting
Add delays or scheduling logic to control when posts go out:

```javascript
// Add delay before posting
setTimeout(() => {
  postJobToTelegram(telegramJobData);
}, 5000); // 5 second delay
```

### Multiple Channels
Post to multiple channels by updating the configuration:

```javascript
const channels = ['@faydajobs', '@ethiojobs'];
for (const channel of channels) {
  postJobToChannel(telegramJobData, channel);
}
```

## 📊 Monitoring

Check your console logs for these messages:

- `✅ Telegram post successful` - Post sent successfully
- `⚠️ Telegram post failed` - Post failed but job was created
- `❌ Error posting to Telegram` - Technical error occurred

## 🔐 Security Notes

- **Never expose your bot token** in frontend code
- **Keep bot token secure** in environment variables
- **Limit bot permissions** to only what's needed
- **Monitor bot activity** regularly

## 📞 Support

If you need help:

1. Check Telegram BotFather documentation
2. Verify your bot token and channel ID
3. Test with the built-in test functions
4. Check console logs for error messages

---

**Ready to start driving traffic from Telegram to your website! 🚀**
