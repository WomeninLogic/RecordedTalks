const talkGridView = (data) => {

    let {author = "No Author",
            title = "No Title",
            date = "No Date",
            author_image = "img/default-avatar.png",
            talk_image = "img/cover-art.svg",
            talk_link = "#",
            author_link = "#",
        description = "No description provided"} = data;

        if(talk_link) {
            
            video_url_regex = /v=([\w\-\_]+)/;
            video_id_matches = talk_link.match(video_url_regex);
            video_id = video_id_matches ? video_id_matches[1] : talk_image;
            talk_image = `https://img.youtube.com/vi/${video_id}/maxresdefault.jpg`;

        };

        const avatar_dir = "img/avatars/";

        const avatar = (author_image == null) ? "img/default-avatar.svg" : avatar_dir + author_image;

    return ["div.card",
        ["a.video-thumbnail", {href: talk_link},
            ["img", {alt: `${title}  by ${author} given on ${date}`, src: talk_image}]],
            ["div.date-and-author",
            ["div.title-and-date",
            ["a.talk-link", {href: talk_link}, ["h3.title", title]],
                ["time", date]],
                ["a.author", {href: author_link},
                ["div.avatar", ["img", {src: avatar, alt: `Portrait of ${author}`}]],
                ["p", author]]],
                ["p.description", description]];

};

/* Toggle List or Grid Mode */

const talks = (data) => data.map(talkGridView);

const render = async () => {

    z.$("#view-selector .list-view").addEventListener("click", () => { z.$("#content").classList = "list-mode"; });

    z.$("#view-selector .grid-view").addEventListener("click", () => { z.$("#content").classList = "grid-mode"; });

    const data = await (await fetch("./data.json")).json();

    z.render("#talk-list", (data != null) ? data.map(d => talkGridView(d)) : ["p", "No talks found!"]);

};

window.onload = render;
