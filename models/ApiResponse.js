class ApiResponse {
  constructor(status = 200, message = "SUCCESS") {
    this.status = status;
    this.message = message;
  }
}

module.exports = ApiResponse;
