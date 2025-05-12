import { getUrl } from "./cloudinary";

export default function mapPublicIdsToUrls(properties: any[]) {
    return properties.map((property) => ({
      ...property,
      images: property.publicsId.map((id: string) => getUrl(id)),
    }));
  }
  