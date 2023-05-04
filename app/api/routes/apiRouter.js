require('dotenv').config();
const express = require('express');
const endpoint = '/v1/';
const knex = require('../../db/db');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let apiRouter = express.Router();


apiRouter.get(endpoint + 'produtos', function (req, res) {
    knex.select('*').from('produtos')
        .then(produtos => res.status(200).json(produtos))
        .catch(err => res.status(500).json({ message: `Erro ao recuperar produtos: ${err.message}` }))
})

apiRouter.get(endpoint + 'produtos/:id', (req, res) => {
    const id = req.params.id;
    knex.select('*').from('produtos').where({ id })
        .then(produtos => res.status(200).json(produtos))
        .catch(err => res.status(500).json({ message: `Erro ao recuperar produtos: ${err.message}` }))
})

apiRouter.post(endpoint + 'produtos', (req, res) => {
    knex('produtos')
        .insert(req.body, ['id'])
        .then(produtos => {
            let id = produtos[0].id
            res.json({ message: `Produto inserido com sucesso.`, id: id })
        })
        .catch(err => res.status(500).json({ message: `Erro ao inserir produto: ${err.message}` }))
})

apiRouter.put(endpoint + 'produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    knex('produtos')
        .where({ id })
        .update({
            descricao: req.body.descricao,
            valor: req.body.valor,
            marca: req.body.marca,
        }, ['id', 'descricao', 'valor', 'marca'])
        .then(_ => {
            res.status(200).json({ message: `Produto atualizado com sucesso.` })
        })
        .catch(err => res.status(500).json({ message: `Erro ao atualizar produto: ${err.message}` }))
})

apiRouter.delete(endpoint + 'produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    knex('produtos')
        .where({ id })
        .del()
        .then(_ => {
            res.status(200).json({ message: `Produto excluído com sucesso.` })
        })
        .catch(err => res.status(500).json({ message: `Erro ao excluído produto: ${err.message}` }))
})

apiRouter.post(endpoint + 'seguranca/register', (req, res) => {
    knex('usuarios')
        .insert({
            nome: req.body.nome,
            login: req.body.login,
            senha: bcrypt.hashSync(req.body.senha, 8),
            email: req.body.email,
            roles: 'USER'
        }, ['id'])
        .then((result) => {
            let usuario = result[0]
            res.status(200).json({ "id": usuario.id })
            return
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao registrar usuario - ' + err.message
            })
        })
})

apiRouter.post(endpoint + 'seguranca/login', (req, res) => {
    knex
        .select('*').from('usuarios').where({ login: req.body.login })
        .then(usuarios => {
            if (usuarios.length) {
                let usuario = usuarios[0]
                let checkSenha = bcrypt.compareSync(req.body.senha, usuario.senha)
                if (checkSenha) {
                    var tokenJWT = jwt.sign({ id: usuario.id },
                        process.env.SECRET_KEY, {
                        expiresIn: 3600
                    })
                    res.status(200).json({
                        id: usuario.id,
                        login: usuario.login,
                        nome: usuario.nome,
                        roles: usuario.roles,
                        token: tokenJWT
                    })
                    return
                }
            }
            res.status(401).json({ message: 'Login ou senha incorretos' })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao verificar login - ' + err.message
            })
        })
})

module.exports = apiRouter;
