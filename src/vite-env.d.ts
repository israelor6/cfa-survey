/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORMSPREE_ENDPOINT?: string;
  readonly VITE_CONSUMER_FORMSPREE_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
