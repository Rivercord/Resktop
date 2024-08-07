/*
 * SPDX-License-Identifier: GPL-3.0
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

import { RIVERCORD_FILES_DIR,USER_AGENT } from "../constants";
import { downloadFile, fetchie } from "./http";

const API_BASE = "https://api.github.com";

export const FILES_TO_DOWNLOAD = [
    "rivercordDesktopMain.js",
    "rivercordDesktopPreload.js",
    "rivercordDesktopRenderer.js",
    "rivercordDesktopRenderer.css"
];

export interface ReleaseData {
    name: string;
    tag_name: string;
    html_url: string;
    assets: Array<{
        name: string;
        browser_download_url: string;
    }>;
}

export async function githubGet(endpoint: string) {
    const opts: RequestInit = {
        headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": USER_AGENT
        }
    };

    if (process.env.GITHUB_TOKEN) (opts.headers! as any).Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

    return fetchie(API_BASE + endpoint, opts, { retryOnNetworkError: true });
}

export async function downloadRivercordFiles() {
    // const release = await githubGet("/repos/Vendicated/Rivercord/releases/latest");

    // const { assets }: ReleaseData = await release.json();

    // await Promise.all(
    //     assets
    //         .filter(({ name }) => FILES_TO_DOWNLOAD.some(f => name.startsWith(f)))
    //         .map(({ name, browser_download_url }) =>
    //             downloadFile(browser_download_url, join(RIVERCORD_FILES_DIR, name), {}, { retryOnNetworkError: true })
    //         )
    // );

    await Promise.all(
        FILES_TO_DOWNLOAD.map(async f => downloadFile(
            `https://raw.githubusercontent.com/Rivercord/Rivercord/main/dist/${f}`,
            join(RIVERCORD_FILES_DIR, f),
            {},
            { retryOnNetworkError: true }
        ))
    );
}

export function isValidRivercordInstall(dir: string) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const lastUpdatePath = join(dir, "lastUpdate.txt");
    if (!existsSync(lastUpdatePath)) writeFileSync(lastUpdatePath, "0");
    const lastUpdateAt = parseInt(readFileSync(lastUpdatePath, "utf-8").trim());
    const now = Date.now();
    
    
    return now - lastUpdateAt < 60000;
}

export async function ensureRivercordFiles() {
    if (isValidRivercordInstall(RIVERCORD_FILES_DIR)) return;

    const lastUpdatePath = join(RIVERCORD_FILES_DIR, "lastUpdate.txt");
    writeFileSync(lastUpdatePath, `${Date.now()}`);

    console.log("[RivercordLoader] Rivercord files are outdated, updating...");

    await downloadRivercordFiles();
}
