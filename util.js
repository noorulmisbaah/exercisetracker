const fs = require('fs');

function splitDate(date) {
    const newDate = date.split('-');
    const year = newDate[0];
    const month = Number(newDate[1]) - 1;
    const day = newDate[2];

    return new Date(new Date(year, month.toString(), day)).toDateString();
}
function save(username) {
    const fileContent = JSON.parse(fs.readFileSync('./users.json'));
    var currentUser;

    currentUser = { username, _id: fileContent.length.toString() };
    fileContent[fileContent.length] = currentUser;

    fs.writeFileSync('./users.json', JSON.stringify(fileContent, null, '\t'));

    return currentUser;
}

function addExercise({ _id, description, duration, date }) {
    const fileContent = JSON.parse(fs.readFileSync('./users.json'));
    const exercises = JSON.parse(fs.readFileSync('./exercises.json')); 
    var concatenatedDate;
    var [currentUser] = fileContent.filter(user => user._id === _id);

    if (date && (date.split('-').length === 3)) {
        concatenatedDate = splitDate(date);
    }

    const obj = { 
        _id,
        username: currentUser.username, 
        date: (concatenatedDate ? concatenatedDate : new Date().toDateString()), 
        duration: Number(duration), 
        description
    };
    
    currentUser.description = description;
    currentUser.duration = Number(duration);
    currentUser.date = obj.date;
    exercises[exercises.length] = obj;
    fs.writeFileSync('./exercises.json', JSON.stringify(exercises, null, '\t'));
    addLog(obj);
    return obj;
}

function addLog({ _id, description, duration, date, username }) {
    const logs = JSON.parse(fs.readFileSync('./logs.json'));
    const [currentLog] = logs.filter(log => log._id === _id);
    const log = {
        username,
        count: 1,
        _id,
        log: [
            {
                description,
                duration,
                date
            }
        ]
    };

    if (!currentLog) {
        logs[logs.length] = log;
        fs.writeFileSync('./logs.json', JSON.stringify(logs, null, '\t'));
    } else {
        currentLog.log[currentLog.log.length] = { description, duration, date };
        currentLog.count = currentLog.log.length;
        fs.writeFileSync('./logs.json', JSON.stringify(logs, null, '\t'));
    }
}

function obtainUserLog(_id) {
    const userId = _id;
    const logs = JSON.parse(fs.readFileSync('./logs.json'));
    var [userLog] = logs.filter(log => log._id === userId);

    return userLog;
}

function obtainBasedOnDateAndLimit(_id, { from, to, limit }) {
    const users = JSON.parse(fs.readFileSync('./logs.json'));
    const [currentUser] = users.filter(user => user._id === _id);
    var newLog = [];
    var logs = [];
    var logDates = [];
    var logIndex = 0;
    var iterationCount;

    for (var i = 0; i < currentUser.log.length; i++) {
        logDates[i] = Date.parse(currentUser.log[i].date);
    }

    if (!currentUser) {
        console.log('Looks like there is no user with an ID ' + _id + '.')
        return ({ notFound: 'User not found' });
    } 

    if (from) {
        currentUser.from = splitDate(from)
    }

    if (to) {
        currentUser.to = splitDate(to);

        for (var i = 0; i < currentUser.log.length; i++) {
            if (logDates[i] >= Date.parse(from) && logDates[i] <= Date.parse(to)) {
                logs[logIndex] = currentUser.log[i];
                logIndex++;
            }
        }
    } else if (from){
        logs = currentUser.log.filter((l, index) => logDates[index] >= Date.parse(from));
    } else {
        logs = [...currentUser.log];
    }
 
    if (limit) {
        limit = Number(limit);
        iterationCount = (limit > logs.length) ? logs.length : limit;
    } else {
        iterationCount = logs.length;
    }

    for (var i = 0; i < iterationCount; i++) {
        newLog[i] = logs[i];
    }

    currentUser.log = [...newLog];

    return currentUser;
};

module.exports = { save, addExercise, obtainUserLog, obtainBasedOnDateAndLimit };