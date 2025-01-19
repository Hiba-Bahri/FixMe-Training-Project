import { Todo } from "src/todo/entities/Todo";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 255})
    name: string;

    @Column()
    email: string;

    @OneToMany(() => Todo, todo => todo.user)
    todos: Todo[];
}