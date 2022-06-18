const {Router} = require('express')
const router = Router()
const auth = require('../middlewares/auth.middleware')
const sequelize = require("../connection");


router.post('/pay', auth, async (req, res) => {
    try {
        const {amount, price} = req.body

        const [newPayment] = await sequelize.query(`INSERT INTO payments (user_id, price, amount) VALUES (${req.user.userId},${price},${amount})`)

        if (typeof newPayment !== "number") {
            return res.status(400).json({type: "ERROR", message: "Ошибка платежа попробуйте снова",})
        }

        const [userUpdate] = await sequelize.query(`UPDATE students SET amount = amount +  ${amount} WHERE id = ${req.user.userId}`)

        res.status(201).json({type: "SUCCESSFUL", message: "Оплата произведенна успешно"})
    } catch (e) {
        res.status(500).json({type: "ERROR", message: "Что то пошло не так!", error: e.message})
    }
})

module.exports = router