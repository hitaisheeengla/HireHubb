import express from 'express';
import { registerCompany, loginCompany, getCompanyData, getCompanyPostedJobs, getJobApplicants, postJob, changeApplicationStatus, changeVisibility } from '../controllers/companyController.js';
import upload from '../config/multer.js';
import { protectCompany } from '../middleware/authMiddleware.js';

const router = express.Router();

//register a company

router.post('/register',upload.single('image'), registerCompany);

//company login
router.post('/login', loginCompany);

//get company data
router.get('/company', protectCompany, getCompanyData);

//post a new job
router.post('/post-job',protectCompany, postJob);

//get company job applicants
router.get('/applicants', protectCompany, getJobApplicants);

//get company posted jobs
router.get('/list-jobs', protectCompany, getCompanyPostedJobs);

//change job application status
router.post('/change-status', protectCompany, changeApplicationStatus);

//change job visibility
router.post('/change-visibility', protectCompany, changeVisibility);

export default router;