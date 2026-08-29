const User = require('../models/user.js');
const Rawitems = require('../models/rawitems.js');
const Cookedfood = require('../models/cookedfood.js');
const Product = require('../models/product.js');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const secret = 'Pankaj';
const geocoding = require('../helpers/geocoding.js');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_RHn1nKke9vOAj3',
    key_secret: process.env.RAZORPAY_SECRET || 'dummy_secret'
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = function(router) {

    router.post('/order', async (req, res) => {
        try {
            const options = {
                amount: req.body.amount,
                currency: "INR",
                receipt: "receipt_prem_001"
            };
            const order = await razorpay.orders.create(options);
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/verify', (req, res) => {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            res.status(200).json({ message: "Payment verified successfully", verified: true });
        } else {
            res.status(400).json({ message: "Invalid signature", verified: false });
        }
    });

    
    router.post('/v1/members/register', async (req, res) => {
        try {
            const { username, password, email, name, role, institute } = req.body;

            if (!username || !password || !email || !role || !name) {
                return res.json({ status: 'error', payload: { message: 'Please ensure all required fields are filled out.' } });
            }

            const temporarytoken = jwt.sign({ username, email }, secret, { expiresIn: '24h' });

            const user = new User({
                username, password, email, name, role, institute, temporarytoken
            });

            await user.save();

            const emailOpts = {
                from: '"RescueMeals" <prem@rescuemeals.org>',
                to: email,
                subject: 'Welcome to RescueMeals! Activate Your Account',
                text: `Hi ${name},\n\nWelcome to RescueMeals! We're thrilled to have you join our mission. Please use the following link to activate your account:\nhttp://localhost:8080/activate/${temporarytoken}\n\nCheers,\nPrem, Founder of RescueMeals`,
                html: `<h3>Hi ${name},</h3><p>Welcome to <strong>RescueMeals</strong>! We're thrilled to have you join our mission.</p><p>Please click the link below to activate your account:</p><p><a href="http://localhost:8080/activate/${temporarytoken}">Activate My Account</a></p><p>Cheers,<br>Prem<br>Founder, RescueMeals</p>`
            };

            transporter.sendMail(emailOpts, (err, info) => {
                
            });

            return res.json({ status: 'ok', payload: { message: 'Welcome! Your account has been created. Please check your email for the activation link.' } });

        } catch (err) {
            if (err.errors != null) {
                if (err.errors.name) {
                    return res.json({ status: 'error', payload: { message: err.errors.name.message } });
                } else if (err.errors.email) {
                    return res.json({ status: 'error', payload: { message: err.errors.email.message } });
                } else if (err.errors.password) {
                    return res.json({ status: 'error', payload: { message: err.errors.password.message } });
                } else {
                    return res.json({ status: 'error', payload: { message: err.message || err } });
                }
            } else if (err.code === 11000) {
                if (err.errmsg && err.errmsg.indexOf('email') !== -1) {
                    return res.json({ status: 'error', payload: { message: 'This email address is already associated with an account.' } });
                } else if (err.errmsg && err.errmsg.indexOf('username') !== -1) {
                    return res.json({ status: 'error', payload: { message: 'That username is taken. Please choose another one.' } });
                } else {
                    return res.json({ status: 'error', payload: { message: err.message || err } });
                }
            }
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    
    router.post('/v1/members/auth', async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.json({ status: 'error', payload: { message: "We need all details to proceed. Please complete the form." } });
            }

            const user = await User.findOne({ username }).select('username password email active');
            if (!user) {
                return res.json({ status: 'error', payload: { message: "We couldn't find an account with that information." } });
            }

            const validation = user.comparepassword(password);
            if (!user.active) {
                return res.json({ status: 'error', payload: { message: "Your account is pending activation. Please check your email for the link.", expired: true } });
            }

            if (!validation) {
                return res.json({ status: 'error', payload: { message: "The password you entered is incorrect." } });
            }

            const token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
            return res.json({ status: 'ok', payload: { message: "Welcome back! You have successfully logged in.", token } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    
    router.post('/v1/members/resend', async (req, res) => {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                return res.json({ status: 'error', payload: { message: "We need all details to proceed. Please complete the form." } });
            }

            const user = await User.findOne({ username }).select('username password active');
            if (!user) {
                return res.json({ status: 'error', payload: { message: "We couldn't find an account with that information." } });
            }

            if (user.active) {
                return res.json({ status: 'error', payload: { message: "Good news! Your account is already fully activated." } });
            }

            const validation = user.comparepassword(password);
            if (!validation) {
                return res.json({ status: 'error', payload: { message: "The password you entered is incorrect." } });
            }

            return res.json({ status: 'ok', payload: { user } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });


    
    router.put('/v1/members/sendlink', async (req, res) => {
        try {
            const { username } = req.body;
            const user = await User.findOne({ username }).select('username name email temporarytoken');
            if (!user) {
                return res.json({ status: 'error', payload: { message: "We couldn't find an account with that information." } });
            }

            user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
            await user.save();

            const emailOpts = {
                from: '"RescueMeals" <prem@rescuemeals.org>',
                to: user.email,
                subject: 'Your New RescueMeals Activation Link',
                text: `Hi ${user.name},\n\nWe received a request for a new activation link for your RescueMeals account. Please use the following link to activate your account:\nhttp://localhost:8080/activate/${user.temporarytoken}\n\nCheers,\nPrem, Founder of RescueMeals`,
                html: `<h3>Hi ${user.name},</h3><p>We received a request for a new activation link for your <strong>RescueMeals</strong> account.</p><p>Please click the link below to activate your account:</p><p><a href="http://localhost:8080/activate/${user.temporarytoken}">Activate My Account</a></p><p>Cheers,<br>Prem<br>Founder, RescueMeals</p>`
            };

            transporter.sendMail(emailOpts, (err, info) => {
                
            });

            return res.json({ status: 'ok', payload: { message: 'A fresh activation link has been sent to ' + user.email + '!' } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    
    router.post('/v1/members/resetusername', async (req, res) => {
        try {
            if (!req.body.email) {
                return res.json({ status: 'error', payload: { message: "Please provide your email address." } });
            }

            const user = await User.findOne({ email: req.body.email }).select('username name email');
            if (!user) {
                return res.json({ status: 'error', payload: { message: "We couldn't find an account with that information." } });
            }

            const emailOpts = {
                from: '"RescueMeals" <prem@rescuemeals.org>',
                to: user.email,
                subject: 'RescueMeals - Your Username Reminder',
                text: `Hi ${user.name},\n\nYou requested a reminder for your RescueMeals username. Your username is: ${user.username}\n\nCheers,\nPrem, Founder of RescueMeals`,
                html: `<h3>Hi ${user.name},</h3><p>You requested a reminder for your <strong>RescueMeals</strong> username.</p><p>Your username is: <strong>${user.username}</strong></p><p>Cheers,<br>Prem<br>Founder, RescueMeals</p>`
            };

            transporter.sendMail(emailOpts, (err, info) => {
                
            });

            return res.json({ status: 'ok', payload: { message: 'We\'ve sent your username to ' + user.email + '.' } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    router.post('/v1/members/resetpassword', async (req, res) => {
        try {
            if (!req.body.email) {
                return res.json({ status: 'error', payload: { message: "Please provide your email address." } });
            }

            const user = await User.findOne({ email: req.body.email }).select('username name email');
            if (!user) {
                return res.json({ status: 'error', payload: { message: "We couldn't find an account with that information." } });
            }

            user.temporarytoken = jwt.sign({ username: user.username, name: user.name, email: user.email }, secret, { expiresIn: '24h' });
            await user.save();

            const emailOpts = {
                from: '"RescueMeals" <prem@rescuemeals.org>',
                to: user.email,
                subject: 'RescueMeals - Password Reset Request',
                text: `Hi ${user.name},\n\nWe received a request to reset your RescueMeals password. Please use the following link to reset it:\nhttp://localhost:8080/changepassword/${user.temporarytoken}\n\nCheers,\nPrem, Founder of RescueMeals`,
                html: `<h3>Hi ${user.name},</h3><p>We received a request to reset your <strong>RescueMeals</strong> password.</p><p>Please click the link below to securely reset your password:</p><p><a href="http://localhost:8080/changepassword/${user.temporarytoken}">Reset My Password</a></p><p>Cheers,<br>Prem<br>Founder, RescueMeals</p>`
            };

            transporter.sendMail(emailOpts, (err, info) => {
                
            });

            return res.json({ status: 'ok', payload: { message: 'A password reset link has been dispatched to your email.', token: user.temporarytoken } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    router.post('/v1/members/setpassword/:token', async (req, res) => {
        try {
            const token = req.params.token;
            if (!token) {
                return res.json({ status: 'error', payload: { message: "An authentication token is required." } });
            }

            const user = await User.findOne({ temporarytoken: token });
            try {
                jwt.verify(token, secret);
            } catch (err) {
                return res.json({ status: 'error', payload: { message: "Your password reset link is invalid or has expired." } });
            }

            if (!user) {
                return res.json({ status: 'error', payload: { message: "Your password reset link is invalid or has expired." } });
            }

            user.temporarytoken = false;
            user.active = true;
            await user.save();

            const emailOpts = {
                from: '"RescueMeals" <prem@rescuemeals.org>',
                to: user.email,
                subject: 'RescueMeals - Password Successfully Changed',
                text: `Hi ${user.name},\n\nYour RescueMeals password has been successfully updated. If you did not make this change, please contact us immediately.\n\nCheers,\nPrem, Founder of RescueMeals`,
                html: `<h3>Hi ${user.name},</h3><p>Your <strong>RescueMeals</strong> password has been successfully updated.</p><p>If you did not make this change, please contact us immediately.</p><p>Cheers,<br>Prem<br>Founder, RescueMeals</p>`
            };

            transporter.sendMail(emailOpts, (err, info) => {
                
            });

            return res.json({ status: 'ok', payload: { message: "Your password has been securely updated." } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    
    router.put('/v1/members/changepassword', async (req, res) => {
        try {
            if (!req.body || !req.body.token || !req.body.password) {
                return res.json({ status: 'error', payload: { message: 'Some required details are missing from your request.' } });
            }

            const user = await User.findOne({ temporarytoken: req.body.token }).select('username password email');
            if (!user) {
                return res.json({ status: 'error', payload: { message: 'The provided token is invalid.' } });
            }

            user.password = req.body.password;
            await user.save();

            return res.json({ status: 'ok', payload: { message: 'Your password was updated successfully!' } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    
    router.put('/v1/members/activate/:token', async (req, res) => {
        try {
            const token = req.params.token;
            if (!token) {
                return res.json({ status: 'error', payload: { message: 'Please provide an authentication token.' } });
            }

            const user = await User.findOne({ temporarytoken: token });
            
            try {
                jwt.verify(token, secret);
            } catch (err) {
                return res.json({ status: 'error', payload: { message: "This activation link is no longer valid." } });
            }

            if (!user) {
                return res.json({ status: 'error', payload: { message: "This activation link is no longer valid." } });
            }

            user.temporarytoken = false;
            user.active = true;
            await user.save();

            const emailOpts = {
                from: '"RescueMeals" <prem@rescuemeals.org>',
                to: user.email,
                subject: 'Welcome Aboard! Your RescueMeals Account is Active',
                text: `Hi ${user.name},\n\nYour RescueMeals account has been fully activated. We are excited to have you on board! Let's start making a difference together.\n\nCheers,\nPrem, Founder of RescueMeals`,
                html: `<h3>Hi ${user.name},</h3><p>Your <strong>RescueMeals</strong> account has been fully activated. We are excited to have you on board! Let's start making a difference together.</p><p>Cheers,<br>Prem<br>Founder, RescueMeals</p>`
            };

            transporter.sendMail(emailOpts, (err, info) => {
                
            });

            return res.json({ status: 'ok', payload: { message: "Success! Your account is now active." } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });


    router.use((req, res, next) => {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            try {
                const decoded = jwt.verify(token, secret);
                req.decoded = decoded;
                next();
            } catch (err) {
                return res.json({ status: 'error', payload: { message: "Your session token is invalid. Please log in again." } });
            }
        } else {
            return res.json({ status: 'error', payload: { message: "An authentication token is required." } });
        }
    });

    router.post('/v1/members/me', async (req, res) => {
        try {
            const user = await User.findOne({ email: req.decoded.email }).select('email username name role');
            if (!user) {
                return res.status(500).send('That user profile does not exist.');
            }
            res.send(user);
        } catch (err) {
            return res.status(500).send('Server error');
        }
    });

    
    router.post('/v1/members/donaterawfood', async (req, res) => {
        try {
            const { name, quantity, city, state, unit, expiryDate, address } = req.body;
            
            if (!name || !quantity || !city || !state) {
                return res.json({ status: 'error', payload: { message: 'Please ensure all required fields are filled out.' } });
            }

            const food = new Rawitems({
                name,
                quantity,
                city,
                state,
                postedby: req.decoded.username
            });
            
            if (unit) food.unit = unit;
            if (expiryDate) food.expiryDate = new Date(expiryDate);
            if (address) food.address = address;

            try {
                const locationData = await geocoding.geocodeAddress(food.address, food.city, food.state);
                food.location = {
                    latitude: locationData.latitude,
                    longitude: locationData.longitude
                };
                if (!food.address && locationData.formattedAddress) {
                    food.address = locationData.formattedAddress;
                }
            } catch (geocodeErr) {
                
            }

            await food.save();
            return res.json({ status: 'ok', payload: { message: 'Donate request successfully posted. We will contact you soon' } });
        } catch (err) {
            return res.json({ status: 'error', payload: { message: 'Error in saving the data to the database: ' + err.message } });
        }
    });

    
    router.post('/v1/members/donateCookedFood', async (req, res) => {
        try {
            const { meal, people, city, state, expiryDate, address } = req.body;
            
            if (!meal || !people || !city || !state) {
                return res.json({ status: 'error', payload: { message: 'Please ensure you fill all details.' } });
            }

            const cookedfood = new Cookedfood({
                meal,
                people,
                city,
                state,
                postedby: req.decoded.username
            });
            
            if (expiryDate) cookedfood.expiryDate = new Date(expiryDate);
            if (address) cookedfood.address = address;
            
            try {
                const locationData = await geocoding.geocodeAddress(cookedfood.address, cookedfood.city, cookedfood.state);
                cookedfood.location = {
                    latitude: locationData.latitude,
                    longitude: locationData.longitude
                };
                if (!cookedfood.address && locationData.formattedAddress) {
                    cookedfood.address = locationData.formattedAddress;
                }
            } catch (geocodeErr) {
                
            }

            await cookedfood.save();
            return res.json({ status: 'ok', payload: { message: 'Donate Request successfully posted.' } });
        } catch (err) {
            return res.json({ status: 'error', payload: { message: 'Error in saving the data to the database: ' + err.message } });
        }
    });

    router.get('/v1/members/donaterequests', async (req, res) => {
        try {
            const institute = new User();
            const raw = await Rawitems.find({ requeststatus: false });
            const food = await Cookedfood.find({ requeststatus: false });

            return res.json({ status: 'ok', payload: { user: raw, food: food, institute: institute } });
        } catch (err) {
            return res.json({ status: 'error', payload: { message: 'We encountered an issue retrieving the donation requests.' } });
        }
    });

    router.get('/v1/members/readdonaterequest/:id', async (req, res) => {
        try {
            let food = await Rawitems.findOne({ _id: req.params.id });
            if (!food) {
                food = await Cookedfood.findOne({ _id: req.params.id });
                if (!food) {
                    return res.json({ status: 'error', payload: { message: 'The requested food item could not be located.' } });
                }
            }

            const user = await User.findOne({ username: food.postedby });
            if (!user) {
                return res.json({ status: 'error', payload: { message: 'We could not locate that user profile.' } });
            }

            return res.json({ status: 'ok', payload: { user, food } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    
    router.put('/v1/members/accept/:id', async (req, res) => {
        try {
            const user = await User.findOne({ username: req.decoded.username });
            if (!user) {
                return res.json({ status: 'error', payload: { message: 'We could not locate that user profile.' } });
            }

            let raw = await Rawitems.findOne({ _id: req.params.id });
            if (!raw) {
                let cook = await Cookedfood.findOne({ _id: req.params.id });
                if (!cook) {
                    return res.json({ status: 'error', payload: { message: 'Food item not found' } });
                }
                
                cook.requeststatus = true;
                cook.acceptedby = req.decoded.username;
                await cook.save();
            } else {
                raw.requeststatus = true;
                raw.acceptedby = req.decoded.username;
                await raw.save();
            }

            return res.json({ status: 'ok', payload: { message: 'You have successfully accepted the request.' } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    
    router.get('/v1/members/searchAccepted', async (req, res) => {
        try {
            const cook = await Cookedfood.find({ acceptedby: req.decoded.username });
            const raw = await Rawitems.find({ acceptedby: req.decoded.username });

            return res.json({ status: 'ok', payload: { cook, raw } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    
    router.post('/v1/members/addtocart/:id', async (req, res) => {
        try {
            const user = await User.findOne({ username: req.decoded.username });
            if (!user) {
                return res.json({ status: 'error', payload: { message: 'We could not locate that user profile.' } });
            }

            const item = await Product.findOne({ _id: req.params.id });
            if (!item) {
                return res.json({ status: 'error', payload: { message: 'That product could not be found.' } });
            }

            const cartObj = {
                itemid: req.params.id,
                count: 1,
                name: item.name,
                price: item.price,
                tag: item.tag
            };

            user.cart.push(cartObj);
            await user.save();

            return res.json({ status: 'ok', payload: { message: 'Item added to your cart successfully!', item: cartObj } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    router.get('/v1/members/cart', async (req, res) => {
        try {
            const user = await User.findOne({ username: req.decoded.username });
            if (!user) {
                return res.json({ status: 'error', payload: { message: 'We could not locate that user profile.' } });
            }

            let value = 0;
            for (let i = 0; i < user.cart.length; i++) {
                if (user.cart[i].price) {
                    value += user.cart[i].price;
                }
            }

            return res.json({ status: 'ok', payload: { cart: user.cart, value } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    
    router.post('/v1/members/clearcart', async (req, res) => {
        try {
            const user = await User.findOne({ username: req.decoded.username });
            if (!user) {
                return res.json({ status: 'error', payload: { message: 'That user profile does not exist.' } });
            }

            user.cart = [];
            await user.save();
            return res.json({ status: 'ok', payload: { message: 'Your cart has been completely cleared.' } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    router.post('/v1/contribute/confirm', async (req, res) => {
        try {
            const user = await User.findOne({ username: req.decoded.username });
            if (user) {
                user.cart = [];
                await user.save();
            }
            return res.json({ status: 'ok', payload: { message: 'Contribution confirmed successfully!' } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    
    router.post('/v1/members/removeitem/:id', async (req, res) => {
        try {
            const user = await User.findOne({ username: req.decoded.username });
            if (!user) {
                return res.json({ status: 'error', payload: { message: 'That user profile does not exist.' } });
            }

            for (let i = 0; i < user.cart.length; i++) {
                if (user.cart[i]._id == req.params.id) {
                    user.cart.splice(i, 1);
                    break;
                }
            }

            await user.save();
            return res.json({ status: 'ok', payload: { message: 'The item has been removed from your cart.' } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    
    router.post('/v1/members/addnewproduct', async (req, res) => {
        try {
            const { name, price, quantity, tag } = req.body;

            if (!name || !price || !quantity || !tag) {
                return res.json({ status: 'error', payload: { message: 'Please ensure all required fields are filled out.' } });
            }

            const product = new Product({ name, price, quantity, tag });
            await product.save();

            return res.json({ status: 'ok', payload: { message: 'The product was added to your cart successfully.' } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    
    router.get('/v1/members/displayproduct', async (req, res) => {
        try {
            const item = await Product.find();
            return res.json({ status: 'ok', payload: { item } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    
    router.get('/v1/members/donators', async (req, res) => {
        try {
            const user = await User.find({ role: 'donator' });
            return res.json({ status: 'ok', payload: { user } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    router.get('/v1/members/receivers', async (req, res) => {
        try {
            const user = await User.find({ role: 'receiver' });
            return res.json({ status: 'ok', payload: { user } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    router.get('/v1/members/volunteers', async (req, res) => {
        try {
            const user = await User.find({ role: 'volunteer' });
            return res.json({ status: 'ok', payload: { user } });
        } catch (err) {
            return res.status(500).json({ status: 'error', payload: { message: err.message || "Server error" } });
        }
    });

    return router;
};
