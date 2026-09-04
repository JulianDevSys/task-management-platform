import { Injectable } from "@nestjs/common";
import { MembersOrganization } from "../entity/memberOrganization.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class CreateMemberService{
  constructor(
    @InjectRepository(MembersOrganization)
    private readonly memberRepository: Repository<MembersOrganization>
  ){}
}