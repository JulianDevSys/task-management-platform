import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { MembersOrganization } from '../entity/memberOrganization.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMemberDto } from '../dto/createMember.dto';
import { Organization } from 'src/organizations/entity/Organization.entity';
import { User } from 'src/users/entity/User.entity';
import { UserRole } from 'src/users/enums/user-role.enum';
import { MemberRole } from '../enum/memberRole.enum';

@Injectable()
export class CreateMemberService {
  constructor(
    @InjectRepository(MembersOrganization)
    private readonly memberRepository: Repository<MembersOrganization>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<Organization>
  ) {}

  async createMember(idUser: string, createMemberDto: CreateMemberDto){
    const organization = await this.organizationRepository.findOneBy({
      id: createMemberDto.organizationId,
    });

    if (!organization) {
      throw new NotFoundException('that organization not found');
    }

    const userMember = await this.userRepository.findOne({where:{id:createMemberDto.userMemberId}})
    if(!userMember){
      throw new NotFoundException("Dont exist the user")
    }

    const verifyAmdin= await this.userRepository.findOne({where:{id: idUser}});
    if(!verifyAmdin){
      throw new NotFoundException("Dont Exist who try add the new member")
    }

    const member= await this.memberRepository.findOne(
      { where:
        { userMember: {id:idUser},
        organization:{id:createMemberDto.organizationId},
        role: MemberRole.ADMIN
     }})
     if(!member){
      throw new NotFoundException("that user, dont have any organization or not is a admin")
     }

     const createMember =  this.memberRepository.create({
        organization,
        role:createMemberDto.role? createMemberDto.role : MemberRole.MEMBER,
        userMember
         
     })
   return  await this.memberRepository.save(createMember);

      
     

  }
}
