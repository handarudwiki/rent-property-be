import { z } from "zod";
import { ApplicationStatus } from "../generated/prisma";
import { application } from "express";
import { lisrRoles } from "../consts/role";

export default class ApplicationValidation {
    static CREATE = z.object({
        tenant_id : z.string().uuid(),
        peroperty_id : z.string().uuid(),
        status : z.nativeEnum(ApplicationStatus),
        application_date : z.date(),
        name : z.string().min(3).max(20),
        email : z.string().email(),
        phone_number : z.string().min(10).max(15),
        message : z.string().min(10).max(500).optional(),
    })

    static UPDATE = z.object({
        status : z.nativeEnum(ApplicationStatus),
        id : z.string().uuid(),
    })

    static GET_ALL = z.object({
        user_id : z.string().uuid(),
        role : z.enum(lisrRoles).optional(),
    })
}

export type CreateApplicationType = z.infer<typeof ApplicationValidation.CREATE>;
export type GetAllApplicationType = z.infer<typeof ApplicationValidation.GET_ALL>;
export type UpdateApplicationType = z.infer<typeof ApplicationValidation.UPDATE>;