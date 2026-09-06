const webpush = require('web-push');

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_CONTACT_EMAIL || 'admin@example.com'}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

async function sendPushToUser(userId, payload) {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return;

  const { PushSubscription } = require('./models');
  const subscriptions = await PushSubscription.findAll({ where: { user_id: userId } });

  await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: { p256dh: subscription.p256dh, auth: subscription.auth },
          },
          JSON.stringify(payload)
        );
      } catch (err) {
        // 404/410 means the browser has invalidated this subscription; anything else, just log it
        if (err.statusCode === 404 || err.statusCode === 410) {
          await subscription.destroy();
        } else {
          console.error('Push send failed:', err.message);
        }
      }
    })
  );
}

module.exports = { sendPushToUser };
