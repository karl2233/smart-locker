const parseJwt = (token) => {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
};

export const getTokenExpiration = (token) => {
  const payload = parseJwt(token);

  if (!payload?.exp) {
    return new Date(Date.now() - 1000);
  }

  return new Date(payload.exp * 1000);
};

export const isTokenValid = (token) => {
  const expirationDate = getTokenExpiration(token);
  return expirationDate.getTime() > Date.now();
};