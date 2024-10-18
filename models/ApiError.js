class ApiErorr extends Error {
  constructor(details, status = "400") {
    super(details);
    this.status = status;
  }
}

module.exports = ApiErorr;
