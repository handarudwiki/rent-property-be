import prisma from "../helpers/prisma";

export default class LeaseService{
    static async getAll(){
        const leases = await prisma.lease.findMany({
            select: {
                startDate: true,
                endDate: true,
                deposit: true,
                rent: true,
                property: {
                    select: {
                        id: true,
                        name: true,
                        amenities  : true,
                        description: true,
                        pricePerMonth: true,
                        securityDeposit: true,
                        publicsId: true,
                        baths: true,
                        beds: true,
                        averageRating: true,
                        propertyType: true,
                        squareFeet: true,
                        highlights: true,
                        applicationFee: true,
                        location: {
                            select: {
                                city: true,
                                state: true,
                                country: true,
                                address: true,
                                postalCode: true,
                                latitude: true,
                                longitude: true,
                            }
                        },
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
        })

        return leases;
    }

    static async getLeasePayment(id:string){
        const payments = await prisma.payment.findMany({
            where: {
                leaseId: id,
            },
            select: {
                id: true,
                paymentDate: true,
                amountDue: true,
                amountPaid: true,
                paymentStatus: true,
            }
        })
        return payments;
    }
}