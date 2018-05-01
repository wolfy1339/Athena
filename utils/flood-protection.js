/**
* Throttles messages sent by bot
* @class
*/
class FloodProtection {

    /**
    * @param {Bot} bot
    */
    constructor(bot) {
        this.bot = bot;
        this.bot.sendQueue = [];

        setInterval(this.reduceQueue, 300, this, false);
        setInterval(this.reduceQueue, 3000, this, true);

        /**
        * @func
        * @param {string} message - Message to send (non-flushable)
        **/
        this.bot.send = message => {
            this.bot.sendQueue.push({ message, root: true, target: this.getTarget(message.message) });
        };

        /**
        * @func
        * @param {string} message - Message to send from plugin (flushable)
        **/
        this.bot._send = message => {
            this.bot.sendQueue.push({ message, root: false, target: this.getTarget(message.message) });
        };
    }

    /** Deletes all messages except those that aren't set by plugins **/
    flushAll() {
        this.bot.sendQueue = this.bot.sendQueue.map(element => element.root ? element : undefined);
    }

    /**
    * @func
    * @param {string} message
    * @return {string}
    **/
    getTarget(message) {
        if (!message) return;
        let splitMessage = message.split(' ');

        if (splitMessage.length > 1) return splitMessage[1];
    }

    /**
    * @func
    * @param {object} that
    * @param {boolean} burst - Whether to burst messages
    **/
    reduceQueue(that, burst) {
        for (let i=0; i<4; i++) {
            let message = this.bot.sendQueue.shift();

            if (message) {
                that.bot.immediateSend(message.message);
            }
            if (!burst) break;
        }
    }

}

module.exports = FloodProtection;
