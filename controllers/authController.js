import Boom from 'boom'
import User from '../models/User'

//help
import {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken
} from '../helpers/jwt'

//vaida
import ValidationSchema  from './valida'
import redis from '../clients/redis'

const Register = async ( req,res,next)=>{
    const input = req.body

    const {error} = ValidationSchema.validate(input)

    if(error){
        return next(Boom.badRequest(error.details[0].message))
    }
    try {
        const isExists = await User.findOne({ email : input.email})
        if(isExists)
        {
            return next(Boom.conflict('email basarili'))
        }
        const user = new User(input)
        const data = await user.save()
        const userData = data.toObject()
     // gonderirken sifreyi ve versiyonu sileriz res cikaririz
        delete userData.password
        delete userData._v


        const accessToken = await signAccessToken(user._id)
        const refreshToken = await signRefreshToken(user._id)

        res.json({
            user:userData,
            accessToken,
            refreshToken
        })
        
    }
    catch(err){
        next(err)
    }
  

}

const Login =async ( req,res,next)=> {
    const input =req.body

    const {error } = ValidationSchema.validate(input)
    if(err)
    {
        return next(Boom.badRequest(error.details[0].message))
    }
    try{
        const user = await User.findOne({email:  input.email})
        if(!user){
            throw Boom.notFound('email yok')
        }

        const isMatched = await user.isValidPass(input.password)
        if(!isMatched){
            throw Boom.unauthorized('email oder password yok')
        }
        const accessToken = await signAccessToken({
            user_id :user_id,
            role:user.role
        })

         const refreshToken = await signRefreshToken(user._id);

		const userData = user.toObject();
		delete userData.password;
		delete userData.__v;
        
		res.json({ user: userData, accessToken, refreshToken });
    }
    
    catch (e) {
		return next(e);
}
}


const RefreshToken = async (req, res, next) => {
	const { refresh_token } = req.body;

	try {
		if (!refresh_token) {
			throw Boom.badRequest();
		}

		const user_id = await verifyRefreshToken(refresh_token);
		const accessToken = await signAccessToken(user_id);
		const refreshToken = await signRefreshToken(user_id);

		res.json({ accessToken, refreshToken });
	} catch (e) {
		next(e);
	}
}
const Logout = async (req, res, next) => {
	try {
		const { refresh_token } = req.body;
		if (!refresh_token) {
			throw Boom.badRequest();
		}

		const user_id = await verifyRefreshToken(refresh_token);
		const data = await redis.del(user_id);

		if (!data) {
			throw Boom.badRequest();
		}

		res.json({ message: "success" });
	} catch (e) {
		console.log(e);
		return next(e);
	}
};

const Me = async (req, res, next) => {
	const { user_id } = req.payload;
//select zap yoksa passwot ve versiyon gider
	try {
		const user = await User.findById(user_id).select("-password -__v");

		res.json(user);
	} catch (e) {
		next(e);
	}
};

export default {
	Register,
	Login,
	RefreshToken,
	Logout,
	Me,
};
