import {BaseEntity as TypeOrmBaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

export class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'datetime'})
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime'})
  updatedAt: Date;
}
