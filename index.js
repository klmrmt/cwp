var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

// Initial data struct of movie repository
let objectInterface = new Map();

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
        dvd_available: null,
        review_links: null,
        awards: null,
        avg_user_rating: null,
        user_comments: null,
        title_reffered_by: null,
        refferer_rating: null,
        blank_1: null,
        blank_2: null,
        blank_3: null,
        blank_4: null,
        blank_5: null,
        blank_6: null,
        blank_7: null,
        blank_8: null,
        blank_9: null,
        blank_10: null
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
                    objectField.dvd_available = row[i];
                    break;
                case (i = 30):
                    objectField.review_links = row[i];
                    break;
                case (i = 31):
                    objectField.awards = row[i];
                    break;
                case (i = 32):
                    objectField.avg_user_rating = row[i];
                    break;
                case (i = 33):
                    objectField.user_comments = row[i];
                    break;
                case (i = 34):
                    objectField.title_reffered_by = row[i];
                    break;
                case (i = 35):
                    objectField.refferer_rating = row[i];
                    break;
                case (i = 36):
                    objectField.blank_1 = row[i];
                    break;
                case (i = 37):
                    objectField.blank_2 = row[i];
                    break;
                case (i = 38):
                    objectField.blank_3 = row[i];
                    break;
                case (i = 39):
                    objectField.blank_4 = row[i];
                    break;
                case (i = 40):
                    objectField.blank_5 = row[i];
                    break;
                case (i = 41):
                    objectField.blank_6 = row[i];
                    break;
                case (i = 42):
                    objectField.blank_7 = row[i];
                    break;
                case (i = 43):
                    objectField.blank_8 = row[i];
                    break;
                case (i = 44):
                    objectField.blank_9 = row[i];
                    break;
                case (i = 45):
                    objectField.blank_10 = row[i];
                    break;
            }
        }

        const _objectRef = {...objectField};
        objectInterface.set(row[0],_objectRef);
    }
});

function filterMap(hashMap, searchParam, searchTerm) {
    // TODO: Recursive loop through iteration object on dynamic search criteria
    // TODO: Decision matrix against preset search fields
    // TODO: JSON.Stringify? Number parser for <=> operations 

    // Create filtered hashMap reference, iterating parsed map as object
    const filtered = new Map([...hashMap].filter(([key, value]) => {
        // Return key value pair to hashMap that fits search criteria
        try {
            return value[searchParam].toString().toLowerCase().includes(searchTerm.toLowerCase());
        } catch { /* Null value propogation error */ }
    }));
    // Return total filtered map to locale called
    return filtered;
}


app.use(express.static(__dirname + '/public'));
server.listen(process.env.PORT || 8080, () => {
    console.log('Server listening at [http://localhost:%d]', process.env.PORT || 8080);
});


//overall genre
var englishMovie
var englishTVSeries
var indianDoc
var IndianMovie
var indianShortDoc
var indianShortMovie
var indianTVSeries
var blankGenre
//watched by chai with papa
var watchedByChai
var watchedBlank
//country
//production genre
var arthousecinema
var commercial
var documentary 
var productionBlank
//language
var hindi
var bengali
var english
//Dvd available?
var yesDvd
var blankDvd
//included in top rank
var topRanked
//platform to view title
var amazon
var netflix
var hulu