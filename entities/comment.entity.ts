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
import {Blog} from "@/entities/blog.entity";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: String, nullable: false})
  content: String;

  @ManyToOne(() => User, {
    nullable: false,
  })
  creator?: User;

  @ManyToOne(() => Blog, {
    nullable: false,
  })
  blog?: Blog;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}