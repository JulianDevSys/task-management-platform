import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Organization } from "../entity/Organization.entity";
import { Repository } from "typeorm";
import { User } from "src/users/entity/User.entity";
import { CreateOrganizationDto } from "../Dtos/createOrganization.dto";
import { MembersOrganization } from "src/memberOrganization/entity/memberOrganization.entity";
import { MemberRole } from "src/memberOrganization/enum/memberRole.enum";
import { OrganizationResponseDto } from "../Dtos/response/respondeOrganization.dto";


@Injectable()
export class CreateOrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly  organizationRepo : Repository<Organization>,
    
    @InjectRepository(User)
    private readonly UserRepo: Repository<User>,

    @InjectRepository(MembersOrganization)
    private readonly memberORgnizationRepo: Repository<MembersOrganization>
  ){}


  async createOrganization(organizationData: CreateOrganizationDto): Promise<OrganizationResponseDto>{
    const existUser= await this.UserRepo.findOneBy({id: organizationData.userId})

    if(!existUser){
        throw new NotFoundException(`that user ${organizationData.userId} doesnot exist `)
    }

    const orgnizationExist= await this.organizationRepo.exists({
      where : {name: organizationData.name}
    })

    if(orgnizationExist){
      throw new ConflictException(`this name ${organizationData.name} already exist, you need put other name`)
    }


    const newOrganization =  this.organizationRepo.create({
      name: organizationData.name,
      description: organizationData.description,
      creator: existUser
    })

    const saveOrganization = await this.organizationRepo.save(newOrganization)



    const newMemberOrganization =  this.memberORgnizationRepo.create({
      userMember: existUser,
      organization: saveOrganization,
      role: MemberRole.ADMIN

    })

    await this.memberORgnizationRepo.save(newMemberOrganization);


    return {
      id: saveOrganization.id,
      name: saveOrganization.name,
      description: saveOrganization.description,
/*       creatorId: saveOrganization.creator.id, */
      creatorName: saveOrganization.creator.name,
      createdAt: saveOrganization.createdAt,
      updatedAt: saveOrganization.updatedAt

    }

  }
}