import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from  '../models/user.js';


export const signin = async (req,res) =>{
    // get credential from fronted
    const {email, password} = req.body;

    try {
        
        //find user in database
        const existingUser = await User.findOne({email});
        
        //if user not exit
        if(!existingUser) return res.status(404).json({message: "User doesn't exit"});
        
        //if exit match password
        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password);

        //if password not match
        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid Credentials"});

        //if password correct, make token with jwt with a string and res send to fronted
        const token = jwt.sign({email:existingUser.email, id: existingUser._id},'test',{expiresIn:"1h"});

        res.status(200).json({result:existingUser,token});

    } catch (error) {
        res.status(500).json({message:"something went wrong..."});
    }
    
}


///for signup
export const signup = async (req,res) =>{
    // get credential from fronted
    const {email, password,confirmPassword, firstName,lastName} = req.body;

    try {
        
        //find user in database
        const existingUser = await User.findOne({email});
        
        //if user  exit
        if(existingUser) return res.status(400).json({message: "User already exit"});
        
        //if  password not match with confirm password
        if(password !== confirmPassword) return res.status(400).json({message:"Password does not match"});

        //hash the password
        const hashPassword = await bcrypt.hash(password, 6);

        //create user in databse
        const result = await User.create({email,password:hashPassword, name: `${firstName} ${lastName}`});

        // make token with jwt with a string and res send to fronted
        const token = jwt.sign({email:result.email, id: result._id},'test',{expiresIn:"1h"});

        res.status(200).json({result:result,token});

    } catch (error) {
        res.status(500).json({message:"something went wrong..."});
    }
    
}


 