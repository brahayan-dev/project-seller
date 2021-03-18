import _ from "lodash";

export const orderCode = () => {
  const randomNumber = _.random(0, 100);
  const timestamp = Date.now();

  return `MSE-${timestamp}-${randomNumber}`;
};
