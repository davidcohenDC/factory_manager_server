const { Router } = require('express');
const UserRoutes = require('../routes/users');
const router = Router();

router.use('/users', UserRoutes);

module.exports = router;