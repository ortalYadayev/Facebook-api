import { BaseEntity } from 'typeorm';
import { NonFunctionProperties } from './types';

abstract class BaseFactory<Entity extends BaseEntity> {
  private state: NonFunctionProperties<Entity> = {};

  protected abstract Entity: { new (): Entity };

  protected abstract definition(): NonFunctionProperties<Entity>;

  protected addToState(parameters: NonFunctionProperties<Entity>): this {
    this.state = {
      ...this.state,
      ...parameters,
    };

    return this;
  }

  protected beforeCreate(
    parameters: NonFunctionProperties<Entity>,
  ): NonFunctionProperties<Entity> {
    return parameters;
  }

  create(
    overrideParameters: NonFunctionProperties<Entity> = {},
  ): Promise<Entity> {
    const entity = new this.Entity();

    overrideParameters = this.beforeCreate({
      ...this.definition(),
      ...this.state,
      ...overrideParameters,
    });

    Object.entries(overrideParameters).forEach(([key, value]) => {
      entity[key] = value;
    });

    return entity.save();
  }
}

export default BaseFactory;
