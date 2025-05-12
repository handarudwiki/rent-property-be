import { NextFunction, Request, Response } from "express";
import LeaseService from "../services/lease.service";
import successResponse from "../helpers/success_response";

export default class LeaseController {
    static async getAll(req:Request, res:Response, next:NextFunction){
        try {
            const result = await LeaseService.getAll();
            successResponse(res, result, "Leases retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    static async getById(req:Request, res:Response, next:NextFunction){
        try {
            const id = req.params.id;
            const result = await LeaseService.getById(id);
            successResponse(res, result, "Lease retrieved successfully");
        } catch (error) {
            next(error);
        }
    }
}