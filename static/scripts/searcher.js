function GET(url,params,onok){
    var s = document.createElement("script")
    var head = document.getElementsByTagName("head").item(0)
    var st = "?"
    for(i in params){
        st = st + i + "=" +params[i]+"&"
    }
    st = st.slice(0,-1)

    s.src = url +st
    s.defer = true
    s.onload = (ev) =>{
        onok(eval("a"))
        void(head.removeChild(s))
    }
    void(head.appendChild(s))
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
function sleep(delay) {
    for (var t = Date.now(); Date.now() - t <= d;);
}

function checkServer() {

}