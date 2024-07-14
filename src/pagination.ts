import {
  FilterQuery,
  Model,
  PipelineStage,
  ProjectionType,
  QueryOptions,
} from "mongoose";

export interface IPaginationOption {
  page: number;
  limit: number;
}

const defaultOptions: IPaginationOption = {
  page: 1,
  limit: 10,
};

export interface PaginationResult<T> {
  docs: T[];
  totalDocs: number;
  page: number;
  pages: number;
  limit: number;
  hasNextPage: boolean;
  nextPage: number;
  hasPrevPage: boolean;
  prevPage: number;
}

type PaginateOptions<T> = {
  searches?: string[];
  populate?: string[];
  projection?: ProjectionType<T>;
  aggregate?: PipelineStage[];
  options?: QueryOptions<T>;
  sort?: any;
  limit?: string | any;
  page?: number | any;
  search?: string | any;
};

export async function paginate<T>(
  this: Model<T, any, any, any>,
  query: FilterQuery<T & any>,
  options: PaginateOptions<T>
): Promise<PaginationResult<T>> {
  const {
    searches,
    populate,
    projection,
    aggregate,
    options: findOptions,
    sort,
  } = options;

  let limit = defaultOptions.limit;

  limit = parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : limit;

  if (searches && options.search) {
    const searchQueries = searches.map((field: string) => {
      return {
        [field]: { $regex: new RegExp(`.*${options.search}.*`), $options: "i" },
      };
    });

    if (query.$or) query.$or = [...searchQueries, query.$or];
    else query.$or = [...searchQueries];
  }

  const cQuery = this.countDocuments(query);

  /**setup query */
  let fQuery = this.find(query, projection, findOptions);

  if (populate) {
    fQuery.populate(populate);
  }

  /**aggregate paginate */
  if (aggregate) {
    fQuery = this.aggregate(aggregate);
  }

  /**limit and skip */
  const page = options.page || defaultOptions.page;

  if (sort) fQuery.sort(sort);
  else fQuery.sort({ createdAt: "desc" });

  if (limit > 0) fQuery.skip((page - 1) * limit);
  if (limit > 0) fQuery.limit(limit);

  const [count, docs] = await Promise.all([cQuery.exec(), fQuery.exec()]);

  const pages = limit > 0 ? Math.ceil(count / limit) || 1 : 1;

  const meta = {
    totalDocs: count,
    page,
    pages,
    limit,
    hasNextPage: false,
    nextPage: 1,
    hasPrevPage: false,
    prevPage: 1,
  };

  if (page < pages) {
    meta.hasNextPage = true;
    meta.nextPage = page + 1;
  }

  if (page > 1) {
    meta.hasPrevPage = true;
    meta.prevPage = page - 1;
  }

  if (limit == 0) {
    meta.pages = 1;
    meta.page = 1;
    meta.hasNextPage = false;
    meta.hasPrevPage = false;
  }

  const result = {
    docs,
    ...meta,
  };

  return result;
}

export default paginate;
