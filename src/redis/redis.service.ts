import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;

  constructor() {
    //estamos creando un cliente Redis de ioredis.
    this.redis = new Redis({
      //A qué servidor Redis debe conectarse mi aplicación?
      host: process.env.REDIS_HOST ?? 'redis',
      port: Number(process.env.REDIS_PORT ?? 6379),
    });
  }

  //Guardar un valor en Redis.
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl !== undefined) {
      await this.redis.set(key, value, 'EX', ttl);
      return;
    }

    await this.redis.set(key, value);
  }

  //Guardar un valor en Redis.
  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  //sirve para eliminar manualmente una clave.
  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  //Cuando NestJS vaya a apagarse, cierra correctamente la conexión con Redis
  async onModuleDestroy(): Promise<void> {
    await this.redis.quit();
  }
}
