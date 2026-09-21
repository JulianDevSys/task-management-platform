import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener roles requeridos desde el decorador @Roles
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // si no hay roles definidos, pasa libre
    }

    // 2. Obtener usuario del request (ya validado por AuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 3. Validar si el rol del usuario está en los roles requeridos
    return requiredRoles.includes(user.role);
  }
}
