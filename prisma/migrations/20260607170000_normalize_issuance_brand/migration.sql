UPDATE "Product" SET "issuanceTime" = '15 Minutes';
UPDATE "EmailTemplate" SET "subject" = 'Welcome to ShieldxSSL' WHERE "key" = 'account_registration';
UPDATE "EmailTemplate" SET "body" = 'Hi {{name}}, your ShieldxSSL account is ready.' WHERE "key" = 'account_registration';
UPDATE "User" SET "name" = 'ShieldxSSL Admin', "company" = 'ShieldxSSL' WHERE "email" = 'admin@trustshieldssl.example';
