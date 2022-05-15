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
    image_url: 'http://placekitten.com/200/300',
  },
  {
    user_name: 'Karen',
    email: 'karen@gmail.com',
    password: 'password2',
    'is_online': true,
    image_url: 'http://placekitten.com/300/300',
  },
  {
    user_name: 'Brenda',
    email: 'brenda@gmail.com',
    password: 'password3',
    'is_online': true,
    image_url: 'http://placekitten.com/300/200',
  },
  {
    user_name: 'Megan',
    email: 'megan@gmail.com',
    password: 'password4',
    'is_online': false,
    image_url: 'http://placekitten.com/400/300',
  },
  {
    user_name: 'MKN',
    email: 'mkn@mail.com',
    password: '123456789',
    'is_online': false,
    image_url: 'http://placekitten.com/300/400',
  },
];

const seedUsers = () => User.bulkCreate(userData, { individualHooks: true });

module.exports = seedUsers;