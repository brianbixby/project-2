"use strict";

const { User } = require('../models');

const userData = [
  {
    user_name: 'Brian',
    email: 'brian@gmail.com',
    password: 'password1',
    'is_online': true,
    image_url: 'https://avatars.githubusercontent.com/u/23647013?s=40&v=4',
  },
  {
    user_name: 'Joe',
    email: 'joe@gmail.com',
    password: 'password12',
    'is_online': true,
    image_url: 'https://avatars.githubusercontent.com/u/23647013?s=40&v=4',
  },
  {
    user_name: 'Karen',
    email: 'karen@gmail.com',
    password: 'password2',
    'is_online': true,
    image_url: 'https://avatars.githubusercontent.com/u/23647013?s=40&v=4',
  },
  {
    user_name: 'Brenda',
    email: 'brenda@gmail.com',
    password: 'password3',
  },
  {
    user_name: 'Megan',
    email: 'megan@gmail.com',
    password: 'password4',
    'is_online': false,
    image_url: 'https://avatars.githubusercontent.com/u/23647013?s=40&v=4',
  },
];

const seedUsers = () => User.bulkCreate(userData, { individualHooks: true });

module.exports = seedUsers;