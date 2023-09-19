import { FilterQuery, Model, Schema } from "mongoose";
import findOneOrCreate from "./findOneOrCreate";
import paginate, { PaginationResult } from "./pagination";

export interface CustomModel<T> extends Model<T> {
  paginate(filter: FilterQuery<T>, options: any): Promise<PaginationResult<T>>;
  findOneOrCreate(filter: FilterQuery<T>, options?: any): Promise<T>;
}

const customMethods = (schema: Schema) => {
  schema.statics.findOneOrCreate = findOneOrCreate;
  schema.statics.paginate = paginate;
};

export default customMethods;
