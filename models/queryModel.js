const DB = require('./dbModel')

var query = function() {}

query.insert = (t_name, params, values, callback) => {
	var v = ''
	for (let p in params)
		v += '?, '
	v = v.slice(0, -2)
	var sql = "INSERT INTO " + t_name + " (" + params.join() + ") " +
		"VALUES " + "(" + v + ")"
	DB.insert(sql, values, (err, res) => {
		if (err)
			callback(err, null)
		else
			callback(null, res)
	})
}

query.delone = (t_name, params, pval, callback) => {
	var sql = "DELETE FROM "+t_name+" WHERE "+params+"=\'"+pval+"\'"
	DB.insert(sql, (err, res) => {
		if (err)
			callback(err, null)
		else
			callback(null, res)
	})
}

query.update = (t_name, sets, values, param, pval, callback) => {
	var z = ''
	for (let s in sets)
		z += sets[s]+"=?, "
	z = z.slice(0, -2)
	var sql = "UPDATE "+t_name+" SET "+z+" WHERE "+param+"=\'"+pval+"\'"
	DB.insert(sql, values, (err, res) => {
		if (err)
			callback("failed to update", null)
		else
			callback(null, "updated")
	})
}


query.fetchall = (t_name, callback) => {
	var sql = "SELECT * FROM " + t_name
	DB.fetch(sql, (err, res) => {
		if (err)
			callback(err, null)
		else
			callback(null, res)
	})
}

query.fetchallOB = (t_name, orderBy, callback) => {
	var sql = `SELECT * FROM ${t_name} ORDER BY ${orderBy}`
	DB.fetch(sql, (err, res) => {
		if (err)
			callback(err, null)
		else {
			callback(null, res)
		}
	})
}

query.fetchallnot = (t_name, param, pval, callback) => {
	var sql = "SELECT * FROM "+t_name+" WHERE NOT "+param+"=\'"+pval+"\'"
	DB.fetch(sql, (err, res) => {
		if (err)
			callback(err, null)
		else
			callback(null, res)
	})
}

query.fetchallnotMCols = (t_name, params, pvals, callback) => {
	var sql = "SELECT * FROM "+t_name+" WHERE NOT "
	var chunk = ""
	for(i = 0; i < params.length; i++) {
		chunk += params[i]+"=\'"+pvals[i]+"\'"
		if (i + 1 < params.length)
			chunk += " AND NOT "
	}
	sql += chunk
	DB.fetch(sql, (err, res) => {
		if (err)
			callback(err, null)
		else {
			callback(null, res)
		}
	})
}

query.countRows = (t_name, callback) =>
{
	var sql = "SELECT COUNT(*) as total from "+t_name//->fetchColumn();
	DB.fetch(sql, (err, res) => {
		if (err)
			callback(err, null)
		else
			callback(null, res[0].total)
	})
}

query.fetchone = (t_name, val, params, pval, callback) => {
	var sql = "SELECT "+val+" FROM "+t_name+" WHERE "+params+"=\'"+pval+"\'"
	DB.fetch(sql, (err, res) => {
		if (err)
			callback(err, null)
		else {
			callback(null, res)
		}
	})
}

query.tableExists = (t_name, callback) => {
	var sql =	"SELECT COUNT(*) as total FROM information_schema.tables" +
				" WHERE table_schema = 'matcha_db'" +
				` AND table_name = '${t_name}'`
	DB.fetch(sql, (err, res) => {
		if (err) {
			callback(err, null)
		}
		else {
			callback(null, res[0].total)
		}
	})
}

query.fetchoneMRows = (t_name, val, params, pvals, callback) => {
	var sql = "SELECT "+val+" FROM "+t_name+" WHERE "
	var chunk = ""
	for(i = 0; i < params.length; i++) {
		chunk += params[i]+"=\'"+pvals[i]+"\'"
		if (i + 1 < params.length)
			chunk += " AND "
	}
	sql += chunk
	DB.fetch(sql, (err, res) => {
		if (err)
			callback(err, null)
		else {
			callback(null, res)
		}
	})
}
query.fetchoneMOrRows = (t_name, val, params, pvals, callback) => {
	var sql = "SELECT "+val+" FROM "+t_name+" WHERE "
	var chunk = ""
	for(i = 0; i < pvals.length; i++) {
		chunk += params[0]+"=\'"+pvals[i]+"\'"
		if (i + 1 < pvals.length)
			chunk += " OR "
	}
	sql += chunk
	DB.fetch(sql, (err, res) => {
		if (err)
			callback(err, null)
		else {
			callback(null, res)
		}
	})
}

query.fetchoneMRowNot = (t_name, val, params, pvals, ovals, callback) => {
	var sql = "SELECT "+val+" FROM "+t_name+" WHERE "
	var chunk1 = ""
	var chunk2 = ""
	for(i = 0; i < params.length; i++) {
		chunk1 += params[i]+"=\'"+pvals[i]+"\'"
		chunk2 += params[i]+"=\'"+ovals[i]+"\'"
		if (i + 1 < params.length) {
			chunk1 += " AND NOT "
			chunk2 += " AND NOT "
		}
	}
	if (ovals[0])
		sql += chunk1 +' OR '+chunk2
	else
		sql += `${chunk1}`
	DB.fetch(sql, (err, res) => {
		if (err)
			callback(err, null)
		else {
			callback(null, res)
		}
	})
}

query.fetchoneRange = (t_name, val, param, range1, range2, callback) => {
	var sql = "SELECT "+val+" FROM "+t_name+" WHERE "
	var chunk = ` ${param} BETWEEN ${range1} AND ${range2}`
	sql += chunk
	DB.fetch(sql, (err, res) => {
		if (err)
			callback(err, null)
		else {
			callback(null, res)
		}
	})
}

query.fetchoneMAndOr = (t_name, val, params, pvals, ovals, callback) => {
	var sql = "SELECT "+val+" FROM "+t_name+" WHERE "
	var chunk1 = ""
	var chunk2 = ""
	for(i = 0; i < params.length; i++) {
		chunk1 += params[i]+"=\'"+pvals[i]+"\'"
		chunk2 += params[i]+"=\'"+ovals[i]+"\'"
		if (i + 1 < params.length) {
			chunk1 += " AND "
			chunk2 += " AND "
		}
	}
	sql += chunk1 +' OR ' + chunk2
	DB.fetch(sql, (err, res) => {
		if (err)
			callback(err, null)
		else {
			callback(null, res)
		}
	})
}

query.fetchoneMAndOr4 = (t_name, val, params, pvals, ovals, uvals, xvals, callback) => {
	var sql = "SELECT "+val+" FROM "+t_name+" WHERE "
	var chunk1 = ""
	var chunk2 = ""
	var chunk3 = ""
	var chunk4 = ""
	for(i = 0; i < params.length; i++) {
		chunk1 += params[i]+"=\'"+pvals[i]+"\'"
		chunk2 += params[i]+"=\'"+ovals[i]+"\'"
		chunk3 += params[i]+"=\'"+uvals[i]+"\'"
		chunk4 += params[i]+"=\'"+xvals[i]+"\'"
		if (i + 1 < params.length) {
			chunk1 += " AND "
			chunk2 += " AND "
			chunk3 += " AND "
			chunk4 += " AND "
		}
	}
	sql += chunk1+' OR '+chunk2+' OR '+chunk3+' OR '+chunk4
	DB.fetch(sql, (err, res) => {
		if (err)
			callback(err, null)
		else {
			callback(null, res)
		}
	})
}

query.deloneMRows = (t_name, params, pvals, callback) => {
	var sql = "DELETE FROM "+t_name+" WHERE "
	var chunk = ""
	for(i = 0; i < params.length; i++) {
		chunk += params[i]+"=\'"+pvals[i]+"\'"
		if (i + 1 < params.length)
			chunk += " AND "
	}
	sql += chunk
	DB.insert(sql, (err, res) => {
		if (err)
			callback(err, null)
		else {
			callback(null, res)
		}
	})
}

query.updateMRows = (t_name, sets, values, params, pvals, callback) => {
	var z = ''
	var chunk = ""
	var len = params.length
	for (let s in sets)
		z += sets[s]+"=?, "
	for (i = 0; i < len; i++) {
		chunk += params[i]+"=\'"+pvals[i]+"\'"
		if (i + 1 < len)
			chunk += " AND "
	}
	z = z.slice(0, -2)
	var sql = "UPDATE "+t_name+" SET "+z+" WHERE "+chunk
	DB.insert(sql, values, (err, res) => {
		if (err)
			callback("failed to update", null)
		else
			callback(null, "updated")
	})
}

module.exports = query
