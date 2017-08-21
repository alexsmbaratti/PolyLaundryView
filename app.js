var http = require('http');

var washer1Line = 10963;
var washer2Line = 12205;
var washer3Line = 13597;
var washer4Line = 14835;

var washerCode = 828233;

var statusArray = [];

var options = {
  host: 'classic.laundryview.com',
  path: '/laundry_room.php?view=c&lr=' + washerCode
}
var request = http.request(options, function(res) {
  var data = '';
  res.on('data', function(chunk) {
    data += chunk;
  });
  res.on('end', function() {
    // console.log(data);
    washer1Line = data.indexOf("<span class=\"stat\">");
    if (data.substring(washer1Line, washer1Line + 19) == "<span class=\"stat\">") {
      for (i = washer1Line; i < data.length; i++) {
        if (data.substring(i, i + 7) == "</span>") {
          statusArray.push(data.substring(washer1Line + 19, i).trim());
          console.log(data.substring(washer1Line + 19, i).trim());
          data = data.substring(i + 7);
          break;
        }
      }
    }

    washer2Line = data.indexOf("<span class=\"stat\">");
    if (data.substring(washer2Line, washer2Line + 19) == "<span class=\"stat\">") {
      for (i = washer2Line; i < data.length; i++) {
        if (data.substring(i, i + 7) == "</span>") {
          statusArray.push(data.substring(washer2Line + 19, i).trim());
          data = data.substring(i + 7);
          break;
        }
      }
    }

    washer3Line = data.indexOf("<span class=\"stat\">");
    if (data.substring(washer3Line, washer3Line + 19) == "<span class=\"stat\">") {
      for (i = washer3Line; i < data.length; i++) {
        if (data.substring(i, i + 7) == "</span>") {
          statusArray.push(data.substring(washer3Line + 19, i).trim());
          data = data.substring(i + 7);
          break;
        }
      }
    }

    washer4Line = data.indexOf("<span class=\"stat\">");
    if (data.substring(washer4Line, washer4Line + 19) == "<span class=\"stat\">") {
      for (i = washer4Line; i < data.length; i++) {
        if (data.substring(i, i + 7) == "</span>") {
          statusArray.push(data.substring(washer4Line + 19, i).trim());
          data = data.substring(i + 7);
          break;
        }
      }
    }

    for (output in statusArray) {
      // console.log(statusArray[output].substring(statusArray[output].length - 4, statusArray[output].length));
      switch (statusArray[output].substring(statusArray[output].length - 4, statusArray[output].length)) {
        case "able":
          statusArray[output] = "Available";
          break;
        case " min":
          statusArray[output] = statusArray[output].substring(statusArray[output].length - 6, statusArray[output].length - 4).trim() + " Minutes";
          break;
        case "idle":
          statusArray[output] = "Idle";
          break;
        default:
      }
    }

    console.log("Washer 1 Status: " + statusArray[0]);
    console.log("Washer 2 Status: " + statusArray[1]);
    console.log("Dryer 1 Status: " + statusArray[2]);
    console.log("Dryer 2 Status: " + statusArray[3]);
  });
});
request.on('error', function(e) {
  console.log(e.message);
});
request.end();
