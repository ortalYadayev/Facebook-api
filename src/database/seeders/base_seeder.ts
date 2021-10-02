export interface BaseSeeder {
  execute(): Promise<void>;
}
