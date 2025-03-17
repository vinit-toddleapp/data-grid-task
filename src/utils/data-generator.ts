import { DataItem } from "../App";
const firstNames = ["John", "Jane", "Michael", "Emily", "Chris", "Sarah"];
const lastNames = ["Smith", "Doe", "Brown", "Johnson", "Taylor", "Lee"];
const domains = ["gmail.com", "yahoo.com", "outlook.com", "example.com"];
const companies = ["Google", "Microsoft", "Toddle", "Tesla", "Facebook"];

export const dataGenerator = (objType: string[], count: number) => {
  const getRandomEle = (arr: string[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const nameGenerator = () => {
    return `${getRandomEle(firstNames)} ${getRandomEle(lastNames)}`;
  };

  const emailGenerator = (name: string) => {
    return `${name.split(" ").join(".").toLowerCase()}@${getRandomEle(domains)}`;
  };

  const phoneGenerator = () => {
    return `+1-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  };

  const companiesGenerator = () => {
    return `${getRandomEle(companies)}`;
  };

  const generators = {
    name: nameGenerator,
    email: emailGenerator,
    phone: phoneGenerator,
    company: companiesGenerator,
  };

  const results = [];

  for (let i = 0; i < count; i++) {
    const obj: DataItem = { name: "", email: "", phone: "", company: "" };
    const name = generators.name();

    objType.forEach((element: string) => {
      switch (element) {
        case "name":
          obj.name = name;
          break;
        case "email":
          obj.email = generators.email(name);
          break;
        case "phone":
          obj.phone = generators.phone();
          break;
        case "company":
          obj.company = generators.company();
          break;
      }
    });

    results.push(obj);
  }

  return results;
};
