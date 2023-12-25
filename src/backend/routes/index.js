/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router))
    app.use('/api', require('./user.js')(router))
    app.use('/api', require('./passwordReset.js')(router))
    app.use('/api', require('./chat.js')(router))
    app.use('/api', require('./history.js')(router))
    app.use('/api', require('./prompt.js')(router))
    app.use('/api', require('./passwordReset.js')(router))
    app.use('/api', require('./chatid.js')(router))
    app.use('/api', require('./historyid.js')(router))
    app.use('/api', require('./promptid.js')(router))
    app.use('/api', require('./reset.js')(router))
}
