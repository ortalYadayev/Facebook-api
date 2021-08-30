import { BaseEntity } from 'typeorm';
import { NonFunctionProperties } from './types';

abstract class BaseFactory<Entity extends BaseEntity> {
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
    // eslint-disable-next-line new-cap
    const entity = new this.entity();

    // eslint-disable-next-line no-param-reassign
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

export default BaseFactory;
