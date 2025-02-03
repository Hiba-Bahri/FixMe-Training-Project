import { Todo } from '../../todo/entities/Todo';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 255})
    name: string;

    @Column()
    email: string;

    @Column({type: 'varchar', length: 255})
    password: string;

    @Column({type: 'varchar', length: 10})
    role: string;

    @OneToMany(() => Todo, todo => todo.user)
    todos: Todo[];
}