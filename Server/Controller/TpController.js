const UserModel = require('../models/usermodel');
const CourseModel = require('../models/coursemodel');
const EnrollModel = require('../models/enrollmodel');
const ChapterModel = require('../models/chaptermodel');
const TestModel = require('../models/testmodel');
const QuestionsModel = require('../models/questionmodel');
const ResultModel = require('../models/resultmodel');
const ChatModel = require('../models/chatmodel')
const jwt = require('jsonwebtoken');
const {jwtkey} = require('../keys');
const resultmodel = require('../models/resultmodel');

exports.register = async(req,res)=>{
    console.log('register');
    try {
        console.log(req.body);
        const name = ""
        const {email,mobile,gender,education,password,cpassword} = req.body;
        const user = new UserModel({name,email,mobile,gender,education,password,cpassword})
        await user.save()
        const token = jwt.sign({userId:user._id}, jwtkey)
        console.log(user);
        res.status(200).send({"status":"yes","msg":"Register Successfully...","user":user,"token":token});
    } catch (error) {
        console.log(error);
        res.status(400).send({"status":"no","msg":"Email or Mobile is already registered","error":error.message});
    }
}

exports.login = async(req,res)=>{
    try {
        console.log(req.body);
        const {mobile,password} = req.body
        const user = await UserModel.findOne({mobile})
        if(!user){
            res.status(400).send({"status":"no","msg":"Invalid Mobile or Password"});
        }
        try {
            await user.comparePassword(password);
            const token = jwt.sign({userId:user._id}, jwtkey);
            res.status(200).send({"status":"yes","msg":"You are logged in..","user":user,"token":token});
        } catch (err) {
            res.status(400).send({"status":"no","msg":"Invalid Mobile or Password"});
        }
    } catch (error) {
        console.log(error);
    }
}

exports.checkMobile = async(req,res)=>{
    try {
        console.log(req.body);
        const {mobile} = req.body
        const user = await UserModel.findOne({mobile})
        if(!user){
            res.status(400).send({"status":"no","msg":"Mobile not Register"});
        }
        try {
            res.status(200).send({"status":"yes","msg":"Mobile is found","user":user});
        } catch (err) {
            res.status(400).send({"status":"no","msg":"Invalid Mobile"});
        }
    } catch (error) {
        console.log(error);
    }
}

exports.reset = async(req,res)=>{
    try {
        console.log(req.body);
        const {mobile,password,cpassword} = req.body
        const updateUser = await UserModel.updateOne({mobile:mobile},{password:password,cpassword,cpassword})
        console.log(updateUser);
        res.status(200).send({"status":"yes","msg":"Password Reset Successfull..."});
    } catch (error) {
        console.log(error);
        res.status(400).send({"status":"no","msg":"Password Not reset"});
    }
}

exports.updateProfile = async(req,res)=>{
    try {
        console.log("updateProfile");
        console.log(req.body);
        const {id,name,email,mobile,education} = req.body
        const user = await UserModel.updateOne({_id:id},{name,email,mobile,education});
        if(user.modifiedCount == 0){
            res.status(400).send({"status":"no","msg":"No any changes in your profile"});
        }else{
            res.status(400).send({"status":"yes","msg":"Profile update successfully..."});
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({"status":"no","msg":"Profile not Updated","error":error.message});
    }
}

exports.fetchCourses = async(req,res)=>{
    try {
        console.log('fetchCourses');
        const course = await CourseModel.find();
        if(!course){
            res.status(400).send({"status":"no","msg":"No Courses Available","error":error.message});
        }else{
            res.status(200).send({"status":"yes","msg":"Courses Found","course":course});
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({"status":"no","msg":"No Courses Available","error":error.message});
    }
}

exports.fetchEnroll = async(req,res)=>{
    try {
        console.log('fetchEnroll');
        console.log(req.body);
        const {uid} = req.body;
        const enroll = await EnrollModel.find({uid});
        console.log(enroll);
        if(!enroll){
            res.status(400).send({"status":"no","msg":"No Enroll Available","error":error.message});
        }else{
            res.status(200).send({"status":"yes","msg":"Enroll Found","enroll":enroll});
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({"status":"no","msg":"No Enroll Available","error":error.message});
    }
}

exports.insertEnroll = async(req,res)=>{
    try {
        console.log('insertEnroll');
        console.log(req.body);
        const {uid,cid} = req.body;
        const enroll = new EnrollModel({uid,cid});
        await enroll.save()
        console.log(enroll);
        res.status(200).send({"status":"yes","msg":"Course Enroll Successfully...","enroll":enroll});
    } catch (error) {
        console.log(error);
        res.status(400).send({"status":"no","msg":"Error in Enroll","error":error.message});
    }
}

exports.removeEnroll = async(req,res)=>{
    try {
        console.log('removeEnroll');
        console.log(req.body);
        const {uid,cid} = req.body;
        const del = await EnrollModel.deleteOne({uid:uid,cid:cid});
        if(del.deletedCount == 0){
            res.status(200).send({"status":"no","msg":"Already Removed..."});
        }else{
            res.status(200).send({"status":"yes","msg":"Removed Successfully..."});   
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({"status":"no","msg":"Something went wrong","error":error.message});
    }
}

exports.fetchChapters = async(req,res)=>{
    try {
        console.log('fetchChapters');
        console.log(req.body);
        const {cid} = req.body;
        const chapters = await ChapterModel.find({cid});
        const course = await CourseModel.find({_id:cid});
        console.log(chapters);
        res.status(200).send({"status":"yes","msg":"Chapters Found","chapters":chapters,"course":course});
    } catch (error) {
        console.log(error);
        res.status(400).send({"status":"no","msg":"No Chpaters Available","error":error.message});
    }
}

// test module start

exports.getTest = async(req,res)=>{
    try {
        console.log('getAllTest');
        console.log(req.body);
        const {cid,chid} = req.body;
        const test = await TestModel.find({cid:cid,chid:chid});
        res.status(200).send({"status":"yes","msg":"Test Found","test":test})
    } catch (error) {
        console.log(error);
        res.status(400).send({"status":"no","msg":"No Test Available","error":error.message});
    }
}

exports.getQuestions = async(req,res)=>{
    try {
        console.log('getQuestions');
        console.log(req.body);
        const {tid} = req.body;
        const question = await QuestionsModel.find({tid:tid});
        res.status(200).send({"status":"yes","msg":"Questions Found","question":question});
    } catch (error) {
        console.log(error);
        res.status(400).send({"status":"no","msg":"No Questions Available","error":error.message});
    }
}

exports.storeResult = async(req,res)=>{
    try {
        console.log('storeResult');
        console.log(req.body);
        const {uid,cid,chid,tid,marks,totalmarks,percentage} = req.body;
        const result = new ResultModel({uid:uid,cid:cid,chid:chid,tid:tid,marks:marks,totalmarks:totalmarks,percentage:percentage});
        await result.save();
        res.status(200).send({"status":"yes","msg":"Result Store Successfully..","result":result});
    } catch (error) {   
        console.log(error);
        res.status(400).send({"status":"no","msg":"Result not stored","error":error.message});
    }
}

exports.fetchChapterWiseResult = async(req,res)=>{
    try {
        console.log('fetchChapterWiseResult');
        console.log(req.body);
        const {uid,cid} = req.body
        const data = await ResultModel.find({uid:uid,cid:cid});
        const data2 = await TestModel.find({cid:cid});
        console.log(data);
        console.log(data2);
        res.status(200).send({"status":"yes","msg":"Results Fetch Successfully..","data":data,"data2":data2});
    } catch (error) {   
        console.log(error);
        res.status(400).send({"status":"no","msg":"Result not stored","error":error.message});
    }
}

// Home API

exports.home = async(req,res)=>{
    try {
        console.log('home');
        console.log(req.body);
        const {uid} = req.body;
        const courses = await CourseModel.find()
        const chapters = await ChapterModel.find()
        const enrolls = await EnrollModel.find({uid:uid})
        const results = await ResultModel.find()
        res.status(200).send({"status":"yes","msg":"Home API Fetch Successfully..","courses":courses,"chapters":chapters,"enrolls":enrolls,"results":results});
    } catch (error) {   
        console.log(error);
        res.status(400).send({"status":"no","msg":"Home API not Fetched","error":error.message});
    }
}

// Help (Forum chat) API

exports.fetchEnrollCourses = async(req,res)=>{
    try {
        console.log('fetchEnrollCourses');
        console.log(req.body);
        const {uid} = req.body;
        const enroll = await EnrollModel.find({uid:uid});
        const course = await CourseModel.find();
        res.status(200).send({"status":"yes","msg":"Help Chat API Fetch Successfully..","enroll":enroll,"course":course});
    } catch (error) {   
        console.log(error);
        res.status(400).send({"status":"no","msg":"Help Chat API not Fetched","error":error.message});
    }
}
exports.storeChat = async(req,res)=>{
    try {
        console.log('storeChat');
        console.log(req.body);
        const {uid,name,cid,msg} = req.body;
        const chat = new ChatModel({uid:uid,name:name,cid:cid,msg:msg});
        await chat.save();
        res.status(200).send({"status":"yes","msg":"Message store successfully...","chat":chat});
    } catch (error) {   
        console.log(error);
        res.status(400).send({"status":"no","msg":"Help Chat API not Fetched","error":error.message});
    }
}
exports.fetchChat = async(req,res)=>{
    try {
        console.log('fetchChat');
        console.log(req.body);
        const {cid} = req.body;
        if(cid){
            const chat = await ChatModel.find({cid:cid});
            res.status(200).send({"status":"yes","msg":"Fetch Chat successfully...","chat":chat});
        }else{
            const chat = await ChatModel.find();
            res.status(200).send({"status":"yes","msg":"Fetch Chat successfully...","chat":chat});
        }
    } catch (error) {   
        console.log(error);
        res.status(400).send({"status":"no","msg":"Help Chat API not Fetched","error":error.message});
    }
}