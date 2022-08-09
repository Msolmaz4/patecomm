const router = require('express').Router()

// jwt help doszasindan token cagiriyi

import { verirfyAccessToken} from '../helpers/jwt'

// burada uc paraca halinde yonettimn genel gris siparisler

import auth from './auth'
import product from './product'
import order from './order'

router.get('/',(req,res)=>{
    res.send('heyyyy')
})

router.use('/auth',auth)
router.use('/product',product)
router.use('/order',verirfyAccessToken,order)


export default router
