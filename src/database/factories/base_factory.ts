import { NonFunctionProperties } from "./types";
import { BaseEntity } from "typeorm";

export abstract class BaseFactory<Entity extends BaseEntity>
{
  private state: NonFunctionProperties<Entity> = {};

  protected abstract entity(): Entity

  protected addToState(parameters: NonFunctionProperties<Entity>): this
  {
    this.state = {
      ...this.state,
      ...parameters,
    }

    return this;
  }

  create(overrideParameters: NonFunctionProperties<Entity> = {}): Promise<Entity>
  {
    const entity = this.entity();

    overrideParameters = {
      ...this.state,
      ...overrideParameters
    };

    for (const key in overrideParameters) {
      entity[key] = overrideParameters[key];
    }

    return entity.save();
  }
}
