var callback;

var sUrl="http://www.gui-nephelo.tk:20119/"
if(sessionStorage["keekie"]==undefined){sessionStorage["keekie"]="";}

$.getUrlParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r != null) return unescape(r[2]);
    return null;
}

function getParam(o){
    return eval("Object({'"+o.replace(/&/g,"','").replace(/=/g,"':'")+"'})")
}

function GET(url,params,onok,onerr){
    var s = document.createElement("script")
    $(s).attr("class","tmp")
    var head = document.getElementsByTagName("head").item(0)
    var st = "?"
    for(i in params){
        st = st + i + "=" +params[i]+"&"
    }

    st += "keekie="+sessionStorage["keekie"]

    s.src = url +st
    s.defer = true
    s.onerror = onerr;
    void(head.appendChild(s))
    callback = (ev) =>{
        onok(ev)
        void(head.removeChild(document.getElementsByClassName("tmp")[0]))
    }

}

function POST(URL, PARAMS) {
    var temp = document.createElement("form");
    temp.action = URL;
    temp.method = "post";
    temp.style.display = "none";
    for (var x in PARAMS) {
        var opt = document.createElement("textarea");
        opt.name = x;
        opt.value = PARAMS[x];
        // alert(opt.name)
        temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    return temp;
}

function sub_pic(url, onok) {
    var tmp = document.createElement("img");
    tmp.src = url;
    tmp.onload = (ev) => {
        onok(true, ev,url);
    }
    tmp.onerror = () => {
        onok(false, null,url);
    }
}

function s_sub_pic(baseurl,grade, ss, uid,i,ii,onok) {
    sub_pic(baseurl.format({
        "level": "201200" + (parseInt(ii) + 1), "grade": parseInt(grade) - 3 * (2 - ii), "sid": ss[i]["id"], "uidi": uid
    }), (status, ev, url) => {
            onok(status, url, ii, i);
    }
    );
}

function progressBar(view) {
    return parswInt($(view).css("width").replace("%", "")) / 100;
}

function progressBar(view, degree) {
    $(view).css("width", degree*100+"%")
} 

String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}
function sleep(d) {
    for (var t = Date.now(); Date.now() - t <= d;);
}

function checkServer() {

}
