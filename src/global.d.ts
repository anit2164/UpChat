declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

declare module "*.svg" {
  const content: any;
  export default content;
}
declare module "*.jpg" {
  const content: any;
  export default content;
}
declare module "*.png" {
  const content: any;
  export default content;
}
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module "rollup-plugin-svg";

declare module "styled-components";

declare module "*.css";
