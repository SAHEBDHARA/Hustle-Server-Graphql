import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JwtUser } from "../interfaces";

const jwtSecret = "$userbase@334"
class Jwtservice {
    public static async generateTokenForUser(user: User){
        const payload: JwtUser = {
            id: user?.id,
            email: user?.email
        }
        const token = jwt.sign(payload, jwtSecret)
        return token; 
    }
    public static async decondeToken(token: string){
        try {
        return jwt.verify(token, jwtSecret) as JwtUser;
        } catch (error) {
            return null
        }
    }
}

export default Jwtservice;