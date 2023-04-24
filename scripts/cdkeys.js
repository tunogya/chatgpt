const fs = require('fs');
const {v4: uuidv4} = require('uuid');
const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient, BatchWriteCommand} = require('@aws-sdk/lib-dynamodb');

let cdkeys = []

const ddbClient = new DynamoDBClient({
    region: 'ap-northeast-1'
});

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
    },
});

for (let i = 0; i < 100; i++) {
    const cdkey = uuidv4();
    cdkeys.push(cdkey)
}

const insertCDKey = async (_cdkeys, quantity) => {
    const params = {
        RequestItems: {
            'wizardingpay': _cdkeys.map((cdkey) => ({
                PutRequest: {
                    Item: {
                        PK: 'CHATGPT#CDKEY',
                        SK: cdkey,
                        quantity: quantity,
                        used: false,
                        created: Math.floor(Date.now() / 1000),
                    }
                }
            }))
        }
    }
    await ddbDocClient.send(new BatchWriteCommand(params));
    console.log('inserted', _cdkeys.length)
}

const insertCDKeyBatch = async (_cdkeys, quantity) => {
    fs.writeFileSync(`cdkeys_${quantity}.csv`, _cdkeys.join('\n'))
    
    for (let i = 0; i < _cdkeys.length; i += 25) {
        await insertCDKey(_cdkeys.slice(i, i + 25), quantity)
    }
}

insertCDKeyBatch(cdkeys, 365)
