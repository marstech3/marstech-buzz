document.addEventListener("DOMContentLoaded", function () {
    const mediumUsername = "arohablue"; // Replace with your Medium username
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const feedUrl = `${proxyUrl}https://medium.com/feed/@${mediumUsername}`;

    async function fetchMediumBlogs() {
        try {
            const response = await fetch(feedUrl);
            if (!response.ok) throw new Error("Failed to fetch Medium feed");

            const data = await response.json();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, "text/xml");

            const feedImage = xmlDoc.querySelector("image > url")?.textContent || "";
            const pathArray = feedImage.split("/");
            const imageId = pathArray[pathArray.length - 1];
            const profileImage = `https://miro.medium.com/fit/c/80/80/${imageId}`;

            const items = xmlDoc.querySelectorAll("item");
            if (items.length === 0) {
                document.querySelector("#blog-container").innerHTML = `<p>No blogs found.</p>`;
                return;
            }

            let blogHTML = `
                <div class="single-post-wrapper content-1070 center-relative">
                    <article class="center-relative">
                        <h1 class="entry-title" style="text-align: center;">Security Blogs</h1>
                        <div class="row">
            `;

            items.forEach((item) => {
                const title = item.querySelector("title")?.textContent || "No Title";
                const link = item.querySelector("link")?.textContent || "#";
                const description = item.querySelector("description")?.textContent || "";
                
                // Use getElementsByTagName to correctly get the content:encoded tag
                const contentEncoded = item.getElementsByTagName("content:encoded")[0]?.textContent || "";

                const sanitizedHTML = contentEncoded.replace(/<!\[CDATA\[|\]\]>/g, "").trim();
                const contentDoc = new DOMParser().parseFromString(sanitizedHTML, "text/html");

                let postImage = "images/Hacker-amico.svg"; // Default fallback image

                // Check for the first image in the content:encoded HTML
                const firstImage = contentDoc.querySelector("img");

                if (firstImage) {
                    postImage = firstImage.getAttribute("src") || postImage;
                } else {
                    // Fallback: Look for <img> in description if not in content:encoded
                    const imgTagIndex = description.indexOf('<img');
                    if (imgTagIndex !== -1) {
                        const srcIndex = description.indexOf('src="', imgTagIndex) + 5;
                        const srcEnd = description.indexOf('"', srcIndex);
                        postImage = description.substring(srcIndex, srcEnd);
                    }
                }

                // Clean and trim the description
                const cleanDescription = description.replace(/<\/?[^>]+(>|$)/g, "").trim();
                const trimmedDescription = cleanDescription.substr(0, 150).trim();

                // Format date
                const pubDate = item.querySelector("pubDate")?.textContent || "";
                const formattedDate = new Date(pubDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                });

                blogHTML += `
                <div class="column">
                    <div class="card">
                        <div class="profile_img">
                            <img alt="Author" src="${profileImage}" class="profile-img">
                            <span class="date">${formattedDate}</span>
                        </div>
                        <img src="${postImage}" alt="Blog Image" class="blog-image">
                        <h4 class="entry-title">
                            <a href="${link}" target="_blank">${title}</a>
                        </h4>
                        <p class="blog-description">${trimmedDescription}...</p>
                        <p><a href="${link}" target="_blank">Continue reading...</a></p>
                    </div>
                </div>
                `;
            });

            blogHTML += `
                        </div>
                        <div class="clear"></div>
                    </article>
                </div>
            `;

            document.querySelector("#blog-container").innerHTML = blogHTML;
        } catch (error) {
            console.error("Error fetching Medium blogs:", error);
            document.querySelector("#blog-container").innerHTML = `<p>Unable to load blogs at the moment.</p>`;
        }
    }

    fetchMediumBlogs();
});
