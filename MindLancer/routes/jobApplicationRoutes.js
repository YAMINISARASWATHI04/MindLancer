const express=require('express');
const { applyToJob } =require('../controllers/jobApplicationController.js');

const router = express.Router();

router.post('api/apply_jobs', applyToJob);

module.exports=router;
