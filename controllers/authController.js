const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt:', email, password);
    console.log('Expected:', process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.json({
            email,
            token,
        });
    } else {
        console.log('Login failed: Credentials mismatch');
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

module.exports = { loginUser };
