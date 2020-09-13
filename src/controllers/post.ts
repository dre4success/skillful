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

    return res.status(200).json({
      status: 200,
      data: { post: createdPost.ops[0] },
      message: `post successful created`,
    });
  };

  editPost = async (req: Request, res: Response) => {
    const postCollection: Collection = MongoHelper.table('posts');
    let postId = req.params.id;
    let post = await postCollection.findOne({ userID: req.user._id, _id: new ObjectId(postId) });
    if (!post)
      return res
        .status(400)
        .json({ status: 400, message: `The post you want to update does not exist` });

    let editPost: UserPost = {
      title: req.body.title || post.title,
      details: req.body.details || post.details,
      userID: req.user._id,
      image: req.body.image || post.image,
      createdAt: post.createdAt,
      updatedAt: new Date(),
    };

    let updatedPost = await postCollection.findOneAndUpdate(
      {
        userID: req.user._id,
        _id: new ObjectId(postId),
      },
      { $set: { ...editPost } },
      { returnOriginal: false }
    );

    if (updatedPost.ok && updatedPost.value)
      return res.status(200).json({
        status: 200,
        data: { post: updatedPost.value },
        message: `Profile successfully updated`,
      });

    return res
      .status(400)
      .json({ status: 400, message: `Unable to update your post, please try again` });
  };

  viewAllUsersPost = async (req: Request, res: Response) => {
    const postCollection: Collection = MongoHelper.table('posts');
    postCollection.createIndex({ createdAt: -1 });
    let allPosts = await postCollection
      .find({ userID: req.user._id })
      .sort({ createdAt: -1 })
      .toArray();
    return res.status(200).json({ status: 200, data: { posts: allPosts } });
  };

  viewASingleUserPost = async (req: Request, res: Response) => {
    const postCollection: Collection = MongoHelper.table('posts');
    let singlePost = await postCollection.findOne({
      userID: req.user._id,
      _id: new ObjectId(req.params.id),
    });
    return res.status(200).json({ status: 200, data: { post: singlePost } });
  };
}

export default Post;
