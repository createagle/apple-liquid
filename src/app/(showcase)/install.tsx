"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const REGISTRY = "https://createagle.github.io/apple-liquid/r";

/** Each manager's "run a package without installing it" command. */
const RUNNERS = {
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
} as const;

type Manager = keyof typeof RUNNERS;

const ManagerContext = React.createContext<Manager>("pnpm");

/** A copyable block. Lines are joined with a trailing `\` so long commands wrap. */
function Block({ text, wrap }: { text: string; wrap?: boolean }) {
  const [copied, setCopied] = React.useState(false);

  // 复制成功的提示自己退回去，不占一个状态容器。
  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // 没有剪贴板权限时什么都不做，命令本身是选得中的。
    }
  };

  return (
    <div className="relative min-w-0 rounded-[14px] bg-fill-tertiary py-3 pr-12 pl-4">
      <pre
        className={cn(
          "text-[13px] leading-relaxed text-foreground",
          // pre-wrap 只在空格处断行，而这些命令里有很长的无空格片段
          // （URL、node -pe 的那串），所以换行那档还要允许任意位置断开。
          wrap
            ? "whitespace-pre-wrap [overflow-wrap:anywhere]"
            : "overflow-x-auto whitespace-pre"
        )}
      >
        <code>{text}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon-xs"
        className="absolute top-2.5 right-2.5 text-label-secondary"
        aria-label={copied ? "Copied" : "Copy"}
        onClick={copy}
      >
        {copied ? (
          <CheckIcon className="size-3.5" />
        ) : (
          <CopyIcon className="size-3.5" />
        )}
      </Button>
    </div>
  );
}

/**
 * A command. `children` receives the package manager's runner, so the
 * pnpm / npm / yarn / bun switch stays the single source of truth.
 */
function Command({
  children,
  wrap,
}: {
  children: (run: string) => string;
  wrap?: boolean;
}) {
  const manager = React.useContext(ManagerContext);
  return <Block text={children(RUNNERS[manager])} wrap={wrap} />;
}

function Step({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <h4 className="text-[14px] font-semibold">{title}</h4>
      {lead && <p className="text-[13px] text-label-secondary">{lead}</p>}
      {children}
    </div>
  );
}

function Card({
  n,
  title,
  lead,
  children,
}: {
  n: number;
  title: string;
  lead: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-[18px] bg-card p-6 shadow-[0_0_0_0.5px_var(--glass-hairline),0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-semibold text-primary-foreground">
          {n}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="text-[16px] font-semibold">{title}</h3>
          <p className="text-[13px] text-label-secondary">{lead}</p>
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-5 sm:pl-[38px]">{children}</div>
    </section>
  );
}

/**
 * 安装说明。展示页是静态导出的，固定英文（见 locale-provider.tsx）。
 * 这里的每条命令都实际跑过；`shadcn add --all` 只认默认 registry，对命名空间
 * 不生效，所以「装全部」走的是 `list --json` 拼参数。
 */
function InstallSection({ className }: { className?: string }) {
  const [manager, setManager] = React.useState<Manager>("pnpm");

  return (
    <ManagerContext.Provider value={manager}>
      <section id="install" className={cn("scroll-mt-24", className)}>
        <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-[22px] font-semibold tracking-tight">Install</h2>
          <span className="rounded-full bg-fill-tertiary px-2 py-0.5 text-[11px] text-label-secondary">
            shadcn registry
          </span>
        </div>
        <p className="mb-5 max-w-2xl text-[14px] text-label-secondary">
          All 66 components are published as a{" "}
          <a
            href="https://ui.shadcn.com/docs/registry"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            shadcn registry
          </a>
          . The CLI copies the source into your project — you own it afterwards,
          exactly like shadcn/ui.
        </p>

        <div className="mb-5">
          <Tabs
            value={manager}
            onValueChange={(value) => setManager(value as Manager)}
          >
            <TabsList>
              {(Object.keys(RUNNERS) as Manager[]).map((name) => (
                <TabsTrigger key={name} value={name}>
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Card
            n={1}
            title="Start a new project"
            lead="Nothing set up yet? init scaffolds the project and installs the whole token set in one go. It asks for a project name, then creates it."
          >
            <Command wrap>
              {(run) =>
                `${run} shadcn@latest init --template next --base base --preset nova \\
  ${REGISTRY}/theme.json`
              }
            </Command>
            <p className="text-[13px] text-label-secondary">
              <code>--template</code> also takes <code>vite</code>,{" "}
              <code>react-router</code>, <code>astro</code>, <code>start</code>{" "}
              and <code>laravel</code>. The trailing{" "}
              <code>theme.json</code> is what brings the design tokens — without
              it you get a plain shadcn project. Then do step 2&apos;s namespace
              block and jump to step 3.
            </p>
          </Card>

          <Card
            n={2}
            title="Or add it to an existing project"
            lead="The project needs Tailwind CSS v4 and a components.json. If you already ran shadcn init, skip straight to step 3."
          >
            <Step title="Initialise shadcn (once)">
              <Command>
                {(run) => `${run} shadcn@latest init --preset nova --base base`}
              </Command>
            </Step>
            <Step
              title="Register the namespace (optional, once)"
              lead={
                <>
                  Add this to <code>components.json</code> and you can install by
                  short name instead of pasting URLs.
                </>
              }
            >
              <Block
                text={`{
  "registries": {
    "@apple-liquid": "${REGISTRY}/{name}.json"
  }
}`}
              />
            </Step>
          </Card>

          <Card
            n={3}
            title="Install components"
            lead="Every component is its own item. Install the ones you need, or take the lot."
          >
            <Step title="One component">
              <Command>
                {(run) => `${run} shadcn@latest add ${REGISTRY}/button.json`}
              </Command>
            </Step>
            <Step
              title="Several at once"
              lead="Pass as many as you like. With the namespace registered, use short names."
            >
              <Command wrap>
                {(run) =>
                  `${run} shadcn@latest add @apple-liquid/button @apple-liquid/card @apple-liquid/slider`
                }
              </Command>
            </Step>
            <Step
              title="Browse what is available"
              lead="74 items: 66 components plus the shared pieces they depend on."
            >
              <Command>{(run) => `${run} shadcn@latest list @apple-liquid`}</Command>
            </Step>
            <Step
              title="All 66 components"
              lead={
                <>
                  There is no <code>--all</code> for custom registries, so feed
                  the list into <code>add</code>. Needs the namespace from step 2.
                </>
              }
            >
              <Command wrap>
                {(run) =>
                  `${run} shadcn@latest add $(${run} shadcn@latest list @apple-liquid -t ui --json \\
  | node -pe "JSON.parse(require('fs').readFileSync(0,'utf8')).items.map(i=>i.addCommandArgument).join(' ')")`
                }
              </Command>
            </Step>
          </Card>
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-[18px] bg-fill-tertiary p-5">
          <p className="text-[13px] leading-relaxed text-label-secondary">
            <span className="font-semibold text-foreground">
              What the first install adds:
            </span>{" "}
            <code>styles/apple-liquid.css</code> — under <code>src/</code> if
            your project has one — with the whole token set (Apple system
            colours, glass materials, radii, type scale, light and dark), plus
            one <code>@import</code> in your entry CSS. Shared pieces like{" "}
            <code>liquid-glass</code> and every npm dependency come along
            automatically.
          </p>
          <p className="text-[13px] leading-relaxed text-label-secondary">
            <span className="font-semibold text-foreground">
              Seven components need Intlayer:
            </span>{" "}
            <code>dialog</code>, <code>input</code>, <code>field</code>,{" "}
            <code>color-picker</code>, <code>spinner</code>,{" "}
            <code>theme-toggle</code> and <code>site-preferences</code> keep
            their built-in copy bilingual through{" "}
            <a
              href="https://intlayer.org"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Intlayer
            </a>
            , so your project has to configure it too — the{" "}
            <a
              href="https://github.com/createagle/apple-liquid#readme"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              README
            </a>{" "}
            has the three steps, and the CLI prints them as it installs.
            Everything else needs no setup.
          </p>
        </div>
      </section>
    </ManagerContext.Provider>
  );
}

export { InstallSection };
