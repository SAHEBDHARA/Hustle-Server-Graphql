import axios from "axios";
import { prismaClient } from "../../clients/db";
import Jwtservice from "../../services/jwt";
import { GraphqlContext } from "../../interfaces";

interface GoogleUserData {
  iss?: string;
  azp?: string;
  aud?: string;
  sub?: string;
  email: string;
  email_verified: string;
  nbf?: string;
  name?: string;
  picture?: string;
  given_name: string;
  family_name: string;
  iat?: string;
  exp?: string;
  jti?: string;
  alg?: string;
  kid?: string;
  typ?: string;
}

const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    const googleToken = token;
    const googleAuthUrl = new URL("https://oauth2.googleapis.com/tokeninfo");
    googleAuthUrl.searchParams.set("id_token", googleToken);

    const { data } = await axios.get<GoogleUserData>(googleAuthUrl.toString(), {
      responseType: "json",
    });

    const user = await prismaClient.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      await prismaClient.user.create({
        data: {
          email: data.email,
          firstname: data.given_name,
          lastname: data.family_name,
          profileImage: data.picture,
        },
      });
    }
    const userIndb = await prismaClient.user.findUnique({
      where: { email: data.email },
    });
    if(!userIndb) throw new Error('This user is not found')

    const userToken = await Jwtservice.generateTokenForUser(userIndb);
    return userToken;
  },
  getCurrentUser: async (parent: any, arg: any, ctx: GraphqlContext) =>{
    const id =  ctx.user?.id;
    if(!id) return null;
    const user = await prismaClient.user.findUnique({ where: {id}})
    return user
  }
};

export const resolvers = { queries };
