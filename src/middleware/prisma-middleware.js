const bcrypt = require('bcrypt');

exports.passWordHash = async (params, next) => {
  // Manipulate params here
  if (params.model === 'User' && params.action === 'create') {
    params.args.data.password = await bcrypt.hash(
      params.args.data.password,
      10
    );
  }
  const result = await next(params);
  // See results her
  return result;
};
