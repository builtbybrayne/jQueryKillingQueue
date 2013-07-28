/*
    JQuery KillingQueue allows you to request callbacks which will optionally wait or be discarded if another callback is already in progress
 */
KillingQueue = function(){

    this.debug = true;

    this._active = false;
    this._deferred = false;
    this._queue = [];

    this.request = function(callback,queue){
        var self = this;
        /*             Debug */  if ( self.debug ) console.log("KQ request");
        if ( !self._active ) {
            /*             Debug */  if ( self.debug ) console.log("KQ not active, starting");
            self._start(callback);
        } else if ( queue ) {
            /*             Debug */  if ( self.debug ) console.log("KQ active so queueing");
            self._queue.push(callback);
        } else {
            /*             Debug */  if ( self.debug ) console.log("KQ active so dropping");
        }
    };

    this._start = function(callback) {
        var self = this;
        /*             Debug */  if ( self.debug ) console.log("starting KQ");
        self._active = true;
        self._deferred = new $.Deferred();
        if ( self.debug ) console.log("KQ hitting callback");
        var promise = callback();
        if ( promise ) {
            /*             Debug */  if ( self.debug ) console.log("KQ found promise on return of callback, waiting for promise to finish before resolving");
            promise.done(function(){
                if ( self.debug ) console.log("KQ wait for promise over, now resolving");
                self._resolve();
            });
        } else {
            /*             Debug */  if ( self.debug ) console.log("KQ found no promise on return of callback, resolving immediately");
            self._resolve();
        }
    };
    this._resolve = function(){
        var self = this;
        if ( self._active ) {
            /*             Debug */  if ( self.debug ) console.log("KQ is active and will now resolve");
            self._active = false;
            self._deferred.resolve();
            if ( self._queue.length > 0 ) {
                /*             Debug */  if ( self.debug ) console.log("KQ has queue, shifting to next callback");
                var nextCallback = self._queue.shift();
                self._start(nextCallback);
            }
        } else {
            /*             Debug */  if ( self.debug ) console.log("KQ is not active so resolve does nothing");
        }
    }

}