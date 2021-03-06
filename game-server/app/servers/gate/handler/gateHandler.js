var Code = require('../../../../../shared/code');
var dispatcher = require('../../../util/dispatcher');

/**
 * Gate handler that dispatch user to connectors.
 */
module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

Handler.prototype.queryEntry = function(msg, session, next) {
	var uid = msg.uid;
	if(!uid) {
		next(null, {code: Code.FAIL});
		return;
	}

	var connectors = this.app.getServersByType('connector');
	if(!connectors || connectors.length === 0) {
		next(null, {code: Code.GATE.FA_NO_SERVER_AVAILABLE});
		return;
	}

	var res = dispatcher.dispatch(uid, connectors);
	console.log("[%s]gate.gateHandler.queryEntry", this.app.serverId);
	next(null, {code: Code.OK, host: res.clientHost, port: res.clientPort});
};