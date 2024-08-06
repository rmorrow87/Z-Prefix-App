const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

//========================================================================USER REGISTRATION

router.post('/users/register', async (req, res) => {
  console.log('Registration route hit', req.body);
  try {
    const { first_name, last_name, username, password } = req.body;

    // Check if user already exists
    const existingUser = await req.db('users').where({ username }).first();
    // Error for already taken username
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add new user to table
    const [userId] = await req.db('users').insert({
      first_name,
      last_name,
      username,
      password: hashedPassword
    }).returning('id');

    // Feedback for successful account creation
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


//========================================================================USER LOGIN

// TODO: figure out logic to automatically redirect to inventory after logging in

router.post('/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Logic for finding user in DB
    const user = await req.db('users').where({ username }).first();
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password input against DB
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create and send a JSON web token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


//========================================================================AUTHENTICATED ROUTING
// userId comes from the token, DB access based on WHERE logic and matching data

//========================================================================CREATE NEW ITEM
router.post('/items', authMiddleware, async (req, res) => {
  try {
    const { item_name, description, quantity } = req.body;
    const [itemId] = await req.db('items').insert({
      user_id: req.userId,
      item_name,
      description,
      quantity
    }).returning('id');
    res.status(201).json({ message: 'Item created successfully', itemId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


//========================================================================UPDATE ITEM
router.put('/items/:id', authMiddleware, async (req, res) => {
  try {
    const { item_name, description, quantity } = req.body;
    const item = await req.db('items').where({ id: req.params.id, user_id: req.userId }).first();
    if (!item) {
      return res.status(404).json({ message: 'Item not found or you do not have permission to update it' });
    }
    await req.db('items').where({ id: req.params.id }).update({
      item_name,
      description,
      quantity
    });
    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


//========================================================================DELETE ITEM
router.delete('/items/:id', authMiddleware, async (req, res) => {
  try {
    const item = await req.db('items').where({ id: req.params.id, user_id: req.userId }).first();
    if (!item) {
      return res.status(404).json({ message: 'Item not found or you do not have permission to delete it' });
    }
    await req.db('items').where({ id: req.params.id }).del();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


//========================================================================NON-AUTH ROUTING

// //========================================================================CREATE NEW ITEM

// // TODO: figure out logic to automatically redirect to inventory creating item

// router.post('/items', async (req, res) => {
//   try {
//     const { user_id, item_name, description, quantity } = req.body;
//     const [itemId] = await req.db('items').insert({
//       user_id,
//       item_name,
//       description,
//       quantity
//     }).returning('id');
//     res.status(201).json({ message: 'Item created successfully', itemId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

//========================================================================SEE ALL ITEMS

router.get('/items', async (req, res) => {
  try {
    const items = await req.db('items').select('*');
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// //========================================================================UPDATE ITEM
// router.put('/items/:id', async (req, res) => {
//   try {
//     const { item_name, description, quantity } = req.body;
//     await req.db('items').where({ id: req.params.id }).update({
//       item_name,
//       description,
//       quantity
//     });
//     res.json({ message: 'Item updated successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


// //========================================================================DELETE ITEM
// router.delete('/items/:id', async (req, res) => {
//   try {
//     await req.db('items').where({ id: req.params.id }).del();
//     res.json({ message: 'Item deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });












module.exports = router;