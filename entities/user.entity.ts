import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import {Exclude} from 'class-transformer';
import * as argon2 from "argon2";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: String, nullable: false})
  fullName: string;

  @Column({type: String, unique: true, nullable: false})
  username: string;

  @Column({type: String, unique: true, nullable: false})
  email: string;

  @Column({nullable: false})
  @Exclude({toPlainOnly: true})
  password: string;

  @Exclude({toPlainOnly: true})
  public previousPassword: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      this.password = await argon2.hash(this.password);
    }
  }

  @Column({type: Date, nullable: true})
  birthday: Date;

  @Column({type: Date, nullable: true})
  lastLoginDate: Date;

  @Column({type: String, nullable: true})
  ipAddress: String;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}