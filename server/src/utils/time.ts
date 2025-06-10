const time = {
    /**
     * Returns the UNIX timestamp for the given `date`. Defaults to `Date.now()`
     * when not providing the `date` argument to the method call.
     *
     * @returns {Number}
     */
    unixTimestamp: (date = Date.now()) => {
        return Math.floor(date / 1000).toString();
    },
};

module.exports = time;
