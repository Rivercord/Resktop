/*
 * SPDX-License-Identifier: GPL-3.0
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 */

import { Button, Forms, Toasts } from "@vencord/types/webpack/common";

import { SettingsComponent } from "./Settings";

export const RivercordLocationPicker: SettingsComponent = ({ settings }) => {
    return (
        <>
            <Forms.FormText>
                Rivercord files are loaded from{" "}
                {settings.rivercordDir ? (
                    <a
                        href="about:blank"
                        onClick={e => {
                            e.preventDefault();
                            ResktopNative.fileManager.showItemInFolder(settings.rivercordDir!);
                        }}
                    >
                        {settings.rivercordDir}
                    </a>
                ) : (
                    "the default location"
                )}
            </Forms.FormText>
            <div className="vcd-location-btns">
                <Button
                    size={Button.Sizes.SMALL}
                    onClick={async () => {
                        const choice = await ResktopNative.fileManager.selectRivercordDir();
                        switch (choice) {
                            case "cancelled":
                                return;
                            case "invalid":
                                Toasts.show({
                                    message:
                                        "You did not choose a valid Rivercord install. Make sure you're selecting the dist dir!",
                                    id: Toasts.genId(),
                                    type: Toasts.Type.FAILURE
                                });
                                return;
                        }
                        settings.rivercordDir = choice;
                    }}
                >
                    Change
                </Button>
                <Button
                    size={Button.Sizes.SMALL}
                    color={Button.Colors.RED}
                    onClick={() => (settings.rivercordDir = void 0)}
                >
                    Reset
                </Button>
            </div>
        </>
    );
};
