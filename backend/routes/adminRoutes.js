
const express = require('express');
const { getAllUsers, searchUsers, editUser, deleteUser, getUSerDetail , createUser} = require('../controllers/adminController');
const validateToken = require('../middleware/validateToken');
const isAdmin = require('../middleware/isAdmin');



const router = express.Router();


//router.get('/',validateToken,isAdmin,getDashboard)
router.get('/users', validateToken, isAdmin, getAllUsers);
router.get('/users/search', validateToken, isAdmin, searchUsers);
//router.post('/users',validateToken,isAdmin,createUser)
router.get('/users/:id',validateToken,isAdmin,getUSerDetail)

router.put('/users/:id', validateToken, isAdmin, editUser);
router.delete('/users/:id', validateToken, isAdmin, deleteUser);


module.exports = router