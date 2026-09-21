import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not configured in the environment');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // toma el token del header
      ignoreExpiration: false, //  no aceptar tokens expirados
      secretOrKey: secret, //  tu clave secreta
    });
  }

  async validate(payload: any) {
    //  aquí decides qué datos del payload quieres exponer en req.user
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
