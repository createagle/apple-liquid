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

/**
 * One copyable command. `run` is the part that changes with the package
 * manager — the caller passes the rest, so the pnpm / npm / yarn / bun switch
 * above stays the single source of truth.
 */
function Command({
  manager,
  children,
}: {
  manager: Manager;
  children: (run: string) => string;
}) {
  const text = children(RUNNERS[manager]);
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
    <div className="relative rounded-[14px] bg-fill-tertiary py-3 pr-12 pl-4">
      <pre className="overflow-x-auto text-[13px] leading-relaxed whitespace-pre text-foreground">
        <code>{text}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon-xs"
        className="absolute top-2.5 right-2.5 text-label-secondary"
        aria-label={copied ? "Copied" : "Copy command"}
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

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3.5">
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-semibold text-primary-foreground">
        {n}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className="text-[15px] font-semibold">{title}</h3>
        {children}
      </div>
    </li>
  );
}

/**
 * 安装说明。展示页是静态导出的，固定英文（见 locale-provider.tsx）。
 * 这里只讲到「装上能跑」为止，Intlayer 配置、明暗模式这些细节留给 README。
 */
function InstallSection({ className }: { className?: string }) {
  const [manager, setManager] = React.useState<Manager>("pnpm");

  return (
    <section id="install" className={cn("scroll-mt-24", className)}>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-[22px] font-semibold tracking-tight">Install</h2>
        <span className="rounded-full bg-fill-tertiary px-2 py-0.5 text-[11px] text-label-secondary">
          shadcn registry
        </span>
      </div>
      <p className="mb-4 max-w-2xl text-[14px] text-label-secondary">
        Every component on this page is published as a{" "}
        <a
          href="https://ui.shadcn.com/docs/registry"
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline"
        >
          shadcn registry
        </a>{" "}
        item. The CLI copies the source into your project — you own it
        afterwards, exactly like shadcn/ui.
      </p>

      <div className="flex flex-col gap-6 rounded-[18px] bg-card p-6 shadow-[0_0_0_0.5px_var(--glass-hairline),0_1px_2px_rgba(0,0,0,0.03)]">
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

        <ol className="flex flex-col gap-6">
          <Step n={1} title="Start from Tailwind v4 + shadcn">
            <p className="text-[14px] text-label-secondary">
              An existing project works too — skip this if you have already run{" "}
              <code>init</code>.
            </p>
            <Command manager={manager}>
              {(run) => `${run} shadcn@latest init --preset nova --base base`}
            </Command>
          </Step>

          <Step n={2} title="Add a component by URL">
            <p className="text-[14px] text-label-secondary">
              Swap <code>tabs</code> for any component in the sidebar. Pass
              several URLs to install them in one go.
            </p>
            <Command manager={manager}>
              {(run) => `${run} shadcn@latest add ${REGISTRY}/tabs.json`}
            </Command>
          </Step>

          <Step n={3} title="That is it">
            <p className="text-[14px] text-label-secondary">
              The first install also brings{" "}
              <code>styles/apple-liquid.css</code> — under <code>src/</code> if
              your project has one — with the whole token set (Apple system
              colours, glass materials, radii, type scale, light and dark), and
              adds one <code>@import</code> to your entry CSS. Shared pieces
              like <code>liquid-glass</code> and npm dependencies come along
              automatically.
            </p>
          </Step>
        </ol>

        <div className="rounded-[14px] bg-fill-tertiary p-4">
          <p className="text-[13px] leading-relaxed text-label-secondary">
            <span className="font-semibold text-foreground">
              One thing to know:
            </span>{" "}
            seven components (<code>dialog</code>, <code>input</code>,{" "}
            <code>field</code>, <code>color-picker</code>, <code>spinner</code>,{" "}
            <code>theme-toggle</code>, <code>site-preferences</code>) keep their
            built-in copy bilingual through{" "}
            <a
              href="https://intlayer.org"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Intlayer
            </a>
            , so your project has to configure it as well — the{" "}
            <a
              href="https://github.com/createagle/apple-liquid#关于-intlayer重要"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              README
            </a>{" "}
            has the three steps. Everything else installs with no setup.
          </p>
        </div>
      </div>
    </section>
  );
}

export { InstallSection };
