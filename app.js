var http = require('http');

var washers = 0;
var currentIndex = 0;

var roomCode = 828233;

var statusArray = [];

var options = {
  host: 'classic.laundryview.com',
  path: '/laundry_room.php?view=c&lr=' + roomCode
}
var request = http.request(options, function(res) {
  var data = '';
  res.on('data', function(chunk) {
    data += chunk;
  });
  res.on('end', function() {
    // console.log(data);

    washers = getNumberOfWashers(data);

    for (j = 0; j < washers; j++) {
      currentIndex = data.indexOf("<span class=\"stat\">");
      for (i = currentIndex; i < data.length; i++) {
        if (data.substring(i, i + 7) == "</span>") {
          statusArray.push(data.substring(currentIndex + 19, i).trim());
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
        case "osed":
          statusArray[output] = "Idle, but still loaded";
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

function getNumberOfWashers(html) {
  var number = 0;
  var index = 0;
  while (index != -1) {
    index = html.indexOf("<span class=\"stat\">");
    if (index != -1) {
      html = html.substring(index + 19);
      number++;
    }
  }
  console.log("Number: " + number);
  return number;
}
