import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Organization } from "../entity/Organization.entity";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class DeleteOrganizationService{
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepo : Repository<Organization>
  ){}


  async deleteOrganization(id: string){
    const organization = await this.organizationRepo.findOneBy( { id });

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }
    return await this.organizationRepo.softRemove(organization);
  }
  }