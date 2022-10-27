const getRandomNumberForMail = () => {
  return Math.random().toString(30).substr(2, 8) + Math.random().toString(30).substr(2, 8);
};

export default getRandomNumberForMail;
