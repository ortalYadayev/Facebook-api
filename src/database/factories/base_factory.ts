import { NonFunctionProperties } from './types';
import { BaseEntity } from 'typeorm';

export abstract class BaseFactory<Entity extends BaseEntity> {
  private state: NonFunctionProperties<Entity> = {};

  protected abstract entity: { new (): Entity };

  protected abstract definition(): NonFunctionProperties<Entity>;

  protected addToState(parameters: NonFunctionProperties<Entity>): this {
    this.state = {
      ...this.state,
      ...parameters,
    };

    return this;
  }

  create(
    overrideParameters: NonFunctionProperties<Entity> = {},
  ): Promise<Entity> {
    const entity = new this.entity();

    overrideParameters = {
      ...this.definition(),
      ...this.state,
      ...overrideParameters,
    };

    Object.entries(overrideParameters).forEach(([key, value]) => {
      entity[key] = value;
    });

    return entity.save();
  }
}
