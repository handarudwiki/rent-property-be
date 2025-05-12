import { z } from "zod";

export default class TenantValidation {
    static ADD_FAVORITE_TENANT = z.object({
        property_id: z.string().uuid(),
        user_id: z.string().uuid(),
    })

    static REMOVE_FAVORITE_TENANT = z.object({
        property_id: z.string().uuid(),
        user_id: z.string().uuid(),
    })
    
    static UPDATE = z.object({
        id: z.string().uuid(),
        name: z.string().min(3).max(20),
        email: z.string().email(),
        phone_number: z.string().min(10).max(15),
        password: z.string().min(8).max(20),
        old_password: z.string().min(8).max(20),
        new_password: z.string().min(8).max(20),
    })
}

export type AddFavoriteTenantType = z.infer<typeof TenantValidation.ADD_FAVORITE_TENANT>;
export type RemoveFavoriteTenantType = z.infer<typeof TenantValidation.REMOVE_FAVORITE_TENANT>;
export type UpdateTenantType = z.infer<typeof TenantValidation.UPDATE>;
