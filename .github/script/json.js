const fs = require('fs');
const path = require('path');

// 读取 JSON 文件
const args = process.argv;

/**
 * @param index {number}
 * @return {string}
 */
const getArg = function (index) {
    if (index < 0 || index >= args.length) {
        return undefined;
    } else return args[index];
}
const jsonPath = path.join(__dirname, '..', '..', getArg(2));
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

if (getArg(4) && getArg(4) === 'set' && getArg(5)) {
    data[getArg(3)] = getArg(5);
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
} else if (getArg(4) && getArg(4) === 'get' && getArg(5)) {
    console.log(`${getArg(5)}=${data[getArg(3)]}`);
} else {
    console.log(data[getArg(3)]);
}
