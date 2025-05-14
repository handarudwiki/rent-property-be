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

    static async getLeasePayments(req:Request, res:Response, next:NextFunction){
        try {
            const result = await LeaseService.getLeasePayment(req.params.id);
            successResponse(res, result, "Lease payments retrieved successfully");
        } catch (error) {
            next(error);
        }
    }
}