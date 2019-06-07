// console.log('Works');

// Web scraping
// Tutorial by Beau Carnes.

const request_promise = require('request-promise');
const cheerio = require('cheerio');
const Table = require('cli-table');

let table = new Table({
    head: ['Username','Likes ♥'],
    colWidths: [15,15]
});
const options = {
    url: 'https://www.freecodecamp.org/forum/directory_items?period=weekly&order=likes_received&_=1559927065177',
    json: true
};

request_promise(options).then((value) => {
    let userData = [];
    for (let user of value.directory_items) {
        userData.push({
            name: user.user.username
            , likes_received: user.likes_received
        })
    }
    process.stdout.write('Loading');
    console.log(userData.slice(0,5));
    getChallengesCompleted(userData);
}).catch((error)=>{
    console.log(error);
});

function getChallengesCompleted(userData){
    var i = 0;
    function next(){
        if(i<userData.length){
            var option = {
                url : 'https://www.freecodecamp.org/'+ userData[i].name,
                transform: body=>cheerio.load(body)
            }
            request_promise(option).then(function($){
                process.stdout.write('.');
                table.push([userData[i].name,userData[i].likes_received]);
                ++i;
                return next();
            })
        }else{
            print();
        }
    }
    return next();
}

function print(){
    console.log('\n');
    console.log('Data Loaded');
    console.log(table.toString());
}