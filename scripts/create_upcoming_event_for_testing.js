#!/usr/bin/env node
const { ZonedDateTime, DateTimeFormatter } = require("@js-joda/core");
const { writeFile, readFile } = require("fs/promises");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const run = async () => {
  const startsInOneHour = ZonedDateTime.now().plusHours(1);
  const endsIn10Hours = startsInOneHour.plusHours(9);

  const ajv = new Ajv();
  addFormats(ajv);
  const validate = ajv.compile(
    JSON.parse(
      (await readFile(__dirname + "/../_data/events/.SCHEMA.json")).toString()
    )
  );

  const event = {
    title: "Testing Event",
    description: "The description",
    format: "ensemble",
    spoken_language: "English",
    url: "https://www.meetup.com/some-link",
    code_of_conduct: "https://communitycodeofconduct.com/",
    date: {
      start: DateTimeFormatter.ISO_DATE_TIME.format(startsInOneHour),
      end: DateTimeFormatter.ISO_DATE_TIME.format(endsIn10Hours),
    },
    moderators: [
      {
        name: "John Doe",
        url: "https://github.com/some-github-link",
      },
    ],
    sponsors: [
      {
        name: "coderetreat-sponsor",
        url: "https://www.coderetreat-sponsor.org",
      },
    ],
    location: "virtual",
  };

  const result = validate(event);
  if (!result) throw validate.errors;

  await writeFile(
    __dirname + "/../_data/events/TEST_EVENT.json",
    JSON.stringify(event, undefined, 2),
    { encoding: "utf-8" }
  );
};

run();
