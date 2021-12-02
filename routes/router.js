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
router.get('/ejemplos', authController.isAuthenticated, (req, res) => {
    res.render('ejemplos', { user: req.user })
})
router.get('/tema1', authController.isAuthenticated, (req, res) => {
    res.render('tema1', { user: req.user })
})
router.get('/tema2', authController.isAuthenticated, (req, res) => {
    res.render('tema2', { user: req.user })
})
router.get('/tema3', authController.isAuthenticated, (req, res) => {
    res.render('tema3', { user: req.user })
})
router.get('/tema4', authController.isAuthenticated, (req, res) => {
    res.render('tema4', { user: req.user })
})
router.get('/configuracion', authController.isAuthenticated, (req, res) => {
    res.render('configuracion', { user: req.user })
})
router.get('/paginaerror', (req, res) => {
    res.render('paginaerror')
})


//router para los métodos del controller
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)


module.exports = router