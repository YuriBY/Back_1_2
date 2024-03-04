import { AuthBodyType } from "../models/authType";
import { UserDBType } from "../models/usersType";
import { usersQueryRepository } from "../repositories/usersQueryRepository";
import { bcryprService } from "./bcrypt-service";

export const authService = {
  async checkCredential(receivedCredential: AuthBodyType): Promise<boolean> {
    const { loginOrEmail, password } = receivedCredential;
    const user : UserDBType | null = await usersQueryRepository.getByLoginOrEmail(loginOrEmail);
    if(!user) return false;
    const checkPass = await bcryprService.checkPassword(password, user.hash);
    console.log(checkPass);
    
    if (!checkPass) return false;
    return true    
  },
};
