import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Formik, Form } from 'formik';
import { addEmploye, deleteEmploye, getEmploye, updateEmploye } from '../Api/Api';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
    loadEmployeeStart, loadEmployeeSuccess, loadEmployeeError, 
    createEmployeeStart, createEmployeeSuccess, createEmployeeError,
    deleteEmployeeStart, deleteEmployeeSuccess, deleteEmployeeError, 
    updateEmployeeStart, updateEmployeeError 
} from '../redux/Actions/Action';

const Employe = () => {
    const dispatch = useDispatch();
    const employees = useSelector((state) => state.employeData);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, [dispatch]);

    const fetchEmployees = async () => {
        dispatch(loadEmployeeStart());
        try {
            const employeData = await getEmploye();
            dispatch(loadEmployeeSuccess(employeData));
        } catch (error) {
            dispatch(loadEmployeeError(error));
        }
    };

    const handleAddEmploye = async (employedata, { resetForm }) => {
        dispatch(createEmployeeStart());
        try {
            await addEmploye(employedata);
            dispatch(createEmployeeSuccess(employedata))
            toast.success('Employee Added..!');
            fetchEmployees();
            resetForm();
            setIsEditing(false); 
        } catch (error) {
            dispatch(createEmployeeError(error));
        }
    };

    const handleDeleteEmploye = async (id) => {
        dispatch(deleteEmployeeStart());
        try {
            await deleteEmploye(id);
            dispatch(deleteEmployeeSuccess())
            
            toast.error('Employee deleted..!');
            const updatedEmployeData = employees.filter(employee => employee._id !== id);
            dispatch(loadEmployeeSuccess(updatedEmployeData));
           
        } catch (error) {
            dispatch(deleteEmployeeError(error));
        }
    };

    const handleUpdateEmploye = async (values, { resetForm }) => {
        if (!selectedEmployee) return;

        dispatch(updateEmployeeStart());
        try {
            await updateEmploye(selectedEmployee._id, values);
            toast.success('Employee updated..!');
           
            fetchEmployees();
            setSelectedEmployee(null);
            setIsEditing(false);
            resetForm(); 
        } catch (error) {
            dispatch(updateEmployeeError(error));
        }
    };

    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
        setIsEditing(true);
    };

    const initialFormValues = {
        name: selectedEmployee ? selectedEmployee.name : '',
        email: selectedEmployee ? selectedEmployee.email : '',
        phone: selectedEmployee ? selectedEmployee.phone : '',
        city: selectedEmployee ? selectedEmployee.city : ''
    };

    return (
        <Grid container justifyContent="center" spacing={3} sx={{ padding: '20px' }}>
            <Grid item xs={12}>
                <Typography sx={{ color: '#e97713', fontWeight: 'bold', fontSize: '30px', textAlign: 'center' }}>
                    Employee CRUD
                </Typography>
            </Grid>
            <Formik
                initialValues={initialFormValues}
                enableReinitialize
                validate={values => {
                    const errors = {};
                    if (!values.name) {
                        errors.name = 'Name is required';
                    }
                    if (!values.email) {
                        errors.email = 'Email is required';
                    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
                        errors.email = 'Invalid email address';
                    }
                    if (!values.phone) {
                        errors.phone = 'number is required';
                    } else if (!/^\d{10}$/.test(values.phone)) {
                        errors.phone = ' must be 10 digits';
                    }
                    if (!values.city) {
                        errors.city = 'City is required';
                    }
                    return errors;
                }}
                onSubmit={(values, { resetForm }) => {
                    if (isEditing) {
                        handleUpdateEmploye(values, { resetForm });
                    } else {
                        handleAddEmploye(values, { resetForm });
                    }
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur }) => (
                    <Form>
                        <Grid container spacing={2} sx={{mt:2}} justifyContent="center" alignItems="center">
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    variant="outlined"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    variant="outlined"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    label="Mobile"
                                    name="phone"
                                    variant="outlined"
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.phone && Boolean(errors.phone)}
                                    helperText={touched.phone && errors.phone}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    label="City"
                                    name="city"
                                    variant="outlined"
                                    value={values.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.city && Boolean(errors.city)}
                                    helperText={touched.city && errors.city}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={1}>
                                <Button 
                                    type="submit" 
                                    sx={{ backgroundColor: isEditing ? 'green' : '#cb421c', color: 'white' }} 
                                    variant="contained"
                                >
                                    {isEditing ? 'Update' : 'Submit'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
            <Grid container xs={10} sx={{ mt:5 }}>
                <TableContainer component={Paper}>
                    <Table aria-label="employee table">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#dcf4f0" }}>
                                <TableCell sx={{ fontWeight: '900', color: '#f06412' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: '900', color: '#f06412' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: '900', color: '#f06412' }}>Mobile</TableCell>
                                <TableCell sx={{ fontWeight: '900', color: '#f06412' }}>City</TableCell>
                                <TableCell sx={{ fontWeight: '900', color: '#f06412' }}>Edit</TableCell>
                                <TableCell sx={{ fontWeight: '900', color: '#f06412' }}>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.map((employee, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' },
                                        '&:nth-of-type(even)': { backgroundColor: '#e0e0e0' },
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {employee.name}
                                    </TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>{employee.phone}</TableCell>
                                    <TableCell>{employee.city}</TableCell>
                                    <TableCell>
                                        <BorderColorIcon onClick={() => handleEditClick(employee)} sx={{ cursor: 'pointer', color: 'green' }} />
                                    </TableCell>
                                    <TableCell>
                                        <DeleteIcon onClick={() => handleDeleteEmploye(employee._id)} sx={{ cursor: 'pointer', color: 'red' }} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
};

export default Employe;
