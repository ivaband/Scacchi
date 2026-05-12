const functions = require('firebase-functions');
const admin     = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// Notifica quando viene fatta una mossa
exports.onMoveMade = functions.firestore
  .document('games/{gameId}')
  .onUpdate(async (change, ctx) => {
    const before = change.before.data();
    const after  = change.after.data();
    if (!after || after.status !== 'active') return null;
    if ((after.moves || []).length <= (before.moves || []).length) return null;

    const nextTurn     = after.currentTurn || 'w';
    const recipientUid = nextTurn === 'w' ? after.whiteUid : after.blackUid;
    if (!recipientUid) return null;

    const senderName = nextTurn === 'w'
      ? (after.blackDisplayName || after.blackEmail || 'Avversario')
      : (after.whiteDisplayName || after.whiteEmail || 'Avversario');

    const lastMove = after.moves[after.moves.length - 1];

    const userSnap = await db.collection('users').doc(recipientUid).get();
    if (!userSnap.exists) return null;
    const fcmToken = userSnap.data().fcmToken;
    if (!fcmToken) return null;

    try {
      await admin.messaging().send({
        token: fcmToken,
        notification: {
          title: '♟ Scacchi Regali — È il tuo turno!',
          body:  `${senderName} ha giocato ${lastMove.san}`
        },
        webpush: { notification: { icon: 'https://scacchi-b74ea.web.app/icon-192.png' } }
      });
    } catch (e) {
      console.log('FCM send error:', e.message);
    }
    return null;
  });

// Notifica quando arriva un invito
exports.onInviteCreated = functions.firestore
  .document('invites/{inviteId}')
  .onCreate(async (snap, ctx) => {
    const inv = snap.data();
    if (!inv || !inv.toEmail) return null;

    const usersSnap = await db.collection('users')
      .where('email', '==', inv.toEmail).get();
    if (usersSnap.empty) return null;

    const fcmToken = usersSnap.docs[0].data().fcmToken;
    if (!fcmToken) return null;

    try {
      await admin.messaging().send({
        token: fcmToken,
        notification: {
          title: '♟ Scacchi Regali — Nuovo invito!',
          body:  `${inv.fromDisplayName || inv.fromEmail} ti ha invitato a una partita!`
        },
        webpush: { notification: { icon: 'https://scacchi-b74ea.web.app/icon-192.png' } }
      });
    } catch (e) {
      console.log('FCM invite error:', e.message);
    }
    return null;
  });
