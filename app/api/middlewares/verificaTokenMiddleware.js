require('dotenv').config();
const knex = require('../../db/db');
const jwt = require('jsonwebtoken');

let checkToken = (req, res, next) => {
    let authToken = req.headers["authorization"]
    if (!authToken) {
        return res.status(401).json({ message: 'Token de acesso requerida' })
    }
    else {
        let token = authToken.split(' ')[1]
        req.token = token
    }
    jwt.verify(req.token, process.env.SECRET_KEY, (err, decodeToken) => {
        if (err) {
            return res.status(401).json({ message: 'Acesso negado' })
        }
        req.usuarioId = decodeToken.id
        next()
    })
}

let isAdmin = (req, res, next) => {
    knex
        .select('*').from('usuarios').where({ id: req.usuarioId })
        .then((usuarios) => {
            if (usuarios.length) {
                let usuario = usuarios[0]
                let roles = usuario.roles.split(';')
                let adminRole = roles.find(i => i === 'ADMIN')
                if (adminRole === 'ADMIN') {
                    next()
                    return
                }
                else {
                    return res.status(403).json({ message: 'Role de ADMIN requerida' })
                }
            }
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Erro ao verificar roles de usuário - ' + err.message
            })
        })
}

module.exports = {
    checkToken,
    isAdmin
};
