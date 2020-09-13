import { Router } from 'express';
const router = Router();
import User from '../controllers/user';
import Upload from '../controllers/upload';
import { asyncError } from '../errorhandler/errorhandler';
import { auth } from '../middleware/auth';

let userController = new User();
let uploadController = new Upload();

router.route('/signup').post(asyncError(userController.signup));
router.route('/login').post(asyncError(userController.login));
router.route('/user').get(auth, asyncError(userController.getALoggedInUser));
router.route('/user').put(auth, asyncError(userController.editProfile));

router.route('/upload/profile').post(asyncError(uploadController.uploadProfileImage));

export { router };
