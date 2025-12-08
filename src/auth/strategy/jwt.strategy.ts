import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "../constants/constants";

@Injectable()   // Indica que é uma Classe de Serviço e pode ser inserida/injetada diretamente em outras classes
export class JwtStrategy extends PassportStrategy(Strategy) {
    // Fazemos uma herança onde JwtStrategy é a classe mãe e JwtStrategy a filha

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Indicamos que vamos extrair o token por meio do cabeçalho da requisição
            ignoreExpiration: false,            // Indica que iremos sim trabalhar com expiração de token
            secretOrKey: jwtConstants.secret,   // Chamamos nossa chave padrão para ser a base de criptografia
        });
    }

    // Criamos esse método puramente para seguir o padrão pré-definido pela PassportStrategy, 
    // mas se fosse necessário poderiamos personalizar
    async validate(payload: any) {
        return payload;
    }
}