const {Router} = require('express')
const router = Router()
const sequelize = require('../connection')
const config = require('config')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')
// /api/user/---

router.post('/auth',
    [
        check('login', 'Логин не должен быть пустым').exists(),
        check('password', "Пароль не должен быть пустым").exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message: 'Некоректные данные при авторизации', errors: errors.array()})
        }

        const {login, password} = req.body

        let [user] = await sequelize.query(`SELECT id,password FROM students WHERE login = '${login}'`)
        let role = "STUDENT"

        if (user.length === 0) {

            let [personal] = await sequelize.query(`SELECT id,password FROM personal WHERE login = '${login}'`)
            user = personal
            role = "PERSONAL"

            if (user.length === 0) {
                return res.status(400).json({type: "ERROR", message: "Не верный логин"})
            }
        }

        if (user[0].password !== password) {
            return res.status(400).json({type: "ERROR", message: "Неверный пароль попробуйте снова"})
        }

        const token = jwt.sign(
            {userId: user[0].id, login: login, role: role},
            config.get('jwtSecret'),
            {expiresIn: '24h'}
        )

        res.status(200).json({
            type: 'SUCCESSFUL',
            message: "Вы успешно вошли в аккаунт",
            token: token,
            role: role
        })
    } catch (e) {
        res.status(500).json({type: "ERROR", message: "Что то пошло не так!"})
    }
})

router.get('/refresh-token', auth, (req, res) => {
    try {

        const token = jwt.sign(
            {userId: req.user.userId, login: req.user.login, role: req.user.role},
            config.get('jwtSecret'),
            {expiresIn: '24h'}
        )

        res.json({type: "SUCCESSFUL", message: "Token was refreshed", token: token, role: req.user.role})
    } catch (e) {
        res.status(500).json({type: "ERROR", message: "Что то пошло не так!"})
    }

})

router.get('/info', auth, async (req, res) => {
    try {
        const userId = req.user.userId
        const role = req.user.role
        let infoQuery

        switch (role) {
            case "STUDENT":
                infoQuery = `SELECT * FROM students WHERE id = '${userId}'`
                break
            case "PERSONAL":
                infoQuery = `SELECT * FROM personal WHERE id = '${userId}'`
        }

        let [user] = await sequelize.query(infoQuery)

        res.json({type: "SUCCESSFUL", info: user[0]})
    } catch (e) {
        res.status(500).json({type: "ERROR", message: "Что то пошло не так!"})
    }
})

router.post('/registration', auth, role, async (req, res) => {
    try {
        const {
            surname,
            name,
            patronymic,
            date_of_b,
            passport,
            tel,
            separation,
            speciality,
            admission,
            s_group,
            roomNum
        } = req.body

        //функция генерации рандомной строки
        function str_rand(e) {
            let result       = '';
            let words        = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
            let max_position = words.length - 1;
            for(let i = 0; i < e; ++i ) {
                let position = Math.floor ( Math.random() * max_position );
                result = result + words.substring(position, position + 1);
            }
            return result;
        }

        const login = str_rand(7)
        const password = str_rand(7)

        let [roomData] = await sequelize.query(`SELECT * FROM rooms WHERE num = '${roomNum}' AND seats_occupied < num_seats`  )

        if (!roomData) {
            return res.status(404).json({type: "ERROR", message: "Данные о комнате не найденны!"})
        }

        roomData = roomData[0]

        const [newStudent] = await sequelize.query(`INSERT INTO students  (login,password,surname,name,patronymic,date_of_b,passport,tel,admission,separation,speciality,s_group,room,level,price,amount) VALUES ('${login}','${password}','${surname}','${name}','${patronymic}','${date_of_b}','${passport}','${tel}','${admission}','${separation}','${speciality}','${s_group}','${roomData.num}','${roomData.level}',800,0)`)

        if (typeof(newStudent) !== "number") {
            return res.status(400).json({type: "ERROR", message: "Ошибка регестрации студента!"})
        }

        let temporaryLoginDetails = {login: login, password: password}

        let [roomDataUpdate] = await sequelize.query(`UPDATE rooms SET seats_occupied = seats_occupied+1 WHERE num = ${roomData.num}`)

        res.status(200).json({type: "SUCCESSFUL", message: "Студент успешно зарегистрирован", temporaryLoginDetails})
    } catch (e) {
        res.status(500).json({type: "ERROR", message: "Что то пошло не так!", error: e.message})
    }
})

router.post('/delete', auth, role, async (req, res) => {
    try {
        const {studentId} = req.body

        const [deleteStudent] = await sequelize.query(`DELETE FROM students WHERE id = ${studentId}`)
        console.log(deleteStudent)

        res.status(200).json({type: "SUCCESSFUL", message: "Студент успешно удалён"})
    } catch (e) {
        res.status(500).json({type: "ERROR", message: "Что то пошло не так!", error: e.message})
    }
})

router.post('/relocation', auth, role, async (req, res) => {
    try {
        const {studentId, roomId} = req.body

        const [getStudent] = await sequelize.query(`SELECT * FROM students WHERE id = ${studentId}`)

        const [getOldRoom] = await sequelize.query(`SELECT seats_occupied FROM rooms WHERE num = ${getStudent[0].room}`)
        const [getNewRoom] = await sequelize.query(`SELECT level,num,seats_occupied FROM rooms WHERE id = ${roomId}`)

        const newDecrementSeats_occupied = () => {
            if (getOldRoom[0].seats_occupied - 1 > 0) {
                return getOldRoom[0].seats_occupied - 1
            }else {
                return 0
            }
        }
        const [updateOldRoom] = await sequelize.query(`UPDATE rooms SET seats_occupied = ${newDecrementSeats_occupied()} WHERE num = ${getStudent[0].room}`)
        const [updateNewRoom] = await sequelize.query(`UPDATE rooms SET seats_occupied = ${getNewRoom[0].seats_occupied+1} WHERE id = ${roomId}`)
        const [updateStudent] = await sequelize.query(`UPDATE students SET room = ${getNewRoom[0].num}, level = ${getNewRoom[0].level} WHERE id = ${studentId}`)

        res.status(200).json({type: "SUCCESSFUL", message: "Студент успешно переселён"})
    } catch (e) {
        res.status(500).json({type: "ERROR", message: "Что то пошло не так!", error: e.message})
    }
})

router.post('/change-login', auth, async (req, res) => {
    try {
        const {oldLogin, newLogin} = req.body

        let [user] = await sequelize.query(`SELECT login FROM students WHERE id = ${req.user.userId}`)

        if (user[0] === undefined) {
            return res.status(404).json({type: "ERROR", message: "Данные о пользователе не найденны!"})
        }

        if(user[0].login !== oldLogin) {
            return res.status(400).json({type: "ERROR", message: "Старый логин введён неверно"})
        }

        const [loginUpdate] = await sequelize.query(`UPDATE students SET login = '${newLogin}' WHERE id = '${req.user.userId}'`)

        res.status(200).json({type: "SUCCESSFUL", message: "Логин успешно изменён"})
    }catch (e) {
        res.status(500).json({type: "ERROR", message: "Что то пошло не так!", error: e.message})
    }
})

router.post('/change-password', auth, async (req, res) => {
    try {
        const {oldPassword, newPassword} = req.body

        let [user] = await sequelize.query(`SELECT password FROM students WHERE id = ${req.user.userId}`)

        if (user[0] === undefined) {
            return res.status(404).json({type: "ERROR", message: "Данные о пользователе не найденны!"})
        }

        if(user[0].password !== oldPassword) {
            return res.status(400).json({type: "ERROR", message: "Старый пароль введён неверно"})
        }

        const [passwordUpdate] = await sequelize.query(`UPDATE students SET password = '${newPassword}' WHERE id = '${req.user.userId}'`)

        res.status(200).json({type: "SUCCESSFUL", message: "Пароль успешно изменён"})
    }catch (e) {
        res.status(500).json({type: "ERROR", message: "Что то пошло не так!", error: e.message})
    }
})

router.get('/search', auth, role, async (req, res) => {
    try {
        const {surname = '', name = '', patronymic = ''} = req.query

        let [users] = await sequelize.query(`SELECT * FROM students WHERE surname LIKE '%${surname}%' AND name LIKE '%${name}%' AND patronymic LIKE '%${patronymic}%' LIMIT 5 `)

        res.status(200).json({type: "SUCCESSFUL", users})
    } catch (e) {
        res.status(500).json({type: "ERROR", message: "Что то пошло не так!", error: e.message})
    }
})

module.exports = router