const Employee = require('../models/Employee')

const createEmploye = async (req,res)=>{

    try{
        const{name,email,phone,city}=req.body

        const employee=new  Employee(

            {
                name,
                email,
                phone,
                city
            })
            await employee.save();
            res.status(201).json(employee)
        
    }
    catch(error)
    {
        console.log("error", error)
        res.status(500).json({message:'server error'})
    }
};

const getEmployees=async (req, res)=>{
    try{
        const employees=await Employee.find()
        res.status(200).json(employees)
    }
    catch (error){
        console.log("error", error)

    }
}


const getEmployeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json(employee);
    } catch (error) {
        console.log("Error getting employee", error);
        res.status(500).json({ message: 'Server error' });
    }
};



const updateEmploye=async(req,res)=>{

    try{
        const{name,email,phone,city}=req.body

        const myEmployee=await Employee.findByIdAndUpdate(

            req.params.id,
            {
                
                    name,
                    email,
                    phone,
                    city
            }
        )
        if(!myEmployee)
        {
            return res.status(404).json({message:'employe not found'})
        }
        res.status(200).json(myEmployee)

    }
    catch (error){

             console.log('error', error)
             res.status(500).json({message:'server error'})

    }
    
}


const deleteEmploye = async (req, res) => {
    try {
        const deleteEmployee = await Employee.findByIdAndDelete(req.params.id);
        
        if (!deleteEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted' });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports={createEmploye, getEmployees, getEmployeById, updateEmploye, deleteEmploye}
