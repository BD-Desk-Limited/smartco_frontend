// Where a signed-in user's own console is, for leaving the sales point without logging out.
// Sellers have no console, so they get null and only see Logout.
export const consoleHome = (user) => {
  if (user?.role === 'manager') return '/pages/account/manager';
  if (user?.role === 'admin') return '/pages/account/admin';
  return null;
};

// Leave the sales point for the console. The chosen work branch is forgotten (as on Logout),
// so the branch picker shows again next time.
export const backToConsole = (user, router) => {
  const home = consoleHome(user);
  if (!home) return;
  localStorage.removeItem(`workBranch_${user?._id}`);
  router.push(home);
};
