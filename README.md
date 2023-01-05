# Women In Logic Recorded Talks

A place to keep info about Women in Logic https://www.womeninlogic.org/

<br>

This updates the webpage in https://womeninlogic.github.io/RecordedTalks/ when it works.

## Contributing

To contribute a talk to the repo, go to the [data.json](https://github.com/WomeninLogic/RecordedTalks/blob/main/data.json) file and add an entry with the following details:

```
{"title": "Title of the Talk",
"talk_link": "Link to the Youtube Video",
"author": "Author’s Name",
"date": "Date of Recording the Talk",
"author_image": "Name of image as you have named it in the img/ folder",
"author_link": "Link to author’s website",
"description": "Description of the talk."}
```

Add author’s image to the img/ folder and make sure to link to the image under the `author_image` key of the database with the the exact name as you have given in the `img/` folder. Also, make sure that each of the entries you add are separated by a comma in the appropriate JSON format. You can validate the JSON file by copy pasting it in one of the JSON services like [JSONLint](https://jsonlint.com)
