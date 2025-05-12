import { NextFunction, Request, Response } from "express";
import ApplicationService from "../services/application.service";
import { GetAllApplicationType, UpdateApplicationType } from "../validations/application.validation";
import successResponse from "../helpers/success_response";

export default class ApplicationController {
    static async getAll(req:Request, res:Response, next:NextFunction){
        try {
            const filter:GetAllApplicationType = req.query;
            const result = await ApplicationService.getAll(filter);
            successResponse(res, result, "Applications retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    static async create(req:Request, res:Response, next:NextFunction){
        try {
            const result = await ApplicationService.create(req.body);
            successResponse(res, result, "Application created successfully");
        } catch (error) {
            next(error);
        }
    }

    static async update(req:Request, res:Response, next:NextFunction){
        try {
            const data:UpdateApplicationType = {
                status: req.body.status,
                id: req.params.id,
            }
            const result = await ApplicationService.update(data);
            successResponse(res, result, "Application updated successfully");
        } catch (error) {
            next(error);
        }
    }
}