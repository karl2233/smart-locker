export const cookieManager = {
  get: (name) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((row) => row.startsWith(`${name}=`));
    if (!cookie) return null;
    return decodeURIComponent(cookie.split("=")[1]);
  },

  set: (name, value, expirationDate) => {
    document.cookie = `${name}=${value};expires=${expirationDate.toUTCString()};path=/`;
  },

  remove: (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  },
};