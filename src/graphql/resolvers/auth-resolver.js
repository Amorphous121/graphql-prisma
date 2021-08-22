const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');

exports.login = async (parent, { payload }, { prisma }, info) => {
  const { email, password } = payload;
  const user = await prisma.user.findFirst({
    where: { email, isDeleted: false },
    include: { role: true },
  });
  if (!user) throw new Error('Invalid Credentials!');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid Credentials!');
  const body = { id: user.id, email: user.email, role: user.role.name };
  const token = sign({ user: body }, process.env.TOKEN_SECRET);
  return token;
};