let autoComplete = function () {
    function e(e) {
        function t(e, t) {
            return e.classList ? e.classList.contains(t) : new RegExp("\\b" + t + "\\b").test(e.className)
        }

        function o(e, t, o) {
            e.attachEvent ? e.attachEvent("on" + t, o) : e.addEventListener(t, o)
        }

        function s(e, t, o) {
            e.detachEvent ? e.detachEvent("on" + t, o) : e.removeEventListener(t, o)
        }

        function n(e, s, n, l) {
            o(l || document, s, function (o) {
                for (var s, l = o.target || o.srcElement; l && !(s = t(l, e));) l = l.parentElement;
                s && n.call(l, o)
            })
        }

        if (document.querySelector) {
            var l = {
                selector: 0,
                source: 0,
                minChars: 3,
                delay: 150,
                offsetLeft: 0,
                offsetTop: 1,
                cache: 1,
                menuClass: "",
                renderItem: function (e, t) {
                    t = t.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
                    var o = new RegExp("(" + t.split(" ").join("|") + ")", "gi");
                    return '<div class="autocomplete-suggestion" data-val="' + e + '">' + e.replace(o, "<b>$1</b>") + "</div>"
                },
                onSelect: function () {
                }
            };
            for (var c in e) e.hasOwnProperty(c) && (l[c] = e[c]);
            for (var a = "object" == typeof l.selector ? [l.selector] : document.querySelectorAll(l.selector), u = 0; u < a.length; u++) {
                var i = a[u];
                i.sc = document.createElement("div"), i.sc.className = "autocomplete-suggestions " + l.menuClass, i.autocompleteAttr = i.getAttribute("autocomplete"), i.setAttribute("autocomplete", "off"), i.cache = {}, i.last_val = "", i.updateSC = function (e, t) {
                    var o = i.getBoundingClientRect();
                    if (i.sc.style.left = Math.round(o.left + (window.pageXOffset || document.documentElement.scrollLeft) + l.offsetLeft) + "px", i.sc.style.top = Math.round(o.bottom + (window.pageYOffset || document.documentElement.scrollTop) + l.offsetTop) + "px", i.sc.style.width = Math.round(o.right - o.left) + "px", !e && (i.sc.style.display = "block", i.sc.maxHeight || (i.sc.maxHeight = parseInt((window.getComputedStyle ? getComputedStyle(i.sc, null) : i.sc.currentStyle).maxHeight)), i.sc.suggestionHeight || (i.sc.suggestionHeight = i.sc.querySelector(".autocomplete-suggestion").offsetHeight), i.sc.suggestionHeight)) if (t) {
                        var s = i.sc.scrollTop, n = t.getBoundingClientRect().top - i.sc.getBoundingClientRect().top;
                        n + i.sc.suggestionHeight - i.sc.maxHeight > 0 ? i.sc.scrollTop = n + i.sc.suggestionHeight + s - i.sc.maxHeight : 0 > n && (i.sc.scrollTop = n + s)
                    } else i.sc.scrollTop = 0
                }, o(window, "resize", i.updateSC), document.body.appendChild(i.sc), n("autocomplete-suggestion", "mouseleave", function () {
                    var e = i.sc.querySelector(".autocomplete-suggestion.selected");
                    e && setTimeout(function () {
                        e.className = e.className.replace("selected", "")
                    }, 20)
                }, i.sc), n("autocomplete-suggestion", "mouseover", function () {
                    var e = i.sc.querySelector(".autocomplete-suggestion.selected");
                    e && (e.className = e.className.replace("selected", "")), this.className += " selected"
                }, i.sc), n("autocomplete-suggestion", "mousedown", function (e) {
                    if (t(this, "autocomplete-suggestion")) {
                        var o = this.getAttribute("data-val");
                        i.value = o, l.onSelect(e, o, this), i.sc.style.display = "none"
                    }
                }, i.sc), i.blurHandler = function () {
                    try {
                        var e = document.querySelector(".autocomplete-suggestions:hover")
                    } catch (t) {
                        var e = 0
                    }
                    e ? i !== document.activeElement && setTimeout(function () {
                        i.focus()
                    }, 20) : (i.last_val = i.value, i.sc.style.display = "none", setTimeout(function () {
                        i.sc.style.display = "none"
                    }, 350))
                }, o(i, "blur", i.blurHandler);
                var r = function (e) {
                    var t = i.value;
                    if (i.cache[t] = e, e.length && t.length >= l.minChars) {
                        for (var o = "", s = 0; s < e.length; s++) o += l.renderItem(e[s], t);
                        i.sc.innerHTML = o, i.updateSC(0)
                    } else i.sc.style.display = "none"
                };
                i.keydownHandler = function (e) {
                    var t = window.event ? e.keyCode : e.which;
                    if ((40 == t || 38 == t) && i.sc.innerHTML) {
                        var o, s = i.sc.querySelector(".autocomplete-suggestion.selected");
                        return s ? (o = 40 == t ? s.nextSibling : s.previousSibling, o ? (s.className = s.className.replace("selected", ""), o.className += " selected", i.value = o.getAttribute("data-val")) : (s.className = s.className.replace("selected", ""), i.value = i.last_val, o = 0)) : (o = 40 == t ? i.sc.querySelector(".autocomplete-suggestion") : i.sc.childNodes[i.sc.childNodes.length - 1], o.className += " selected", i.value = o.getAttribute("data-val")), i.updateSC(0, o), !1
                    }
                    if (27 == t) i.value = i.last_val, i.sc.style.display = "none"; else if (13 == t || 9 == t) {
                        var s = i.sc.querySelector(".autocomplete-suggestion.selected");
                        s && "none" != i.sc.style.display && (l.onSelect(e, s.getAttribute("data-val"), s), setTimeout(function () {
                            i.sc.style.display = "none"
                        }, 20))
                    }
                }, o(i, "keydown", i.keydownHandler), i.keyupHandler = function (e) {
                    var t = window.event ? e.keyCode : e.which;
                    if (!t || (35 > t || t > 40) && 13 != t && 27 != t) {
                        var o = i.value;
                        if (o.length >= l.minChars) {
                            if (o != i.last_val) {
                                if (i.last_val = o, clearTimeout(i.timer), l.cache) {
                                    if (o in i.cache) return void r(i.cache[o]);
                                    for (var s = 1; s < o.length - l.minChars; s++) {
                                        var n = o.slice(0, o.length - s);
                                        if (n in i.cache && !i.cache[n].length) return void r([])
                                    }
                                }
                                i.timer = setTimeout(function () {
                                    l.source(o, r)
                                }, l.delay)
                            }
                        } else i.last_val = o, i.sc.style.display = "none"
                    }
                }, o(i, "keyup", i.keyupHandler), i.focusHandler = function (e) {
                    i.last_val = "\n", i.keyupHandler(e)
                }, l.minChars || o(i, "focus", i.focusHandler)
            }
            this.destroy = function () {
                for (var e = 0; e < a.length; e++) {
                    var t = a[e];
                    s(window, "resize", t.updateSC), s(t, "blur", t.blurHandler), s(t, "focus", t.focusHandler), s(t, "keydown", t.keydownHandler), s(t, "keyup", t.keyupHandler), t.autocompleteAttr ? t.setAttribute("autocomplete", t.autocompleteAttr) : t.removeAttribute("autocomplete"), document.body.removeChild(t.sc), t = null
                }
            }
        }
    }

    return e
}();
!function () {
    "function" == typeof define && define.amd ? define("autoComplete", function () {
        return autoComplete
    }) : "undefined" != typeof module && module.exports ? module.exports = autoComplete : window.autoComplete = autoComplete
}();

let route_id;
const route_stop_info = document.getElementById("route_stop_info");
new autoComplete({
    selector: route_stop_info,
    minChars: 1,
    source: function (term, suggest) {
        term = term.toLowerCase();
        let choices = route_list;
        let matches = [];
        for (let i = 0; i < choices.length; i++)
            if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
        suggest(matches);
    },
    onSelect: function (e, term, item) {
        route_id = term;
        document.getElementById("direction_switch").checked = false;
        get_bus_stop_list(route_id, "in");
        document.getElementById("drawer__search__title__label").innerText = term;
    }
});

const get_bus_stop_list = (route_id, direction) => {
    fetch('bus_stop_list_by_route?route_id=' + route_id + "&direction=" + direction, {method: 'get'})
        .then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response.json()
            } else {
                let error = new Error(response.statusText);
                error.response = response;
                throw error
            }
        })
        .then(function (data) {
            console.log(data);
            display_stops(data['stops_list']);
        }).catch(function (error) {
        return error;
    })
};

const timeline__content = document.getElementById("timeline__content");
let timeline_li_list = document.querySelectorAll("li");
const display_stops = (stops) => {
    for (let i of document.querySelectorAll("li")) {
        i.remove();
    }

    for (let value of stops) {
        let li = document.createElement("li");
        let h3 = document.createElement("h3");

        h3.innerHTML = "<i>" + value[0] + "</i> - " + value[1];
        h3.className = "timeline-wrapper__content__h3";
        li.append(h3);
        li.className = "timeline-wrapper__content__event";
        li.id = "timeline-wrapper__content-li";
        timeline__content.appendChild(li);
    }
};

const direction_switch = document.getElementById("direction_switch");
direction_switch.addEventListener("change", () => {
    if (direction_switch.checked === true) {
        console.log(route_id);
        get_bus_stop_list(route_id, "out");
    } else {
        console.log(route_id);
        get_bus_stop_list(route_id, "in");
    }
});


const route_list = ['11', '43', '84a', '46a', '66x', '25', '9', '41c', '31a', '140', '83', '41', '14', '41x',
    '42', '40e', '65', '31b', '120', '66b', '65b', '15', '25a', '51d', '27b', '68', '68x', '39', '31', '7d', '130',
    '7', '79a', '1', '15d', '33', '67x', '56a', '151', '16d', '25x', '25d', '116', '37', '49', '32', '150', '44b',
    '27a', '25b', '53', '67', '39a', '122', '7a', '145', '118', '84', '54a', '47', '33x', '39x', '15a', '69', '123',
    '29a', '40d', '33e', '40', '26', '38b', '38a', '16', '747', '68a', '51x', '757', '83a', '16c', '14c', '84x', '15b',
    '13', '32x', '7b', '38', '27', '41d', '27x', '66a', '61', '38d', '41b', '66e', '142', '77x', '69x', '155', '33d',
    '40b', '79', '70', '77a', '66', '4', '44'];

