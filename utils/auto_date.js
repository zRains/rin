const fs = require('fs')
const _path = require('path')
const os = require('os')

const targetDir = _path.join(__dirname, '../pages')

/**
 * 添加日期
 * @param {string} path
 */
function autoDate(path) {
  fs.readdirSync(targetDir).forEach((name) => {
    const currentPath = _path.join(targetDir, name)
    const currentStat = fs.statSync(currentPath)
    if (currentStat.isDirectory()) {
      return autoDate(currentPath)
    } else if (name.endsWith('.page.md') && name !== 'index.page.md') {
      const data = fs.readFileSync(currentPath).toString().split('\n')
      data.splice(1, 0, `date: ${+currentStat.birthtime}`)
      fs.writeFile(currentPath, data.join('\n'), function (err) {
        if (err) return console.log(err)
        console.log(currentPath + ' 添加成功！')
      })
    }
    return true
  })
}

autoDate(targetDir)
// console.log(targetDir)
