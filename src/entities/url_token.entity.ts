import { Column, Entity, ManyToOne } from 'typeorm';
import { v4 as uuid4 } from 'uuid';
import BaseEntity from './BaseEntity';
import { User } from './user.entity';
import UrlTokenFactory from '../database/factories/url_token.factory';

export enum UrlTokenEnum {
  EMAIL_VERIFICATION = 'email_verification',
}

@Entity('url_tokens')
export class UrlToken extends BaseEntity {
  @Column({
    type: 'simple-enum',
    enum: UrlTokenEnum,
  })
  type!: UrlTokenEnum;

  @Column({ unique: true })
  token!: string;

  @Column({ type: 'datetime', nullable: true })
  expireAt!: Date | null;

  @ManyToOne(() => User, (user) => user.urlTokens)
  user!: User;

  static generateRandomToken(): string {
    return uuid4();
  }

  static factory(): UrlTokenFactory {
    return new UrlTokenFactory();
  }
}
