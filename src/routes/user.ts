import express from "express";
import * as user from "../controllers/user/user";

const router = express.Router();

router.post('/signUp', user.handleSignUp);
router.post('/login', user.handleLogin);
router.get('/getAllUsers', user.findAllUsers);
router.post('/checkUserExist', user.findOneUser);

export default router;