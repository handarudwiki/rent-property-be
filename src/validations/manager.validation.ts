import { z } from "zod";

export default class ManagerValidation {
    static UPDATE = z.object({
        name : z.string().min(3).max(20),
        email : z.string().email(),
        phone_number : z.string().min(10).max(15),
        password : z.string().min(8).max(20),
        old_password : z.string().min(8).max(20),
        new_password : z.string().min(8).max(20),
    })
}

export type UpdateManagerType = z.infer<typeof ManagerValidation.UPDATE>;

