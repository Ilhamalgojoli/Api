const service = require('../service/user_service');
const collection = require('../service/collection_service');
const jwt = require('jsonwebtoken');
const http = require("node:http");

// Controller system for payload from user
// Sign-Up Controller

const sign_up = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide username and password"
            });
        }
        const result = await service.sign_up(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: result.success,
                message: result.message
            });
        }

        res.cookie('authcookie', result.Token, {maxAge: 900000, httpOnly: true});

        return res.status(201).json({
            success: result.success,
            message: result.message
        });

    } catch (err) {
        return res.status(500).json({
            message: `Internal server error ${err}`,
        }, err);
    }
}

// Sign-in Controller

const sign_in = async (req, res) => {
    try {
        const {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Please provide username and password"
            });
        }

        const result = await service.sign_in(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: result.message
            });
        }

        res.cookie('authcookie', result.Token, {maxAge: 900000, httpOnly: true, secure: true});

        return res.status(201).json({
            status: "Ok",
            success: result.success,
            message: result.message,
            Token: result.Token
        });
    } catch (err) {
        return res.status(500).json({
            message: `Internal server error ${err}`,
        }, err);
    }
}

// Logout controller

const logout = async (req, res) => {
    try{
        req.clearCookie('authcookie', { httpOnly: true, secure: true});
        return res.status(200).json({
            success: true,
            message: "Success to logout"
        });
    } catch (err){
        return res.status(500).json({
            success: false,
            message: err
        });
    }
}

const getToken = (req, res) => {
    try {
        const token = req.cookies.authcookie ;

        if (!token || token === ""){
            return res.status(401).json({
               success: false,
               message: "Unathorized, Please Sign-In"
            });
        }

        return res.status(200).json({
            success: true,
            message: ""
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err
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
    getCollection
}