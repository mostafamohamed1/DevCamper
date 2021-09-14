const advancedResult = (model, populate) => async (req, res, next) => {
	let query;
	// Copy req.query
	let reqQuery = { ...req.query };
	// Fields to exclude
	const removeFields = ['select', 'sort', 'page', 'limit'];
	//Loop over removeFields and delete them from reqQuery
	removeFields.forEach((params) => delete removeFields[params]);
	// Create query string
	let queryStr = JSON.stringify(reqQuery);
	// Create operators ($gt, $gte, etc)
	queryStr = queryStr.replace(/\bgt|gte|lt|lte|in\b/g, (match) => `$${match}`);
	// Finding resource
	query = model.find(JSON.parse(queryStr));
	// Select fields
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}

	// Sort fields
	if (req.query.sort) {
		const fields = req.query.sort.split(',').join(' ');
		query = query.sort(fields);
	} else {
		query = query.sort('-createdAt');
	}

	// Pagination and limit
	const page = +req.query.page || 1;
	const limit = +req.query.limit || 100;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

	query = query.skip(startIndex).limit(limit).sort('-name');

	if (populate) {
		query = query.populate(populate);
	}
	// Count the documents
	const total = await model.countDocuments();
	// Executing query
	const results = await query; //BootcampModel.find();

	// Pagination result
	const pagination = {};
	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}

	if (startIndex > 0) {
		pagination.previous = {
			page: page - 1,
			limit,
		};
	}

	res.advancedResults = {
		success: true,
		result: results.length,
		pagination,
		data: {
			results,
		},
	};

	next();
};

module.exports = advancedResult;
