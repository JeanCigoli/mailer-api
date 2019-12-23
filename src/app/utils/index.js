
export function apiResponse({
  success = true, message = '', data = [], errors = [],
}) {
  return ({
    success,
    message,
    data,
    errors,
  });
}

export function apiErrorResponse({ message = '', errors = [] }) {
  const error = errors.map((description) => ({
    code: 999,
    description,
  }));

  return apiResponse({ success: false, message, errors: error });
}
