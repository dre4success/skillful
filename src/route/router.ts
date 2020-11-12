import { Router } from 'express';
const router = Router();
import User from '../controllers/user';
import Upload from '../controllers/upload';
import { asyncError } from '../errorhandler/errorhandler';
import { auth } from '../middleware/auth';
import Post from '../controllers/post';
import Jobs from '../controllers/jobs';

let userController = new User();
let uploadController = new Upload();
let postController = new Post();
let jobsController = new Jobs();

router.route('/signup').post(asyncError(userController.signup));
router.route('/login').post(asyncError(userController.login));
router.route('/user').get(auth, asyncError(userController.getALoggedInUser));
router.route('/user').put(auth, asyncError(userController.editProfile));

router.route('/upload/profile').post(asyncError(uploadController.uploadProfileImage));

router
  .route('/post')
  .post(auth, asyncError(postController.createPost))
  .get(auth, asyncError(postController.viewAllUsersPost));
router
  .route('/post/:id')
  .put(auth, asyncError(postController.editPost))
  .get(auth, asyncError(postController.viewASingleUserPost))
  .delete(auth, asyncError(postController.deletePost));

router
  .route('/jobs')
  .post(auth, asyncError(jobsController.createJobs))
  .get(asyncError(jobsController.getAllJobs));

router.route('/jobs/:id').get(asyncError(jobsController.getASingleJob));

router.route('/jobs/apply/:id').get(auth, asyncError(jobsController.applyForJobs));

router.route('/explore').get(auth, asyncError(postController.explore));
export { router };
