var url = window.location.href;
var arr = url.split("/");
var result = arr[0] + "//" + arr[2];
const socket = io.connect(result);

var show = true;

var globalMap = new Map();

var globalObject;

function setGlobalMap(map) {
    globalMap = map;
}

function getGlobalMap() {
    return globalMap;
}

function setGlobalObject(object) {
    globalObject = object;
}

function setGlobalObjectFromID(id) {
    let obj = globalMap.get(id);
    globalObject = obj;
}

function getGlobalObject() {
    return globalObject;
}

function validateSearchForm() {
    let searchTerm = document.getElementById('searchBar').value;
    let data = {'searchParam': 'title', 'searchTerm': searchTerm};
    socket.emit('general_search', data);
}

function validateForm() {
    let object = {};
    let form = document.forms['advancedSearch'];
    object['allChecked'] = true;
    object['noneChecked'] = true;
    Array.from(form.elements).forEach((input) => {
      if (input.type === "checkbox") {
        object[input.name] = input.checked;
        if (!input.checked) {
          object.allChecked = false;
        } else {
          object.noneChecked = false;
        }
      }
    });
    socket.emit('advanced_search', object);
}

socket.on('general_search_response', function (data) {
    var map = new Map();
    data.forEach((result) => {
      map.set(result[0], result[1]);
    });
    setGlobalMap(map);
    setTableData(getGlobalMap());
});

socket.on('advanced_search_response', function (data) {
    var map = new Map();
    data.forEach((result) => {
      result.forEach((entry) => {
        map.set(entry[0], entry[1]);
      })
    });
    setGlobalMap(map);
    setTableData(getGlobalMap());
});

function setTableData(map) {
    document.getElementById('searchTable').innerHTML = ''
    const _mapArr = Array.from(map);
    for (let i = 0; i < _mapArr.length; i++) {
      var tableNode = document.createElement('tr');
      tableNode.setAttribute('class', 'row100 body');
      tableNode.setAttribute('id',_mapArr[i][0])
      tableNode.setAttribute('onclick','openTitleWindow(this.id)');
      var tableText1 = document.createElement('td');
      tableText1.setAttribute('class', 'cell100 column1');
      tableText1.style.textDecoration = "underline";
      var tableText2 = document.createElement('td');
      tableText2.setAttribute('class', 'cell100 column2');
      var tableText3 = document.createElement('td');
      tableText3.setAttribute('class', 'cell100 column3');
      tableText1.innerHTML = _mapArr[i][1].title;
      if (_mapArr[i][1].imdb_rating != null) {
        tableText2.innerHTML = _mapArr[i][1].imdb_rating;
      } else {
        tableText2.innerHTML = 'Not Rated';
      }

      if (_mapArr[i][1].cwp_rating != null) {
        tableText3.innerHTML = _mapArr[i][1].cwp_rating;
      } else {
        tableText3.innerHTML = 'Not Rated';
      }
      tableNode.appendChild(tableText1);
      if (show) {
        tableNode.appendChild(tableText2);
        tableNode.appendChild(tableText3);
      }
      document.getElementById('searchTable').appendChild(tableNode);
    }
}

function openTitleWindow(id) {
    setGlobalObjectFromID(id);
    let url = './title-page.html#' + id.toString();
    window.location.replace(url);
}