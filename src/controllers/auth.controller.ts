import { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth.service";
import successResponse from "../helpers/success_response";

export default class AuthController {
    static async login(req:Request, res:Response, next:NextFunction){
        try {
            const result = await AuthService.signIn(req.body);

           successResponse(res, result, "Login successful");
        } catch (error) {
            next(error);
        }
    }

    static async signup(req:Request, res:Response, next:NextFunction){
        try {
            const result = await AuthService.signUp(req.body);

            successResponse(res, result, "Signup successful");
        } catch (error) {
            next(error);
        }
    }
}