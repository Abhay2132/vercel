const {getData} = require("./hlprs");

module.exports = async function (req, res) {
	if ( typeof _cj_data != 'undefined' &&  !! _cj_data)
		return res.json(_cj_data);
	const data = await getData();
	res.json(data);
}