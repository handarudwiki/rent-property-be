import { role } from "../consts/role";
import ConflictException from "../errors/conflict.exception";
import UnauthorizedException from "../errors/unauthorized_exception";
import { generateToken } from "../helpers/jwt";
import prisma from "../helpers/prisma";
import AuthValidation, { SignupType } from "../validations/auth.validation";
import Validation from "../validations/validate";
import {hash} from "bcryptjs";

export default class AuthService {
    static async signUp (data:SignupType){
        const validData = Validation.validate(AuthValidation.SIGNUP, data);

       if (validData.role == role.manager) {
            const [isEmailExist, isPhoneExist] = await Promise.all([
                prisma.manager.findUnique({
                    where: {
                        email: validData.email,
                    },
                }),
                prisma.manager.findUnique({
                    where: {
                        phoneNumber: validData.phone_number,
                    },
                }),
            ]);

            if (isEmailExist) {
                throw new ConflictException("Email already exists");
            }

            if (isPhoneExist) {
                throw new ConflictException("Phone number already exists");
            }

            const hashedPassword = await hash(validData.password, 10);

         return await prisma.manager.create({
                data: {
                    email: validData.email,
                    password: hashedPassword,
                    name: validData.name,
                    phoneNumber: validData.phone_number,
                },
            });


        }else if (validData.role == role.tenant) {
            const [isEmailExist, isPhoneExist] = await Promise.all([
                prisma.tenant.findUnique({
                    where: {
                        email: validData.email,
                    },
                }),
                prisma.tenant.findUnique({
                    where: {
                        phoneNumber: validData.phone_number,
                    },
                }),
            ]);

            if (isEmailExist) {
                throw new ConflictException("Email already exists");
            }

            if (isPhoneExist) {
                throw new ConflictException("Phone number already exists");
            }

            const hashedPassword = await hash(validData.password, 10);

            return await prisma.tenant.create({
                data: {
                    email: validData.email,
                    password: hashedPassword,
                    name: validData.name,
                    phoneNumber: validData.phone_number,
                },
            });
        }
    }

    static async signIn (data:SignupType){
        const validData = Validation.validate(AuthValidation.LOGIN, data);

        let loggedInUser
        if (validData.role == role.manager) {
             loggedInUser = await prisma.manager.findUnique({
                where: {
                    email: validData.email,
                },
            });

            if (!loggedInUser) {
                throw new UnauthorizedException("Email or password is incorrect");
            }

            return generateToken(loggedInUser.id, role.manager);

        }else if (validData.role == role.tenant) {
             loggedInUser = await prisma.tenant.findUnique({
                where: {
                    email: validData.email,
                },
            });

            if (!loggedInUser) {
                throw new UnauthorizedException("Email or password is incorrect");
            }

            return generateToken(loggedInUser.id,role.tenant);
        }

    }
}