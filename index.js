var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

// Initial data struct of movie repository
let objectInterface = new Map();
const searchTypes = ['overall_genre', 'language', 'production_genre', 'watched_by_cwp', 'include_in_top', 'dvd_available', 'platforms', 'country_theme'];
const searchMap = {
    // Overall Genre
    english_movie: {key:'overall_genre', value:'english movie'},
    english_tv: {key:'overall_genre', value:'english tv'},
    indian_doc: {key:'overall_genre', value:'indian documentary'},
    indian_movie: {key:'overall_genre', value:'indian movie'},
    indian_short_doc: {key:'overall_genre', value:'indian short documentary'},
    indian_short_movie: {key:'overall_genre', value:'indian short movie'},
    indian_tv: {key:'overall_genre', value:'indian tv'},
    genre_blank: {key:'overall_genre', value:''},
    // Watched by CWP
    watched_no: {key:'watched_by_cwp', value:'no'},
    watched_yes: {key:'watched_by_cwp', value:'yes'},
    watched_queue: {key:'watched_by_cwp', value:'queue'},
    watched_blank: {key:'watched_by_cwp', value:''},
    // Production Genre
    prod_Art_House: {key:'production_genre', value:'Art House'},
    prod_commercial: {key:'production_genre', value:'commercial'},
    prod_doc: {key:'production_genre', value:'documentary'},
    prod_blank: {key:'production_genre', value:''},
    //country/ languages
    zero: {key: 'country_theme', value: '0'},
    country_afghanistan: {key: 'country_theme', value: 'afghanistan'},
    country_american: {key: 'country_theme', value: 'american'},
    country_arabic: {key: 'country_theme', value: 'arabic'},
    country_brazil: {key: 'country_theme', value: 'brazil'},
    country_english: {key: 'country_theme', value: 'english'},
    country_french: {key: 'country_theme', value: 'french'},
    country_german: {key: 'country_theme', value: 'german'},
    country_hungarian: {key: 'country_theme', value: 'hungarian'},
    country_indian: {key: 'country_theme', value: 'indian'},
    country_isreal: {key: 'country_theme', value: 'isreal'},
    country_italy: {key: 'country_theme', value: 'italy'},
    country_spain: {key: 'country_theme', value: 'spain'},
    country_syria: {key: 'country_theme', value: 'syria'},
    country_thai: {key: 'country_theme', value: 'thai'},
    // Languages
    hindi: {key:'language', value:'hindi'},
    english: {key:'language', value:'english'},
    bengali: {key:'language', value:'bengali'},
    arabic: {key:'language', value:'arabic'},
    assamesse: {key:'language', value:'assamesse'},
    bhojpuri: {key:'language', value:'bhojpuri'},
    bodo_assamese: {key:'language', value:'bodo, assamese'},
    french: {key:'language', value:'french'},
    german: {key:'language', value:'german'},
    gujarati: {key:'language', value:'gujarati'},
    hebrew: {key:'language', value:'hebrew'},
    hindi_assamese: {key:'language', value:'hindi/assamese'},
    hindi_marathi: {key:'language', value:'hindi, marathi'},
    italian: {key:'language', value:'italian'},
    kannada: {key:'language', value:'kannada'},
    khasi: {key:'language', value:'khasi'},
    konkani: {key:'language', value:'konkani'},
    lang_blank: {key:'language', value:''},
    maithili: {key:'language', value:'maithili'},
    malayalam: {key:'language', value:'malayalam'},
    manipuri: {key:'language', value:'manipuri'},
    marathi: {key:'language', value:'marathi'},
    nepali: {key:'language', value:'nepali'},
    oriya: {key:'language', value:'oriya'},
    punjabi: {key:'language', value:'punjabi'},
    sinhalese: {key:'language', value:'sinhalese'},
    spanish: {key:'language', value:'spanish'},
    tamil: {key:'language', value:'tamil'},
    telegu: {key:'language', value:'telegu'},
    thai: {key:'language', value:'thai'},
    urdu: {key:'language', value:'urdu'},
    // DVD Availability
    dvd_yes: {key:'dvd_available', value:'yes'},
    dvd_no: {key:'dvd_available', value:'no'},
    dvd_blank: {key:'dvd_available', value:''},
    // Top ranked
    top_ranked_yes: {key:'include_in_top', value:'yes'},
    top_ranked_no: {key:'include_in_top', value:'no'},
    top_ranked_blank: {key:'include_in_top', value:''},
    // Where to watch
    amazon: {key:'platforms', value:'amazon'},
    netflix: {key:'platforms', value:'netflix'},
    hulu: {key:'platforms', value:'hulu'},
    youtube: {key:'platforms', value:'youtube'},
    mubi: {key:'platforms', value:'mubi'},
    cinemas_of_india: {key:'platforms', value:'cinemas'},
    movie_saints: {key:'platforms', value:'saints'},
}

const xlsxFile = require('read-excel-file/node');
const { title } = require('process');
xlsxFile('./chaiwithpapa.xlsx').then((rows) => {
    let objectField = {
        imdb_createdDate: null,
        imdb_modifiedDate: null,
        imdb_description: null,
        title: null,
        alternate_title: null,
        description_of_title: null,
        overall_genre: null,
        imdb_rating: null,
        country_theme: null,
        production_genre: null,
        language: null,
        country_of_origin: null,
        runtime: null,
        year: null,
        type_genre: null,
        num_votes: null,
        release_date: null,
        directors: null,
        actors: null,
        watched_by_cwp: null,
        cwp_rating: null,
        date_rated: null,
        cwp_comments: null,
        include_in_top: null,
        last_edit_date: null,
        link_to_trailer: null,
        film_festivals: null,
        platforms: null,
        specific_link: null,
        dvd_available: null,
        review_links: null,
        awards: null,
        avg_user_rating: null,
        user_comments: null,
        title_reffered_by: null,
        refferer_rating: null,
        date_added: null,
    };
    for (var j = 0; j < rows.length; j ++) {
        const row = rows[j];
        for (var i = 1; i < row.length; i++) {
            switch (i) {
                case (i = 1):
                    objectField.imdb_createdDate = row[i];
                    break;
                case (i = 2):
                    objectField.imdb_modifiedDate = row[i];
                    break;
                case (i = 3):
                    objectField.imdb_description = row[i];
                    break;
                case (i = 4):
                    objectField.title = row[i];
                    break;
                case (i = 5):
                    objectField.alternate_title = row[i];
                    break;
                case (i = 6):
                    objectField.description_of_title = row[i];
                    break;
                case (i = 7):
                    objectField.overall_genre = row[i];
                    break;
                case (i = 8):
                    objectField.imdb_rating = row[i];
                    break;
                case (i = 9):
                    objectField.country_theme = row[i];
                    break;
                case (i = 10):
                    objectField.production_genre = row[i];
                    break;
                case (i = 11):
                    objectField.language = row[i];
                    break;
                case (i = 12):
                    objectField.country_of_origin = row[i];
                    break;
                case (i = 13):
                    objectField.runtime = row[i];
                    break;
                case (i = 14):
                    objectField.year = row[i];
                    break;
                case (i = 15):
                    objectField.type_genre = row[i];
                    break;
                case (i = 16):
                    objectField.num_votes = row[i];
                    break;
                case (i = 17):
                    objectField.release_date = row[i];
                    break;
                case (i = 18):
                    objectField.directors = row[i];
                    break;
                case (i = 19):
                    objectField.actors = row[i];
                    break;
                case (i = 20):
                    objectField.watched_by_cwp = row[i];
                    break;
                case (i = 21):
                    objectField.cwp_rating = row[i];
                    break;
                case (i = 22):
                    objectField.date_rated = row[i];
                    break;
                case (i = 23):
                    objectField.cwp_comments = row[i];
                    break;
                case (i = 24):
                    objectField.include_in_top = row[i];
                    break;
                case (i = 25):
                    objectField.last_edit_date = row[i];
                    break;
                case (i = 26):
                    objectField.link_to_trailer = row[i];
                    break;
                case (i = 27):
                    objectField.film_festivals = row[i];
                    break;
                case (i = 28):
                    objectField.platforms = row[i];
                    break;
                case (i = 29):
                    objectField.specific_link = row[i];
                    break;
                case (i = 30):
                    objectField.dvd_available = row[i];
                    break;
                case (i = 31):
                    objectField.review_links = row[i];
                    break;
                case (i = 32):
                    objectField.awards = row[i];
                    break;
                case (i = 33):
                    objectField.avg_user_rating = row[i];
                    break;
                case (i = 34):
                    objectField.user_comments = row[i];
                    break;
                case (i = 35):
                    objectField.title_reffered_by = row[i];
                    break;
                case (i = 36):
                    objectField.refferer_rating = row[i];
                    break;
                case (i = 37):
                    objectField.date_added = row[i];
                    break;
            }
        }

        const _objectRef = {...objectField};
        objectInterface.set(row[0],_objectRef);
    }
});

function filterMap(hashMap, searchParam, searchTerm) {
    // DONE: Recursive loop through iteration object on dynamic search criteria
    // DONE: Decision matrix against preset search fields
    // TODO: JSON.Stringify? Number parser for <=> operations

    // Create filtered hashMap reference, iterating parsed map as object
    const filtered = new Map([...hashMap].filter(([key, value]) => {
        // Return key value pair to hashMap that fits search criteria
        try {
            if (searchTerm === '') {
                return value[searchParam] === null;
            } else {
                return value[searchParam].toString().toLowerCase().includes(searchTerm.toLowerCase());
            }
        } catch { /* Null value propogation error */ }
    }));
    // Return total filtered map to locale called
    return filtered;
}

function recursiveSearch(object) {
    // Initial state of recursively searched map
    let recursiveMap = [objectInterface];
    // Initial index state through searchTypes
    let elementIndex = 0;

    // Returned promise of search result
    return new Promise(resolve => {
        // Structure calls to recursive mutuallyExclusive search function
        function doSearch(element) {
            // Returned promise for result from recursive_meSearch()
            return new Promise(resolve => {
                // Search for each element that falls under a singular mutually exclusive category, wait for result
                recusive_meSearch(element, object, recursiveMap[recursiveMap.length - 1]).then((result) => {
                    // On retrieval of result, iterate up elementIndex
                    elementIndex += 1;
                    // If the result has been filtered, add the new filtered map to the recursive tree otherwise do nothing
                    if (result.filtered) {
                        recursiveMap.push(result.map);
                    }
                    // If no checkboxes were checked on advanced search, return a blank map
                    if (result.noneChecked) {
                        resolve(new Map());
                    } else {
                        // Return most recent instance of the filtered map under the recursive tree
                        resolve(recursiveMap[recursiveMap.length - 1]);
                    }
                });
            });
        }

        // Iterative search function to collapse asynchronous state into a single synchronous set
        function iterativeSearch() {
            // Search indexed tree against element 0
            doSearch(searchTypes[elementIndex]).then((res) => {
                // If the function has not reached the end of all search fields, iterate until it has
                if (elementIndex === searchTypes.length) {
                    // Return array condensed iterated result
                    resolve([res]);
                } else {
                    iterativeSearch();
                }
            });
        }

        // Start single state iterative search
        iterativeSearch();
    });

}

// Asynchronous mutually exclusive search function
async function recusive_meSearch(element, object, map) {
    // Create a new map holding the result from the filter on the main data store
    let mutuallyExclusive = new Map();
    // Check against if there has been a filtered result received
    let beenFiltered = false;
    return new Promise(resolve => {
        // Iterate through checkbox object
        for (const property in object) {
            let key = property;
            let value = object[property];
            try {
                // If the search field matches the current search index and the value has been checked => proceed to search
                if (searchMap[key].key.toString().toLowerCase() === element.toString().toLowerCase() && value === true) {
                    // Update filtered status to true
                    beenFiltered = true;
                    // Filter from data store based on key-state parameters
                    let filtMap = filterMap(map, searchMap[key].key, searchMap[key].value);
                    // Update the mutuallyExlusive map with the filtered result
                    filtMap.forEach((v, k) => mutuallyExclusive.set(k, v));
                }
            } catch { /* Stop error propogation */ }
        }
        // Resolve a data object containing the hashMap for the filtered result, and consecutive states for if the map has been filtered, allChecked and noneChecked
        resolve({'map': mutuallyExclusive, 'filtered': beenFiltered, 'allChecked': object.allChecked, 'noneChecked': object.noneChecked});
    });
    
}

io.on('connection', function (socket) {
    // On receive of the 'advanced_search' command from the client perform a recursiveSearch 
    socket.on('advanced_search', function(data) {
        // If no checkboxes ticked, don't search (for efficiency)
        if (data.noneChecked) {
            let transitArray = [new Map()];
            socket.emit('advanced_search_response', Array.from(transitArray[0]));
        } else {
            // Recursively search through the data store
            recursiveSearch(data).then((result) => {
                let transitArray = [];
                for (var i = 0; i < result.length; i++) {
                    transitArray.push(Array.from(result[i]));
                }
                // Emit condensed Map under ES6 JSON standard
                socket.emit('advanced_search_response', transitArray);
            });
        }
    });
    socket.on('general_search', function(data) {
        let transitArray = [];
        transitArray.push(filterMap(objectInterface, data.searchParam, data.searchTerm));
        socket.emit('general_search_response', Array.from(transitArray[0]));
    });
    socket.on('get_by_id', function(data) {
        let transitMap = JSON.stringify(objectInterface.get(data.toString()));
        socket.emit('get_by_id_result', transitMap);
    });
});

app.use(express.static(__dirname + '/public'));
server.listen(process.env.PORT || 8080, () => {
    console.log('Server listening at [http://localhost:%d]', process.env.PORT || 8080);
});
