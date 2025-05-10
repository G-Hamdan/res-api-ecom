export const checkEmail = {
    checkEmpty: (stringEmail) => stringEmail !== "",
    checkFormat: (stringEmail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringEmail),
  }
  