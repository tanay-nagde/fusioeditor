import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

// ek naya schema banao use userSchema naam do
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)
// hasing password before saving it to the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10) // password ko hash karta hai bycrypt
    next()
})//pre ek middleware function hai jo har bar call hota hai jab koi naya document save hota hai

// checking hashed and plain password


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}
// you can make methods on schema by using schema.methods


userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
// userSchema.methods.generateAccessToken ek method hai jo user ko access token generate karne me help karta hai and userSchema.methods.generateRefreshToken ek method hai jo user ko refresh token generate karne me help karta hai

// it has 3 params return jwt.sign({payload}, process.env.ACCESS_TOKEN_SECRET, {options})







export const User = mongoose.model("User", userSchema) //ek model banao User naam ka jo userSchema ka use karega

// schema sirf ek blueprint hota hai jo model ko batata hai ki kis tarah ka data store karna hai
// mongoose.model ek function hai jo schema ko model me convert karta hai jisko refrence ke liye user name se export karte hai