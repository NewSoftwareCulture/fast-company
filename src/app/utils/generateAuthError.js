const errors = {
  EMAIL_EXISTS: "Пользователь с таким email уже существует",
  EMAIL_NOT_FOUND: "Пользователь с таким email не найден",
  INVALID_PASSWORD: "Неверный пароль"
};

export function generateAuthError(message) {
  return errors[message] || message;
};

export default generateAuthError;
