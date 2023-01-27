# Women In Logic Recorded Talks

This github repo, part of the organization (https://github.com/WomeninLogic/), is a place to keep information about logic recorded talks, in behalf of the collective Women in Logic https://www.womeninlogic.org/.

<br>

This repo updates the webpage in https://womeninlogic.github.io/RecordedTalks/, a curation of previously recorded talks by women in logic, considered broadly.

## Contributing

To contribute a talk to the repo, go to the [data.json](https://github.com/WomeninLogic/RecordedTalks/blob/main/data.json) file and add an entry with the following details:

```
{"title": "Title of the talk",
"talk_link": "Link to the Youtube video",
"author": "Author’s name",
"date": "Date of recording the talk",
"author_image": "Name of image as you have named it in the img/ folder",
"author_link": "Link to author’s website",
"description": "Description of the talk."}
```

Add author’s image to the `img/` folder and make sure to link to the image under the `author_image` key of the database with the the exact name as you have given in the `img/` folder. Try to follow the convention for the name of the speaker photo `firstname-lastname.png'. Please don't use numbers only for the date, as conventions are different in the US and the rest of the world.

Also, make sure that each of the entries you add are separated by a comma in the appropriate JSON format. You can ensure the data you have entered is in the correct format by validating the JSON file by copy pasting it in one of the JSON services like [JSONLint](https://jsonlint.com)
