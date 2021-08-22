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
    await authenticate(request, ["admin"], prisma);
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
    const user = await prisma.user.findFirst({
      where: { id },
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
  } catch (error) {
    throw error;
  }
};
