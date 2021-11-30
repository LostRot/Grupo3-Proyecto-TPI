const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const path = require('path');
//const res = require('express/lib/response')


const app = express()

//seteamos el motor de plantillas
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
    //seteamos la carpeta public para archivos estáticos
app.use(express.static('public'))

//para procesar datos enviados desde forms
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//seteamos las variables de entorno
dotenv.config({ path: './env/.env' })

//para poder trabajar con las cookies
app.use(cookieParser())

//llamar al router
app.use('/', require('./routes/router'))

//Para eliminar la cache 
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

/*
app.get('/', (req, res) => {
    res.render('index')
})*/

/*Error 404*/
app.use(function(req, res, next) {
    //res.status(404).send('Lo sentimos pagina no encontrada');
    if (req.accepts('html')) {
        res.render('paginaerror', { url: req.url })
        return
    }
});

app.listen(3000, () => {
    console.log('SERVER UP runnung in http://localhost:3000')
})