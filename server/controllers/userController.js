import sendEmail from "../config/sendEmail.js";
import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import verifyEmailTemplate from "../utils/verificationEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import genertedRefreshToken from "../utils/genertedRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

export const registerUser = async (req, res) => {
    try {
        const {email, password, name} = req.body;
        if(!email || !password || !name) {
            return res.status(400).json({message : "Provide All Fields", error : true, success: false})
        }

        const user = await userModel.findOne({email})
        if (user) {
            return res.status(400).json({message : "User is already exisit", error : true, success: false}) 
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const payload = {
            name, 
            email,
            password : hashPassword
        }
        const newUser = await userModel(payload)
        const save = await newUser.save()

        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

        const verifyEmail = await sendEmail({
            sendTo : email,
            subject : 'Verify email from binkeyit',
            html : verifyEmailTemplate({
                name,
                url : verifyEmailUrl
            })
        })

        return res.status(200).json({message : "User Register Succefully ..", error : false, success: true})

    } catch (error) {
        return res.status(500).json({message : error.message, error : true, success: false})
    }
}

export const verifyEmailController = async (req, res) => {
    try {
        const { code } = req.body;
        const user = await userModel.findOne({ _id : code })
        if(!user) {
            return res.status(400).json({message : "Invalid Code", error : true, success: false}) 
        }

        const updateUser = await userModel.updateOne({ _id : code }, {
            verify_email : true
        })

        return res.status(200).json({message : "Verify Email Done", error : false, success: true})
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : true
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({message : "Provide Email Or Password", error : true, success : false})
        }
        const user = await userModel.findOne({ email })
        if ( !user ) {
            return res.status(400).json({message : "User Not Register", error : true, success : false})
        }

        if(user.status !== "Active") {
            return res.status(400).json({message : "Contact to Admin", error : true, success : false})
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) {
            return res.status(400).json({message : "Check Your Password", error : true, success : false})
        }

        const accessToken = await generatedAccessToken(user._id)
        const refresh_token = await genertedRefreshToken(user._id)

        const updateUser = await userModel.findByIdAndUpdate(user?._id, {last_login_date: new Date()})

        const cookiesOption = {
            httpOnly : true, 
            secure : true, 
            sameSite : "None"
        }
        res.cookie('accessToken', accessToken, cookiesOption)
        res.cookie('refreshToken', refresh_token , cookiesOption)

        return res.status(200).json({
            message : "Login successfully",
            error : false,
            success : true,
            data : {
                accessToken,
                refresh_token
            }
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const logoutController = async (req, res) => {
    try {
        const userid = req.userId;

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        res.clearCookie('accessToken', cookiesOption)
        res.clearCookie('refreshToken', cookiesOption)

        const removeRefreshToken = await userModel.findByIdAndUpdate(userid, {
            refresh_token: ""
        })

        return res.status(200).json({message: ' Logout Successfully', error: false, success: true})

    } catch (error) {
        return res.status(500).json({message: error.message || error, error: true, success : false})
    }
}

export const uploadAvatar = async (req, res) => {
    try {
        const userId = req.userId;  // auth middleware
        const image = req.file;  // multer midware

        const uplaod = await uploadImageCloudinary(image)

        const uadateUser = await userModel.findByIdAndUpdate(userId, {
            avatar : uplaod.url
        })

        return res.status(200).json({message: 'upload profile', success: true, error: false, data : {
            _id: userId,
            avatar : uplaod.url
        }})
    } catch (error) {
        return res.status(500).json({message : error.message || error || "error in upload avatar", error : true , success : false})
}
}

export const updateUserDetails = async (req, res) => {
    try {
        const userId = req.userId;
        const {name, email, mobile, password} = req.body;
        
        let hashPassword = ""

        if(password) {
            const salt = await bcrypt.genSalt(10)
            hashPassword = await bcrypt.hash(password, salt)
        }

        const updateUser = await userModel.updateOne({ _id : userId}, {
            ...(name && {name : name}),
            ...(mobile && {mobile : mobile}),
            ...(email && {email : email}),
            ...(password && { password : password})
        })

        return res.status(200).json({message : "Update Successfully . . . . . . ", error : false, success : true, data : updateUser})

    } catch (error) {
        return res.status(500).json({message : error.message || error , error : true , success : false})
    }
}