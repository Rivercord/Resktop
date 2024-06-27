/*
 * SPDX-License-Identifier: GPL-3.0
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 */

import "./fixes";
import "./appBadge";
import "./patches";
import "./themedSplash";

console.log("read if cute :3");

export * as Components from "./components";
import { findByPropsLazy, onceReady } from "@vencord/types/webpack";
import { FluxDispatcher } from "@vencord/types/webpack/common";

import SettingsUi from "./components/settings/Settings";
import { Settings } from "./settings";
export { Settings };

const InviteActions = findByPropsLazy("resolveInvite");

export async function openInviteModal(code: string) {
    const { invite } = await InviteActions.resolveInvite(code, "Desktop Modal");
    if (!invite) return false;

    ResktopNative.win.focus();

    FluxDispatcher.dispatch({
        type: "INVITE_MODAL_OPEN",
        invite,
        code,
        context: "APP"
    });

    return true;
}


const customSettingsSections = (
    // @ts-ignore
    Rivercord.Plugins.plugins.Settings as any as { customSections: ((ID: Record<string, unknown>) => any)[] }
).customSections;

customSettingsSections.push(() => ({
    section: "Resktop",
    label: "Resktop Settings",
    element: SettingsUi,
    className: "vc-Resktop-settings"
}));

// @ts-ignore
const arRPC = Rivercord.Plugins.plugins["WebRichPresence (arRPC)"] as any as {
    handleEvent(e: MessageEvent): void;
};

ResktopNative.arrpc.onActivity(async data => {
    if (!Settings.store.arRPC) return;

    await onceReady;

    arRPC.handleEvent(new MessageEvent("message", { data }));
});
