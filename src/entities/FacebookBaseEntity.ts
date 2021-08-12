import {BaseEntity, CreateDateColumn, UpdateDateColumn} from "typeorm";

export class FacebookBaseEntity extends BaseEntity {
  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
