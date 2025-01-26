const talkGridView = (data) => {

    let {author = "No Author",
            title = "No Title",
            date = "No Date",
            author_image = "img/default-avatar.png",
            talk_image = "img/cover-art.svg",
            talk_link = "#",
            author_link = "#",
        description = "No description provided"} = data;

        const sanitize = str => str.replaceAll(/[^a-zA-Z0-9 -]/g, "").replaceAll(" ", "-").toLowerCase();

        const buildIdentifier = ({title, author}) => sanitize(title) + sanitize(author);

        const id = buildIdentifier(data);

        const avatar_dir = "img/avatars/";

        const avatar = (author_image == null) ? "img/default-avatar.svg" : avatar_dir + author_image;

    return {id, talk_link, view: ["a.card.video-card", {id},
         ["div.video-thumbnail", 
            ["img", {alt: `${title}  by ${author} given on ${date}`, src: talk_image}]],
            ["div.date-and-author",
            ["div.title-and-date",
            ["a.talk-link", {href: talk_link}, ["h3.title", title]],
                ["time", date]],
                ["a.author", {href: author_link},
                ["div.avatar", ["img", {src: avatar, alt: `Portrait of ${author}`}]],
                ["p", author]]],
                ["p.description", description]]};

};

const isBigImage = src => new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img.height > 500);
    img.onerror = reject;
    img.src = src;
});

const setImage = async ({id, talk_link}) => {

    let talk_image = "img/cover-art.svg";
        
        if(talk_link) {
            
            video_url_regex = /v=([\w\-\_]+)/;
            video_id_matches = talk_link.match(video_url_regex);
            video_id = video_id_matches ? video_id_matches[1] : null;

            let max_res_img = null, hq_default = null;

            if(video_id != null) {

                max_res_img = `https://img.youtube.com/vi/${video_id}/maxresdefault.jpg`;
                hq_default = `https://img.youtube.com/vi/${video_id}/hqdefault.jpg`;

                 let isImageGood = await isBigImage(max_res_img);

                talk_image = isImageGood ? max_res_img : hq_default;

            };


            document.querySelector("#" + id + " img").src = talk_image;

        };

    }

/* Toggle List or Grid Mode */

const talks = (data) => data.map(talkGridView);

const render = async () => {

    z.$("#view-selector .list-view").addEventListener("click", () => { z.$("#content").classList = "list-mode"; });

    z.$("#view-selector .grid-view").addEventListener("click", () => { z.$("#content").classList = "grid-mode"; });

    const data = await (await fetch("./data.json")).json();

    const views = data.map((d) => talkGridView(d));

    z.render("#talk-list", (data != null) ? views.map(x => x.view) : ["p", "No talks found!"]);

    views.map(x => setImage(x));

};

window.onload = render;