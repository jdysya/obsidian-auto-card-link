import { LinkMetadata } from "src/interfaces";

export class LinkMetadataParser {
  link: string;
  htmlDoc: Document;

  constructor(link: string, htmlText: string) {
    this.link = link;

    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlText, "text/html");
    this.htmlDoc = htmlDoc;
  }

  parse(): LinkMetadata | undefined {
    const title = this.getTitle()
      ?.replace(/\r\n|\n|\r/g, "")
      .replace(/"/g, '\\"')
      .trim();
    if (!title) return;

    const description = this.getDescription()
      ?.replace(/\r\n|\n|\r/g, "")
      .replace(/"/g, '\\"')
      .trim();
    const { hostname } = new URL(this.link);
    const favicon = this.getFavicon();
    const image = this.getImage();

    return {
      link: this.link,
      title: title,
      desc: description,
      host: hostname,
      favicon: favicon,
      logo: image,
    };
  }

  private getTitle(): string | undefined {
    const ogTitle = this.htmlDoc
      .querySelector("meta[property='og:title']")
      ?.getAttr("content");
    if (ogTitle) return ogTitle;

    const title = this.htmlDoc.querySelector("title")?.textContent;
    if (title) return title;
  }

  private getDescription(): string | undefined {
    const ogDescription = this.htmlDoc
      .querySelector("meta[property='og:description']")
      ?.getAttr("content");
    if (ogDescription) return ogDescription;

    const metaDescription = this.htmlDoc
      .querySelector("meta[name='description']")
      ?.getAttr("content");
    if (metaDescription) return metaDescription;
  }

  private getFavicon(): string | undefined {
    const favicon = this.htmlDoc
      .querySelector("link[rel='icon']")
      ?.getAttr("href");
    if (favicon) return favicon;
  }

  private getImage(): string | undefined {
    const ogImage = this.htmlDoc
      .querySelector("meta[property='og:image']")
      ?.getAttr("content");
    if (ogImage) return ogImage;
  }
}
