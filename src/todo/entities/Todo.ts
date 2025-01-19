import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Todo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 255})
    description: string;

    @Column({type: 'boolean', default: false})
    done: boolean;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    timestamp: Date;

    @Column()
    user: number;
}