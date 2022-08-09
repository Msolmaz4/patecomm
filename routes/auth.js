import express from 'express'
const router = require('express').Router()



import authController  from '../controllers/authController.js'
import { verifyAccessToken} from '../helpers/jwt'

router.post('/register' ,auth.Register)
router.post('/login',auth.Login)
router.post('/refresh_token',auth.RefreshToken)
router.post('/logout',auth.Logout)
router.get('/me',verifyAccessToken,auth.Me)
// me biye giris yapan kullanici bilgilerini sunuyor
export default router