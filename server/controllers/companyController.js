import Company from "../models/Company.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import generateToken from "../utils/generateToken.js";

//Register a new company
export const registerCompany = async (req, res) => {
    const { name, email, password } = req.body;
    const imageFile = req.file;
    if (!name || !email || !password) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    try {
        const companyExists = await Company.findOne({ email });
        if (companyExists) {
            return res.json({ success: false, message: 'Company already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        // console.log(req.file);
        // console.log(imageFile.path);
        // console.log("Before upload");
        // const imageUpload=await cloudinary.uploader.upload(imageFile.path)
        // console.log(imageUpload);
        // console.log("After upload");

        const imageUpload = {
            secure_url: "https://via.placeholder.com/300"
        };

        const company = await Company.create({ name, email, password: hashedPassword, image: imageUpload.secure_url });
        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id),
            message: 'Company registered successfully',
        });

        //     }catch (error) {
        //     console.dir(error, { depth: null });

        //     if (error.error) {
        //         console.dir(error.error, { depth: null });
        //     }

        //     return res.json({
        //         success: false,
        //         message: error.message
        //     });
        // }
    } catch (error) {
        console.dir(error, { depth: null });
        return res.json({
            success: false,
            message: error.message
        });
    }
}

//Company Login
export const loginCompany = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: 'All fields are required' });
    }
    try {
        const company = await Company.findOne({ email });
        if (!company) {
            return res.json({ success: false, message: 'Company not found' });
        }
        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id),
            message: 'Company logged in successfully',
        });
    } catch (error) {
        // console.dir(error, { depth: null });
        return res.json({
            success: false,
            message: error.message
        });
    }
}

//Get company data
export const getCompanyData = async (req, res) => {

    try {
        const company = req.company;
        res.json({
            success: true,
            company
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}

//post a new job
export const postJob = async (req, res) => {
    const { title, description, location, salary, level, category } = req.body;
    const companyId = req.company._id;

    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            level,
            category,
            companyId,
            date: Date.now(),
        });
        await newJob.save();
        res.json({
            success: true,
            job: newJob
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}

//get company job applicants
export const getJobApplicants = async (req, res) => {

}

//get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {
    try {
        const companyId = req.company._id;
        const jobs = await Job.find({ companyId });

        //adding no of applicants for each job
        const jobsData = await Promise.all(jobs.map(async (job) => {
            const applicants = await JobApplication.find({jobId: job._id});
            return {
                ...job.toObject(),
                applicants: applicants.length
            };
        }));

        res.json({
            success: true,
            jobsData
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}

//change job application status
export const changeApplicationStatus = async (req, res) => {

}

//change job visibility
export const changeVisibility = async (req, res) => {
    try {
        const { id } = req.body;
        const companyId = req.company._id;
        // // console.log(id, companyId);
        const job = await Job.findById(id);

        // // console.log("Before:", job.visible);
        if (companyId.toString() === job.companyId.toString()) {
            job.visible = !job.visible;
        }
        // // console.log("after:", job.visible);
        await job.save();
        return res.json({
            success: true,
            message: 'Job visibility changed successfully'
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}