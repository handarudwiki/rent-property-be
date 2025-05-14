import { NextFunction, Request, Response } from "express";
import successResponse from "../helpers/success_response";
import PropertyService from "../services/property.service";
import { CreatePropertyType, FilterPropertyType } from "../validations/property.validation";

export default class PropertyController{
    static async findAll (req:Request, res:Response, next:NextFunction){
        try {
            const filter:FilterPropertyType = req.query ;
            const result = await PropertyService.getAll(filter);
            successResponse(res, result, "Properties retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    static async findById (req:Request, res:Response, next:NextFunction){
        try {
            const id = req.params.id;
            const result = await PropertyService.getById(id);
            successResponse(res, result, "Property retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    static async create (req:Request, res:Response, next:NextFunction){
        try {
            const data:CreatePropertyType = req.body;
            const files = req.files as Express.Multer.File[];
            data.paths = files.map((file: Express.Multer.File) => file.path);
            const result = await PropertyService.create(req.body);
            successResponse(res, result, "Property created successfully");
        } catch (error) {
            next(error);
        }
    }
}