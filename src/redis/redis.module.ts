import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

//hace que no tengas que importar RedisModule manualmente en cada módulo que quiera utilizar Redis.
@Global()
@Module({
  //Le dice a Nest: edisService es un proveedor que Nest debe administrar.permite que otros módulos puedan utilizar RedisService.
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}