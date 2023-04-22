const express = require('express');
const { PrismaClient } = require('@prisma/client');
const admin = require('firebase-admin');

const app = express();
const prisma = new PrismaClient();
const serviceAccount = require('./notification-notifee-exemple-firebase-adminsdk-walbg-f221b4cfba.json');
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    'https://notification-notifee-exemple-default-rtdb.firebaseio.com',
});

app.get('/', async (req, res) => {
  const token = [
    '<DEVICE_TOKEN>',
  ];

  await admin.messaging().sendMulticast({
    tokens: token,
    android: {
      priority: 'high',
    },
    data: {
      title: '[Passo a Passo] Renderizando gráficos no React Native',
      body: 'Fala galera, hoje eu vou mostrar como você pode renderizar gráficos no react native sem perder na performance e assim customizar do jeito certo. Espero que gostem!!!',
      image: 'https://github.com/Icode-Mobile.png',
      actions: JSON.stringify([
        {
          title: 'Assistir',
          pressAction: {
            id: 'watch',
          },
        },
        {
          title: 'Assistir mais tarde',
          pressAction: {
            id: 'watch-later',
          },
        },
        {
          title: 'Cancelar',
          pressAction: {
            id: 'cancel',
          },
        },
      ]),
    },
    apns: {
      payload: {
        aps: {
          contentAvailable: true,
        },
      },
      headers: {
        'apns-push-type': 'background',
        'apns-priority': '5',
        'apns-topic': '',
      },
    },
  });

  return res.status(200).send({
    error: false,
    message: 'Tudo ok',
  });
});

app.post('/registerToken', async (req, res) => {
  const { token } = req.body;

  const alreadyToken = await prisma.deviceToken.findFirst({
    where: {
      id: '<ID_DO_REGISTRO_DO_TOKEN>',
    },
  });

  if (!alreadyToken) {
    const registerToken = await prisma.deviceToken.create({
      data: {
        token,
        userId: '<ID_DO_REGISTRO_USUARIO>',
      },
    });
    console.log(registerToken);
  }
});

app.listen(PORT, () => {
  console.log('Server is running -> http://localhost:' + PORT);
});
