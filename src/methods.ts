import { Model, Schema } from "mongoose";
import findOneOrCreate from "./findOneOrCreate";
import paginate from "./pagination";
import { deleteById, deleteManyById } from "./delete";

export interface ExtraModel<T> extends Model<T> {
  paginate: typeof paginate;
  findOneOrCreate: typeof findOneOrCreate;
  deleteManyById: typeof deleteManyById;
  deleteById: typeof deleteById;
}

function MongooseExtras(schema: Schema) {
  schema.add({
    deleted: {
      type: Boolean,
      default: false,
    },
  });
  schema.statics.findOneOrCreate = findOneOrCreate;
  schema.statics.paginate = paginate;
  schema.statics.deleteManyById = deleteManyById;
  schema.statics.deleteById = deleteById;
}

export default MongooseExtras;
