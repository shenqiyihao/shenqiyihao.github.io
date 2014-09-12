(function (root, factory) {
    "use strict";

    // CommonJS
    if (typeof exports === "object" && module) {
        module.exports = factory();
    // AMD
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    // Browser
    } else {
        root.date = factory();
    }
}((typeof window === "object" && window) || this, function () {
    var DATE_ISO8601 = "%Y-%m-%dT%H:%i:%s%O";
    var DATE_RFC2822 = "%D, %d %M %y %H:%i:%s %O"

    function zeroPad (input, toLength) {
        toLength = toLength || 2;
        input += "";

        var i = input.length;

        while (i++ < toLength) { input = "0" + input; }

        return input;
    }

    var dateHelpers = {
        j: function (dp) { return dp.day; },
        d: function (dp) { return zeroPad(dp.day); },

        w: function (dp) { return dp.weekDay; },
        N: function (dp) { return dp.weekDay || 7; },
        l: function (dp) { return date.i18n.weekDayNames[dp.weekDay]; },
        D: function (dp) { return date.i18n.weekDayNamesShort[dp.weekDay]; },

        S: function (dp) {
            // INFO: this works fine for numbers between 0 and 99
            // since dates are between 1 and 31, it's OK to use it
            return ["st", "nd", "rd"][dp.day < 11 || dp.day > 13 ? dp.day % 10 - 1 : 3] || "th";
        },

        z: function (dp) { return (dp.ts - new Date(dp.year, 0)) / 864e5 | 0; },

        W: function (dp) {
            var t = new Date(dp.year, dp.month, dp.day + 4 - (dp.weekDay || 7));
            return zeroPad(1 + Math.floor((t - new Date(t.getFullYear(), 0, 1)) / 6048e5));
        },

        n: function (dp) { return dp.month + 1; },
        m: function (dp) { return zeroPad(dp.month + 1); },
        F: function (dp) { return date.i18n.monthNames[dp.month]; },
        M: function (dp) { return date.i18n.monthNamesShort[dp.month]; },

        t: function (dp) { return new Date(dp.year, dp.month + 1, 0).getDate(); },
        L: function (dp) { return new Date(dp.year, 1, 29).getMonth() === 1 | 0; },

        Y: function (dp) { return dp.year; },
        y: function (dp) { return zeroPad(dp.year % 100); },

        G: function (dp) { return dp.hours; },
        g: function (dp) { return dp.hours % 12 || 12; },
        H: function (dp) { return zeroPad(dp.hours); },
        h: function (dp) { return zeroPad(dp.hours % 12 || 12); },
        a: function (dp) { return dp.hours < 12 ? "am" : "pm"; },
        A: function (dp) { return dp.hours < 12 ? "AM" : "PM"; },

        i: function (dp) { return zeroPad(dp.min); },
        s: function (dp) { return zeroPad(dp.sec); },
        U: function (dp) { return dp.ts / 1e3 | 0; },
        u: function (dp) { return zeroPad(dp.ts * 1e3, 6); },
        
        I: function (dp) { return (dp.tz !== new Date(dp.year, 0).getTimezoneOffset()) | 0; },

        O: function (dp, a) {
            a = Math.abs(dp.tz);
            return (dp.tz > 0 ? "-" : "+") + zeroPad((a / 60 | 0) * 100 + a % 60, 4);
        },

        P: function (dp, t) {
            t = date('%O', dp.ts);
            return t.slice(0, 3) + ":" + t.slice(3);
        },

        Z: function (dp) { return -60 * dp.tz; },

        o: function (dp) { return new Date(dp.year, dp.month, dp.day + 4 - (dp.weekDay || 7)).getFullYear(); },

        B: function (dp) {
            var t = Math.floor((dp.hours * 3600 + dp.min * 60 + dp.sec + (dp.tz + 60) * 60) / 86.4);
            t += t > 1e3 ? -1e3 : t < 0 ? 1e3 : 0;
            return zeroPad(t, 3);
        },

        c: function (dp) { return date(DATE_ISO8601, dp.ts); },
        r: function (dp) { return date(DATE_RFC2822, dp.ts); }
    };

    function date (format, timestamp) {
        if (timestamp) {
            timestamp = new Date(timestamp);
        } else if (!(timestamp instanceof Date)) {
            timestamp = new Date();
        }

        var dateParts = {
            year: timestamp.getFullYear(),
            month: timestamp.getMonth(),
            day: timestamp.getDate(),
            weekDay: timestamp.getDay(),
            tz: timestamp.getTimezoneOffset(),
            hours: timestamp.getHours(),
            min: timestamp.getMinutes(),
            sec: timestamp.getSeconds(),
            ts: +timestamp
        };


        return format.replace(/%(.)/g, function ($0, $1) {
            return dateHelpers[$1] ? dateHelpers[$1](dateParts) : $0;
        });
    }

    date.i18n = {
        monthNames: ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"],
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        weekDayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        weekDayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    };

    date.DATE_ISO8601 = DATE_ISO8601;
    date.DATE_RFC822 = date.DATE_RFC1036 = date.DATE_RFC1123 = date.DATE_RFC2822 = DATE_RFC2822;
    date.DATE_ATOM = date.DATE_RFC3339 = date.DATE_W3C = "%Y-%m-%dT%H:%i:%s%P";
    date.DATE_COOKIE = date.DATE_RFC850 = "%l, %d-%M-%y %H:%i:%s %T";
    date.DATE_RSS = "%D, %d %M %Y %H:%i:%s %O";

    return date;
}));