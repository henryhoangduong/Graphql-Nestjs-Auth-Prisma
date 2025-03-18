import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
@ObjectType()
export class SignRespone {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}
