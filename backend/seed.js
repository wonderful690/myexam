require('dotenv').config();
const mongoose = require('mongoose');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/conference_db');
    await mongoose.connection.db.dropDatabase();

    const Room = require('./models/Room');
    const User = require('./models/User');

    const rooms = await Room.insertMany([
      { name: 'Конференц-зал А', type: 'auditorium', capacity: 100, description: 'Просторный зал с проектором', pricePerHour: 5000 },
      { name: 'Коворкинг центр', type: 'coworking', capacity: 30, description: 'Современное пространство', pricePerHour: 2000 },
      { name: 'Кинозал', type: 'cinema', capacity: 80, description: 'Кинозал с профессиональным звуком', pricePerHour: 7000 },
      { name: 'Малый зал Б', type: 'auditorium', capacity: 40, description: 'Камерный зал для семинаров', pricePerHour: 3000 },
      { name: 'Коворкинг лофт', type: 'coworking', capacity: 20, description: 'Уютный лофт', pricePerHour: 1500 },
      { name: 'VIP кинозал', type: 'cinema', capacity: 30, description: 'Премиум кинозал', pricePerHour: 10000 }
    ]);
    console.log(`Создано ${rooms.length} помещений`);

    const admin = await User.create({
      username: 'Admin26',
      password: 'Demo20',
      fullName: 'Администратор Системы',
      phone: '+7 (999) 000-00-00',
      email: 'admin@conference.ru',
      role: 'admin'
    });
    console.log('Администратор создан:');
    console.log('   Логин: Admin26');
    console.log('   Пароль: Demo20');

    console.log('\nБаза данных успешно заполнена!\n');

  } catch (error) {
    console.error('Ошибка:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();