const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { passWordHash } = require('../../middleware/prisma-middleware');
const authenticate = require('../../middleware/auth-middleware');
prisma.$use(passWordHash);

exports.createUser = async (parent, { payload }, { request }, info) => {
  try {
    const isEmailExists = await prisma.user.count({
      where: { email: payload.email },
    });

    if (isEmailExists)
      throw new Error('Email is already in use. Please use another Email!.');

    const role = await prisma.role.findFirst({ where: { name: 'user' } });

    if (!role) throw new Error('System roles are not generated yet!.');
    const user = await prisma.user.create({
      data: { ...payload, roleId: role.id },
    });
    return user;
  } catch (error) {
    throw error;
  }
};

exports.getAllUsers = async (parent, args, { request }, info) => {
  try {
    await authenticate(request, ['admin'], prisma);
    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      include: { posts: true, comments: true },
    });
    return users;
  } catch (error) {
    throw error;
  }
};

exports.getUserById = async (parent, { id }, { request }, info) => {
  try {
    await authenticate(request, ['admin'], prisma);
    const user = await prisma.user.findFirst({
      where: { id, isDeleted: false },
      include: { posts: true, comments: true },
    });

    if (!user) throw new Error('No such user belongs with given id!');
    return user;
  } catch (error) {
    throw error;
  }
};

exports.updateUser = async (parent, { id, payload }, { request }, info) => {
  try {
    const reqUser = await authenticate(request, ['user'], prisma);
    if (reqUser.id !== id) throw new Error("You can't update other's details!");
    if (payload.email) {
      const isEmailExists = await prisma.user.count({
        where: { isDeleted: false, email: payload.email, id: { not: id } },
      });
      if (isEmailExists) throw new Error('Email is already in use!');
    }
    const user = await prisma.user.update({ where: { id }, data: payload });
    return user;
  } catch (error) {
    throw error;
  }
};

exports.deleteUser = async (parent, { id }, { request }, info) => {
  try {
    const reqUser = await authenticate(req, ['admin', 'user'], prisma);
    if (reqUser.id === id || reqUser.role === 'admin') {
      const isUserExists = await prisma.user.count({
        where: { id, isDeleted: false },
      });
      if (!isUserExists) throw new Error('No such user belongs to given id!');
      await prisma.post.updateMany({
        where: { createdBy: id, isDeleted: false },
        data: { isDeleted: true, deletedBy: reqUser.id, deletedAt: new Date() },
      });
      const postList = await prisma.user.findUnique({ where: { id } }).posts();
      const list = postList.map((post) => post.id);
      await prisma.comment.updateMany({
        where: {
          OR: [
            { createdBy: id, isDeleted: false },
            { createdOn: { in: list } },
          ],
        },
      });
      await prisma.user.update({
        where: { id },
        data: { isDeleted: true, deletedBy: reqUser.id, deletedAt: new Date() },
      });
      return 'User Deleted Successfully';
    } else
      throw new Error('You dont have sufficient right to delete other users!');
  } catch (error) {
    throw error;
  }
};
