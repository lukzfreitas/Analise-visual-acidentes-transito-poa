var express = require('express');

module.exports.sendJSON = function (res, status, content) {
    res.status(status);
    res.json(content);
};