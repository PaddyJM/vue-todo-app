aws dynamodb create-table --attribute-definitions AttributeName=id,AttributeType=S --table-name TodoTable-offline --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=10 --endpoint-url http://localhost:8000