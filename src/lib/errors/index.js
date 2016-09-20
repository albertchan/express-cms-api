export default class error {
  static badRequest(req, res) {
    res.status(400).json({
      code: 400,
      error: 'Bad request'
    });
  }

  static unauthorized(req, res) {
    res.status(401).json({
      code: 401,
      error: 'Unauthorized'
    });
  }

  static methodNotAllowed(req, res) {
    // TODO provide a list of allowed methods in header
    res.status(405).json({
      code: 405,
      error: 'Method not allowed'
    });
  }

  static internalServerError(req, res) {
    res.status(500).json({
      code: 500,
      error: 'Internal server error'
    });
  }
}
