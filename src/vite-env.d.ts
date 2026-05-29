/// <reference types="vite/client" />

declare module "*.docx" {
  const url: string;

  export default url;
}