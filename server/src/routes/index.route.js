const {Router} = require('express')
const router = Router()


router.use('/user', require('./user.route'))
router.use('/tables', require('./tables.route'))
router.use('/rooms', require('./rooms.route'))
router.use('/payment', require('./payment.route'))



module.exports = router