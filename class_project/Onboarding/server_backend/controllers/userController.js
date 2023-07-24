const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

// Sign up a new user
exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Salt the password
    const saltedPassword = await bcrypt.genSalt( 10 );
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltedPassword);

    // Create a new user
    const user = new UserModel({
      username,
      email,
      password: hashedPassword,
    //   records: [],
    } );
    

    // Save the user to the database
    await user.save();
      res.status( 201 ).json( {
          message: 'User created successfully',
      } );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Sign in an existing user
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Set user session
    req.session.user = user;

      res.status( 200 ).json( {
          message: 'User signed in successfully',
          user
      } );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Sign out the currently signed-in user
exports.signOut = (req, res) => {
  // Destroy the session
  req.session.destroy();
  res.status(200).json({ message: 'User signed out successfully' });
};


