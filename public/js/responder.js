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