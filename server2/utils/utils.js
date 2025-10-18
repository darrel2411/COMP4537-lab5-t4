const MYSQL_ERRNO = {
    ER_PARSE_ERROR: 1064,
    ER_NO_SUCH_TABLE: 1146,
    ER_ACCESS_DENIED_ERROR: 1045,
    ER_DUP_ENTRY: 1062,
    ER_BAD_FIELD_ERROR: 1054
}


mysqlErrToStatus = (err) => {
    const errNo = err.errno;
    if (errNo === MYSQL_ERRNO.ER_PARSE_ERROR) return 400;
    if (errNo === MYSQL_ERRNO.ER_NO_SUCH_TABLE) return 404;
    if (errNo === MYSQL_ERRNO.ER_ACCESS_DENIED_ERROR) return 401;
    if (errNo === MYSQL_ERRNO.ER_DUP_ENTRY) return 409;

    return 500;
}

module.exports = { mysqlErrToStatus }