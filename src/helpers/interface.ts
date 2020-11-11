import { ObjectID } from 'mongodb';

export interface Signup {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phoneNumber: string;
  interest: string;
  skill: string;
  bio: string;
  profilePicture: string;
  createdAt: Date;
  type: string;
}

export interface UpdateProfile {
  firstname: string;
  lastname: string;
  interest: string;
  bio: string;
  skill: string;
  profilePicture: string;
  updatedAt: Date;
}

export interface DataStoredInToken {
  _id: string;
}

export interface UserPost {
  title: string;
  details: string;
  image: string;
  userID: ObjectID;
  createdAt: Date;
  updatedAt: Date;
}

export interface Jobbers {
  title: string;
  location: string;
  duration: string;
  amount: string;
  description: string;
  organisation: ObjectID;
  requiredSkills: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  jobId: ObjectID;
  user: ObjectID;
  organisation: ObjectID;
  dateApplied: Date;
  jobStatus: JobStatus;
  applicationStatus: ApplicationStatus;
}

export enum JobStatus {
  completed = 'completed',
  active = 'active',
  pending = 'pending',
}

export enum ApplicationStatus {
  reviewing = 'reviewing',
  accepted = 'accepted',
  declined = 'declined',
}
