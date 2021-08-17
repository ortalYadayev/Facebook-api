export type EntityProperties<Entity> = {
  [Property in keyof Entity]?: Entity[Property]
}
