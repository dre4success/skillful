import { Job } from 'aws-sdk/clients/codepipeline';
import { Request, Response } from 'express';
import { Collection, ObjectId } from 'mongodb';
import { MongoHelper } from '../db/mongo.helper';
import { validator } from '../errorhandler/errorhandler';
import { Jobbers, JobApplication, JobStatus, ApplicationStatus } from '../helpers/interface';

// only an organisation can post jobs

class Jobs {
  createJobs = async (req: Request, res: Response) => {
    if (req.user && req.user.type !== 'organisation')
      return res.status(400).json({ status: 400, messsage: `Only organisations can post jobs` });

    const jobCollections: Collection = MongoHelper.table('jobs');
    let inputs = ['title', 'location', 'duration', 'amount', 'description', 'requiredSkills'];
    let err = validator(inputs, req.body);
    if (err.length) return res.status(400).json({ status: 400, messsage: err });

    if (isNaN(Number(req.body.amount)))
      return res.status(400).json({ status: 400, message: `Amount can only be in number` });

    if (!Array.isArray(req.body.requiredSkills))
      return res
        .status(400)
        .json({ status: 400, message: `requiredSkills must be an array of skills` });

    const job: Jobbers = {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      duration: req.body.duration,
      amount: req.body.amount,
      organisation: req.user._id,
      requiredSkills: req.body.requiredSkills,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let createdJob = await jobCollections.insertOne(job);

    return res.status(200).json({ status: 200, message: `Job successfully created` });
  };

  getAllJobs = async (req: Request, res: Response) => {
    const jobCollections: Collection = MongoHelper.table('jobs');

    // const jobs = await jobCollections.find({}).toArray();
    const jobs = await jobCollections
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'organisation',
            foreignField: '_id',
            as: 'organisation',
          },
        },

        {
          $project: {
            title: 1,
            description: 1,
            location: 1,
            duration: 1,
            requiredSkills: 1,
            amount: 1,
            organisationEmail: { $arrayElemAt: ['$organisation.email', 0] },
            organisationProfilePic: { $arrayElemAt: ['$organisation.profilePicture', 0] },
            organisationPhone: { $arrayElemAt: ['$organisation.phoneNumber', 0] },
            organisationName: {
              $concat: [
                { $arrayElemAt: ['$organisation.firstname', 0] },
                " ",
                { $arrayElemAt: ['$organisation.lastname', 0] },
              ],
            },
          },
        },
      ])
      .toArray();

    return res.status(200).json({ status: 200, jobs });
  };

  getASingleJob = async (req: Request, res: Response) => {
    const jobCollections: Collection = MongoHelper.table('jobs');
    let id = req.params.id;
    const job = await jobCollections.findOne({ _id: new ObjectId(id) });
    return res.status(200).json({ status: 200, job });
  };

  applyForJobs = async (req: Request, res: Response) => {
    const jobCollections: Collection = MongoHelper.table('jobs');
    const jobApplied: Collection = MongoHelper.table('jobsappliedfor');

    let jobId = req.params.id;
    const job = await jobCollections.findOne({ _id: new ObjectId(jobId) });
    if (!job) return res.status(200).json({ status: 200, message: `Job not found` });
    let user = req.user._id;
    // job being applied for
    // user applying for job
    // organisation with job
    let applied: JobApplication = {
      jobId: job._id,
      user,
      organisation: job.organisation,
      dateApplied: new Date(),
      jobStatus: JobStatus.pending,
      applicationStatus: ApplicationStatus.reviewing,
    };
    let jobAppliedFor = await jobApplied.insertOne(applied);

    return res.status(200).json({ status: 200, message: `Job successfully applied to` });
  };
}

export default Jobs;
