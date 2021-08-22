const { verify } = require('jsonwebtoken');
/**
 * Middlware for authentication and authorizing user request for secure routes access.
 * @param {object} req
 * @param {Array} roles
 */
module.exports = async (req, roles, prisma) => {
  try {
    let token;
    try {
      token = req.headers['authorization'].split(' ')[1];
    } catch (error) {
      throw new Error("Token is missing!")
    }
    if (!token) throw new Error('Invalid Token!');
    const { user } = verify(token, process.env.TOKEN_SECRET);

    const isUserExists = await prisma.user.findFirst({
      where: { id: user.id, isDeleted: false },
    });
    if (!isUserExists) throw new Error('Invalid Token!');

    if (roles) {
      roles = typeof roles === 'string' ? [roles] : roles || [];
      if (!roles.includes(user.role))
        throw new Error("You don't have sufficient access to this path!");
    }
    return user;
  } catch (error) {
    throw error;
  }
};
