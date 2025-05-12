import { NextFunction, Request, Response } from "express";
import TenantService from "../services/tenant.service";
import successResponse from "../helpers/success_response";
import { AddFavoriteTenantType, RemoveFavoriteTenantType } from "../validations/tenant.validation";

export default class TenantController {
    static async getTenantById(req:Request, res:Response, next:NextFunction) {
       try {
        const result = await TenantService.getTenantById(req.user.id);
         successResponse(res, result, "Tenant retrieved successfully");
       } catch (error) {
         next(error);
       }
    }

    static async updateTenant(req:Request, res:Response, next:NextFunction) {
        try {
            const result = await TenantService.update(req.user.id, req.body);
             successResponse(res, result, "Tenant updated successfully");
        } catch (error) {
        next(error);
        }
    }

    static async addFavoriteProperty(req:Request, res:Response, next:NextFunction) {
        try {
            const data:AddFavoriteTenantType = {
                property_id: req.body.property_id,
                user_id: req.user.id,
            }
            const result = await TenantService.addfavoriteProperty(data);
             successResponse(res, result, "Tenant added to favorites successfully");
        } catch (error) {
            next(error);
        }
    }

    static async removeFavoriteProperty(req:Request, res:Response, next:NextFunction) {
        try {
            const data:RemoveFavoriteTenantType = {
                property_id: req.body.property_id,
                user_id: req.user.id,
            }
            const result = await TenantService.removefavoriteProperty(data);
            successResponse(res, result, "Tenant removed from favorites successfully");
        } catch (error) {
            next(error);
        }
    }

    static async getCurrentResidence(req:Request, res:Response, next:NextFunction) {
        try {
            const result = await TenantService.getCurrentResidents(req.user.id);
            successResponse(res, result, "Tenant current residence retrieved successfully");
        } catch (error) {
            next(error);
        }
    }
}