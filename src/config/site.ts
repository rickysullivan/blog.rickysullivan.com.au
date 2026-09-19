import siteSettings from "./site.json";

export const siteConfig = siteSettings;

/** Header navigation. Add or remove entries freely; the header renders them in order. */
export const navigation = [
  { label: "Writing", href: "/posts/" },
  { label: "About", href: "/about/" },
];

/** Secondary navigation rendered in the footer. */
export const footerNavigation = [{ label: "RSS", href: "/rss.xml" }];
