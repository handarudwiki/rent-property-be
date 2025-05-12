import { NextFunction, Request, Response } from "express";
import ManagerService from "../services/manager.service";
import successResponse from "../helpers/success_response";

export default class ManagerController {
    static async getManager(req:Request, res:Response, next:NextFunction){
        try {
            const result = await ManagerService.getManagerById(req.user.id);
            successResponse(res, result, "Manager retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    static async update(req:Request, res:Response, next:NextFunction){
        try {
            const result = await ManagerService.upadte(req.user.id, req.body);
            successResponse(res, result, "Manager updated successfully");
        } catch (error) {
            next(error);
        }
    }

    static async getManagerProperties(req:Request, res:Response, next:NextFunction){    
        try {
            const result = await ManagerService.getManagerProperties(req.user.id);
            successResponse(res, result, "Manager properties retrieved successfully");
        } catch (error) {
            next(error);
        }
    }
}