const fs = require("fs").promises;

const fileWriteAndRetrieve = async (msg) => {
  try {
    await fs.appendFile("input.txt", "\n" + msg, "utf8");
    console.log("Data is appended to file successfully.");
    const data = await fs.readFile("input.txt", "utf8");
    let lines = data.split("\n");
    return lines.length >= 10 ? lines.slice(lines.length - 10) : lines;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  fileWriteAndRetrieve,
};
