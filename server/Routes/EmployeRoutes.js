const express = require('express');
const router = express.Router();
const employeController = require('../controllers/employeController');

router.post('/addemp', employeController.createEmploye);
router.get('/allemployees', employeController.getEmployees);
router.get('/employee/:id', employeController.getEmployeById); 
router.put('/update/:id',employeController.updateEmploye )
router.delete('/delete/:id',employeController.deleteEmploye)

module.exports = router;
