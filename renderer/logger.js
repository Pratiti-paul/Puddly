const DEBUG_ENABLED = ["1", "true", "yes"].includes(
    String(process.env.PUDDLY_DEBUG || "").toLowerCase()
);

function write(method, args) {
    if (!DEBUG_ENABLED) {
        return;
    }

    console[method]("[Puddly]", ...args);
}

module.exports = {
    debug(...args) {
        write("debug", args);
    },

    info(...args) {
        write("info", args);
    },

    warn(...args) {
        write("warn", args);
    },

    error(...args) {
        write("error", args);
    }
};
