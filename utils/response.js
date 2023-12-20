class jsonResponse {
  constructor(status, message, code, data = null) {
    this.message = message;
    this.data = data;
    this.status = status;
    this.code = code;
  }
  getJsonResponse() {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      data: this.data,
    };
  }
}
module.exports = { jsonResponse };
