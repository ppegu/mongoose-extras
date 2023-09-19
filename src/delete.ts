import { ObjectId as MongodbObjectId } from "mongodb";
import { Model, ObjectId as SchemObjectId, Types } from "mongoose";

type ObjectId = SchemObjectId | Types.ObjectId | MongodbObjectId;

export async function deleteManyById<T>(
  this: Model<T, any, any, any>,
  ids: ObjectId[]
) {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new Error("Invalid input. Provide an array of ObjectIds to delete.");
  }

  const filter = { _id: { $in: ids } };

  const update = { deleted: true };

  const result = await this.updateMany(filter, update);

  return result;
}

export async function deleteById<T>(
  this: Model<T, any, any, any>,
  id: ObjectId
) {
  if (!id) {
    throw new Error("Invalid input. Provide an ObjectId to delete.");
  }

  const update = { deleted: true };
  const result = await this.findByIdAndUpdate(id, update);
  return result;
}
