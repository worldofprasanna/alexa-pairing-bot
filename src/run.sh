rm pairingbot.zip
zip -r pairingbot.zip *
aws lambda update-function-code --function-name helloworldlamdba --zip-file fileb://pairingbot.zip
