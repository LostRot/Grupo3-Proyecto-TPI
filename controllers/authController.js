const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const { promisify } = require('util')
const router = require('../routes/router')

//procedimiento para registrarnos
exports.register = async(req, res) => {
    try {
        const name = req.body.name
        const user = req.body.user
        const pass = req.body.pass


        if (!name || !user || !pass) {
            res.render('register', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Debe rellenar los campos solicitados",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: 3000,
                ruta: 'register'
            })
        } else {

            conexion.query('SELECT * FROM users WHERE user = ?', [user], async(error, results) => {
                if (results.length > 0) {
                    res.render('register', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "User ya existente",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: 3000,
                        ruta: 'register'
                    })
                } else {
                    let passHash = await bcryptjs.hash(pass, 8)

                    //console.log(passHash)   
                    conexion.query('INSERT INTO users SET ?', { user: user, name: name, pass: passHash }, (error, results) => {
                        res.render('register', {
                            alert: true,
                            alertTitle: "CUENTA CREADA",
                            alertMessage: "Ya puede iniciar sesión",
                            alertIcon: 'success',
                            showConfirmButton: false,
                            timer: 1200,
                            ruta: 'login'
                        })


                    })
                }
            })
        }

    } catch (error) {
        console.log(error)
    }
}

exports.login = async(req, res) => {
    try {
        const user = req.body.user
        const pass = req.body.pass

        if (!user || !pass) {
            res.render('login', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un user y password",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: 3000,
                ruta: 'login'
            })
        } else {
            conexion.query('SELECT * FROM users WHERE user = ?', [user], async(error, results) => {
                if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: 3000,
                        ruta: 'login'
                    })
                } else {
                    //inicio de sesión OK
                    const id = results[0].id
                    const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                            expiresIn: process.env.JWT_TIEMPO_EXPIRA
                        })
                        //generamos el token SIN fecha de expiracion
                        //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
                    console.log("TOKEN: " + token + " para el USUARIO : " + user)

                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)
                    res.render('login', {
                        alert: true,
                        alertTitle: "Conexión exitosa",
                        alertMessage: "¡LOGIN CORRECTO!",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 1200,
                        ruta: 'unidades'
                    })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.isAuthenticated = async(req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results) => {
                if (!results) { return next() }
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        res.redirect('/')
    }
}

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/unidades');
   

}