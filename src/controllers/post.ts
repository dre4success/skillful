import { Request, Response } from 'express';
import { Collection, ObjectId } from 'mongodb';
import { MongoHelper } from '../db/mongo.helper';
import { validator } from '../errorhandler/errorhandler';
import { UserPost } from '../helpers/interface';

class Post {
  createPost = async (req: Request, res: Response) => {
    const postCollection: Collection = MongoHelper.table('posts');
    let inputs = ['title', 'details'];

    let err = validator(inputs, req.body);
    if (err.length) return res.status(400).json({ status: 400, messsage: err });

    let post: UserPost = {
      title: req.body.title,
      details: req.body.details,
      userID: req.user._id,
      image: req.body.image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let createdPost = await postCollection.insertOne({ ...post });

    return res
      .status(200)
      .json({ status: 200, data: { post: createdPost.ops[0] }, message: `post successful created` });
  };
}

export default Post
