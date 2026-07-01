class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  /* ==========================================
      Create
  ========================================== */

  async create(payload) {
    return this.model.create(payload);
  }

  /* ==========================================
      Find
  ========================================== */

  async findById(id, populate = "") {
    let query = this.model.findById(id);

    if (populate) {
      query = query.populate(populate);
    }

    return query;
  }

  async findOne(filter = {}, populate = "") {
    let query = this.model.findOne(filter);

    if (populate) {
      query = query.populate(populate);
    }

    return query;
  }

  async find(
    filter = {},
    options = {}
  ) {
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      populate = "",
      select = "",
    } = options;

    let query = this.model
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort);

    if (populate) {
      query = query.populate(populate);
    }

    if (select) {
      query = query.select(select);
    }

    const [data, total] =
      await Promise.all([
        query,
        this.model.countDocuments(
          filter
        ),
      ]);

    return {
      data,

      pagination: {
        total,

        page,

        limit,

        pages: Math.ceil(
          total / limit
        ),
      },
    };
  }

  /* ==========================================
      Update
  ========================================== */

  async update(id, payload) {
    return this.model.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async updateOne(
    filter,
    payload
  ) {
    return this.model.findOneAndUpdate(
      filter,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /* ==========================================
      Delete
  ========================================== */

  async delete(id) {
    return this.model.findByIdAndDelete(
      id
    );
  }

  async deleteOne(filter) {
    return this.model.findOneAndDelete(
      filter
    );
  }

  /* ==========================================
      Count
  ========================================== */

  async count(filter = {}) {
    return this.model.countDocuments(
      filter
    );
  }

  async exists(filter = {}) {
    return this.model.exists(filter);
  }

  /* ==========================================
      Aggregate
  ========================================== */

  async aggregate(pipeline = []) {
    return this.model.aggregate(
      pipeline
    );
  }

  /* ==========================================
      Bulk
  ========================================== */

  async insertMany(data = []) {
    return this.model.insertMany(
      data
    );
  }

  async deleteMany(filter = {}) {
    return this.model.deleteMany(
      filter
    );
  }
}

export default BaseRepository;