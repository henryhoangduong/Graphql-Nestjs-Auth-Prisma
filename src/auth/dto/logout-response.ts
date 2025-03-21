import { ObjectType, Field } from '@nestjs/graphql';
@ObjectType()
export class LogOutResponse {
  @Field()
  loggedOut: boolean;
}
