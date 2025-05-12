import NotFoundException from "../errors/notfound.exception";
import prisma from "../helpers/prisma";
import TenantValidation, { AddFavoriteTenantType, UpdateTenantType } from "../validations/tenant.validation";
import Validation from "../validations/validate";

export default class TenantService {
    static async getTenantById(id: string) {
        const tenant = await prisma.tenant.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                favorites:{
                    select:{
                        id:true,
                        name:true,
                    }
                }
                    
            }
        });

        if (!tenant) {
            throw new NotFoundException("Tenant not found");
        }

        return tenant;
    }

    static async update(id :string, data:UpdateTenantType){

        const validData = Validation.validate(TenantValidation.UPDATE, data);

        const tenant = await prisma.tenant.findUnique({
            where: {
                id,
                password: validData.old_password,
            },
        });

        if (!tenant) {
            throw new NotFoundException("Old password is incorrect");
        }

        const [isEmailExist, isPhoneExist] = await Promise.all([
            prisma.tenant.findUnique({
                where: {
                    email: data.email,
                },
            }),
            prisma.tenant.findUnique({
                where: {
                    phoneNumber: data.phone_number,
                },
            }),
        ]);
        if (isEmailExist && isEmailExist.id !== id) {
            throw new NotFoundException("Email already exists");
        }
        if (isPhoneExist && isPhoneExist.id !== id) {
            throw new NotFoundException("Phone number already exists");
        }

        return await prisma.tenant.update({
            where: {
                id,
            },
            data: {
                name: data.name,
                email: data.email,
                phoneNumber: data.phone_number,
                password: data.new_password,
            },
        });
    }

    static async addfavoriteProperty(data: AddFavoriteTenantType) {

        const validData = Validation.validate(TenantValidation.ADD_FAVORITE_TENANT, data);

        const [tenant, property] = await Promise.all([
            prisma.tenant.findUnique({
                where: {
                    id: data.user_id,
                },
                include: {
                    favorites: true
                }
            }),
            prisma.property.findUnique({
                where: {
                    id: data.property_id,
                },
            }),
        ]);
        if (!tenant) {
            throw new NotFoundException("Tenant not found");
        }
        if (!property) {
            throw new NotFoundException("Property not found");
        }

        const existiingFavorites = tenant.favorites || [];

        if (existiingFavorites.some((favorite) => favorite.id === property.id)) {
            throw new NotFoundException("Property already in favorites");
        }

        return await prisma.tenant.update({
            where: {
                id: data.user_id,
            },
            data: {
                favorites: {
                    connect: {
                        id: property.id,
                    },
                },
            },
        });
    }

    static async removefavoriteProperty(data: AddFavoriteTenantType) {
        const validData = Validation.validate(TenantValidation.REMOVE_FAVORITE_TENANT, data);

        const [tenant, property] = await Promise.all([
            prisma.tenant.findUnique({
                where: {
                    id: data.user_id,
                },
            }),
            prisma.property.findUnique({
                where: {
                    id: data.property_id,
                },
            }),
        ]);
        if (!tenant) {
            throw new NotFoundException("Tenant not found");
        }
        if (!property) {
            throw new NotFoundException("Property not found");
        }

        return await prisma.tenant.update({
            where: {
                id: data.user_id,
            },
            data: {
                favorites: {
                    disconnect: {
                        id: property.id,
                    },
                },
            },
        });
    }

    static async getCurrentResidents(userId: string) {
        const properties = await prisma.property.findMany({
            where:{
                tenants:{
                    some:{
                        id: userId
                    }
                }
            },
            select:{
                id:true,
                name:true,
               location:{
                    select:{
                        id:true,
                        address:true,
                        city:true,
                        state:true,
                        country:true,
                        latitude:true,
                        longitude:true,
                    }
                },
               }
            }
        );

        if (!properties) {
            throw new NotFoundException("No properties found");
        }

        return properties;
    }

}

