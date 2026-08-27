/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOCIOBOT_BUY_URL?: string;
  readonly VITE_SOCIOBOT_LICENSE_VERIFY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
