import { existsSync, readdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join } from "node:path";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

type PromptInfo = {
	name: string;
	description: string;
	argumentHint: string;
};

const AGENT_DIR = process.env.PI_CODING_AGENT_DIR || join(homedir(), ".pi", "agent");
const PROMPTS_DIR = join(AGENT_DIR, "prompts");

function parseFrontmatter(content: string): { data: Record<string, string>; body: string } {
	if (!content.startsWith("---\n")) {
		return { data: {}, body: content.trim() };
	}

	const end = content.indexOf("\n---\n", 4);
	if (end === -1) {
		return { data: {}, body: content.trim() };
	}

	const frontmatter = content.slice(4, end);
	const body = content.slice(end + 5).trim();
	const data: Record<string, string> = {};

	for (const line of frontmatter.split("\n")) {
		const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
		if (!match) continue;
		const value = match[2].trim().replace(/^['"]|['"]$/g, "");
		data[match[1]] = value;
	}

	return { data, body };
}

function loadPrompts(): PromptInfo[] {
	if (!existsSync(PROMPTS_DIR)) return [];

	return readdirSync(PROMPTS_DIR)
		.filter((file) => file.endsWith(".md"))
		.sort((a, b) => a.localeCompare(b))
		.map((file) => {
			const fullPath = join(PROMPTS_DIR, file);
			const parsed = parseFrontmatter(readFileSync(fullPath, "utf8"));
			return {
				name: basename(file, ".md"),
				description: parsed.data.description || "无说明",
				argumentHint: parsed.data["argument-hint"] || "",
			};
		});
}

function examplesFor(prompt: PromptInfo): string[] {
	switch (prompt.name) {
		case "promote":
			return ["/promote", "/promote fix-workflow-notify"];
		case "push":
			return ["/push", "/push fix:17436 【新】流程审核节点要通过微信公众号给指定人员发推送消息"];
		case "help":
			return ["/help", "/help push", "/help all"];
		default:
			return [`/${prompt.name}${prompt.argumentHint ? ` ${prompt.argumentHint}` : ""}`];
	}
}

function detailFor(prompt: PromptInfo): string {
	const command = `/${prompt.name}${prompt.argumentHint ? ` ${prompt.argumentHint}` : ""}`;
	const examples = examplesFor(prompt).map((example) => `  ${example}`).join("\n");

	return [`${command}`, `用途：${prompt.description}`, `示例：`, examples].join("\n");
}

function formatHelp(topic: string): string {
	const normalized = topic.trim().replace(/^\//, "").toLowerCase();
	const prompts = loadPrompts();

	if (prompts.length === 0) {
		return `未找到用户自定义命令目录：${PROMPTS_DIR}`;
	}

	if (["skills", "extensions", "all"].includes(normalized)) {
		const commandHelp = prompts.map(detailFor).join("\n\n");
		const extra = [
			"更多自定义能力：",
			"/help skills：预留，后续可展示用户 skills",
			"/help extensions：预留，后续可展示用户 extensions",
		].join("\n");
		return normalized === "all" ? `${commandHelp}\n\n${extra}` : extra;
	}

	const filtered = normalized
		? prompts.filter((prompt) => prompt.name.toLowerCase().includes(normalized))
		: prompts;

	if (filtered.length === 0) {
		return `没有找到匹配的自定义命令：${topic}`;
	}

	return filtered.map(detailFor).join("\n\n");
}

export default function customHelp(pi: ExtensionAPI) {
	pi.registerCommand("help", {
		description: "显示当前自定义命令及用途（本地执行）",
		getArgumentCompletions: (prefix) => {
			const values = [
				...loadPrompts().map((prompt) => prompt.name),
				"skills",
				"extensions",
				"all",
			];
			const matches = values.filter((value) => value.startsWith(prefix));
			return matches.map((value) => ({ value, label: value }));
		},
		handler: async (args, ctx) => {
			ctx.ui.notify(formatHelp(args), "info");
		},
	});
}
