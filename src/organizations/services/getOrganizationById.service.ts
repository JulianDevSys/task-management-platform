import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Organization } from "../entity/Organization.entity";
import { Repository } from "typeorm";
import { ResponseGetOrganizationByIdDto } from "../Dtos/response/responseGetOrganizationById";



@Injectable()
export class GetOrganizationByIdService{
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepo : Repository<Organization>
  ){}

  async findOrganizationById (id: string): Promise<ResponseGetOrganizationByIdDto | null>{
    const existOrganization= await this.organizationRepo.findOne({
      where: {id},
      relations: { creator: true, Membership: {userMember: true} } // asi ponemos la relacion con quien la cree
    })

    if(!existOrganization){
      throw new NotFoundException("Organization not found");
    }

    return {
      id: existOrganization.id,
      name: existOrganization.name,
      description: existOrganization.description,
      createdAt: existOrganization.createdAt,
      updatedAt: existOrganization.updatedAt,
      creator: {
        id: existOrganization.creator.id,
        name: existOrganization.creator.name,
        email: existOrganization.creator.email
      },
      members: existOrganization.Membership.map(member => ({
        id: member.userMember.id,
        name: member.userMember.name,
        role: member.role
      })),
      membersCount: existOrganization.Membership.length
    };
  }
}