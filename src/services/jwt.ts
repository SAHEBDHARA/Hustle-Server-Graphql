import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

const jwtSecret = "$userbase@334"
class Jwtservice {
    public static async generateTokenForUser(user: User){
        const payload = {
            id: user?.id,
            email: user?.email
        }
        const token = jwt.sign(payload, jwtSecret)
        return token; 
    }
}

export default Jwtservice;