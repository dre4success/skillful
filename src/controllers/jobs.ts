import { Job } from 'aws-sdk/clients/codepipeline';
import { Request, Response } from 'express';
import { Collection, ObjectId } from 'mongodb';
import { MongoHelper } from '../db/mongo.helper';
import { validator } from '../errorhandler/errorhandler';
import { Jobbers } from '../helpers/interface';

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

    const jobs = await jobCollections.find({}).toArray();

    return res.status(200).json({ status: 200, jobs });
  };
}

export default Jobs;
