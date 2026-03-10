
export const handleLogout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = '/signin';
  }
};