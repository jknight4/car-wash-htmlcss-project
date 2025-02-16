const ValueType = {
  NAME: "name",
  EMAIL: "email",
  PHONE: "phone",
  DATE: "date",
  TIME: "time",
  TEXT: "text",
  SERVICES: "services",
  ADD_SERVICES: "addServices",
};

const ACCEPTABLE_CAR_TYPES = ["sedan", "suv", "pickup-truck", "other"];

const ACCEPTABLE_PACKAGES = [
  "exterior-only",
  "express",
  "gold",
  "platinum",
  "ultimate",
];

const ACCEPTABLE_ADD_SERVICES = [
  "headlightRestoration",
  "engineDetail",
  "scratchRemoval",
  "clayBarTreatment",
  "odorRemovalTreatment",
  "ceramicCoating",
];

export const handler = async (event) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Origin": "https://primetimeauto.knightj.xyz",
    "Access-Control-Allow-Methods": "OPTIONS, PUT",
  };
  let contactFormData = JSON.parse(event.body);
  const persistenceApiEndpoint = process.env.PERSISTENCE_API;

  try {
    validateField(contactFormData.name, ValueType.NAME, 2, 70);
    validateField(contactFormData.email, ValueType.EMAIL, 3, 320);
    validateField(contactFormData.phone, ValueType.PHONE, 7, 15);
    validateField(contactFormData.date, ValueType.DATE, 0, 10);
    validateField(contactFormData.time, ValueType.TIME, 0, 6);

    if (contactFormData.comments !== null || contactFormData.comments !== "") {
      validateField(contactFormData.comments, ValueType.TEXT, 0, 250);
    }

    validateServices(
      contactFormData.carType,
      ValueType.SERVICES,
      ACCEPTABLE_CAR_TYPES
    );

    validateServices(
      contactFormData.detailPackage,
      ValueType.SERVICES,
      ACCEPTABLE_PACKAGES
    );

    if (
      contactFormData.additionalServices !== null ||
      contactFormData.additionalServices !== ""
    ) {
      validateServices(
        contactFormData.additionalServices,
        ValueType.ADD_SERVICES,
        ACCEPTABLE_ADD_SERVICES
      );
    }

    let requestData;
    requestData.id = crypto.randomUUID();
    requestData.name = contactFormData.name;
    requestData.phone = contactFormData.phone;
    requestData.email = contactFormData.email;
    requestData.date = contactFormData.date;
    requestData.time = contactFormData.time;
    requestData.comments = contactFormData.comments;
    requestData.carType = contactFormData.carType;
    requestData.detailPackage = contactFormData.detailPackage;
    requestData.additionalServices = contactFormData.addServices;

    await fetch(persistenceApiEndpoint, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(requestData),
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
  if (
    value == null ||
    value === "" ||
    value.length < minLength ||
    value.length > maxLength
  ) {
    throw Error("Invalid Input");
  }

  if (valueType === ValueType.EMAIL) {
    if (!value.includes("@")) {
      throw Error("Invalid Email");
    }
  }
}

function validateServices(value, valueType, acceptableValues) {
  const lowercaseValues = acceptableValues.map((value) => value.toLowerCase());

  if (valueType === ValueType.ADD_SERVICES) {
    const arrayOfServices = value.split(",");

    if (
      () =>
        !arrayOfServices.every((service) => acceptableValues.includes(service))
    ) {
      throw Error("Invalid Additional Services");
    }
  } else if (!lowercaseValues.includes(value.toLowerCase())) {
    throw Error("Invalid Services");
  }
}
