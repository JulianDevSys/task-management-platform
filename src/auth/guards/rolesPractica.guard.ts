import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
// decidir si una petición puede continuar o no antes de llegar al controlador
export class RolesGuardPractica implements CanActivate {
  constructor(private reflector: Reflector) {}
  // con el reflector es general significa puede acceder vatios('admin, 'member)
  // sin el podemos colocar en el cual solo el admin puede acceder

  canActivate(context: ExecutionContext): boolean {
    // decidimos si la peticion pasa o no true o false
    const requiredRoles= 
    //this.reflector.get<string[]> --> lee la metada que henos guardado en decoradores, luego colocamos
    // roles que es lo que colocamos entre comillas en el decorador es como la clave para que acceda debe ser la misma
    //el gethandler y traeme el decorador que tenga esa clave
    this.reflector.get<string[]>('roles',context.getHandler())
    //Si el endpoint no tiene decorador @Roles, no hay roles definidos.entonces pasa es true
    if (!requiredRoles) return true;

    // 2. Obtenemos el usuario de la request
    const request = context.switchToHttp().getRequest();
    //se h
    const user = request.user

    const hasRole = requiredRoles.some((roles)=> user.roles?.includes(roles))
      if (!hasRole) throw new ForbiddenException('No tienes permisos');

      return true
  }
}
/* 
@Injectable()
export class RolesGuardSinReflector implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.roles?.includes('admin')) {
      return true; // solo admin pasa
    }
    throw new ForbiddenException('No tienes permisos');
  }
}

*/