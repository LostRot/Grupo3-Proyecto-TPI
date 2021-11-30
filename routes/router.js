const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')

//router para las vistas
router.get('/', (req, res) => {
    res.render('index')
})
router.get('/login', (req, res) => {
    res.render('login', { alert: false })
})
router.get('/register', (req, res) => {
    res.render('register',{ alert: false })
})
router.get('/unidades', authController.isAuthenticated, (req, res) => {
    res.render('unidades', { user: req.user })
})
router.get('/evaluaciones', authController.isAuthenticated, (req, res) => {
    res.render('evaluaciones', { user: req.user })
})
router.get('/infoempresa', authController.isAuthenticated, (req, res) => {
    res.render('infoempresa', { user: req.user })
})
router.get('/paginaerror', (req, res) => {
    res.render('paginaerror')
})


//router para los métodos del controller
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)


module.exports = router