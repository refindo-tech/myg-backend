// Define response structures
function TResponseMeta(success, message) {
  return {
    success,
    message,
  };
}

function TResponseMetaPage(success, message, page, limit, total) {
  return {
    ...TResponseMeta(success, message),
    page,
    limit,
    total,
  };
}

function TResponseMetaPageCustom(success, message, pageMeta) {
  return {
    ...TResponseMeta(success, message),
    ...pageMeta,
  };
}

function TSuccessResponse(meta, results) {
  return {
    meta,
    results,
  };
}

function TSuccessResponsePage(meta, results) {
  return {
    meta,
    results,
  };
}

function TErrorResponse(meta) {
  return {
    meta,
  };
}

// Define helper functions
function successResponse(message, data) {
  if (!data) {
    return TErrorResponse(TResponseMeta(true, message));
  } else {
    return TSuccessResponse(TResponseMeta(true, message), data);
  }
}

function successResponsePage(message, page, limit, total, data) {
  return TSuccessResponsePage(
    TResponseMetaPage(true, message, page, limit, total),
    data
  );
}

function successResponsePageCustom(message, meta, data) {
  return TSuccessResponsePage(
    TResponseMetaPageCustom(true, message, meta),
    data
  );
}

function errorResponse(message) {
  return TErrorResponse(TResponseMeta(false, message));
}

module.exports = {
  successResponse,
  successResponsePage,
  successResponsePageCustom,
  errorResponse,
};
