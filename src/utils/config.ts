// Time in milliseconds
const sessionLength = 1000 * 60 * 10; // 10 minutes

export default {
  sessionLength,
  checkSessionInterval: sessionLength + 10,
};
