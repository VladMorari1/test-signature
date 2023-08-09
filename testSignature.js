const soap = require("soap");
const fs = require("fs");

async function createSignedXml() {
  const password = ""; // optional password
  const privateKeyPath = "C:\\Users\\Fusion\\Desktop\\keys\\private-wisdm.pem";
  const publicKeyPath = "C:\\Users\\Fusion\\Desktop\\keys\\private-wisdm.pem";

  const options = {
    hasTimeStamp: true,
    additionalReferences: [
      //'wsa:Action',
      //'wsa:ReplyTo',
      //'wsa:To',
      // "//*[local-name(.)='Body']",
    ],
    signerOptions: {
      prefix: "ds",
      attrs: { Id: "Signature" },
      existingPrefixes: {
        wsu: "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd",
      },
      // signatureTransformations: ['http://www.w3.org/2001/10/xml-exc-c14n#'],
      // signatureAlgorithm: 'http://www.w3.org/2000/09/xmldsig#rsa-sha1',
    },
  };

  const request = `
  <soapenv:Envelope xmlns:mai="http://mai.gov.md/" xmlns:mcon="https://mconnect.gov.md" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
     <soapenv:Header>
        <mcon:CallReason>${this.reason}</mcon:CallReason>
        <mcon:CallingUser>${this.idnp}</mcon:CallingUser>
        <mcon:CallBasis>${this.basis}</mcon:CallBasis>
        <mcon:CallingEntity>${this.idno}</mcon:CallingEntity>
     </soapenv:Header>
     <soapenv:Body wsu:Id="id-7C833816AA6572D42E155154355839252" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
        <mai:GetChangedDocuments>
           <mai:IDNO>${this.idno}</mai:IDNO>
        </mai:GetChangedDocuments>
     </soapenv:Body>
  </soapenv:Envelope>
  `;

  const privateKey = fs.readFileSync(privateKeyPath);
  const publicKey = fs.readFileSync(publicKeyPath);
  const wsSecurity = new soap.WSSecurityCert(
    privateKey,
    publicKey,
    password,
    options
  );

  const signedXml = wsSecurity.postProcess(request, "soapenv");

  console.log("\n\n\n[--signedXml", signedXml);
  console.log("=====================================");
}

createSignedXml(); // Call the function
