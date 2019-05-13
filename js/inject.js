console.log("injected");

AV.init("{{appid}}", "{{appsecret}}");

doAction();
const interval = setInterval(() => {
  doAction();
}, 60000);

setInterval(() => {
  document.location.reload();
}, 1000 * 60 * 5);

function doAction() {
  const items = wx.cgiData.mass_data;
  if (items.length === 0) return;
  let appmsgidlist = "";
  let titles = {};
  const token = window.wx.commonData.data.t;
  Array.prototype.forEach.call(wx.cgiData.mass_data.sent_list, function(item) {
    appmsgidlist += item.appmsg_info[0].appmsgid + ",";
    titles[item.appmsg_info[0].appmsgid] = item.appmsg_info[0].title;
  });
  appmsgidlist = appmsgidlist.substring(0, appmsgidlist.length - 1);
  request(
    {
      method: "GET",
      url:
        "https://mp.weixin.qq.com/cgi-bin/appmsgotherinfo?appmsgidlist=" +
        appmsgidlist +
        "&token=" +
        token +
        "&token=" +
        token +
        "&lang=zh_CN&f=json&ajax=1"
    },
    function(resp) {
      const data = JSON.parse(resp);
      Array.prototype.forEach.call(data.sent_list, function(item) {
        const info = item.appmsg_info[0];
        var Log = AV.Object.extend("MpMsgLog");
        var log = new Log();
        log.set("read_num", info.read_num);
        log.set("comment_num", info.comment_num);
        log.set("appmsgid", info.appmsgid);
        log.set("title", titles[info.appmsgid]);
        log.save().then(
          function(log) {
            // 成功保存之后，执行其他逻辑.
            console.log("New object created with objectId: " + log.id);
          },
          function(error) {
            // 异常处理
            console.error(
              "Failed to create new object, with error message: " +
                error.message
            );
          }
        );
      });
    }
  );
}

function request(opts, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open(opts.method, opts.url);
  xhr.onload = function() {
    if (this.status >= 200 && this.status < 300) {
      callback(xhr.response);
    } else {
      callback(null, {
        status: this.status,
        statusText: xhr.statusText
      });
    }
  };
  xhr.onerror = function() {
    callback(null, {
      status: this.status,
      statusText: xhr.statusText
    });
  };
  if (opts.headers) {
    Object.keys(opts.headers).forEach(function(key) {
      xhr.setRequestHeader(key, opts.headers[key]);
    });
  }
  var params = opts.params;
  // We'll need to stringify if we've been given an object
  // If we have a string, this is skipped.
  if (params && typeof params === "object") {
    params = JSON.stringify(params);
  }
  xhr.send(params);
}
