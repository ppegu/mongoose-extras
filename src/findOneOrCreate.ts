import { FilterQuery, Model } from "mongoose";

async function findOneOrCreate<T>(
  this: Model<T, any, any, any>,
  filter: FilterQuery<any>
): Promise<T> {
  let doc = await this.findOne(filter);
  if (!doc) doc = await this.create(filter);
  return doc;
}

export default findOneOrCreate;
