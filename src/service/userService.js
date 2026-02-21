const user = require('./../schemas/userSchema');
const mongoose = require('mongoose');
class userService {
  async createNewUser(req) {
    const { name, username, email, password, role } = req.body;
    const newUser = new user({
      name,
      username,
      email,
      password,
      role,
    });
    const savedUser = await newUser.save();
    return savedUser;
  }

  async findUserByUsername(req) {
    const { username } = req.params;
    const foundUser = await user.findOne({ username }).select('-password -__v -role');

    if (!foundUser) {
      const error = new Error(`کاربری با این ${username}نام پیدا نشد.`);
      error.statusCode = 404;
      throw error;
    }
    return foundUser;
  }

  async findByUserId(req) {
    const { id } = req.params;
    const foundUser = await user.findById(id).select('-password').select('-__v');

    if (!foundUser) {
      const error = new Error(`کاربری با این ${id}نام پیدا نشد.`);
      error.statusCode = 404;
      throw error;
    }
    return foundUser;
  }

  async updateUserDetail(req) {
    const { id } = req.params;
    const updates = req.body;
    const forbiddenFields = ['password', 'role', 'id', '_id', 'tokenVersion'];
    forbiddenFields.forEach((field) => delete updates[field]);
    const updatedUser = await user
      .findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      })
      .select('-password -__v');
    if (!updatedUser) {
      const error = new Error(`کاربری با این ${id}شناسه پیدا نشد.`);
      error.statusCode = 404;
      throw error;
    }
    return updatedUser;
  }

  async deleteUserById(req, res) {
    const { id } = req.params;
    const deletedUser = await user.findByIdAndDelete(id).select('-password -__v');
    if (!deletedUser) {
      const error = new Error(`کاربری با این ${id}شناسه پیدا نشد.`);
      error.statusCode = 404;
      throw error;
    }
    return deletedUser;
  }

  async findAllUsers(req) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (limit >= 10) {
      const error = new Error(`درخواست با محدودیت بالا غیرمجاز میباشد!`);
      error.statusCode = 400;
      throw error;
    }
    const skip = (page - 1) * limit;

    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    const users = await user.find().select('-password -__v').skip(skip).limit(limit).sort('-createdAt');
    const totalUsers = await user.countDocuments(queryObj);
    const totalPages = Math.ceil(totalUsers / limit);

    return {
      status: true,
      results: users.length,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      data: { users },
    };
  }
  async findByUserProfile(req) {
    const { id } = req.params;
    const foundUser = await user.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $project: {
          username: 1,
          name: 1,
          email: 1,
          signupDate: '$createdAt',
          daysSinceSignup: {
            $dateDiff: {
              startDate: '$createdAt',
              endDate: '$$NOW',
              unit: 'day',
            },
          },
        },
      },
    ]);

    if (!foundUser) {
      const error = new Error(`کاربری با این ${id}نام پیدا نشد.`);
      error.statusCode = 404;
      throw error;
    }
    return foundUser;
  }
  async updateUserProfile(req) {
    const { id } = req.params;
    const updates = req.body;
    const forbiddenFields = ['password', 'role', 'id', '_id', 'tokenVersion'];
    forbiddenFields.forEach((field) => delete updates[field]);
    const updatedUser = await user
      .findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      })
      .select('-password -__v');
    if (!updatedUser) {
      const error = new Error('کاربری با این شناسه یافت نشد.');
      error.statusCode = 404;
      throw error;
    }
    return updatedUser;
  }
}

module.exports = new userService();
