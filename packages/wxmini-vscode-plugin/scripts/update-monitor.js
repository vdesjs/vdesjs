const fse = require('fs-extra');
const path = require('path');

const WX_MONITOR_PATH = path.resolve(process.cwd(), '../wx-monitor');
console.log(WX_MONITOR_PATH);

fse.removeSync(path.resolve(process.cwd(), '.monitor'));

fse.copySync(
  WX_MONITOR_PATH + '/dist/monitor',
  path.resolve(process.cwd(), '.monitor'),
  {
    recursive: true
  }
);
