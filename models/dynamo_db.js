const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "eu-west-1"
});

async function addDebate(data) {
  const params = {
    Item: {
      id: data.id,
      title: data.title,
      description: data.description,
      debateType: data.debateType,
      comments: [],
      debateStatus: data.debateStatus,
      votingStatus: data.votingStatus,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }
  };

  let queryStatement = await query("put", params);

  if (queryStatement.result) {
    return queryStatement.result;
  }

  return { error: queryStatement };
}

async function editDebate(data) {
  const params = {
    Key: {
      id: String(data.id)
    },
    UpdateExpression:
      "set title=:t, description=:d, debateStatus=:s, votingStatus=:vs, updatedAt=:u",
    ExpressionAttributeValues: {
      ":t": data.title,
      ":d": data.description,
      ":s": data.debateStatus,
      ":vs": data.votingStatus,
      ":u": data.timestamp
    },
    ReturnValues: "UPDATED_NEW"
  };

  let queryStatement = await query("update", params);

  if (queryStatement.result) {
    return queryStatement.result;
  }

  return { error: queryStatement };
}

async function getAll() {
  let queryStatement = await query("scan", {});

  if (queryStatement.result) {
    return queryStatement.result;
  }

  return { error: queryStatement };
}

async function getById(debateId) {
  const params = {
    KeyConditionExpression: "id = :debateId",
    ExpressionAttributeValues: {
      ":debateId": debateId
    }
  };

  let queryStatement = await query("query", params);

  if (queryStatement.result) {
    return queryStatement.result;
  }

  return { error: queryStatement.result };
}

async function getBy(attribute, value) {
  const params = {
    FilterExpression: `${attribute} = :v`,
    ExpressionAttributeValues: {
      ":v": value
    }
  };

  let queryStatement = await query("scan", params);

  if (queryStatement.result) {
    return queryStatement.result;
  }

  return { error: queryStatement };
}

async function getAllTypes() {
  const params = {
    ProjectionExpression: "debateType"
  };

  let queryStatement = await query("scan", params);
  const types = [];

  if (queryStatement.result) {
    queryStatement.result["Items"].forEach(result => {
      if (!types.includes(result.debateType)) {
        types.push(result.debateType);
      }
    });
    return types;
  }

  return { error: queryStatement };
}

async function getAllDebateLists() {
  let queryStatement = await query("scan", {});

  if (queryStatement.result) {
    let debates = {};

    queryStatement.result["Items"].map(item => {
      if (!debates.hasOwnProperty(item.debateType)) {
        debates[item.debateType] = {
          debateTypeName: item.debateType,
          debates: []
        };
      }

      debates[item.debateType].debates.push(item);
    });

    return debates;
  }

  return { error: queryStatement };
}

async function getDebateList(type) {
  const params = {
    FilterExpression: "#ty = :type_str",
    ExpressionAttributeNames: {
      "#ty": "debateType"
    },
    ExpressionAttributeValues: {
      ":type_str": type
    }
  };

  let queryStatement = await query("scan", params);

  if (queryStatement.result) {
    let debates = {};

    queryStatement.result["Items"].map(item => {
      if (!debates.hasOwnProperty(item.debateType)) {
        debates[item.debateType] = {
          debateTypeName: item.debateType,
          debates: []
        };
      }

      debates[item.debateType].debates.push(item);
    });

    return debates;
  }

  return { error: queryStatement };
}

async function getAllReports() {
  const params = {
    //TODO
  };

  let queryStatement = await query("scan", params);
  const types = [];

  if (queryStatement.result) {
    // TODO: list all content with reports
  }

  return { error: queryStatement };
}

async function query(type = "query", params) {
  try {
    let baseParams = {
      TableName: process.env.DEBATE_TABLE
    };

    const allParams = Object.assign(baseParams, params);
    const result = await dynamoDb[type](allParams).promise();

    if (result.hasOwnProperty("Items") || result.hasOwnProperty("Item")) {
      return { result };
    } else {
      return { result: [] };
    }
  } catch (err) {
    return `Error with request ${err}`;
  }
}

module.exports = {
  addDebate,
  editDebate,
  getAll,
  getById,
  getBy,
  getAllTypes,
  getDebateList,
  getAllDebateLists,
  getAllReports
};
