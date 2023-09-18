import { FilterQuery, Model } from "mongoose"

async function findOneOrCreate(
  this: Model<any, any, any, any>,
  filter: FilterQuery<any>
) {
  let doc = await this.findOne(filter)
  if (!doc) doc = await this.create(filter)
  return doc
}

export default findOneOrCreate
