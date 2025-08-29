const service = require('../service/service');

exports.sign_up = async (req, res) => {
    try {
        const { username, password } = req.body;

        if(!username || !password){
            return res.status(400).json({
                message: "Please provide username and password"
            });
        }
        const result = await service.sign_up(req.body);

        if(!result.success){
            return res.status(400).json(result.message);
        }

        return res.status(201).json({
            message: result.message
        });

    } catch (err) {
        return res.status(500).json({
            message : "Internal server error",
        }, err);
    }
}

exports.sign_in = async (req, res) => {
    try {
        const { username, password } = req.body ;

        if(!username || !password){
            return res.status(400).json({
                message: "Please provide username and password"
            });
        }

        const result = await service.sign_in(req.body);

        if(!result.success){
            return res.status(400).json(result.message);
        }

        return res.status(201).json({
            message: result.message
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