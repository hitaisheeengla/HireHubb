import User from '../models/User.js';
import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';
import { v2 as cloudinary } from "cloudinary"

//get user data
export const getUserData = async (req, res) => {
    // const userId = req.auth.userId;
    // console.log(userId);

    const { userId } = req.auth();

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//apply for a job
export const applyForJob = async (req, res) => {
    const { jobId } = req.body;
    const { userId } = req.auth();

    try {
        const isAlreadyApplied = await JobApplication.findOne({ jobId, userId });
        if (isAlreadyApplied) {
            return res.json({
                success: false,
                message: 'User has already applied for this job'
            });
        }
        const jobData = await Job.findById(jobId);

        if (!jobData) {
            return res.json({
                success: false,
                message: 'Job not found'
            });
        }
        await JobApplication.create({
            userId,
            companyId: jobData.companyId,
            jobId,
            date: Date.now()
        });
        res.json({
            success: true,
            message: 'Job application submitted successfully'
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

//get user applied jobs
export const getUserJobApplications = async (req, res) => {

    try {
        const { userId } = req.auth();
        const jobApplications = await JobApplication.find({ userId }).populate('jobId', 'title description location category level salary').populate('companyId', 'name email image').exec();

        if (!jobApplications) {
            return res.json({
                success: false,
                message: 'No job applications found for this user'
            });
        }
        res.json({
            success: true,
            jobApplications
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

//update user profile(resume)
export const updateUserResume = async (req, res) => {
    try {
        const { userId } = req.auth();
        const resumeFile = req.file;
        const userData = await User.findById(userId);

      
        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url;
        }
        await userData.save(); 
        res.json({
            success: true,
            message: 'Resume updated successfully',
            // resumeUrl: userData.resume
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}