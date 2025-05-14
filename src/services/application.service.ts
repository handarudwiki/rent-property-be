import { promise } from "zod";
import { role } from "../consts/role";
import NotFoundException from "../errors/notfound.exception";
import { ApplicationStatus, Prisma } from "../generated/prisma";
import { getUrl } from "../helpers/cloudinary";
import prisma from "../helpers/prisma";
import ApplicationValidation, { CreateApplicationType, GetAllApplicationType, UpdateApplicationType } from "../validations/application.validation";
import Validation from "../validations/validate";

export default class ApplicationService {
    static async create(data:CreateApplicationType){
        const validData = Validation.validate(ApplicationValidation.CREATE, data);

        const property = await prisma.property.findUnique({
            where: {
                id: validData.peroperty_id,
            },
        });
        if (!property) {
            throw new NotFoundException("Property not found");
        }


        const newApplication = await prisma.$transaction(async (tx) => {
            const lease = await tx.lease.create({
                data: {
                    startDate: new Date(),
                    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    property: {
                        connect: {
                            id: validData.peroperty_id,
                        }
                    },
                    deposit: property.securityDeposit,
                    rent: property.pricePerMonth,
                    tenant: {
                        connect: {
                            id: validData.tenant_id,   
                        }
                    },
                }
            })

            const application = await tx.apllication.create({
                data: {
                    status: validData.status,
                    applicationDate: validData.application_date,
                    name: validData.name,
                    email: validData.email,
                    phoneNumber: validData.phone_number,
                    message: validData.message,
                    leaseId: lease.id,
                    propertyId: validData.peroperty_id,
                    tenantId: validData.tenant_id,
                }
            })
            return application;
            
        }
        );

        return newApplication;
    }

    static async getAll(filter:GetAllApplicationType){

        const validFilter = Validation.validate(ApplicationValidation.GET_ALL, filter);

        let whereClause:Prisma.ApllicationWhereInput = {}

        if(validFilter.role === role.tenant && validFilter.user_id){
            whereClause = {
                tenantId: validFilter.user_id,
            }
        }else if(validFilter.role === role.manager){
            whereClause = {
                property: {
                    managerId: validFilter.user_id,
                }
            }
        }

        const applications = await prisma.apllication.findMany({
            where: whereClause,
            select: {
                id: true,
                status: true,
                applicationDate: true,
                name: true,
                email: true,
                phoneNumber: true,
                message: true,
                leaseId: true,
                propertyId: true,
                tenantId: true,
                property: {
                    select: {
                        id: true,
                        name: true,
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
                        publicsId: true,
                        amenities: true,
                        location: {
                            select: {
                                id: true,
                                city: true,
                                state: true,
                                country: true,
                                postalCode: true,
                                address: true,
                                latitude: true,
                                longitude: true,
                            }
                        },
                        manager: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phoneNumber: true,
                            }
                        }
                    }
                },
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNumber: true,
                    }
                },
            }
        });

        
        return applications.map((application) => application.property.publicsId.map((publicId) => (getUrl(publicId))));
    }

    static async update(data:UpdateApplicationType){
        const validData = Validation.validate(ApplicationValidation.UPDATE, data);

       const application = await prisma.apllication.findUnique({
            where: {
                id: validData.id,
            },
            include: {
                property: true,
                tenant: true,
            }
        });
        if (!application) {
            throw new NotFoundException("Application not found");
        }

        if(validData.status === ApplicationStatus.Approved){
            const newLease = await prisma.lease.create({
                data: {
                    startDate: new Date(),
                    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    property: {
                        connect: {
                            id: application.propertyId,
                        }
                    },
                    deposit: application.property.securityDeposit,
                    rent: application.property.pricePerMonth,
                    tenant: {
                        connect: {
                            id: application.tenantId,
                        }
                    },
                }
            })

            Promise.all([
                await prisma.property.update({
                    where: {
                        id: application.propertyId,
                    },
                    data: {
                        tenants: {
                            connect: {
                                id: application.tenantId,
                            }
                        },
                    }
                }),
    
                await prisma.apllication.update({
                    where: {
                        id: validData.id,
                    },
                    data: {
                        status: validData.status,
                        leaseId: newLease.id,
                    }
                })
            ])

        }else {
            await prisma.apllication.update({
                where: {
                    id: validData.id,
                },
                data: {
                    status: validData.status,
                }
            })
        }
    }
}