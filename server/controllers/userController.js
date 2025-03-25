import sendEmail from "../config/sendEmail.js";
import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import verifyEmailTemplate from "../utils/verificationEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import genertedRefreshToken from "../utils/genertedRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generatedOtp from "../utils/generatedOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from 'jsonwebtoken'

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


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body; // ✅ Extract email correctly

        // Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Email not found",
                error: true,
                success: false
            });
        }

        // Generate OTP
        const otp = generatedOtp();
        
        // Set expiry time for OTP (1 hour from now)
        const expiryTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();

        // Update user with OTP and expiry
        await userModel.findByIdAndUpdate(
            user._id,
            {
                forgot_password_otp: otp,
                forgot_password_expiry: expiryTime
            },
            { new: true }
        );

        // Send email with OTP
        try {
            await sendEmail({
                sendTo: email,
                subject: "Forgot Password - Binkeyit",
                html: forgotPasswordTemplate({
                    name: user.name,
                    otp: otp
                })
            });
        } catch (emailError) {
            return res.status(500).json({
                message: "Failed to send email",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "Check your email for the OTP",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};


export const  verifyForgotPasswordOtp = async (req, res) => {
   try {
    const { email, otp} = req.body;
    if(!email || !password) {
        return res.status(400).json({message : 'Provide required field email, otp.', error : true, success: false})
    }
    const user = await userModel.findOne({ email})

    if(!user) {
        return res.status(400).json({message : 'Email is not available', error : true, success : false})
    }

    const currentTime = new Date().toISOString()
    if(user.forgot_password_expiry < currentTime) {
        return res.status(400).json({message : 'Otp is expired', error : true, success : false})
    }

    if(otp !== user.forgot_password_otp) {
        return res.status(400).json({message : 'Invalid Otp', error : true, success : false})
    }

    // If otp is not expire
    // otp === user.forgot_password_otp

    const updateUser = await userModel.findByIdAndUpdate(user?._id, {
        forgot_password_expiry : "",
        forgot_password_otp : ""
    })

    return res.status(200).json({message : 'Verify Otp is Successfully', error : false, success : true})
   } catch (error) {
    return res.status(500).json({message : error.message || error,  error : true, success : false})
   }
}

// reset the Password

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword} = req.body;

        if(!email || !newPassword ||  !confirmPassword) {
            return res.status(400).json({message : 'Provide Required field', error : true, success : false})
        }

        const user = await userModel.findOne({ email })
        if(!user) {
            return res.status(400).json({message : 'email not found', error : true, success : false})
        }

        if(newPassword !== confirmPassword) {
            return res.status(400).json({message : 'Password Must Match', error : true, success : false})
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword, salt)
        
        const update = await userModel.findByIdAndUpdate(user._id, {
            password : hashPassword
        })

        return res.status(200).json({message : 'Password Update Successfully', error : false, success : true})
    } catch (error) {
        return res.status(500).json({message : error.message || error,  error : true, success : false})
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req?.header?.authorization?.split(" ")[1] // Bearer Token

    if(!refreshToken) {
        return res.status(400).json({message : 'Invalid Token', error : true, success : false})
    }

    const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

    if(!verifyToken) {
        return res.status(400).json({message : 'Token Not Verfied', error : true, success : false})
    }
    
    const userId = verifyToken?._id

    const newAccessToken = await generatedAccessToken(userId)

    const cookiesOption = {
        httpOnly : true,
        secure : true,
        sameSite: None
    }

    res.cookie('accessToken', newAccessToken, cookiesOption)

    return res.status(200).json({message : 'New Access Token', error : false, success : true, data : {
        accessToken : newAccessToken
    }})
    } catch (error) {
        return res.status(500).json({message : error.message || error,  error : true, success : false})
    }
}

// get login user details

export const userDetails = async (req, res) => {
    try {
        const userId = req.userId

        console.log(userId)

        const user = await userModel.findById(userId).select('-password -refresh_token')

        res.status(200).json({message: "User Details", error : false, success : true})
    } catch (error) {
        return res.status(500).json({message : error.message || error,  error : true, success : false})
    }
}