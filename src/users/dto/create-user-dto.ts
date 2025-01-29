import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";

@InputType()
export class CreateUserDto{

    @Field()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}