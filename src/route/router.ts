import { Router } from 'express';
const router = Router();
import User from '../controllers/user';
import { asyncError } from '../errorhandler/errorhandler';

let userController = new User();

router.route('/signup').post(asyncError(userController.signup));

export { router };
