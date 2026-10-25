import fs from 'node:fs/promises';
import path from 'node:path';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// Writes machine-readable copies of the docs at build time, for AI agents:
//   /llms.txt           index of every page (https://llmstxt.org/)
//   /llms-full.txt      every page in one Markdown file
//   /docs/<page>.md     each page as plain Markdown
// Pages are read from docs/ in sidebar order. Links are root-relative so they
// work on every host the same image is promoted to.

type Options = {sidebars: SidebarsConfig; sidebarId: string};
type Section = {title: string; docIds: string[]};
type Page = {id: string; title: string; description: string; body: string};

const DOCS_DIR = 'docs';
const ROUTE_BASE = '/docs';

// Flattens the top level of the sidebar into sections of doc IDs. External
// links (the platform docs) become their own section.
function sidebarSections(items: unknown[]): {sections: Section[]; links: {label: string; href: string}[]} {
  const sections: Section[] = [];
  const links: {label: string; href: string}[] = [];
  const loose: string[] = [];
  for (const item of items as any[]) {
    if (typeof item === 'string') {
      loose.push(item);
    } else if (item.type === 'doc') {
      loose.push(item.id);
    } else if (item.type === 'category') {
      const docIds: string[] = [];
      for (const child of item.items) {
        if (typeof child === 'string') docIds.push(child);
        else if (child.type === 'doc') docIds.push(child.id);
        else if (child.type === 'link') links.push({label: child.label, href: child.href});
      }
      if (docIds.length) sections.push({title: item.label, docIds});
    }
  }
  if (loose.length) sections.push({title: 'More', docIds: loose});
  return {sections, links};
}

// Splits YAML front matter from the body. Only flat `key: value` pairs are needed.
function parseDoc(id: string, raw: string): Page {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const meta: Record<string, string> = {};
  if (match) {
    for (const line of match[1].split('\n')) {
      const kv = line.match(/^(\w+):\s*(.*)$/);
      if (kv) meta[kv[1]] = kv[2].trim();
    }
  }
  const body = (match ? raw.slice(match[0].length) : raw).trim();
  const heading = body.match(/^#\s+(.+)$/m);
  return {
    id,
    title: meta.title ?? heading?.[1] ?? id,
    description: meta.description ?? '',
    body,
  };
}

// Drops layout-only wrappers such as <div className="hierarchy">, which carry
// styling for the site but mean nothing in plain Markdown.
function stripLayoutWrappers(body: string): string {
  return body.replace(/^<div className="[^"]*">\n\n|^\n?<\/div>\n?$/gm, '');
}

// Rewrites relative links to other .mdx pages as root-relative .md links.
function rewriteLinks(page: Page): string {
  const dir = path.posix.dirname(page.id);
  return stripLayoutWrappers(page.body).replace(/\]\((\.{1,2}\/[^)#\s]+)\.mdx(#[^)\s]*)?\)/g, (_m, rel, hash = '') => {
    const target = path.posix.normalize(path.posix.join(dir, rel));
    return `](${ROUTE_BASE}/${target}.md${hash})`;
  });
}

// Docusaurus passes plugin options as `unknown`; config.ts supplies an Options.
export default function llmsTxtPlugin(context: LoadContext, rawOptions: unknown): Plugin {
  const options = rawOptions as Options;
  return {
    name: 'llms-txt',
    async postBuild({outDir}) {
      const {siteConfig, siteDir} = context;
      const {sections, links} = sidebarSections(options.sidebars[options.sidebarId] as unknown[]);

      const pages = new Map<string, Page>();
      for (const id of sections.flatMap((s) => s.docIds)) {
        const raw = await fs.readFile(path.join(siteDir, DOCS_DIR, `${id}.mdx`), 'utf8');
        pages.set(id, parseDoc(id, raw));
      }

      const index = [`# ${siteConfig.title}`, '', `> ${siteConfig.tagline}`, ''];
      for (const section of sections) {
        index.push(`## ${section.title}`, '');
        for (const id of section.docIds) {
          const page = pages.get(id)!;
          const desc = page.description ? `: ${page.description}` : '';
          index.push(`- [${page.title}](${ROUTE_BASE}/${id}.md)${desc}`);
        }
        index.push('');
      }
      if (links.length) {
        index.push('## Platform documentation', '');
        for (const link of links) index.push(`- [${link.label}](${link.href})`);
        index.push('');
      }
      index.push('## Optional', '', '- [Full documentation in one file](/llms-full.txt)', '');

      const full: string[] = [];
      for (const page of pages.values()) {
        const markdown = rewriteLinks(page) + '\n';
        const file = path.join(outDir, ROUTE_BASE, `${page.id}.md`);
        await fs.mkdir(path.dirname(file), {recursive: true});
        await fs.writeFile(file, markdown);
        full.push(`<!-- Source: ${ROUTE_BASE}/${page.id} -->\n\n${markdown}`);
      }

      await fs.writeFile(path.join(outDir, 'llms.txt'), index.join('\n'));
      await fs.writeFile(path.join(outDir, 'llms-full.txt'), full.join('\n---\n\n'));
    },
  };
}
