import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import {User} from "@/entities/user.entity";

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: String, nullable: false})
  title: String;

  @Column({type: String, nullable: false})
  content: String;

  @Column({type: String, nullable: false})
  category: String;

  @ManyToOne(() => User, {
    nullable: false,
  })
  creator?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}