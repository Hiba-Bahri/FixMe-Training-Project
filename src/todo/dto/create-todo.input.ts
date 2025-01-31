import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsNumber } from "class-validator";

@InputType()
export class CreateTodoInput{

    @Field()
    @IsNotEmpty()
    @IsString()
    description: string;

    @Field()
    @IsNotEmpty()
    @IsNumber()
    user: number;
}