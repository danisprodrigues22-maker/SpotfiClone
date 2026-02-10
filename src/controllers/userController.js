//src/controllers/userController.js
const User = require("../models/userModel");

const getUsers = async (req, res) => { 
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



const getUserId = async (req,res) =>{
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



const createUser = async (req, res) =>{
    const user = new User(req.body);
    
    try{
        await user.save();
        res.status(201).json(user);
    }catch(error){
        res.status(400).json({message: error.message})
    }
}



const deleteUser = async (req, res) =>{
    try{
        const removed = await User.findByIdAndDelete(req.params.id);
        if(!removed){
            return res.status(404).json({message: "User não encontrado"})
        }

        res.status(204).send()
    }catch(error){
        res.status(400).json({message: "Id invalido"})
    }
}



const updateUser = async (req, res) =>{
    try{
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!updated){
            return res.status(404).json({message: "User não encontrado"});
        }
        res.status(200).json(updated);
    }catch(error){
        res.status(400).json({message: "Id invalido"})
    }
}



module.exports = {
    getUsers,
    createUser,
    deleteUser,
    updateUser,
    getUserId
};