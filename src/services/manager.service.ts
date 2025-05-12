import NotFoundException from "../errors/notfound.exception";
import prisma from "../helpers/prisma";
import ManagerValidation, { UpdateManagerType } from "../validations/manager.validation";
import Validation from "../validations/validate";

export default class ManagerService {
    static async getManagerById(id: string) {
        const manager = await prisma.manager.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
            },
        });

        if (!manager) {
            throw new NotFoundException("Manager not found");
        }

        return manager;
    }

    static async upadte(id: string, data: UpdateManagerType) {
        const validData = Validation.validate(ManagerValidation.UPDATE, data);

        const manager = await prisma.manager.findUnique({
            where: {
                id,
                password: validData.old_password,
            },
        });

        if (!manager) {
            throw new NotFoundException("Old password is incorrect");
        }

        const [isEmailExist, isPhoneExist] = await Promise.all([
            prisma.manager.findUnique({
                where: {
                    email: data.email,
                },
            }),
            prisma.manager.findUnique({
                where: {
                    phoneNumber: data.phone_number,
                },
            }),
        ])

        if (isEmailExist && isEmailExist.id !== id) {
            throw new NotFoundException("Email already exists");
        }

        if (isPhoneExist && isPhoneExist.id !== id) {
            throw new NotFoundException("Phone number already exists");
        }

        const updatedManager = await prisma.manager.update({
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

        return updatedManager;
    }

    static async getManagerProperties(managerId: string) {
        const properties = await prisma.property.findMany({
            where: {
                id : managerId,
            },
            select: {
                id: true,
                name: true,
                amenities: true,
                location: true,
                pricePerMonth: true,
                description: true,
                propertyType: true,
                baths: true,
                beds: true,
                applicationFee: true,
                averageRating: true,
                highlights: true,
                squareFeet: true,
                securityDeposit: true,
                photoUrls: true,

            },
        });

        if (!properties) {
            throw new NotFoundException("No properties found for this manager");
        }

        return properties;
    }
}