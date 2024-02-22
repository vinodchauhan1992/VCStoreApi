const express = require('express')
const router = express.Router()
const user = require('../../controller/v1/user')

router.get('/getAllUsers',user.getAllUser)
router.get('/getUserByID/:id',user.getUser)
router.post('/addUser',user.addUser)
router.put('/:id',user.editUser)
router.patch('/:id',user.editUser)
router.delete('/:id',user.deleteUser)

module.exports = router