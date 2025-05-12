import NotFoundException from "../errors/notfound.exception";
import { Prisma } from "../generated/prisma";
import { getUrl, upload } from "../helpers/cloudinary";
import mapPublicIdsToUrls from "../helpers/mapperPublicId";
import prisma from "../helpers/prisma";
import PropertyValidation, { CreatePropertyType, FilterPropertyType } from "../validations/property.validation";
import Validation from "../validations/validate";

export default class PropertyService {
  static async create(data: CreatePropertyType){
    const validData = Validation.validate(PropertyValidation.CREATE, data);

    const location = await prisma.location.create({
        data: {
            city: validData.city,
            state: validData.state,
            country: validData.country,
            postalCode: validData.postal_code,
            address: validData.address,
            latitude: validData.latitude,
            longitude: validData.longitude,
        }
    })

    const publicIds = await Promise.all(
        validData.paths.map(async (path) => await upload(path) )
    )
    return await prisma.property.create({
        data: {
            name: validData.name,
            description: validData.description,
            pricePerMonth: validData.price_per_month,
            securityDeposit: validData.security_deposit,
            applicationFee: validData.application_fee,
            isPetsAllowed: validData.is_pets_allowed,
            isParkingIncluded: validData.is_parking_included,
            beds: validData.beds,
            baths: validData.baths,
            squareFeet: validData.square_feet,
            managerId: validData.manager_id,
            amenities: validData.amenities,
            highlights: validData.highlights,
            propertyType: validData.property_type,
            locationId: location.id,
            publicsId: publicIds,
        }
    })
  }

  static async getById(id: string) {
    const property = await prisma.property.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        amenities: true,
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
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException("Property not found");
    }

    return property.publicsId.map((id: string) => {
      return  getUrl(id);
    });
  }

  static async getAll(filter: FilterPropertyType) {
    const validFilter = Validation.validate(PropertyValidation.FILTER, filter);

    let whereConditions: Prisma.PropertyWhereInput 

    if(validFilter.favorite_ids) {
      whereConditions = {
        id: {
          in: validFilter.favorite_ids,
        }
      }
    }

    if(validFilter.price_min){
        whereConditions = {
            ...whereConditions,
            pricePerMonth: {
              gte: validFilter.price_min,
            }
        }
    }

    if(validFilter.price_max){
        whereConditions = {
            ...whereConditions,
            pricePerMonth: {
              lte: validFilter.price_max,
            }
        }
    }

    if(validFilter.beds){
        whereConditions = {
            ...whereConditions,
            beds: validFilter.beds,
        }
    }

    if(validFilter.baths){
        whereConditions = {
            ...whereConditions,
            baths: validFilter.baths,
        }
    }
    if(validFilter.property_type){
        whereConditions = {
            ...whereConditions,
            propertyType: validFilter.property_type,
        }
    }
    if(validFilter.amenities){
        whereConditions = {
            ...whereConditions,
            amenities: {
                hasSome: validFilter.amenities,
            }
        }
    }
    if(validFilter.square_feet_min){
        whereConditions = {
            ...whereConditions,
            squareFeet: {
                gte: validFilter.square_feet_min,
            }
        }
    }
    if(validFilter.square_feet_max){
        whereConditions = {
            ...whereConditions,
            squareFeet: {
                lte: validFilter.square_feet_max,
            }
        }
    }
    if(validFilter.availableFrom){
        whereConditions = {
            ...whereConditions,
            leases:{
                some: {
                    startDate: {
                        gte: validFilter.availableFrom,
                    }
                }
            }
        }
    }

    if(validFilter.latitude && validFilter.longitude){
        whereConditions = {
            ...whereConditions,
            location: {
                latitude: validFilter.latitude,
                longitude: validFilter.longitude
            }
        }
    }

    const properties = await prisma.property.findMany({
      where: whereConditions,
      select: {
        id: true,
        name: true,
        amenities: true,
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
          },
        },
      },
    });

    const mappedProperties = mapPublicIdsToUrls(properties);

    return mappedProperties;
  }
}