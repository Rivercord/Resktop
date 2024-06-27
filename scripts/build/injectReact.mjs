/*
 * SPDX-License-Identifier: GPL-3.0
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 */

export const RivercordFragment = /* #__PURE__*/ Symbol.for("react.fragment");
export let RivercordCreateElement = (...args) =>
    (RivercordCreateElement = Rivercord.Webpack.Common.React.createElement)(...args);
