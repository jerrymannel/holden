const db = require("./db.client")
const config = require("../config");

let logger = global.logger

let e = {}

async function __generateTestPayload(_testDataStructure, _users, _data, _updateData) {
  let testData = JSON.parse(JSON.stringify(_testDataStructure))
  userMap = {}
  _users.forEach(_user => userMap[_user.operation] = _user)
  // POST
  testData.method = "POST"
  testData.data = _data
  testData.responseCode = 200
  testData['_id'] = `${_data._id}-1-POST`
  testData.user = userMap["POST"] ? userMap["POST"] : userMap["ALL"];
  await db.insertDocument('tests', testData)
  // GET
  testData.method = "GET"
  testData['_id'] = `${_data._id}-2-GET-200`
  testData.user = userMap["GET"] ? userMap["GET"] : userMap["ALL"];
  testData.uri += `/${testData.data._id}`
  await db.insertDocument('tests', testData)
  // PUT
  testData.method = "PUT"
  testData.data = _updateData
  testData['_id'] = `${_data._id}-3-PUT`
  testData.user = userMap["PUT"] ? userMap["PUT"] : userMap["ALL"];
  await db.insertDocument('tests', testData)
  // GET
  testData.method = "GET"
  testData['_id'] = `${_data._id}-4-GET-200`
  testData.user = userMap["GET"] ? userMap["GET"] : userMap["ALL"];
  await db.insertDocument('tests', testData)
  // DELETE
  testData.method = "DELETE"
  testData['_id'] = `${_data._id}-5-DELETE`
  testData.user = userMap["DELETE"] ? userMap["DELETE"] : userMap["ALL"];
  await db.insertDocument('tests', testData)
  // GET
  testData.method = "GET"
  testData.responseCode = 404
  testData['_id'] = `${_data._id}-6-GET-404`
  testData.user = userMap["GET"] ? userMap["GET"] : userMap["ALL"];
  await db.insertDocument('tests', testData)
}

async function __generateTestsBasedOnMapping(_testDataStructure, _users, _attribute, _dataset) {
  const dataset = await db.findOne('datasets', { _id: _dataset })
  await dataset.data.reduce(async (prev, _data, _index) => {
    await prev;
    let data = {
      _id: `${_attribute}-${_dataset}-${_testDataStructure.data._id}-${_index}`
    }
    data[_attribute] = _data;
    let updateData = {}
    updateData[_attribute] = `${_data}${_data}${_data}`
    return await __generateTestPayload(_testDataStructure, _users, data, updateData)
  }, Promise.resolve())
}

e.generate = async (_testSuite) => {
  let testSet = `${_testSuite._id}-${_testSuite.environment}-${_testSuite.app}-${_testSuite.dataservice}`;
  logger.info(`TestID :: ${testSet}`);
  const environment = await db.findOne("environments", { _id: _testSuite.environment })
  let testDataStructure = {
    testSet: testSet,
    testSuite: _testSuite._id,
    app: _testSuite.app,
    dataserviceName: _testSuite.dataserviceName,
    method: "POST",
    responseCode: 200,
    uri: _testSuite.api,
    loginURL: `${environment.url}${config.apis.login}`,
    logoutURL: `${environment.url}${config.apis.logout}`,
    checkURL: `${environment.url}${config.apis.check}`,
    json: true,
    user: {},
    data: {
      _id: `${Math.ceil(Math.random() * 1000000)}`
    },
  }
  await _testSuite.testParams.reduce(async (_p, _testParam) => {
    await _p;
    // logger.info(`[${testSet}] :: ${_testParam.join(" - ")}`)
    if (_testSuite.testEachAttribute) {
      await __generateTestsBasedOnMapping(testDataStructure, _testSuite.users, _testParam[0], _testParam[1])
    }
  }, Promise.resolve())
}

module.exports = e;