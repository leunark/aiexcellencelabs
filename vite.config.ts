import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const normalizeBase = (value: string) => {
  if (value === "./") {
    return value;
  }

  const trimmed = value.replace(/^\/*/, "");
  const withLeadingSlash = trimmed ? `/${trimmed}` : "/";
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
};

const resolveBasePath = () => {
  if (process.env.VITE_BASE_PATH) {
    return normalizeBase(process.env.VITE_BASE_PATH);
  }

  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
  const isGithubActions = process.env.GITHUB_ACTIONS === "true";
  const isUserOrOrgSite = repoName?.endsWith(".github.io");

  if (isGithubActions && repoName && !isUserOrOrgSite) {
    return normalizeBase(repoName);
  }

  return "/";
};

export default defineConfig({
  base: resolveBasePath(),
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
