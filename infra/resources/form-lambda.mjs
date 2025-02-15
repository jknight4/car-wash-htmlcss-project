const ValueType = {
  NAME: "name",
  EMAIL: "email",
  PHONE: "phone",
  DATE: "date",
  TIME: "time",
  TEXT: "text",
  SERVICES: "services",
};

const ACCEPTABLE_CAR_TYPES = ["sedan", "suv", "pickup truck", "other"];

const ACCEPTABLE_PACKAGES = [
  "exterior only",
  "express",
  "gold",
  "platinum",
  "ultimate",
];

const ACCEPTABLE_ADD_SERVICES = [
  "headlight restoration",
  "engine detail",
  "scratch removal",
  "clay bar treatment",
  "odor removal treatment",
  "ceramic coating",
];

export const handler = async (event) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };
  let contactData = JSON.parse(event.body);
  const persistenceApiEndpoint = process.env.PERSISTENCE_API;

  try {
    validateField(contactData.name, ValueType.NAME, 2, 70);
    validateField(contactData.email, ValueType.EMAIL, 3, 320);
    validateField(contactData.phone, ValueType.PHONE, 7, 15);
    validateField(contactData.date, ValueType.DATE, 0, 25);
    validateField(contactData.time, ValueType.TIME, 0, 25);

    if (contactData.comments != null) {
      validateField(contactData.comments, ValueType.TEXT, 0, 250);
    }

    validateServices(contactData.carType, ACCEPTABLE_CAR_TYPES);

    validateServices(contactData.detailPackage, ACCEPTABLE_PACKAGES);

    if (contactData.additionalServices != null) {
      validateServices(contactData.additionalServices, ACCEPTABLE_ADD_SERVICES);
    }

    contactData.id = crypto.randomUUID();

    await fetch(persistenceApiEndpoint, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(contactData),
    });
  } catch (error) {
    statusCode = 400;
    body = JSON.stringify(error.message.toString());
  }

  return {
    statusCode,
    headers,
    body,
  };
};

function validateField(value, valueType, minLength, maxLength) {
  if (value == null || value.length < minLength || value.length > maxLength) {
    throw Error("Invalid Input");
  }

  if (valueType === ValueType.EMAIL) {
    if (!value.includes("@")) {
      throw Error("Invalid Email");
    }
  }
}

function validateServices(value, acceptableValues) {
  if (!acceptableValues.includes(value.toLowerCase())) {
    throw Error("Invalid Services");
  }
}
