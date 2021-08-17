import { EntityProperties } from "./types";

export abstract class BaseFactory<Entity>
{
  abstract definition(): EntityProperties<Entity>

  abstract create(overrideParameters?: EntityProperties<Entity>): Promise<Entity>
}
