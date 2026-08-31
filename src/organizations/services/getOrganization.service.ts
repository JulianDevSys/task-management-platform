import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Organization } from "../entity/Organization.entity";
import { Repository } from "typeorm";



@Injectable()
export class GetOrganizationService{
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepo : Repository<Organization>
  ){}

  async findAllOrganization (){
    const existOrganization= await this.organizationRepo.find({
      relations: { creator: true} // asi ponemos la relacion con quien la cree
    })

    return  existOrganization.map(org=>({
      id: org.id,
      name: org.name,
      description: org.description,
      creator: org.creator.name,  
      createdAt: org.updatedAt,
      
    }))
  }
}