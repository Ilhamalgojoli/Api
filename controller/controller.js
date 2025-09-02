const service = require('../service/user_service');
const collection = require('../service/collection_service');
const jwt = require('jsonwebtoken');

// Controller system for payload from user

const sign_up = async (req, res) => {
    try {
        const {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Please provide username and password"
            });
        }
        const result = await service.sign_up(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: result.message
            });
        }

        res.cookie('authcookie', result.Token, {maxAge: 900000, httpOnly: true});

        return res.status(200).json({
            message: result.message
        });

    } catch (err) {
        return res.status(500).json({
            message: `Internal server error ${err}`,
        }, err);
    }
}

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

        res.cookie('authcookie', result.Token, {maxAge: 900000, httpOnly: true});

        return res.status(200).json({
            status: "Ok",
            message: result.message,
            Token: result.Token
        });
    } catch (err) {
        return res.status(500).json({
            message: `Internal server error ${err}`,
        }, err);
    }
}

const addCollection = async (req, res) => {
    try {
        // Get token at cookie httpOnly
        const token = req.cookies.authcookie;

        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        // Decoded token to get user Id
        const decoded = jwt.verify(req.cookies.authcookie, process.env.ACCESS_TOKEN);
        const userId = decoded.id;

        // Req body payload
        const { title, poster_path, coll_id } = req.body ;
        req.body.userId = userId ;

        console.log(req.body);

        // Call function from service and send parameter req.body
        const result = await collection.addCollection(req.body);

        if (!result){
            return res.status(400).json({
                success: false,
                message: result.message,
            })
        }

        return res.status(201).json({
            message: result.message,
        });
    } catch (err) {
        return res.status(500).json({
            success:false,
            message: `Internal server ${err}`
        }, err)
    }
}

module.exports = {
    sign_up,
    sign_in,
    addCollection
}