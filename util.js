const fs = require('fs');

function save(username) {
    const fileContent = JSON.parse(fs.readFileSync('./users.json'));
    const userExists = fileContent.some(user => user.username.toLowerCase() === username.toLowerCase());
    var currentUser;

    //If the user exists, the user information will be returned.
    if (userExists) {
        return ([user] = fileContent.filter(user => user.username.toLowerCase() === username.toLowerCase()));
    //Otherwise, the new user will be added to the record and the username and ID for new user will be returned.
    } else {
        currentUser = { username, _id: fileContent.length.toString() };
        fileContent[fileContent.length] = currentUser;
        fs.writeFileSync('./users.json', JSON.stringify(fileContent, null, '\t'));
    }

    return currentUser;
}

function addExercise({ _id, description, duration, date }) {
    const fileContent = JSON.parse(fs.readFileSync('./users.json'));
    const [currentUser] = fileContent.filter(user => user._id === _id);

    if (!currentUser) {
        return;
    } else {
        const exercises = JSON.parse(fs.readFileSync('./exercises.json'));
        const obj = { username: currentUser.username, 
            description, 
            duration: Number(duration), 
            date: (date ? new Date(date).toDateString() : new Date().toDateString()), 
            _id 
        };
        
        exercises[exercises.length] = obj;
        fs.writeFileSync('./exercises.json', JSON.stringify(exercises, null, '\t'));
        addLog(obj);
        return obj;
    }
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

function sendUserLog(_id) {
    const userId = _id;
    const logs = JSON.parse(fs.readFileSync('./logs.json'));
    const [userLog] = logs.filter(log => log._id === userId);

    if (!userLog)
        return;
    return userLog;
}

module.exports = { save, addExercise, sendUserLog };