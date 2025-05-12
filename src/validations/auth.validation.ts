import { z } from "zod";
import { lisrRoles } from "../consts/role";

export default class AuthValidation{
    static SIGNUP = z.object({
        email: z.string().email(),
        password: z.string().min(8).max(20),
        name: z.string().min(3).max(20),
        phone_number: z.string().min(10).max(15),
        role : z.enum(lisrRoles),
    })

    static LOGIN = z.object({
        email: z.string().email(),
        password: z.string().min(8).max(20),
    })
}

export type SignupType = z.infer<typeof AuthValidation.SIGNUP>;
export type LoginType = z.infer<typeof AuthValidation.LOGIN>;