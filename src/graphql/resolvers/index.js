const UserResolver = require('./user-resolver');
const AuthResolver = require('./auth-resolver');
module.exports = {
  Query: {
    login: AuthResolver.login,
    getAllUsers: UserResolver.getAllUsers,
    getUserById: UserResolver.getUserById,
  },

  Mutation: {
    createUser: UserResolver.createUser,
  },
};
