const mongoose=require("mongoose");
const schema=mongoose.Schema;
const passportlocalMongoose=require("passport-local-mongoose");

const userSchema=new schema({
    email:{
        type:String,
        required:true
    }
})
userModel.plugin(passportlocalMongoose);

module.exports=mongoose.model("userModel",userSchema)

