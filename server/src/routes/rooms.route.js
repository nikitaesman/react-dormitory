const {Router} = require('express')
const router = Router()
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')
const sequelize = require("../connection");

router.get('/available', auth, role, async (req, res) => {
    try {
        let [rooms] = await sequelize.query(`SELECT * FROM rooms WHERE seats_occupied < num_seats ORDER BY num DESC`)

        if (rooms === undefined) {
            return res.status(200).json({type: "ERROR", message: "DataBase error"})
        }

        res.status(200).json({type: "SUCCESSFUL", message: "ALL OK", rooms})
    } catch (e) {
        res.status(500).json({type: "ERROR", message: "Что то пошло не так!"})
    }
})

module.exports = router