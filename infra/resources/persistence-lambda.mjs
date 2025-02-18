import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.TABLE_NAME;

export const handler = async (event) => {
  let body = "";
  let statusCode = 200;

  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      case "PUT /contacts":
        let requestJSON = JSON.parse(event.body);
        console.log(JSON.stringify(requestJSON));
        await docClient.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: requestJSON.id,
              name: requestJSON.name,
              emailAddr: requestJSON.email,
              phoneNumber: requestJSON.phone,
              carType: requestJSON.carType,
              detailPackage: requestJSON.detailPackage,
              additionalServices: requestJSON.additionalServices,
              date: requestJSON.date,
              time: requestJSON.time,
              comments: requestJSON.comments,
            },
          })
        );
        statusCode = 204;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  }

  return {
    statusCode,
    headers,
    body,
  };
};
