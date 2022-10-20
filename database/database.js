 const mongoose = require("mongoose");

 const dataBaseConnect = async (link)=>{
    mongoose.connect(link).then(()=>{console.log("connection successful with databse")}).catch((err)=>{console.log(err)});
 }


 
 module.exports = dataBaseConnect;
 