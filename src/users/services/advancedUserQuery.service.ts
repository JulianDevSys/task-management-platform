import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/User.entity";
import { Repository } from "typeorm";
import { Organization } from "src/organizations/entity/Organization.entity";
import { UserTasksFiltersDto } from "src/task/dtos/userTasksFilters.dto";

@Injectable()
export class AdvancedUserQueryService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
  ) {}

  async advancedUserQuery(
    organizationId: string,
    userTaskFilterDto: UserTasksFiltersDto,
  ) {
    const {
      createdFrom,
      createdTo,
      limit,
      offset,
      orderBy,
      orderDirection,
      priority,
      status,
    } = userTaskFilterDto;

    const organization = await this.organizationRepo.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }

    const qb = this.userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.memberShip", "membership")
      .leftJoinAndSelect("membership.taskAssigned", "tasks")
      .where("membership.organizationId = :organizationId", { organizationId });


    if (status) {
      qb.andWhere("tasks.status = :status", { status });
    }

    if (priority) {
      qb.andWhere("tasks.priority = :priority", { priority });
    }

    if (createdFrom && createdTo) {
      // Limita las tareas a las que fueron creadas entre dos fechas específicas
      qb.andWhere("tasks.createdAt BETWEEN :from AND :to", {
        from: createdFrom,
        to: createdTo,
      });
    }

    if (orderBy) {
      // Ordena dinámicamente por la columna indicada
      qb.orderBy(`tasks.${orderBy}`, orderDirection || "DESC");
    } else {
      // Ordena por fecha de creación descendente por defecto
      qb.orderBy("tasks.createdAt", "DESC");
    }

    // Controla cuántos resultados devuelve y desde dónde empieza
    qb.take(limit || 20);
    qb.skip(offset || 0);

    // 4️⃣ Ejecutar consulta
    const users = await qb.getMany();

    if (!users || users.length === 0) {
      throw new NotFoundException("No users with tasks found");
    }

    // 5️⃣ Mapear respuesta limpia
    return users.map((user) => ({
      userId: user.id,
      userName: user.name,
      tasks: user.memberShip.flatMap((membership) =>
        membership.taskAssigned.map((task) => ({
          taskId: task.id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          createdAt: task.createdAt,
        })),
      ),
    }));
  }
}
