const service = require('../service/user_service');


// Controller system for payload from user

const sign_up = async (req, res) => {
    try {
        const { username, password } = req.body;

        if(!username || !password){
            return res.status(400).json({
                message: "Please provide username and password"
            });
        }
        const result = await service.sign_up(req.body);

        if(!result.success){
            return res.status(400).json({
                message: result.message
            });
        }

        return res.status(200).json({
            message: result.message
        });

    } catch (err) {
        return res.status(500).json({
            message : "Internal server error",
        }, err);
    }
}

const sign_in = async (req, res) => {
    try {
        const { username, password } = req.body ;

        if(!username || !password){
            return res.status(400).json({
                message: "Please provide username and password"
            });
        }

        const result = await service.sign_in(req.body);

        if(!result.success){
            return res.status(400).json({
                message: result.message
            });
        }

        return res.status(201).json({
            message: result.message,
            Token : result.Token
        });
    } catch (err) {
        return res.status(500).json({
            message : "Internal server error",
        }, err);
    }
}

module.exports = {
    sign_up,
    sign_in
}