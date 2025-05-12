import { application } from "express";
import { z } from "zod";
import { Amenity, Highlight, PropertyType } from "../generated/prisma";

export default class PropertyValidation {
    static CREATE = z.object({
        name : z.string().min(3).max(50),
        description : z.string().min(10).max(500),
        price_per_month : z.number().min(0),
        security_deposit : z.number().min(0),
        application_fee : z.number().min(0),
        is_pets_allowed : z.boolean(),
        is_parking_included : z.boolean(),
        beds : z.number().min(1),
        baths : z.number().min(1),
        square_feet : z.number().min(1),
        manager_id : z.string().uuid(),
        amenities : z.array(z.nativeEnum(Amenity)),
        highlights : z.array(z.nativeEnum(Highlight)),
        property_type : z.nativeEnum(PropertyType),
        address : z.string().min(10).max(100),
        paths : z.array(z.string().min(10).max(100)),
        city : z.string().min(3).max(50),
        state : z.string().min(2).max(50),
        country : z.string().min(3).max(50),
        postal_code : z.string().min(5).max(10),
        manager_uuid : z.string().uuid(),
        latitude : z.number().min(-90).max(90),
        longitude : z.number().min(-180).max(180),
    })

    static FILTER = z.object({
        favorite_ids : z.array(z.string().uuid()).optional(),
        price_min : z.number().min(0).optional(),
        price_max : z.number().min(0).optional(),
        beds : z.number().min(1).optional(),
        baths : z.number().min(1).optional(),
        property_type : z.nativeEnum(PropertyType).optional(),
        amenities : z.array(z.nativeEnum(Amenity)).optional(),
        square_feet_min : z.number().min(1).optional(),
        square_feet_max : z.number().min(1).optional(),
        availableFrom : z.date().optional(),
        latitude : z.number().min(-90).max(90).optional(),
        longitude : z.number().min(-180).max(180).optional(),
    })
}

export type CreatePropertyType = z.infer<typeof PropertyValidation.CREATE>;
export type FilterPropertyType = z.infer<typeof PropertyValidation.FILTER>;