const {Router} = require('express')
const router = Router()
const sequelize = require('../connection')
const config = require('config')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

router.get('/list', auth, role, async (req, res) => {
    try {
        let [tablesNamesRows] = await sequelize.query(`SHOW TABLES`)
        let tablesNames = []

        if (tablesNamesRows.length === 0) {
            return res.status(404).json({type: "ERROR", message: "Таблицы не найденны!"})
        }

        for (let obj of tablesNamesRows) {
            tablesNames.push(obj["Tables_in_dormitory"])
        }

        res.status(200).json({type: "SUCCESSFUL", tablesNames: tablesNames})

    } catch (e) {
        res.status(500).json({type: "ERROR", message: "Что то пошло не так!"})
    }
})

router.get('/table', auth, role, async (req, res) => {
    try {
        const {tableName, sort, searchTag, searchValue} = req.query

        let optionally = ''
        if (searchTag !== '' && searchValue !== '') {
            optionally = ` WHERE ${searchTag} LIKE '%${searchValue}%'`
        }

        let [table] = await sequelize.query(`SELECT * FROM ${tableName}${optionally} ORDER BY ${sort} `)

        res.status(200).json({type: "SUCCESSFUL", tableName, table})

    } catch (e) {
        res.status(500).json({type: "ERROR", message: "Что то пошло не так!", error: e})
    }
})

router.post('/changeCell', auth, role, async (req, res) => {
    try {
        const {table, rowId, cellTag, value} = req.body

        let [changeCell] = await sequelize.query(`UPDATE ${table} SET ${cellTag} = '${value}' WHERE id = ${rowId}`)

        console.log(changeCell)
        res.status(200).json({type: "SUCCESSFUL", message: `Поле '${cellTag}' было сохраненно в таблице '${table}`})

    } catch (e) {
        res.status(500).json({type: "ERROR", message: "Что то пошло не так!", error: e})
    }
})




module.exports = router