const fs = require('fs')
const _path = require('path')
const os = require('os')

const targetDir = _path.join(__dirname, '../pages/wrap/sword_to_offer')

/**
 * 添加日期
 * @param {string} path
 */
function autoDate(path) {
  fs.readdirSync(targetDir).forEach((name, index) => {
    const currentPath = _path.join(targetDir, name)
    const currentStat = fs.statSync(currentPath)
    if (currentStat.isDirectory()) {
      return autoDate(currentPath)
    } else if (name.endsWith('.page.md') && name !== 'index.page.md') {
      const data = fs.readFileSync(currentPath).toString().split('\n')
      // fake
      // data[1] = `date: ${1648397724000 + 86400000 * (parseInt(name.split('_')[0].replaceAll('day', ''), 10))}`
      data.splice(1, 0, `date: ${1648397724000}`)
      fs.writeFileSync(currentPath, data.join('\n'))
      console.log(currentPath + ' 添加成功！')
    }
    return true
  })
}

autoDate(targetDir)
