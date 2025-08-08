import * as bcrypt from "bcrypt";
const saltRounds = 1;

export async function hash(password){
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

export async function checkPassword(userPassword, hashedPassword){
  try {
    const isMatch = await bcrypt.compare(userPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    return false
  }
}
