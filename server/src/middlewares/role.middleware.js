

module.exports = (req, res, next) => {
    try {
        if (req.method === 'OPTIONS') {
            return next()
        }

        if (req.user.role !== "PERSONAL") {
            throw new Error("Нет прав доступа для данной роли пользователя")
        }

        next()
    } catch (e) {
        res.status(401).json({type: 'ERROR', message: "Недостатьчно прав доступа"})
    }
}