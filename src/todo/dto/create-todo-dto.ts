import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateTodoDto{

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    user: number;
}