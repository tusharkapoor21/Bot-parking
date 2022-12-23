const sql = require('mssql/msnodesqlv8')
const config = require('../config')

const sqlQuery = (sql_query) => {
  const result = sql.connect(config).then(() => {
    return sql.query(sql_query)
  })

  return result
}

// const data = sqlQuery('select * from parking_spaces')
// data.then(res => console.log(res)).catch(err => console.log(err))
module.exports = sqlQuery;