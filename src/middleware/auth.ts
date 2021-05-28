import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import { Collection, ObjectId } from 'mongodb';
import { MongoHelper } from '../db/mongo.helper';
import { DataStoredInToken } from '../helpers/interface';

config({ path: 'app.env' });

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCollection: Collection = MongoHelper.table('users');
    if (!req.headers.authorization)
      return res.status(401).json({ status: 401, meesage: `Unauthorized access` });

    const token = req.headers.authorization.split(' ')[1];
    const { _id } = jwt.verify(token, `${process.env.SECRET}`) as DataStoredInToken;

    const user = await userCollection.findOne({ _id: new ObjectId(_id) });
    if (!user) return res.status(401).json({ status: 401, message: `No user found` });

    const { password, ...rest } = user;
    req.user = rest;
    next();
  } catch (e) {
    res.status(401).json({ status: 401, message: e.message });
  }
};
