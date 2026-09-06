const bcrypt = require('bcrypt');
const crypto = require('crypto');

const DELETED_USER_USERNAME = 'deleted_user';
const DELETED_USER_EMAIL = 'deleted-user@bound.invalid';

// A single shared placeholder account (like Reddit's u/[deleted]) that every
// deleted account's shared/visible content gets reassigned to, rather than
// leaving posts/comments/messages pointing at a user_id that no longer exists.
async function getOrCreateDeletedUserPlaceholder(User) {
  let placeholder = await User.findOne({ where: { username: DELETED_USER_USERNAME } });
  if (placeholder) return placeholder;

  const unusablePassword = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
  return User.create({
    username: DELETED_USER_USERNAME,
    email: DELETED_USER_EMAIL,
    password: unusablePassword,
    visibility: 'private',
  });
}

// Right-to-be-forgotten deletion: content other people can see (posts, comments,
// reactions, messages, and ownership of durable entities like groups/events/polls)
// is reassigned to the placeholder account instead of being destroyed, so deleting
// your account doesn't blow up someone else's comment thread or DM history. Data
// that's purely personal (preferences, push subscriptions, karma, consent records,
// etc.) is deleted outright rather than left attached to a "[deleted]" ghost.
async function anonymizeAndDeleteUser(user, models) {
  const {
    User, Post, Comment, Reaction, Message, Group, Event, Poll, Report,
    Consent, Feedback, KarmaPoints, NotificationPreference, UserPreference,
    Notification, PushSubscription, GroupMember, EventFeedback, Profile,
  } = models;

  const placeholder = await getOrCreateDeletedUserPlaceholder(User);
  const userId = user.id;
  const placeholderId = placeholder.id;

  await Post.update({ author_id: placeholderId }, { where: { author_id: userId } });
  await Comment.update({ user_id: placeholderId }, { where: { user_id: userId } });
  await Reaction.update({ user_id: placeholderId }, { where: { user_id: userId } });
  await Message.update({ sender_id: placeholderId }, { where: { sender_id: userId } });
  await Message.update({ receiver_id: placeholderId }, { where: { receiver_id: userId } });
  await Group.update({ created_by: placeholderId }, { where: { created_by: userId } });
  await Event.update({ created_by: placeholderId }, { where: { created_by: userId } });
  await Poll.update({ created_by: placeholderId }, { where: { created_by: userId } });
  await Report.update({ reported_by: placeholderId }, { where: { reported_by: userId } });
  await Report.update({ moderated_by: placeholderId }, { where: { moderated_by: userId } });

  await Consent.destroy({ where: { user_id: userId } });
  await Feedback.destroy({ where: { user_id: userId } });
  await KarmaPoints.destroy({ where: { user_id: userId } });
  await NotificationPreference.destroy({ where: { user_id: userId } });
  await UserPreference.destroy({ where: { user_id: userId } });
  await Notification.destroy({ where: { user_id: userId } });
  await PushSubscription.destroy({ where: { user_id: userId } });
  await GroupMember.destroy({ where: { user_id: userId } });
  await EventFeedback.destroy({ where: { user_id: userId } });
  await Profile.destroy({ where: { user_id: userId } });

  await user.destroy();
}

module.exports = { anonymizeAndDeleteUser, DELETED_USER_USERNAME };
