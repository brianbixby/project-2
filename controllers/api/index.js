const router = require('express').Router();

const gameRoutes = require('./gameRoutes');
const userRoutes = require('./userRoutes');
const rankingRoutes = require('./rankingRoutes');
const friendRoutes = require('./friendRoutes');
const gameInstanceRoutes = require('./gameInstanceRoutes');

router.use('/games', gameRoutes);
router.use('/users', userRoutes);
router.use('/rankings', rankingRoutes);
router.use('/friends', friendRoutes);
router.use('/gameInstances', gameInstanceRoutes);

module.exports = router;