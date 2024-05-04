import { LoginDTO, RegisterDTO } from "../common/protocols/authentication.types";
import { CustomError, ErrorType } from "../common/protocols/error.types";
import { AuthenticationRepository } from "../common/repositories/bankAccount.repository";


const Repository = new AuthenticationRepository();

async function signIn(data: LoginDTO) {
    const result = await Repository.getUserByCPF(data.cpf);
    if (!result) {
        throw new CustomError(ErrorType.NOT_FOUND, "Usuário não existe");
    }

    if (result.cpf == data.cpf && result.password == data.password) {
        const result = await Repository.signIn(data);
        return result;
    }

    throw new CustomError(ErrorType.UNAUTHORIZED, "Senha ou Cpf incorretas");
};

async function signUp(data: RegisterDTO) {
    const userHasAccount = await Repository.getUserByCPF(data.cpf);
    if (userHasAccount) {
        throw new CustomError(ErrorType.CONFLICT, "Usuário ja cadastrado");
    }
    const result = await Repository.signUp(data);
    return result;

};

const AuthenticationService = {
    signIn,
    signUp
};

export default AuthenticationService;