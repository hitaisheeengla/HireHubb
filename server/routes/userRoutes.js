import express from 'express';
import upload from '../config/multer.js'; 
import { getUserData, applyForJob, getUserJobApplications, updateUserResume } from '../controllers/userController.js';

const router = express.Router();

//get user data
router.get('/user', getUserData);

//apply for a job
router.post('/apply', applyForJob);

//get user job applications
router.get('/applications', getUserJobApplications);

//update user resume
router.post('/resume',upload.single('resume'), updateUserResume);

export default router;