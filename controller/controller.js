const service = require('../service/user_service');
const collection = require('../service/collection_service');
const profile = require("../service/profile_service");
const jwt = require('jsonwebtoken');
const http = require("node:http");
const {decode} = require("jsonwebtoken");

// Controller system for payload from user
// Sign-Up Controller

const sign_up = async (req, res) => {
    console.log("Payload yang di terima : ", req.body);
    try {
        const { username, password } = req.body;

        const result = await service.sign_up(req.body);

        if (!result.success) {
            console.log("Register failed");
            return res.status(409).json({
                success: result.success,
                message: result.message
            });
        }

        if (result.success){
            console.log("Register berhasil");
        }

        res.cookie('authcookie', result.Token, {maxAge: 900000, httpOnly: true});

        return res.status(201).json({
            success: result.success,
            message: result.message
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${err}`,
        });
    }
}

// Sign-in Controller

const sign_in = async (req, res) => {
    console.log("Payload diterima dari frontend", req.body);
    try {
        const { username, password } = req.body;

        const result = await service.sign_in(req.body);

        if (!result.success) {
            return res.status(409).json({
                success: result.success,
                message: result.message
            });
        }

        if (result){
            console.log("Login berhasil");
        }

        res.cookie('authcookie', result.Token, {
            maxAge: 900000,
            httpOnly: true, secure: true
        });

        return res.status(201).json({
            status: "Ok",
            success: result.success,
            message: result.message
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal server error ${err}`,
        });
    }
}

// Logout controller

const logout = (req, res) => {
    try{
        res.clearCookie('authcookie', { httpOnly: true, secure: true});

        return res.status(200).json({
            success: true,
            message: "Success to logout 😭"
        });
    } catch (err){
        return res.status(500).json({
            success: false,
            message: `Internal server down : ${err}`
        });
    }
}

const postProfile = async(req, res) => {
    try {
        const token = req.cookies.authcookie;

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unathorized"
            });
        }

        const { pathImage,image } = req.body;
        const decoded = jwt.decode(res.cookies.authcookie, process.env.ACCESS_TOKEN);
        req.body = decoded.id ;

        const result = await profile.postProfile(req.body);

        if(!result){
            return res.status(400).json({
                success: result.success,
                message: result.message
            });
        }

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch(err){
        return res.status(500).json({
            success: false,
            message: "Internal server down"
        });
    }
}

const getProfile = async(req, res) => {
    try {
        const token = req.cookies.authcookie;

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unathorized"
            });
        }

        const decoded = jwt.decode(res.cookies.authcookie, process.env.ACCESS_TOKEN);
        req.body = decoded.id ;

        const result = await profile.getProfile(req.body);
        console.log("data ? : " + res.query);

        if(!result){
            return res.status(404).json({
                success: result.success,
                message: result.message
            });
        }

        return res.status(200).json({
            success: result.success,
            message: result.message,
        });
    } catch (err){
        return res.status(500).json({
            success: false,
            message: res.message
        });
    }
}

const getToken = async (req, res) => {
    try {
        const token = req.cookies.authcookie ;

        if (!token || token === "" || token === null){
            return res.status(401).json({
                success: false,
                message: "Unathorized"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Credentials valid",
            token: token
        });
    } catch (e){
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Add Collection Controller

const addCollection = async (req, res) => {
    try {
        // Get token at cookie httpOnly
        const token = req.cookies.authcookie;

        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized err, token expired'
            });
        }

        // Decoded token to get user Id
        const decoded = jwt.verify(req.cookies.authcookie, process.env.ACCESS_TOKEN);
        const userId = decoded.id;

        // Req body payload
        const { id_coll } = req.body;
        req.body.userId = userId;

        console.log(req.body);

        // Call function from service and send parameter req.body
        const result = await collection.addCollection(req.body);

        if (!result) {
            return res.status(400).json({
                success: result.success,
                message: result.message,
            });
        }

        return res.status(201).json({
            message: result.message,
            result: result.rows
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal server ${err}`
        }, err);
    }
}

// Get Collection Controller

const getCollection = async (req, res) => {
    try {
        const token = req.cookies.authcookie ;

        if (!token){
            return res.status(400).json({
                success: false,
                message: 'Unauthorized error, Token expired'
            });
        }

        const decoded = jwt.verify(req.cookies.authcookie, process.env.ACCESS_TOKEN);
        const userId = decoded.id;

        const result = await collection.getCollection({
            userId
        });

        if (!result){
            return res.status(400).json({
                success: false,
                message: 'Bad request'
            });
        }

        return res.status(200).json({
            success: result.success,
            message: result.message,
            result: result.rows
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal server ${err}`
        }, err);
    }
}

module.exports = {
    sign_up,
    sign_in,
    logout,
    getToken,
    addCollection,
    getCollection,
    getProfile,
    postProfile
}