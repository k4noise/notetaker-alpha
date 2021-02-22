const logout = () => {
  return {
    status: 200,
    header: 'token=deleted;path=/;Max-Age = -1;HttpOnly',
  };
};

module.exports = logout;
