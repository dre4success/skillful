import { Request, Response } from 'express';
import { Collection, ObjectId } from 'mongodb';
import { MongoHelper } from '../db/mongo.helper';
import { validator } from '../errorhandler/errorhandler';
import isEmail from 'validator/lib/isEmail';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

dotenv.config({ path: 'application.env' });
import { Signup, DataStoredInToken, UpdateProfile } from '../helpers/interface';

let phoneUtil = PhoneNumberUtil.getInstance();

class User {
  signup = async (req: Request, res: Response) => {
    const userCollection: Collection = MongoHelper.table('users');
    let inputs = ['password', 'email', 'firstname', 'lastname', 'phoneNumber'];
    let err = validator(inputs, req.body);
    if (err.length) return res.status(400).json({ status: 400, messsage: err });

    // check email is unique
    let emailExist = await userCollection.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).json({ status: 400, message: `Email already exist` });

    if (!isEmail(req.body.email))
      return res
        .status(400)
        .json({ status: 400, message: `${req.body.email} is not a valid email` });

    let countryCode = req.body.countryCode || 'NG';
    let number = phoneUtil.parseAndKeepRawInput(req.body.phoneNumber, countryCode);

    // validate phone number
    if (!phoneUtil.isValidNumber(number))
      return res
        .status(400)
        .json({ status: 400, message: `Not a valid phone number for ${countryCode}` });

    let mobileNumber = phoneUtil.format(number, PhoneNumberFormat.E164);

    let hashedPassword = await bcrypt.hash(req.body.password, 10);

    let signup: Signup = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      profilePicture: req.body.profilePicture,
      phoneNumber: mobileNumber,
      password: hashedPassword,
      interest: req.body.interest,
      skill: req.body.skill,
      bio: req.body.bio,
      createdAt: new Date()
    };

    let user = await userCollection.insertOne({ ...signup });

    return res.status(200).json({ status: 200, message: `User successful created` });
  };

  login = async (req: Request, res: Response) => {
    let inputs = ['password', 'email'];
    let err = validator(inputs, req.body);
    if (err.length) return res.status(400).json({ status: 400, messsage: err });

    const userCollection: Collection = MongoHelper.table('users');
    const user = await userCollection.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).json({ status: 401, message: `Email or Password does not exist` });

    const correctPassword = await bcrypt.compare(req.body.password, user.password);
    if (!correctPassword)
      return res.status(401).json({
        status: 401,
        message: `Email or Password does not exist`,
      });

    // generate jwt
    let dataStored: DataStoredInToken = {
      _id: user._id,
    };

    let token = jwt.sign(dataStored, `${process.env.SECRET}`, {
      expiresIn: '8760h',
    });
    let { password, ...rest } = user;
    return res.status(200).json({ status: 200, data: { user: rest, token } });
  };

  getALoggedInUser = async (req: Request, res: Response) => {
    return res.status(200).json({ status: 200, data: { user: req.user } });
  };

  editProfile = async (req: Request, res: Response) => {
    let userID = req.user._id;
    const userCollection: Collection = MongoHelper.table('users');
    let user = await userCollection.findOne({ _id: new ObjectId(userID) });

    let updateProfile: UpdateProfile = {
      firstname: req.body.firstname || user.firstname,
      lastname: req.body.lastname || user.lastname,
      interest: req.body.interest || user.interest,
      bio: req.body.bio || user.bio,
      skill: req.body.skill || user.skill,
      profilePicture: req.body.profilePicture || user.profilePicture,
      updatedAt: new Date()
    };

    let updatedDoc = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userID) },
      { $set: { ...updateProfile } },
      { returnOriginal: false }
    );

    if (updatedDoc.ok && updatedDoc.value)
      return res.status(200).json({
        status: 200,
        data: { user: updatedDoc.value },
        message: `Profile successfully updated`,
      });

    return res
      .status(400)
      .json({ status: 400, message: `Unable to update your profile, please try again` });
  };
}

export default User;
