import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";

@InputType()
export class CreateUserInput{

    @Field()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    password: string;

    @Field({ nullable: true })
    @IsString()
    role: 'admin' | 'user' = 'user'; 
}