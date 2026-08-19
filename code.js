"use strict";
(() => {
  // src/constants/index.ts
  var BRANDING = {
    NAME: "Design System Foundation Generator",
    VERSION: "1.0.0",
    CREATOR: "Ariyo Aziz",
    USERNAME: "@ariyoaziz_",
    INSPIRED_BY: "shadcn/ui",
    DISCLAIMER: "This project is an independent community project and is not affiliated with the official shadcn/ui project.",
    SUCCESS_NOTIFICATION: "\u2728 Design System Foundation generated successfully.\nCreated by Ariyo Aziz (@ariyoaziz_)",
    // Future-ready URLs & metadata
    WEBSITE_URL: "",
    GITHUB_URL: "",
    DOCS_URL: "",
    FIGMA_COMMUNITY_URL: "",
    CHANGELOG_URL: "",
    SUPPORT_URL: "",
    get BANNER() {
      return [
        "==================================================",
        `${this.NAME}`,
        `Version ${this.VERSION}`,
        "",
        "Created by",
        `${this.CREATOR}`,
        `${this.USERNAME}`,
        "",
        `Inspired by ${this.INSPIRED_BY}`,
        "=================================================="
      ].join("\n");
    }
  };
  var COLLECTIONS = {
    COLORS: "Colors",
    RADIUS: "Radius",
    TYPOGRAPHY: "Typography",
    SPACING: "Spacing",
    SEMANTIC: "Semantic",
    ICON: "Icon",
    EFFECTS: "Effects",
    MOTION: "Motion",
    LAYERS: "Layers"
  };
  var MODES = {
    LIGHT: "Light",
    DARK: "Dark",
    DEFAULT: "Mode 1"
  };
  var GROUPS = {
    PRIMITIVE: "Primitive",
    BRAND: "Brand",
    THEME: "Theme",
    SIDEBAR: "Sidebar",
    CHART: "Chart",
    TYPOGRAPHY: "Typography",
    SPACING: "Spacing",
    SEMANTIC: "Semantic",
    ICON: "Icon",
    EFFECTS: "Effects",
    MOTION: "Motion",
    LAYERS: "Layers"
  };

  // src/services/logger.service.ts
  var LoggerService = class {
    static {
      this.prefix = "[Design System Generator]";
    }
    static getTimestamp() {
      const now = /* @__PURE__ */ new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const ms = String(now.getMilliseconds()).padStart(3, "0");
      return `[${hours}:${minutes}:${seconds}.${ms}]`;
    }
    static printBanner() {
      console.log(BRANDING.BANNER);
    }
    static debug(message) {
      console.log(`${this.getTimestamp()} ${this.prefix} \u{1F50D} [DEBUG] ${message}`);
    }
    static info(message) {
      console.log(`${this.getTimestamp()} ${this.prefix} \u2139\uFE0F [INFO] ${message}`);
    }
    static step(stepName) {
      console.log(`${this.getTimestamp()} ${this.prefix} \u{1F680} [STEP] ${stepName}...`);
    }
    static success(message) {
      console.log(`${this.getTimestamp()} ${this.prefix} \u2705 [SUCCESS] ${message}`);
    }
    static warn(message) {
      console.warn(`${this.getTimestamp()} ${this.prefix} \u26A0\uFE0F [WARN] ${message}`);
    }
    static error(message, error) {
      console.error(`${this.getTimestamp()} ${this.prefix} \u274C [ERROR] ${message}`, error ?? "");
    }
    static group(groupName, fn) {
      const c = console;
      if (typeof c.group === "function") {
        c.group(`${this.getTimestamp()} ${this.prefix} \u{1F4C2} ${groupName}`);
      } else {
        this.info(`--- Start Group: ${groupName} ---`);
      }
      try {
        fn();
      } finally {
        if (typeof c.groupEnd === "function") {
          c.groupEnd();
        } else {
          this.info(`--- End Group: ${groupName} ---`);
        }
      }
    }
  };

  // src/services/stats.service.ts
  var StatsService = class {
    static {
      this.stats = {
        collectionsCreated: 0,
        collectionsUpdated: 0,
        modesCreated: 0,
        variablesCreated: 0,
        variablesUpdated: 0,
        aliasesCreated: 0,
        brandTokensCreated: 0,
        skippedVariables: 0,
        stylesCreated: 0,
        stylesUpdated: 0
      };
    }
    static reset() {
      this.stats = {
        collectionsCreated: 0,
        collectionsUpdated: 0,
        modesCreated: 0,
        variablesCreated: 0,
        variablesUpdated: 0,
        aliasesCreated: 0,
        brandTokensCreated: 0,
        skippedVariables: 0,
        stylesCreated: 0,
        stylesUpdated: 0
      };
    }
    static trackCollectionCreated() {
      this.stats.collectionsCreated++;
    }
    static trackCollectionUpdated() {
      this.stats.collectionsUpdated++;
    }
    static trackModeCreated() {
      this.stats.modesCreated++;
    }
    static trackVariableCreated(isAlias = false) {
      this.stats.variablesCreated++;
      if (isAlias) this.stats.aliasesCreated++;
    }
    static trackVariableUpdated() {
      this.stats.variablesUpdated++;
    }
    static trackBrandTokenCreated() {
      this.stats.brandTokensCreated++;
    }
    static trackVariableSkipped() {
      this.stats.skippedVariables++;
    }
    static trackStyleCreated() {
      this.stats.stylesCreated++;
    }
    static trackStyleUpdated() {
      this.stats.stylesUpdated++;
    }
    static getStats() {
      return { ...this.stats };
    }
    static getSummaryReport() {
      const s = this.stats;
      return [
        "==================================================",
        "\u{1F4C8} Foundation Generation Statistics Summary",
        "==================================================",
        `Collections Created : ${s.collectionsCreated}`,
        `Collections Reused  : ${s.collectionsUpdated}`,
        `Modes Configured    : ${s.modesCreated}`,
        `Variables Created   : ${s.variablesCreated}`,
        `Variables Updated   : ${s.variablesUpdated}`,
        `Variable Aliases    : ${s.aliasesCreated}`,
        `Brand Tokens        : ${s.brandTokensCreated}`,
        `Text Styles Created : ${s.stylesCreated}`,
        `Text Styles Updated : ${s.stylesUpdated}`,
        `Variables Skipped   : ${s.skippedVariables}`,
        "=================================================="
      ].join("\n");
    }
    static printSummary() {
      console.log(this.getSummaryReport());
    }
  };

  // src/services/collection.service.ts
  var CollectionService = class {
    /**
     * Retrieves an existing variable collection by name, or creates a new one idempotently.
     */
    static async getOrCreateCollection(name) {
      try {
        const collections = await figma.variables.getLocalVariableCollectionsAsync();
        const existing = collections.find((c) => c.name === name);
        if (existing) {
          LoggerService.info(`Using existing collection: "${name}" (ID: ${existing.id})`);
          StatsService.trackCollectionUpdated();
          return existing;
        }
        const created = figma.variables.createVariableCollection(name);
        try {
          created.setPluginData("generator", "shadcn-foundation");
        } catch (_e) {
        }
        LoggerService.info(`Created new collection: "${name}" (ID: ${created.id})`);
        StatsService.trackCollectionCreated();
        return created;
      } catch (err) {
        LoggerService.error(`Failed to get or create collection "${name}"`, err);
        throw err;
      }
    }
  };

  // src/services/mode.service.ts
  var ModeService = class {
    /**
     * Ensures specified modes exist on the given VariableCollection.
     * Renames default "Mode 1" if present, adds missing modes, and returns a name -> modeId map.
     */
    static ensureModes(collection, targetModeNames) {
      const modeMap = {};
      if (!targetModeNames || targetModeNames.length === 0) {
        if (collection.modes.length > 0) {
          modeMap[collection.modes[0].name] = collection.modes[0].modeId;
          StatsService.trackModeCreated();
        }
        return modeMap;
      }
      const currentModes = [...collection.modes];
      if (currentModes.length === 1 && (currentModes[0].name === MODES.DEFAULT || currentModes[0].name === "Mode 1")) {
        const defaultMode = currentModes[0];
        const firstTargetMode = targetModeNames[0];
        collection.renameMode(defaultMode.modeId, firstTargetMode);
        LoggerService.info(
          `Renamed default mode "${defaultMode.name}" to "${firstTargetMode}" in collection "${collection.name}"`
        );
        modeMap[firstTargetMode] = defaultMode.modeId;
        StatsService.trackModeCreated();
        for (let i = 1; i < targetModeNames.length; i++) {
          const modeName = targetModeNames[i];
          const existingMode = collection.modes.find((m) => m.name === modeName);
          if (existingMode) {
            modeMap[modeName] = existingMode.modeId;
          } else {
            try {
              const newModeId = collection.addMode(modeName);
              modeMap[modeName] = newModeId;
              StatsService.trackModeCreated();
              LoggerService.info(`Added mode "${modeName}" to collection "${collection.name}"`);
            } catch (err) {
              LoggerService.warn(`Could not add mode "${modeName}" (Figma plan limits may apply): ${err}`);
            }
          }
        }
        return modeMap;
      }
      for (const modeName of targetModeNames) {
        const existingMode = collection.modes.find((m) => m.name === modeName);
        if (existingMode) {
          modeMap[modeName] = existingMode.modeId;
        } else {
          try {
            const newModeId = collection.addMode(modeName);
            modeMap[modeName] = newModeId;
            StatsService.trackModeCreated();
            LoggerService.info(`Added mode "${modeName}" to collection "${collection.name}"`);
          } catch (err) {
            LoggerService.warn(`Could not add mode "${modeName}" (Figma plan limits may apply): ${err}`);
          }
        }
      }
      return modeMap;
    }
  };

  // src/services/variable.service.ts
  var VariableService = class {
    /**
     * Fetches all local variables and builds a fast lookup map keyed by "collectionId:variableName".
     */
    static async getLocalVariablesMap() {
      const map = /* @__PURE__ */ new Map();
      try {
        const variables = await figma.variables.getLocalVariablesAsync();
        for (const variable of variables) {
          const key = `${variable.variableCollectionId}:${variable.name}`;
          map.set(key, variable);
        }
      } catch (err) {
        LoggerService.error("Failed to load local variables map", err);
      }
      return map;
    }
    /**
     * Idempotently creates or updates a COLOR variable in Figma.
     * Supports variable aliases to primitive tokens and specific variable scopes.
     */
    static createOrUpdateColorVariable(collection, variableName, modeMap, valuesByModeName, variableMap, description, stats, aliasesByModeName, scopes) {
      const key = `${collection.id}:${variableName}`;
      let variable = variableMap.get(key);
      if (!variable) {
        variable = figma.variables.createVariable(variableName, collection, "COLOR");
        variableMap.set(key, variable);
        if (stats) stats.created++;
        StatsService.trackVariableCreated(!!aliasesByModeName);
      } else {
        if (stats) stats.updated++;
        StatsService.trackVariableUpdated();
      }
      try {
        variable.setPluginData("generator", "shadcn-foundation");
        variable.setPluginData("version", "v1.0.0");
      } catch (_e) {
      }
      if (description && variable.description !== description) {
        variable.description = description;
      }
      if (scopes && scopes.length > 0) {
        try {
          variable.scopes = scopes;
        } catch (_err) {
          try {
            variable.scopes = scopes.filter((s) => s !== "FRAME_FILL" && s !== "SHAPE_FILL" && s !== "TEXT_FILL");
          } catch (_e) {
          }
        }
      }
      for (const [modeName, modeId] of Object.entries(modeMap)) {
        let valueAssigned = false;
        const aliasTarget = aliasesByModeName?.[modeName] ?? aliasesByModeName?.[modeName.toLowerCase()];
        if (aliasTarget) {
          let targetVarName = aliasTarget;
          if (!aliasTarget.startsWith(`${GROUPS.PRIMITIVE}/`) && !aliasTarget.startsWith(`${GROUPS.BRAND}/`) && !aliasTarget.startsWith(`${GROUPS.THEME}/`) && !aliasTarget.startsWith(`${GROUPS.SEMANTIC}/`) && !aliasTarget.startsWith(`${GROUPS.SIDEBAR}/`) && !aliasTarget.startsWith(`${GROUPS.CHART}/`)) {
            targetVarName = `${GROUPS.PRIMITIVE}/${aliasTarget}`;
          }
          const sameCollectionKey = `${collection.id}:${targetVarName}`;
          let targetVariable = variableMap.get(sameCollectionKey);
          if (!targetVariable) {
            for (const v of variableMap.values()) {
              if (v.name === targetVarName) {
                targetVariable = v;
                break;
              }
            }
          }
          if (targetVariable) {
            variable.setValueForMode(modeId, {
              type: "VARIABLE_ALIAS",
              id: targetVariable.id
            });
            valueAssigned = true;
          }
        }
        if (!valueAssigned) {
          const colorValue = valuesByModeName[modeName] ?? valuesByModeName[modeName.toLowerCase()] ?? valuesByModeName["light"] ?? valuesByModeName["Light"];
          if (colorValue) {
            variable.setValueForMode(modeId, colorValue);
          }
        }
      }
      return variable;
    }
    /**
     * Idempotently creates or updates a FLOAT variable in Figma.
     * Supports specific variable scopes (e.g. CORNER_RADIUS).
     */
    static createOrUpdateFloatVariable(collection, variableName, modeId, floatValue, variableMap, description, stats, scopes, aliasTarget) {
      const key = `${collection.id}:${variableName}`;
      let variable = variableMap.get(key);
      const isAlias = !!aliasTarget;
      if (!variable) {
        variable = figma.variables.createVariable(variableName, collection, "FLOAT");
        variableMap.set(key, variable);
        if (stats) stats.created++;
        StatsService.trackVariableCreated(isAlias);
      } else {
        if (stats) stats.updated++;
        StatsService.trackVariableUpdated();
      }
      if (description && variable.description !== description) {
        variable.description = description;
      }
      if (scopes && scopes.length > 0) {
        variable.scopes = scopes;
      }
      let valueAssigned = false;
      if (aliasTarget) {
        const aliasKey = `${collection.id}:${aliasTarget}`;
        const targetVar = variableMap.get(aliasKey);
        if (targetVar) {
          variable.setValueForMode(modeId, {
            type: "VARIABLE_ALIAS",
            id: targetVar.id
          });
          valueAssigned = true;
        }
      }
      if (!valueAssigned) {
        variable.setValueForMode(modeId, floatValue);
      }
      return variable;
    }
    /**
     * Idempotently creates or updates a STRING variable in Figma.
     * Supports font family, text case, and text decoration tokens.
     */
    static createOrUpdateStringVariable(collection, variableName, modeId, stringValue, variableMap, description, stats, scopes) {
      const key = `${collection.id}:${variableName}`;
      let variable = variableMap.get(key);
      if (!variable) {
        variable = figma.variables.createVariable(variableName, collection, "STRING");
        variableMap.set(key, variable);
        if (stats) stats.created++;
        StatsService.trackVariableCreated(false);
      } else {
        if (stats) stats.updated++;
        StatsService.trackVariableUpdated();
      }
      if (description && variable.description !== description) {
        variable.description = description;
      }
      if (scopes && scopes.length > 0) {
        variable.scopes = scopes;
      }
      variable.setValueForMode(modeId, stringValue);
      return variable;
    }
  };

  // src/utils/color.ts
  function isValidHexColor(hexStr) {
    if (!hexStr || typeof hexStr !== "string") return false;
    const hex = hexStr.replace(/^#/, "").trim();
    return /^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{4}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(hex);
  }
  function hexToRGB(hexStr) {
    if (!hexStr || typeof hexStr !== "string") return { r: 0, g: 0, b: 0 };
    let hex = hexStr.replace(/^#/, "").trim();
    if (!/^[0-9a-fA-F]{3,8}$/.test(hex)) {
      return { r: 0, g: 0, b: 0 };
    }
    if (hex.length === 3) {
      hex = hex.split("").map((char) => char + char).join("");
    } else if (hex.length === 4) {
      hex = hex.slice(0, 3).split("").map((char) => char + char).join("");
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      return {
        r: isNaN(r) ? 0 : r,
        g: isNaN(g) ? 0 : g,
        b: isNaN(b) ? 0 : b
      };
    }
    return { r: 0, g: 0, b: 0 };
  }
  function hslToRGB(h, s, l) {
    const normS = s / 100;
    const normL = l / 100;
    const k = (n) => (n + h / 30) % 12;
    const a = normS * Math.min(normL, 1 - normL);
    const f = (n) => normL - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
      r: f(0),
      g: f(8),
      b: f(4)
    };
  }
  function cssColorToRGB(cssColor) {
    const clean = cssColor.trim();
    if (clean.startsWith("#")) {
      return hexToRGB(clean);
    }
    const hslMatch = clean.match(/^hsla?\(\s*([\d.]+)\s*[\s,]\s*([\d.]+)%\s*[\s,]\s*([\d.]+)%/i);
    if (hslMatch) {
      const h = parseFloat(hslMatch[1]);
      const s = parseFloat(hslMatch[2]);
      const l = parseFloat(hslMatch[3]);
      return hslToRGB(h, s, l);
    }
    const rgbMatch = clean.match(/^rgba?\(\s*([\d.]+)\s*[\s,]\s*([\d.]+)\s*[\s,]\s*([\d.]+)/i);
    if (rgbMatch) {
      return {
        r: Math.min(1, Math.max(0, parseFloat(rgbMatch[1]) / 255)),
        g: Math.min(1, Math.max(0, parseFloat(rgbMatch[2]) / 255)),
        b: Math.min(1, Math.max(0, parseFloat(rgbMatch[3]) / 255))
      };
    }
    return hexToRGB(clean);
  }
  function rgbToHex(rgb) {
    const r = Math.round(rgb.r * 255).toString(16).padStart(2, "0");
    const g = Math.round(rgb.g * 255).toString(16).padStart(2, "0");
    const b = Math.round(rgb.b * 255).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`.toLowerCase();
  }
  function generateBrandShades(baseHex) {
    const rgb = hexToRGB(baseHex);
    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const min = Math.min(rgb.r, rgb.g, rgb.b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rgb.r:
          h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0);
          break;
        case rgb.g:
          h = (rgb.b - rgb.r) / d + 2;
          break;
        case rgb.b:
          h = (rgb.r - rgb.g) / d + 4;
          break;
      }
      h /= 6;
    }
    const hDeg = Math.round(h * 360);
    const sPct = Math.round(s * 100);
    const lightnessTargets = {
      "50": 97,
      "100": 92,
      "200": 84,
      "300": 74,
      "400": 62,
      "500": 50,
      "600": 40,
      "700": 30,
      "800": 20,
      "900": 12,
      "950": 8
    };
    const shades = {};
    for (const [step, targetL] of Object.entries(lightnessTargets)) {
      const rgbShade = hslToRGB(hDeg, sPct, targetL);
      shades[step] = rgbToHex(rgbShade);
    }
    const formattedBase = baseHex.startsWith("#") ? baseHex : `#${baseHex}`;
    shades["500"] = formattedBase.toLowerCase();
    return shades;
  }
  function relativeLuminance(rgb) {
    const toLinear = (c) => {
      const clamped = Math.max(0, Math.min(1, c));
      return clamped <= 0.04045 ? clamped / 12.92 : Math.pow((clamped + 0.055) / 1.055, 2.4);
    };
    const r = toLinear(rgb.r);
    const g = toLinear(rgb.g);
    const b = toLinear(rgb.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function contrastRatio(rgb1, rgb2) {
    const l1 = relativeLuminance(rgb1);
    const l2 = relativeLuminance(rgb2);
    const maxL = Math.max(l1, l2);
    const minL = Math.min(l1, l2);
    return (maxL + 0.05) / (minL + 0.05);
  }

  // src/generators/brand.ts
  var VALID_BRAND_KEYS = /* @__PURE__ */ new Set([
    "primary",
    "secondary",
    "accent",
    "neutral",
    "destructive",
    "error",
    "success",
    "warning",
    "info"
  ]);
  var DEFAULT_BRAND_CONFIG = {
    primary: "#6750a4",
    secondary: "#8b5cf6",
    accent: "#9bb710",
    neutral: "#6b7280",
    error: "#ef4444",
    warning: "#f59e0b"
  };
  function generateBrandColors(colorContext, variableMap, customConfig = {}, brandGroupPrefix) {
    const stats = { created: 0, updated: 0, skipped: 0 };
    const groupRoot = brandGroupPrefix || GROUPS.BRAND;
    LoggerService.step(`Generating Custom Brand Colors & Shade Palettes under "${groupRoot}"`);
    const { collection, modes } = colorContext;
    const sanitizedCustom = {};
    for (const [key, val] of Object.entries(customConfig)) {
      if (VALID_BRAND_KEYS.has(key) && typeof val === "string" && isValidHexColor(val)) {
        sanitizedCustom[key] = val;
      }
    }
    const config = { ...DEFAULT_BRAND_CONFIG, ...sanitizedCustom };
    for (const [brandKey, hexInput] of Object.entries(config)) {
      if (!VALID_BRAND_KEYS.has(brandKey) || !hexInput || !isValidHexColor(hexInput)) {
        continue;
      }
      const shades = generateBrandShades(hexInput);
      for (const [shadeStep, hexValue] of Object.entries(shades)) {
        const variableName = `${groupRoot}/${brandKey}/${shadeStep}`;
        const rgbValue = cssColorToRGB(hexValue);
        const valuesByModeName = {
          [MODES.LIGHT]: rgbValue,
          [MODES.DARK]: rgbValue
        };
        VariableService.createOrUpdateColorVariable(
          collection,
          variableName,
          modes,
          valuesByModeName,
          variableMap,
          `Custom Brand ${brandKey} shade ${shadeStep}`,
          stats
        );
      }
    }
    LoggerService.success(
      `Brand Colors generated: ${stats.created} created, ${stats.updated} updated.`
    );
    return {
      generatorName: "Brand Colors",
      stats
    };
  }

  // src/data/chart.ts
  var CHART_TOKENS = [
    {
      name: "chart-1",
      value: {
        light: "#e76e50",
        dark: "#2662ea"
      },
      alias: {
        light: "orange/500",
        dark: "blue/600"
      },
      description: "Chart series 1 visual color.",
      scopes: ["ALL_FILLS", "SHAPE_FILL", "STROKE_COLOR"]
    },
    {
      name: "chart-2",
      value: {
        light: "#2a9d90",
        dark: "#2eb88a"
      },
      alias: {
        light: "teal/600",
        dark: "emerald/500"
      },
      description: "Chart series 2 visual color.",
      scopes: ["ALL_FILLS", "SHAPE_FILL", "STROKE_COLOR"]
    },
    {
      name: "chart-3",
      value: {
        light: "#274754",
        dark: "#e88c30"
      },
      alias: {
        light: "cyan/900",
        dark: "amber/600"
      },
      description: "Chart series 3 visual color.",
      scopes: ["ALL_FILLS", "SHAPE_FILL", "STROKE_COLOR"]
    },
    {
      name: "chart-4",
      value: {
        light: "#e8c468",
        dark: "#af57db"
      },
      alias: {
        light: "amber/400",
        dark: "purple/500"
      },
      description: "Chart series 4 visual color.",
      scopes: ["ALL_FILLS", "SHAPE_FILL", "STROKE_COLOR"]
    },
    {
      name: "chart-5",
      value: {
        light: "#f4a261",
        dark: "#e23670"
      },
      alias: {
        light: "orange/400",
        dark: "rose/500"
      },
      description: "Chart series 5 visual color.",
      scopes: ["ALL_FILLS", "SHAPE_FILL", "STROKE_COLOR"]
    }
  ];

  // src/generators/chart.ts
  function generateChartTokens(colorContext, variableMap) {
    const stats = { created: 0, updated: 0, skipped: 0 };
    LoggerService.step("Generating Chart Tokens");
    const { collection, modes } = colorContext;
    for (const token of CHART_TOKENS) {
      const formattedTokenName = token.name.toLowerCase().replace(/\s+/g, "-");
      const variableName = `${GROUPS.CHART}/${formattedTokenName}`;
      const valuesByModeName = {
        [MODES.LIGHT]: cssColorToRGB(token.value.light),
        [MODES.DARK]: cssColorToRGB(token.value.dark)
      };
      const aliasesByModeName = token.alias ? {
        [MODES.LIGHT]: token.alias.light ?? "",
        [MODES.DARK]: token.alias.dark ?? ""
      } : void 0;
      VariableService.createOrUpdateColorVariable(
        collection,
        variableName,
        modes,
        valuesByModeName,
        variableMap,
        token.description ?? `Shadcn UI Chart ${token.name}`,
        stats,
        aliasesByModeName,
        token.scopes
      );
    }
    LoggerService.success(
      `Chart Tokens generated: ${stats.created} created, ${stats.updated} updated.`
    );
    return {
      generatorName: "Chart Tokens",
      stats
    };
  }

  // src/data/primitive.ts
  var PRIMITIVE_PALETTES = [
    {
      name: "Slate",
      shades: {
        "50": "#f8fafc",
        "100": "#f1f5f9",
        "200": "#e2e8f0",
        "300": "#cbd5e1",
        "400": "#94a3b8",
        "500": "#64748b",
        "600": "#475569",
        "700": "#334155",
        "800": "#1e293b",
        "900": "#0f172a",
        "950": "#020617"
      }
    },
    {
      name: "Gray",
      shades: {
        "50": "#f9fafb",
        "100": "#f3f4f6",
        "200": "#e5e7eb",
        "300": "#d1d5db",
        "400": "#9ca3af",
        "500": "#6b7280",
        "600": "#4b5563",
        "700": "#374151",
        "800": "#1f2937",
        "900": "#111827",
        "950": "#030712"
      }
    },
    {
      name: "Zinc",
      shades: {
        "50": "#fafafa",
        "100": "#f4f4f5",
        "200": "#e4e4e7",
        "300": "#d4d4d8",
        "400": "#a1a1aa",
        "500": "#71717a",
        "600": "#52525b",
        "700": "#3f3f46",
        "800": "#27272a",
        "900": "#18181b",
        "950": "#09090b"
      }
    },
    {
      name: "Neutral",
      shades: {
        "50": "#fafafa",
        "100": "#f5f5f5",
        "200": "#e5e5e5",
        "300": "#d4d4d4",
        "400": "#a3a3a3",
        "500": "#737373",
        "600": "#525252",
        "700": "#404040",
        "800": "#262626",
        "900": "#171717",
        "950": "#0a0a0a"
      }
    },
    {
      name: "Stone",
      shades: {
        "50": "#fafaf9",
        "100": "#f5f5f4",
        "200": "#e7e5e4",
        "300": "#d6d3d1",
        "400": "#a8a29e",
        "500": "#78716c",
        "600": "#57534e",
        "700": "#44403c",
        "800": "#292524",
        "900": "#1c1917",
        "950": "#0c0a09"
      }
    },
    {
      name: "Red",
      shades: {
        "50": "#fef2f2",
        "100": "#fee2e2",
        "200": "#fecaca",
        "300": "#fca5a5",
        "400": "#f87171",
        "500": "#ef4444",
        "600": "#dc2626",
        "700": "#b91c1c",
        "800": "#991b1b",
        "900": "#7f1d1d",
        "950": "#450a0a"
      }
    },
    {
      name: "Orange",
      shades: {
        "50": "#fff7ed",
        "100": "#ffedd5",
        "200": "#fed7aa",
        "300": "#fdba74",
        "400": "#fb923c",
        "500": "#f97316",
        "600": "#ea580c",
        "700": "#c2410c",
        "800": "#9a3412",
        "900": "#7c2d12",
        "950": "#431407"
      }
    },
    {
      name: "Amber",
      shades: {
        "50": "#fffbeb",
        "100": "#fef3c7",
        "200": "#fde68a",
        "300": "#fcd34d",
        "400": "#fbbf24",
        "500": "#f59e0b",
        "600": "#d97706",
        "700": "#b45309",
        "800": "#92400e",
        "900": "#78350f",
        "950": "#451a03"
      }
    },
    {
      name: "Yellow",
      shades: {
        "50": "#fefce8",
        "100": "#fef9c3",
        "200": "#fef08a",
        "300": "#fde047",
        "400": "#facc15",
        "500": "#eab308",
        "600": "#ca8a04",
        "700": "#a16207",
        "800": "#854d0e",
        "900": "#713f12",
        "950": "#422006"
      }
    },
    {
      name: "Lime",
      shades: {
        "50": "#f7fee7",
        "100": "#ecfccb",
        "200": "#d9f99d",
        "300": "#bef264",
        "400": "#a3e635",
        "500": "#84cc16",
        "600": "#65a30d",
        "700": "#4d7c0f",
        "800": "#3f6212",
        "900": "#365314",
        "950": "#1a2e05"
      }
    },
    {
      name: "Green",
      shades: {
        "50": "#f0fdf4",
        "100": "#dcfce7",
        "200": "#bbf7d0",
        "300": "#86efac",
        "400": "#4ade80",
        "500": "#22c55e",
        "600": "#16a34a",
        "700": "#15803d",
        "800": "#166534",
        "900": "#14532d",
        "950": "#052e16"
      }
    },
    {
      name: "Emerald",
      shades: {
        "50": "#ecfdf5",
        "100": "#d1fae5",
        "200": "#a7f3d0",
        "300": "#6ee7b7",
        "400": "#34d399",
        "500": "#10b981",
        "600": "#059669",
        "700": "#047857",
        "800": "#065f46",
        "900": "#064e3b",
        "950": "#022c22"
      }
    },
    {
      name: "Teal",
      shades: {
        "50": "#f0fdfa",
        "100": "#ccfbf1",
        "200": "#99f6e4",
        "300": "#5eead4",
        "400": "#2dd4bf",
        "500": "#14b8a6",
        "600": "#0d9488",
        "700": "#0f766e",
        "800": "#115e59",
        "900": "#134e4a",
        "950": "#042f2e"
      }
    },
    {
      name: "Cyan",
      shades: {
        "50": "#ecfeff",
        "100": "#cffaff",
        "200": "#a5f3fc",
        "300": "#67e8f9",
        "400": "#22d3ee",
        "500": "#06b6d4",
        "600": "#0891b2",
        "700": "#0e7490",
        "800": "#155e75",
        "900": "#164e63",
        "950": "#083344"
      }
    },
    {
      name: "Sky",
      shades: {
        "50": "#f0f9ff",
        "100": "#e0f2fe",
        "200": "#bae6fd",
        "300": "#7dd3fc",
        "400": "#38bdf8",
        "500": "#0ea5e9",
        "600": "#0284c7",
        "700": "#0369a1",
        "800": "#075985",
        "900": "#0c4a6e",
        "950": "#082f49"
      }
    },
    {
      name: "Blue",
      shades: {
        "50": "#eff6ff",
        "100": "#dbeafe",
        "200": "#bfdbfe",
        "300": "#93c5fd",
        "400": "#60a5fa",
        "500": "#3b82f6",
        "600": "#2563eb",
        "700": "#1d4ed8",
        "800": "#1e40af",
        "900": "#1e3a8a",
        "950": "#172554"
      }
    },
    {
      name: "Indigo",
      shades: {
        "50": "#eef2ff",
        "100": "#e0e7ff",
        "200": "#c7d2fe",
        "300": "#a5b4fc",
        "400": "#818cf8",
        "500": "#6366f1",
        "600": "#4f46e5",
        "700": "#4338ca",
        "800": "#3730a3",
        "900": "#312e81",
        "950": "#1e1b4b"
      }
    },
    {
      name: "Violet",
      shades: {
        "50": "#f5f3ff",
        "100": "#ede9fe",
        "200": "#ddd6fe",
        "300": "#c4b5fd",
        "400": "#a78bfa",
        "500": "#8b5cf6",
        "600": "#7c3aed",
        "700": "#6d28d9",
        "800": "#5b21b6",
        "900": "#4c1d95",
        "950": "#2e1065"
      }
    },
    {
      name: "Purple",
      shades: {
        "50": "#faf5ff",
        "100": "#f3e8ff",
        "200": "#e9d5ff",
        "300": "#d8b4fe",
        "400": "#c084fc",
        "500": "#a855f7",
        "600": "#9333ea",
        "700": "#7e22ce",
        "800": "#6b21a8",
        "900": "#581c87",
        "950": "#3b0764"
      }
    },
    {
      name: "Fuchsia",
      shades: {
        "50": "#fdf4ff",
        "100": "#fae8ff",
        "200": "#f5d0fe",
        "300": "#f0abfc",
        "400": "#e879f9",
        "500": "#d946ef",
        "600": "#c026d3",
        "700": "#a21caf",
        "800": "#86198f",
        "900": "#701a75",
        "950": "#4a044e"
      }
    },
    {
      name: "Pink",
      shades: {
        "50": "#fdf2f8",
        "100": "#fce7f3",
        "200": "#fbcfe8",
        "300": "#f9a8d4",
        "400": "#f472b6",
        "500": "#ec4899",
        "600": "#db2777",
        "700": "#be185d",
        "800": "#9d174d",
        "900": "#831843",
        "950": "#500724"
      }
    },
    {
      name: "Rose",
      shades: {
        "50": "#fff1f2",
        "100": "#ffe4e6",
        "200": "#fecdd3",
        "300": "#fda4af",
        "400": "#fb7185",
        "500": "#f43f5e",
        "600": "#e11d48",
        "700": "#be123c",
        "800": "#9f1239",
        "900": "#881337",
        "950": "#4c0519"
      }
    }
  ];

  // src/generators/primitive.ts
  function generatePrimitiveColors(colorContext, variableMap, selectedPalettes) {
    const stats = { created: 0, updated: 0, skipped: 0 };
    LoggerService.step("Generating Primitive Colors (Tailwind Palettes)");
    const { collection, modes } = colorContext;
    const filterSet = selectedPalettes && selectedPalettes.length > 0 ? new Set(selectedPalettes.map((p) => p.toLowerCase())) : null;
    for (const palette of PRIMITIVE_PALETTES) {
      const paletteNameLower = palette.name.toLowerCase();
      if (filterSet && !filterSet.has(paletteNameLower)) {
        continue;
      }
      for (const [shade, hexValue] of Object.entries(palette.shades)) {
        const variableName = `${GROUPS.PRIMITIVE}/${paletteNameLower}/${shade}`;
        const rgbValue = cssColorToRGB(hexValue);
        const valuesByModeName = {
          [MODES.LIGHT]: rgbValue,
          [MODES.DARK]: rgbValue
        };
        VariableService.createOrUpdateColorVariable(
          collection,
          variableName,
          modes,
          valuesByModeName,
          variableMap,
          `Tailwind CSS ${palette.name} ${shade}`,
          stats
        );
      }
    }
    LoggerService.success(
      `Primitive Colors generated: ${stats.created} created, ${stats.updated} updated.`
    );
    return {
      generatorName: "Primitive Colors",
      stats
    };
  }

  // src/data/sidebar.ts
  var SIDEBAR_TOKENS = [
    {
      name: "sidebar",
      value: {
        light: "#fafafa",
        dark: "#18181b"
      },
      alias: {
        light: "zinc/50",
        dark: "zinc/900"
      },
      description: "Sidebar background surface color.",
      scopes: ["ALL_FILLS", "FRAME_FILL"]
    },
    {
      name: "sidebar-foreground",
      value: {
        light: "#18181b",
        dark: "#f4f4f5"
      },
      alias: {
        light: "zinc/900",
        dark: "zinc/100"
      },
      description: "Sidebar default text and icon color.",
      scopes: ["TEXT_FILL", "ALL_FILLS"]
    },
    {
      name: "sidebar-primary",
      value: {
        light: "#18181b",
        dark: "#1d4ed8"
      },
      alias: {
        light: "zinc/900",
        dark: "blue/700"
      },
      description: "Sidebar active item primary action background color.",
      scopes: ["ALL_FILLS", "FRAME_FILL"]
    },
    {
      name: "sidebar-primary-foreground",
      value: {
        light: "#fafafa",
        dark: "#ffffff"
      },
      alias: {
        light: "zinc/50",
        dark: "zinc/50"
      },
      description: "Sidebar active item text color.",
      scopes: ["TEXT_FILL", "ALL_FILLS"]
    },
    {
      name: "sidebar-accent",
      value: {
        light: "#f4f4f5",
        dark: "#27272a"
      },
      alias: {
        light: "zinc/100",
        dark: "zinc/800"
      },
      description: "Sidebar hover item background color.",
      scopes: ["ALL_FILLS", "FRAME_FILL"]
    },
    {
      name: "sidebar-accent-foreground",
      value: {
        light: "#18181b",
        dark: "#f4f4f5"
      },
      alias: {
        light: "zinc/900",
        dark: "zinc/100"
      },
      description: "Sidebar hover item text color.",
      scopes: ["TEXT_FILL", "ALL_FILLS"]
    },
    {
      name: "sidebar-border",
      value: {
        light: "#e4e4e7",
        dark: "#27272a"
      },
      alias: {
        light: "zinc/200",
        dark: "zinc/800"
      },
      description: "Sidebar component border color.",
      scopes: ["STROKE_COLOR", "ALL_FILLS"]
    },
    {
      name: "sidebar-ring",
      value: {
        light: "#18181b",
        dark: "#d4d4d8"
      },
      alias: {
        light: "zinc/900",
        dark: "zinc/300"
      },
      description: "Sidebar focus outline ring color.",
      scopes: ["STROKE_COLOR", "ALL_FILLS"]
    }
  ];

  // src/generators/sidebar.ts
  function generateSidebarTokens(colorContext, variableMap) {
    const stats = { created: 0, updated: 0, skipped: 0 };
    LoggerService.step("Generating Sidebar Tokens");
    const { collection, modes } = colorContext;
    for (const token of SIDEBAR_TOKENS) {
      const formattedTokenName = token.name.toLowerCase().replace(/\s+/g, "-");
      const variableName = `${GROUPS.SIDEBAR}/${formattedTokenName}`;
      const valuesByModeName = {
        [MODES.LIGHT]: cssColorToRGB(token.value.light),
        [MODES.DARK]: cssColorToRGB(token.value.dark)
      };
      const aliasesByModeName = token.alias ? {
        [MODES.LIGHT]: token.alias.light ?? "",
        [MODES.DARK]: token.alias.dark ?? ""
      } : void 0;
      VariableService.createOrUpdateColorVariable(
        collection,
        variableName,
        modes,
        valuesByModeName,
        variableMap,
        token.description ?? `Shadcn UI Sidebar ${token.name}`,
        stats,
        aliasesByModeName,
        token.scopes
      );
    }
    LoggerService.success(
      `Sidebar Tokens generated: ${stats.created} created, ${stats.updated} updated.`
    );
    return {
      generatorName: "Sidebar Tokens",
      stats
    };
  }

  // src/data/theme.ts
  var THEME_TOKENS = [
    {
      name: "background",
      value: {
        light: "#ffffff",
        dark: "#09090b"
      },
      alias: {
        light: "zinc/50",
        dark: "zinc/950"
      },
      description: "The default application background color.",
      scopes: ["FRAME_FILL"]
    },
    {
      name: "foreground",
      value: {
        light: "#09090b",
        dark: "#fafafa"
      },
      alias: {
        light: "zinc/950",
        dark: "zinc/50"
      },
      description: "Default text and icon color.",
      scopes: ["TEXT_FILL"]
    },
    {
      name: "card",
      value: {
        light: "#ffffff",
        dark: "#09090b"
      },
      alias: {
        light: "zinc/50",
        dark: "zinc/950"
      },
      description: "Card container surface background color.",
      scopes: ["FRAME_FILL"]
    },
    {
      name: "card-foreground",
      value: {
        light: "#09090b",
        dark: "#fafafa"
      },
      alias: {
        light: "zinc/950",
        dark: "zinc/50"
      },
      description: "Text and icon color on card elements.",
      scopes: ["TEXT_FILL"]
    },
    {
      name: "popover",
      value: {
        light: "#ffffff",
        dark: "#09090b"
      },
      alias: {
        light: "zinc/50",
        dark: "zinc/950"
      },
      description: "Popover container background color.",
      scopes: ["FRAME_FILL"]
    },
    {
      name: "popover-foreground",
      value: {
        light: "#09090b",
        dark: "#fafafa"
      },
      alias: {
        light: "zinc/950",
        dark: "zinc/50"
      },
      description: "Text and icon color inside popovers.",
      scopes: ["TEXT_FILL"]
    },
    {
      name: "primary",
      value: {
        light: "#18181b",
        dark: "#fafafa"
      },
      alias: {
        light: "zinc/900",
        dark: "zinc/50"
      },
      description: "Primary brand color used for interactive elements.",
      scopes: ["ALL_FILLS"]
    },
    {
      name: "primary-foreground",
      value: {
        light: "#fafafa",
        dark: "#18181b"
      },
      alias: {
        light: "zinc/50",
        dark: "zinc/900"
      },
      description: "Text color on primary interactive elements.",
      scopes: ["TEXT_FILL"]
    },
    {
      name: "secondary",
      value: {
        light: "#f4f4f5",
        dark: "#27272a"
      },
      alias: {
        light: "zinc/100",
        dark: "zinc/800"
      },
      description: "Secondary background color for badges and secondary buttons.",
      scopes: ["FRAME_FILL"]
    },
    {
      name: "secondary-foreground",
      value: {
        light: "#18181b",
        dark: "#fafafa"
      },
      alias: {
        light: "zinc/900",
        dark: "zinc/50"
      },
      description: "Text color on secondary elements.",
      scopes: ["TEXT_FILL"]
    },
    {
      name: "muted",
      value: {
        light: "#f4f4f5",
        dark: "#27272a"
      },
      alias: {
        light: "zinc/100",
        dark: "zinc/800"
      },
      description: "Low emphasis surface background color.",
      scopes: ["FRAME_FILL"]
    },
    {
      name: "muted-foreground",
      value: {
        light: "#71717a",
        dark: "#a1a1aa"
      },
      alias: {
        light: "zinc/500",
        dark: "zinc/400"
      },
      description: "Low emphasis text and subtle labels.",
      scopes: ["TEXT_FILL"]
    },
    {
      name: "accent",
      value: {
        light: "#f4f4f5",
        dark: "#27272a"
      },
      alias: {
        light: "zinc/100",
        dark: "zinc/800"
      },
      description: "Hover and active interactive highlight color.",
      scopes: ["FRAME_FILL"]
    },
    {
      name: "accent-foreground",
      value: {
        light: "#18181b",
        dark: "#fafafa"
      },
      alias: {
        light: "zinc/900",
        dark: "zinc/50"
      },
      description: "Text color on accent elements.",
      scopes: ["TEXT_FILL"]
    },
    {
      name: "destructive",
      value: {
        light: "#ef4444",
        dark: "#7f1d1d"
      },
      alias: {
        light: "red/500",
        dark: "red/900"
      },
      description: "Destructive actions and error state color.",
      scopes: ["ALL_FILLS"]
    },
    {
      name: "destructive-foreground",
      value: {
        light: "#fafafa",
        dark: "#fafafa"
      },
      alias: {
        light: "zinc/50",
        dark: "zinc/50"
      },
      description: "Text color on destructive action elements.",
      scopes: ["TEXT_FILL"]
    },
    {
      name: "border",
      value: {
        light: "#e4e4e7",
        dark: "#27272a"
      },
      alias: {
        light: "zinc/200",
        dark: "zinc/800"
      },
      description: "Default border color.",
      scopes: ["STROKE_COLOR"]
    },
    {
      name: "input",
      value: {
        light: "#e4e4e7",
        dark: "#27272a"
      },
      alias: {
        light: "zinc/200",
        dark: "zinc/800"
      },
      description: "Form input control border color.",
      scopes: ["STROKE_COLOR"]
    },
    {
      name: "ring",
      value: {
        light: "#18181b",
        dark: "#d4d4d8"
      },
      alias: {
        light: "zinc/900",
        dark: "zinc/300"
      },
      description: "Focus ring outline color for keyboard navigation.",
      scopes: ["STROKE_COLOR"]
    }
  ];

  // src/generators/theme.ts
  function generateThemeTokens(colorContext, variableMap, brandConfig, brandGroupPrefix) {
    const stats = { created: 0, updated: 0, skipped: 0 };
    LoggerService.step("Generating Theme Tokens (Shadcn UI)");
    const { collection, modes } = colorContext;
    const isBrandMode = Boolean(brandConfig && brandConfig.primary);
    const groupRoot = brandGroupPrefix || GROUPS.BRAND;
    for (const token of THEME_TOKENS) {
      const formattedTokenName = token.name.toLowerCase().replace(/\s+/g, "-");
      const variableName = `${GROUPS.THEME}/${formattedTokenName}`;
      const valuesByModeName = {
        [MODES.LIGHT]: cssColorToRGB(token.value.light),
        [MODES.DARK]: cssColorToRGB(token.value.dark)
      };
      let lightAlias = token.alias?.light ? `${GROUPS.PRIMITIVE}/${token.alias.light}` : void 0;
      let darkAlias = token.alias?.dark ? `${GROUPS.PRIMITIVE}/${token.alias.dark}` : void 0;
      if (isBrandMode) {
        if (formattedTokenName === "primary" && brandConfig?.primary) {
          lightAlias = `${groupRoot}/primary/600`;
          darkAlias = `${groupRoot}/primary/400`;
        } else if (formattedTokenName === "primary-foreground") {
          lightAlias = brandConfig?.neutral ? `${groupRoot}/neutral/50` : void 0;
          darkAlias = brandConfig?.neutral ? `${groupRoot}/neutral/950` : void 0;
        } else if (formattedTokenName === "secondary" && brandConfig?.secondary) {
          lightAlias = `${groupRoot}/secondary/600`;
          darkAlias = `${groupRoot}/secondary/400`;
        } else if (formattedTokenName === "secondary-foreground") {
          lightAlias = brandConfig?.neutral ? `${groupRoot}/neutral/950` : void 0;
          darkAlias = brandConfig?.neutral ? `${groupRoot}/neutral/50` : void 0;
        } else if (formattedTokenName === "accent" && (brandConfig?.accent || brandConfig?.secondary)) {
          const accKey = brandConfig?.accent ? "accent" : "secondary";
          lightAlias = `${groupRoot}/${accKey}/500`;
          darkAlias = `${groupRoot}/${accKey}/400`;
        } else if (formattedTokenName === "accent-foreground") {
          lightAlias = brandConfig?.neutral ? `${groupRoot}/neutral/950` : void 0;
          darkAlias = brandConfig?.neutral ? `${groupRoot}/neutral/50` : void 0;
        } else if (formattedTokenName === "destructive" && (brandConfig?.destructive || brandConfig?.error)) {
          const destKey = brandConfig?.destructive ? "destructive" : "error";
          lightAlias = `${groupRoot}/${destKey}/600`;
          darkAlias = `${groupRoot}/${destKey}/400`;
        } else if (formattedTokenName === "destructive-foreground") {
          const destKey = brandConfig?.destructive ? "destructive" : brandConfig?.error ? "error" : void 0;
          lightAlias = destKey ? `${groupRoot}/${destKey}/50` : brandConfig?.neutral ? `${groupRoot}/neutral/50` : void 0;
          darkAlias = destKey ? `${groupRoot}/${destKey}/50` : brandConfig?.neutral ? `${groupRoot}/neutral/50` : void 0;
        } else if (formattedTokenName === "warning" && brandConfig?.warning) {
          lightAlias = `${groupRoot}/warning/600`;
          darkAlias = `${groupRoot}/warning/400`;
        } else if (formattedTokenName === "success" && brandConfig?.success) {
          lightAlias = `${groupRoot}/success/600`;
          darkAlias = `${groupRoot}/success/400`;
        } else if (formattedTokenName === "info" && brandConfig?.info) {
          lightAlias = `${groupRoot}/info/600`;
          darkAlias = `${groupRoot}/info/400`;
        } else if (formattedTokenName === "muted" && brandConfig?.neutral) {
          lightAlias = `${groupRoot}/neutral/100`;
          darkAlias = `${groupRoot}/neutral/900`;
        } else if (formattedTokenName === "muted-foreground" && brandConfig?.neutral) {
          lightAlias = `${groupRoot}/neutral/500`;
          darkAlias = `${groupRoot}/neutral/400`;
        } else if ((formattedTokenName === "card" || formattedTokenName === "popover" || formattedTokenName === "background") && brandConfig?.neutral) {
          lightAlias = `${groupRoot}/neutral/50`;
          darkAlias = `${groupRoot}/neutral/950`;
        } else if ((formattedTokenName === "foreground" || formattedTokenName === "card-foreground" || formattedTokenName === "popover-foreground") && brandConfig?.neutral) {
          lightAlias = `${groupRoot}/neutral/950`;
          darkAlias = `${groupRoot}/neutral/50`;
        } else if ((formattedTokenName === "border" || formattedTokenName === "input") && brandConfig?.neutral) {
          lightAlias = `${groupRoot}/neutral/200`;
          darkAlias = `${groupRoot}/neutral/800`;
        } else if (formattedTokenName === "ring" && brandConfig?.primary) {
          lightAlias = `${groupRoot}/primary/600`;
          darkAlias = `${groupRoot}/primary/400`;
        } else {
          lightAlias = token.alias?.light ? `${GROUPS.PRIMITIVE}/${token.alias.light}` : void 0;
          darkAlias = token.alias?.dark ? `${GROUPS.PRIMITIVE}/${token.alias.dark}` : void 0;
        }
      }
      const aliasesByModeName = lightAlias && darkAlias ? {
        [MODES.LIGHT]: lightAlias,
        [MODES.DARK]: darkAlias
      } : void 0;
      VariableService.createOrUpdateColorVariable(
        collection,
        variableName,
        modes,
        valuesByModeName,
        variableMap,
        token.description ?? `Shadcn UI Theme ${token.name}`,
        stats,
        aliasesByModeName,
        token.scopes
      );
    }
    LoggerService.success(
      `Theme Tokens generated: ${stats.created} created, ${stats.updated} updated.`
    );
    return {
      generatorName: "Theme Tokens",
      stats
    };
  }

  // src/generators/colors.ts
  async function generateColorsCollection(variableMap, brandConfig, colorScope, selectedPalettes, brandGroupPrefix) {
    LoggerService.step("Orchestrating Colors Collection Generation");
    const collection = await CollectionService.getOrCreateCollection(COLLECTIONS.COLORS);
    const modes = ModeService.ensureModes(collection, [MODES.LIGHT, MODES.DARK]);
    const colorContext = { collection, modes };
    const scope = colorScope || {
      primitive: true,
      brand: true,
      theme: true,
      semantic: true,
      sidebar: true,
      chart: true
    };
    const results = [];
    if (scope.primitive) {
      results.push(generatePrimitiveColors(colorContext, variableMap, selectedPalettes));
    }
    if (scope.brand) {
      results.push(generateBrandColors(colorContext, variableMap, brandConfig, brandGroupPrefix));
    }
    if (scope.theme) {
      results.push(generateThemeTokens(colorContext, variableMap, brandConfig, brandGroupPrefix));
    }
    if (scope.sidebar) {
      results.push(generateSidebarTokens(colorContext, variableMap));
    }
    if (scope.chart) {
      results.push(generateChartTokens(colorContext, variableMap));
    }
    return results;
  }

  // src/data/effects.ts
  var SHADOW_TOKENS = [
    { name: "shadow/xs", value: 2, description: "2px drop shadow elevation", scopes: ["EFFECT_FLOAT"] },
    { name: "shadow/sm", value: 4, description: "4px drop shadow elevation", scopes: ["EFFECT_FLOAT"] },
    { name: "shadow/md", value: 8, description: "8px drop shadow elevation", scopes: ["EFFECT_FLOAT"] },
    { name: "shadow/lg", value: 16, description: "16px drop shadow elevation", scopes: ["EFFECT_FLOAT"] },
    { name: "shadow/xl", value: 24, description: "24px drop shadow elevation", scopes: ["EFFECT_FLOAT"] }
  ];
  var BLUR_TOKENS = [
    { name: "blur/none", value: 0, description: "0px blur", scopes: ["EFFECT_FLOAT"] },
    { name: "blur/sm", value: 4, description: "4px backdrop blur", scopes: ["EFFECT_FLOAT"] },
    { name: "blur/md", value: 8, description: "8px backdrop blur", scopes: ["EFFECT_FLOAT"] },
    { name: "blur/lg", value: 16, description: "16px backdrop blur", scopes: ["EFFECT_FLOAT"] },
    { name: "blur/xl", value: 24, description: "24px backdrop blur", scopes: ["EFFECT_FLOAT"] }
  ];
  var OPACITY_TOKENS = [
    { name: "opacity/0", value: 0, description: "0% opacity - Transparent", scopes: ["OPACITY"] },
    { name: "opacity/5", value: 0.05, description: "5% opacity", scopes: ["OPACITY"] },
    { name: "opacity/10", value: 0.1, description: "10% opacity", scopes: ["OPACITY"] },
    { name: "opacity/20", value: 0.2, description: "20% opacity", scopes: ["OPACITY"] },
    { name: "opacity/25", value: 0.25, description: "25% opacity", scopes: ["OPACITY"] },
    { name: "opacity/30", value: 0.3, description: "30% opacity", scopes: ["OPACITY"] },
    { name: "opacity/40", value: 0.4, description: "40% opacity", scopes: ["OPACITY"] },
    { name: "opacity/50", value: 0.5, description: "50% opacity", scopes: ["OPACITY"] },
    { name: "opacity/60", value: 0.6, description: "60% opacity", scopes: ["OPACITY"] },
    { name: "opacity/70", value: 0.7, description: "70% opacity", scopes: ["OPACITY"] },
    { name: "opacity/75", value: 0.75, description: "75% opacity", scopes: ["OPACITY"] },
    { name: "opacity/80", value: 0.8, description: "80% opacity", scopes: ["OPACITY"] },
    { name: "opacity/90", value: 0.9, description: "90% opacity", scopes: ["OPACITY"] },
    { name: "opacity/95", value: 0.95, description: "95% opacity", scopes: ["OPACITY"] },
    { name: "opacity/100", value: 1, description: "100% opacity - Opaque", scopes: ["OPACITY"] }
  ];
  var BORDER_WIDTH_TOKENS = [
    { name: "border-width/hairline", value: 0.5, description: "0.5px hairline stroke width", scopes: ["STROKE_COLOR"] },
    { name: "border-width/thin", value: 1, description: "1.0px standard border width", scopes: ["STROKE_COLOR"] },
    { name: "border-width/default", value: 1.5, description: "1.5px default component stroke width", scopes: ["STROKE_COLOR"] },
    { name: "border-width/medium", value: 2, description: "2.0px medium stroke width", scopes: ["STROKE_COLOR"] },
    { name: "border-width/thick", value: 3, description: "3.0px heavy border width", scopes: ["STROKE_COLOR"] }
  ];
  var OUTLINE_TOKENS = [
    { name: "outline/default", value: 1, description: "1.0px standard outline offset", scopes: ["STROKE_COLOR"] },
    { name: "outline/focus", value: 2, description: "2.0px focus outline ring width", scopes: ["STROKE_COLOR"] },
    { name: "outline/error", value: 2, description: "2.0px error outline ring width", scopes: ["STROKE_COLOR"] }
  ];

  // src/services/effect-style.service.ts
  var EffectStyleService = class {
    static {
      /**
       * Standard Shadcn UI Drop Shadow Definitions
       */
      this.SHADOW_DEFINITIONS = [
        {
          name: "shadow-sm",
          description: "Shadcn UI Small Drop Shadow",
          effects: [
            {
              type: "DROP_SHADOW",
              color: { r: 0, g: 0, b: 0, a: 0.05 },
              offset: { x: 0, y: 1 },
              radius: 2,
              spread: 0,
              visible: true,
              blendMode: "NORMAL"
            }
          ]
        },
        {
          name: "shadow-md",
          description: "Shadcn UI Medium Drop Shadow",
          effects: [
            {
              type: "DROP_SHADOW",
              color: { r: 0, g: 0, b: 0, a: 0.1 },
              offset: { x: 0, y: 4 },
              radius: 6,
              spread: -1,
              visible: true,
              blendMode: "NORMAL"
            }
          ]
        },
        {
          name: "shadow-lg",
          description: "Shadcn UI Large Drop Shadow",
          effects: [
            {
              type: "DROP_SHADOW",
              color: { r: 0, g: 0, b: 0, a: 0.1 },
              offset: { x: 0, y: 10 },
              radius: 15,
              spread: -3,
              visible: true,
              blendMode: "NORMAL"
            }
          ]
        },
        {
          name: "shadow-xl",
          description: "Shadcn UI Extra Large Drop Shadow",
          effects: [
            {
              type: "DROP_SHADOW",
              color: { r: 0, g: 0, b: 0, a: 0.1 },
              offset: { x: 0, y: 20 },
              radius: 25,
              spread: -5,
              visible: true,
              blendMode: "NORMAL"
            }
          ]
        },
        {
          name: "shadow-2xl",
          description: "Shadcn UI 2X Extra Large Drop Shadow",
          effects: [
            {
              type: "DROP_SHADOW",
              color: { r: 0, g: 0, b: 0, a: 0.25 },
              offset: { x: 0, y: 25 },
              radius: 50,
              spread: -12,
              visible: true,
              blendMode: "NORMAL"
            }
          ]
        }
      ];
    }
    /**
     * Creates or updates native Figma EffectStyle objects idempotently.
     */
    static async generateNativeEffectStyles() {
      const createdStyles = [];
      try {
        let existingStyles = [];
        if (typeof figma.getLocalEffectStylesAsync === "function") {
          existingStyles = await figma.getLocalEffectStylesAsync();
        }
        for (const def of this.SHADOW_DEFINITIONS) {
          let style = existingStyles.find((s) => s.name === def.name);
          if (!style) {
            style = figma.createEffectStyle();
            style.name = def.name;
            StatsService.trackStyleCreated();
            LoggerService.info(`Created new EffectStyle: "${def.name}"`);
          } else {
            StatsService.trackStyleUpdated();
          }
          style.description = def.description;
          style.effects = def.effects;
          createdStyles.push(style);
        }
      } catch (err) {
        LoggerService.error("Failed to create native EffectStyles", err);
      }
      return createdStyles;
    }
  };

  // src/generators/effects.ts
  async function generateEffectsCollection(variableMap) {
    const result = {
      generatorName: COLLECTIONS.EFFECTS,
      stats: { created: 0, updated: 0, skipped: 0 }
    };
    LoggerService.step(`Generating "${COLLECTIONS.EFFECTS}" Collection`);
    const collection = await CollectionService.getOrCreateCollection(COLLECTIONS.EFFECTS);
    const modeMap = ModeService.ensureModes(collection, [MODES.LIGHT]);
    const modeId = modeMap[MODES.LIGHT] || collection.defaultModeId;
    for (const token of SHADOW_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of BLUR_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of OPACITY_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of BORDER_WIDTH_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of OUTLINE_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    LoggerService.step("Generating Native Figma Effect Styles (Drop Shadows)");
    await EffectStyleService.generateNativeEffectStyles();
    LoggerService.success(
      `Completed "${COLLECTIONS.EFFECTS}" Collection generation. Created: ${result.stats.created}, Updated: ${result.stats.updated}.`
    );
    return result;
  }

  // src/factories/base.factory.ts
  var BaseComponentFactory = class _BaseComponentFactory {
    /**
     * Finds or creates a page by name and sets it as the current active page.
     */
    static async getOrCreatePage(pageName) {
      const existingPage = figma.root.children.find((p) => p.name === pageName);
      if (existingPage) {
        await figma.setCurrentPageAsync(existingPage);
        return existingPage;
      }
      const newPage = figma.createPage();
      newPage.name = pageName;
      await figma.setCurrentPageAsync(newPage);
      LoggerService.info(`Created new canvas page: "${pageName}"`);
      return newPage;
    }
    /**
     * Creates a structural FrameNode with Auto Layout for canvas preview sections.
     */
    static createStructuralFrame(name, direction = "HORIZONTAL", padding = {}, itemSpacing = 8) {
      const frame = figma.createFrame();
      frame.name = name;
      frame.layoutMode = direction;
      frame.primaryAxisSizingMode = "AUTO";
      frame.counterAxisSizingMode = "AUTO";
      frame.paddingTop = padding.top ?? 0;
      frame.paddingBottom = padding.bottom ?? 0;
      frame.paddingLeft = padding.left ?? 0;
      frame.paddingRight = padding.right ?? 0;
      frame.itemSpacing = itemSpacing;
      return frame;
    }
    /**
     * Binds a Figma Variable to a specific node field safely.
     */
    static bindVariable(node, field, variable, initialColor) {
      if (!variable) return;
      try {
        if (field === "fills" && "fills" in node) {
          const solidPaint = {
            type: "SOLID",
            color: initialColor || { r: 0.9, g: 0.9, b: 0.9 }
          };
          if (typeof figma.variables?.setBoundVariableForPaint === "function") {
            const boundPaint = figma.variables.setBoundVariableForPaint(solidPaint, "color", variable);
            node.fills = [boundPaint];
          } else {
            node.fills = [solidPaint];
          }
          if ("setBoundVariable" in node && typeof node.setBoundVariable === "function") {
            try {
              node.setBoundVariable("fills", variable);
            } catch (_e) {
            }
          }
        } else if (field === "strokes" && "strokes" in node) {
          const solidPaint = {
            type: "SOLID",
            color: initialColor || { r: 0.8, g: 0.8, b: 0.8 }
          };
          if (typeof figma.variables?.setBoundVariableForPaint === "function") {
            const boundPaint = figma.variables.setBoundVariableForPaint(solidPaint, "color", variable);
            node.strokes = [boundPaint];
          } else {
            node.strokes = [solidPaint];
          }
          if ("setBoundVariable" in node && typeof node.setBoundVariable === "function") {
            try {
              node.setBoundVariable("strokes", variable);
            } catch (_e) {
            }
          }
        } else if ("setBoundVariable" in node && typeof node.setBoundVariable === "function") {
          node.setBoundVariable(field, variable);
        }
      } catch (_e) {
      }
    }
    /**
     * Creates a structured documentation block (What It Is / How To Use / Do / Don't).
     * All text nodes use textAutoResize = 'WIDTH_AND_HEIGHT' for proper hug behavior.
     * Returns a VERTICAL Auto Layout frame.
     */
    static createDocBlock(opts) {
      const block = figma.createFrame();
      block.name = "Doc Block";
      block.layoutMode = "VERTICAL";
      block.primaryAxisSizingMode = "AUTO";
      block.counterAxisSizingMode = "AUTO";
      block.paddingTop = 0;
      block.paddingBottom = 0;
      block.paddingLeft = 0;
      block.paddingRight = 0;
      block.itemSpacing = 10;
      const addLabel = (label, color, v, bold = true) => {
        const t2 = figma.createText();
        t2.characters = label;
        t2.fontSize = 9;
        t2.textAutoResize = "WIDTH_AND_HEIGHT";
        if (bold) {
          try {
            t2.fontName = { family: "Inter", style: "Bold" };
          } catch (_e) {
          }
        }
        t2.fills = [{ type: "SOLID", color }];
        if (v) _BaseComponentFactory.bindVariable(t2, "fills", v);
        return t2;
      };
      const addBody = (text, v) => {
        const t2 = figma.createText();
        t2.characters = text;
        t2.fontSize = 11;
        t2.textAutoResize = "WIDTH_AND_HEIGHT";
        t2.fills = [{ type: "SOLID", color: { r: 0.2, g: 0.2, b: 0.24 } }];
        if (v) _BaseComponentFactory.bindVariable(t2, "fills", v);
        return t2;
      };
      const mutedColor = { r: 0.45, g: 0.45, b: 0.5 };
      const warnColor = { r: 0.85, g: 0.45, b: 0.1 };
      const successColor = { r: 0.1, g: 0.65, b: 0.3 };
      const errorColor = { r: 0.85, g: 0.1, b: 0.1 };
      if (opts.whatItIs) {
        block.appendChild(addLabel(opts.labelWhatItIs || "WHAT IT IS", mutedColor, opts.mutedVar));
        block.appendChild(addBody(opts.whatItIs, opts.fgVar));
      }
      if (opts.howToUse) {
        block.appendChild(addLabel(opts.labelHowToUse || "HOW TO USE", mutedColor, opts.mutedVar));
        block.appendChild(addBody(opts.howToUse, opts.fgVar));
      }
      if (opts.doText) {
        block.appendChild(addLabel(opts.labelDo || "DO", successColor, opts.successVar));
        block.appendChild(addBody(opts.doText, opts.fgVar));
      }
      if (opts.dontText) {
        block.appendChild(addLabel(opts.labelDont || "DON'T", errorColor));
        block.appendChild(addBody(opts.dontText, opts.fgVar));
      }
      if (opts.notes) {
        block.appendChild(addLabel(opts.labelNotes || "NOTES", warnColor, opts.warnVar));
        block.appendChild(addBody(opts.notes, opts.fgVar));
      }
      return block;
    }
    /**
     * Creates a bold uppercase section label (e.g. "PRIMITIVE COLORS").
     */
    static createSectionLabel(text, fgVar) {
      const t2 = figma.createText();
      t2.characters = text;
      t2.fontSize = 11;
      t2.textAutoResize = "WIDTH_AND_HEIGHT";
      try {
        t2.fontName = { family: "Inter", style: "Bold" };
      } catch (_e) {
      }
      t2.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.12 } }];
      if (fgVar) _BaseComponentFactory.bindVariable(t2, "fills", fgVar);
      return t2;
    }
    /**
     * Tags a category frame with plugin metadata to mark it as plugin-managed.
     */
    static tagCategoryFrame(frame, categoryId, lang) {
      try {
        if (typeof frame.setPluginData === "function") {
          frame.setPluginData("foundation-category", "true");
          frame.setPluginData("foundation-category-id", categoryId);
          if (lang) frame.setPluginData("foundation-language", lang);
        }
      } catch (_e) {
      }
    }
    /**
     * Finds an existing plugin-managed category frame on a page.
     * Priority:
     *   1. foundation-category-id pluginData match
     *   2. foundation-category pluginData match + category match
     *   3. Legacy display name match fallback
     */
    static findFoundationCategoryFrame(page, categoryId) {
      if (!page || !Array.isArray(page.children)) return void 0;
      const legacyNames = {
        overview: ["01 \u2014 Overview", "01 \u2014 Ikhtisar"],
        colors: [
          "02 \u2014 Colors",
          "02 \u2014 Color Foundations",
          "02 \u2014 Fondasi Warna",
          "02A \u2014 Primitive Colors",
          "02A \u2014 Warna Primitif",
          "02B \u2014 Brand Colors",
          "02B \u2014 Warna Merek",
          "02C \u2014 Theme Colors",
          "02C \u2014 Warna Tema",
          "02D \u2014 Semantic Colors",
          "02D \u2014 Warna Semantik",
          "02E \u2014 Sidebar Colors",
          "02E \u2014 Warna Sidebar",
          "02F \u2014 Chart Colors",
          "02F \u2014 Warna Grafik"
        ],
        typography: ["03 \u2014 Typography", "03 \u2014 Tipografi"],
        layout: ["04 \u2014 Layout", "04 \u2014 Layout Foundations", "04 \u2014 Fondasi Tata Letak"],
        visual: ["05 \u2014 Visual", "05 \u2014 Visual Foundations", "05 \u2014 Fondasi Visual"],
        system: ["06 \u2014 System", "06 \u2014 System Foundations", "06 \u2014 Fondasi Sistem"]
      };
      const foundById = page.children.find((c) => {
        if ("getPluginData" in c && typeof c.getPluginData === "function") {
          return c.getPluginData("foundation-category-id") === categoryId;
        }
        return false;
      });
      if (foundById && foundById.type === "FRAME") return foundById;
      const expectedLegacy = legacyNames[categoryId] || [];
      const foundByLegacy = page.children.find((c) => expectedLegacy.includes(c.name));
      if (foundByLegacy && foundByLegacy.type === "FRAME") {
        _BaseComponentFactory.tagCategoryFrame(foundByLegacy, categoryId);
        return foundByLegacy;
      }
      return void 0;
    }
  };

  // src/i18n/en/common.ts
  var common = {
    // Plugin Header
    pluginTitle: "Design System Generator",
    pluginSubtitle: "Foundation-first Design System Generator for Figma",
    langSelect: "Language",
    // 8 Main Navigation Tabs
    navDashboard: "Dashboard",
    navColors: "Colors",
    navTypography: "Typography",
    navTypo: "Typography",
    navLayout: "Layout",
    navVisual: "Visual",
    navSystem: "System",
    navExport: "Export & Import",
    navAbout: "About",
    navMore: "More",
    // Dropdown Headers
    dropHeaderColors: "COLORS",
    dropHeaderTypo: "TYPOGRAPHY",
    dropHeaderLayout: "LAYOUT",
    dropHeaderVisual: "VISUAL",
    dropHeaderSystem: "SYSTEM",
    dropHeaderMore: "UTILITIES",
    // Groups
    groupColors: "Colors",
    groupTypography: "Typography",
    groupLayout: "Layout",
    groupVisual: "Visual",
    groupSystem: "System",
    // Dashboard Section Headers & Stats
    statusHeader: "Foundation Status",
    statCollections: "Collections",
    statVariables: "Variables",
    statModes: "Modes",
    statStyles: "Text Styles",
    coverageHeader: "Foundation Coverage",
    quickActionsHeader: "Quick Actions",
    // Category Status Badges
    catStatusConfigured: "\u2713 Configured",
    catStatusPartial: "\u26A0 Partially configured",
    catStatusNotConfigured: "\u25CB Not configured",
    catStatusConfiguredClean: "Configured",
    catStatusPartialClean: "Partially configured",
    catStatusNotConfiguredClean: "Not configured",
    catStatusConfiguredFull: "\u25CF Configured",
    catStatusPartialFull: "\u25D0 Partial",
    catStatusNotConfiguredFull: "\u25CB Not configured",
    // Common Action Buttons & Labels
    btnCancel: "Cancel",
    btnConfirmReplace: "Replace & Generate",
    btnViewLog: "View Log",
    btnHideLog: "Hide Log",
    btnGenerating: "Generating\u2026",
    statusGenTitle: "Generation Status",
    statusGenSuccess: "\u2713 Foundation created successfully",
    statusGenIdle: "Ready to generate foundation.",
    chipBound: "Bound",
    // CTAs
    btnGenerateFull: "\u26A1 Generate Full Foundation",
    btnGenerateBrand: "\u{1F3A8} Generate Custom Brand Colors",
    btnGenerateShadcnColors: "\u26A1 Generate Shadcn Colors",
    btnGenerateTypography: "\u26A1 Generate Typography Styles",
    btnGenerateLayout: "\u26A1 Generate Layout Foundation",
    btnGenerateVisual: "\u26A1 Generate Visual Foundation",
    btnGenerateSystem: "\u26A1 Generate System Foundation"
  };

  // src/i18n/en/dashboard.ts
  var dashboard = {
    dashTitle: "Design System Generator",
    dashSubtitle: "Design System overview for this Figma document.",
    statusConnected: "Connected",
    statusNoFoundation: "No foundation detected",
    btnRefresh: "Refresh",
    hdrOverview: "FOUNDATION OVERVIEW",
    hdrCoverage: "FOUNDATION COVERAGE",
    hdrInventory: "VARIABLE INVENTORY",
    lblSearchPlaceholder: "Search variables\u2026",
    hdrFoundationCollections: "FOUNDATION COLLECTIONS",
    hdrOtherCollections: "OTHER COLLECTIONS",
    hdrOwnership: "VARIABLE OWNERSHIP",
    lblPluginGenerated: "Plugin Generated",
    lblExternal: "Existing / External",
    lblUnknown: "Unknown",
    lblOwnershipNote: "Ownership determined from plugin metadata & token structure.",
    hdrLastGeneration: "LAST GENERATION",
    lblNoGenerationRecorded: "No plugin generation recorded yet.",
    lblRecentHeader: "Recent Session",
    lblLastGenerated: "Last generated",
    lblSessionSource: "Categories",
    lblSessionLang: "Language",
    lblSessionVer: "Version",
    lblLastGenMode: "Mode",
    hdrDangerZone: "Danger Zone",
    descDangerZone: "Reset all plugin-generated foundation collections, variables, text styles, and canvas documentation.",
    btnResetFoundation: "Reset Foundation",
    // Units for dynamic counters
    lblUnitVariables: "variables",
    lblUnitStyles: "text styles",
    lblUnitCollections: "collections",
    lblUnitItems: "items"
  };

  // src/i18n/en/colors.ts
  var colors = {
    dropHeaderColors: "COLORS",
    dropColorsShadcn: "Shadcn Palettes",
    dropColorsBrand: "Brand Colors",
    dropColorsPrimitive: "Shadcn Palettes",
    dropColorsTheme: "Theme",
    dropColorsSemantic: "Semantic",
    dropColorsSidebar: "Sidebar",
    dropColorsChart: "Chart",
    subShadcnColors: "Shadcn Palettes",
    subBrandColors: "Brand Colors",
    subPrimitive: "Primitive",
    subBrand: "Brand",
    subTheme: "Theme",
    subSemantic: "Semantic",
    subSidebar: "Sidebar",
    subChart: "Chart",
    descColorsCard: "Brand, theme and semantic colors.",
    // Adobe Color Harmonies
    harmonyAnalogous: "Analogous",
    harmonyComplementary: "Complementary",
    harmonySplitComp: "Split Complementary",
    harmonyTriad: "Triad",
    harmonySquare: "Square",
    harmonyCompound: "Compound",
    harmonyShades: "Shades",
    harmonyMonochromatic: "Monochromatic",
    pageColorsTitle: "Colors Foundation",
    pageColorsDesc: "Manage Primitive, Custom Brand, Theme, Semantic, Sidebar, and Chart color variables.",
    srcHeader: "Color Source Intent",
    srcShadcn: "Shadcn Colors",
    srcShadcnDesc: "Generate standard Shadcn color foundation (Primitive, Theme, Semantic, Sidebar, Chart).",
    srcBrand: "Custom Brand Colors",
    srcBrandDesc: "Generate custom Brand palette (50\u2013950) and link to Theme & Semantic tokens.",
    presetHeader: "Color Scope Preset",
    presetFull: "Full Color Foundation",
    presetBrand: "Brand Only",
    presetThemeSem: "Theme + Semantic",
    presetCustom: "Custom Selection",
    btnCfgColors: "Configure Colors \u2192",
    btnGenerateColors: "\u{1F3A8} Generate Color Foundation",
    btnGenerateBrand: "\u{1F3A8} Generate Custom Brand Colors",
    btnGenerateShadcnColors: "\u26A1 Generate Shadcn Colors",
    primaryBrand: "Primary Brand",
    secondaryBrand: "Secondary Brand",
    palettePreviewTitle: "Palette Preview",
    connectedFoundation: "Connected Foundation",
    lblPrimaryShades: "Primary (50\u2013950)",
    lblSecondaryShades: "Secondary (50\u2013950)"
  };

  // src/i18n/en/typography.ts
  var typography = {
    dropHeaderTypo: "TYPOGRAPHY",
    dropTypoFont: "Font Family",
    dropTypoScale: "Type Scale",
    dropTypoStyles: "Text Styles",
    subFont: "Font",
    subTypeScale: "Type Scale",
    subTextStyles: "Text Styles",
    descTypoCard: "Native Figma text styles & font scale.",
    colTypeStyle: "Style",
    colTypeSize: "Size",
    colTypeWeight: "Weight",
    colTypeLineHeight: "Line Height",
    colTypeTracking: "Tracking",
    colTypePreview: "Preview",
    btnCfgTypography: "Configure Typography \u2192",
    btnGenerateTypography: "\u26A1 Generate Typography Styles",
    pageTypographyTitle: "Typography Foundation",
    pageTypographyDesc: "Manage Native Figma Text Styles organized by typographic hierarchy.",
    lblFontPicker: "Font Family Discovery",
    lblFontSearch: "Search fonts\u2026",
    lblAvailableWeights: "Available Font Weights",
    lblTypoScale: "Configured Type Scale"
  };

  // src/i18n/en/layout.ts
  var layout = {
    dropHeaderLayout: "LAYOUT",
    dropLayoutSpacing: "Spacing",
    dropLayoutRadius: "Radius",
    subSpacing: "Spacing",
    subRadius: "Radius",
    descLayoutCard: "Spacing grid scale & radius corner tokens.",
    btnGenSpacingOnly: "Spacing Only",
    btnGenRadiusOnly: "Radius Only",
    btnGenLayoutBoth: "Generate Layout Foundation",
    btnCfgLayout: "Configure Layout \u2192",
    btnGenerateLayout: "\u26A1 Generate Layout Foundation",
    pageLayoutTitle: "Layout Foundation",
    pageLayoutDesc: "Define spacing grid scale and corner radius used across the Design System.",
    lblSpacingScale: "Spacing Scale (4px Increments)",
    lblRadiusScale: "Radius Tokens (Corner Scale)",
    lblSpacingRuler: "Ruler Bar Preview"
  };

  // src/i18n/en/visual.ts
  var visual = {
    dropHeaderVisual: "VISUAL",
    dropVisualEffects: "Effects",
    dropVisualShadows: "Shadows",
    dropVisualMotion: "Motion",
    subEffects: "Effects",
    subShadows: "Shadows",
    subMotion: "Motion",
    descVisualCard: "Drop-shadow elevation & motion tokens.",
    btnCfgVisual: "Configure Visual \u2192",
    btnGenerateVisual: "\u26A1 Generate Visual Foundation",
    pageVisualTitle: "Visual Foundation",
    pageVisualDesc: "Manage Drop-Shadow elevation and Motion transition tokens.",
    lblEffectsScale: "Effects & Drop Shadows (Elevation)",
    lblMotionScale: "Motion & Transition Tokens",
    lblStyleBoundNote: "Figma Effect Binding: STYLE-BOUND (Native EffectStyle)",
    lblDurationScale: "Duration Scale",
    lblEasingCurves: "Easing Curves"
  };

  // src/i18n/en/system.ts
  var system = {
    dropHeaderSystem: "SYSTEM",
    dropSystemLayers: "Layers",
    dropSystemIcons: "Icons",
    subLayers: "Layers",
    subIcons: "Icons",
    descSystemCard: "Z-index stacking & icon dimension tokens.",
    btnCfgSystem: "Configure System \u2192",
    btnGenerateSystem: "\u26A1 Generate System Foundation",
    pageSystemTitle: "System Foundation",
    pageSystemDesc: "Manage Z-Index Layer hierarchy and Icon system dimension tokens.",
    lblLayersScale: "Layers & Z-Index Hierarchy",
    lblIconsScale: "Icon System Tokens & Stroke Weights",
    lblStackingTokens: "Stacking Order Tokens",
    lblOverlayTokens: "Component Overlay Z-Index",
    lblIconScale: "Icon Dimension Scale",
    lblStrokeWeights: "Stroke Weights & Aliases"
  };

  // src/i18n/en/export.ts
  var exportTokens = {
    dropHeaderMore: "UTILITIES",
    dropMoreExport: "Export / Import",
    exportHeader: "Export Foundation",
    exportTitle: "Export Tokens",
    exportCss: "Export CSS Variables",
    exportCssDesc: "Outputs :root and .dark CSS custom properties.",
    exportTailwind: "Export Tailwind Config",
    exportTailwindDesc: "Outputs a Tailwind 3 theme extend configuration.",
    exportW3c: "Export W3C Design Tokens",
    exportW3cDesc: "Outputs a standards-compliant W3C token JSON file.",
    importHeader: "Import Tokens",
    importTitle: "Import Tokens",
    importDesc: "Paste W3C JSON token data to import variables into this document.",
    btnImport: "Import JSON Tokens",
    lblExportResultHeader: "Export Result",
    lblImportPlaceholder: "Paste W3C or Shadcn JSON tokens here\u2026"
  };

  // src/i18n/en/about.ts
  var about = {
    dropMoreAbout: "About",
    aboutTitle: "Design System Generator",
    aboutDesc: "Foundation-first Design System Generator for Figma.",
    authorLabel: "Created by",
    githubLabel: "GitHub",
    inspiredBy: "Inspired by",
    versionLabel: "Version"
  };

  // src/i18n/en/canvas.ts
  var canvas = {
    // Canvas Documentation Labels
    docOverviewTitle: "Design System Generator Foundation",
    docOverviewSub: "Foundation tokens and theme primitives used to build the Design System.",
    docNavIndex: "FOUNDATION INDEX",
    docSectionOverview: "01 \u2014 Overview",
    docSectionColors: "02 \u2014 Colors",
    docSectionPrim: "02A \u2014 Primitive Colors",
    docSectionBrand: "02B \u2014 Brand Colors",
    docSectionTheme: "02C \u2014 Theme Colors",
    docSectionSemantic: "02D \u2014 Semantic Colors",
    docSectionSidebar: "02E \u2014 Sidebar Colors",
    docSectionChart: "02F \u2014 Chart Colors",
    docSectionTypo: "03 \u2014 Typography",
    docSectionLayout: "04 \u2014 Layout",
    docSectionVisual: "05 \u2014 Visual",
    docSectionSystem: "06 \u2014 System",
    docPrimTitle: "Primitive Colors Palette",
    docPrimSub: "Tailwind Primitive Palettes (100% Variable Bound)",
    docBrandTitle: "Brand Color System",
    docBrandSub: "Custom Brand Palette (600 Light / 400 Dark Accent)",
    docThemeTitle: "Theme Tokens",
    docThemeSub: "Side-by-Side Comparison of Light & Dark Modes",
    docWcagTitle: "WCAG 2.1 AA Contrast Diagnostic",
    docWcagSub: "Evaluating Theme/primary & Theme/secondary vs Theme/background",
    docTypoTitle: "Typography Scale",
    docTypoSub: "Native Figma Text Styles Organized by Hierarchy",
    docSpacingTitle: "Spacing Scale",
    docSpacingSub: "Incremental Grid Spacing Scale (4px Increments)",
    docRadiusTitle: "Radius Scale",
    docRadiusSub: "Corner Radius Tokens (0px to 9999px Full)",
    docEffectsTitle: "Effects & Elevation",
    docEffectsSub: "Drop-Shadow & Elevation Tokens",
    docMotionTitle: "Motion & Animation Tokens",
    docMotionSub: "Transition Duration & Easing Tokens",
    docLayersTitle: "Layers & Stacking Order",
    docLayersSub: "Z-Index Hierarchy Tokens",
    docIconsTitle: "Icon System Tokens",
    docIconsSub: "Icon Dimension & Stroke Weight Tokens",
    // Documentation Canvas Block Labels
    docWhatItIs: "WHAT IT IS",
    docHowToUse: "HOW TO USE",
    docDo: "DO",
    docDont: "DONT",
    docNotes: "NOTES",
    docUsageHierarchy: "USAGE HIERARCHY",
    docGeneratedBy: "Generated by Shadcn Foundation Generator",
    docFooterSource: "Source",
    docFooterLang: "Language",
    docColorHierarchy: "Primitive \u2192 Brand \u2192 Theme \u2192 Semantic",
    docTypoHierarchy: "Text Styles \u2192 Component Usage",
    docLayoutHierarchy: "Spacing \u2192 Radius",
    docVisualHierarchy: "Effects \u2192 Motion",
    docSystemHierarchy: "Layers \u2192 Icons",
    // Canvas Preview Specific Labels
    docStatVars: "VARIABLES",
    docStatColls: "COLLECTIONS",
    docStatStyles: "TEXT STYLES",
    docStatScore: "FOUNDATION SCORE",
    docStatWcag: "WCAG CONTRAST",
    docEmptyTypoTitle: "No Text Styles",
    docEmptyTypoDesc: "No Text Styles found in this document. Generate Typography first.",
    docSampleText: "The quick brown fox jumps over the lazy dog",
    docSrcCustomBrand: "Custom Brand",
    docSrcShadcn: "Shadcn",
    docSrcFull: "Full Foundation",
    docLightMode: "LIGHT MODE",
    docDarkMode: "DARK MODE",
    // Category specific documentation text
    docColorWhatItIs: "Defines the color foundation used across products.",
    docColorHowToUse: "\u2022 Use Primitive tokens as raw palette sources (do not bind directly to components)\n\u2022 Use Brand tokens for brand identity\n\u2022 Use Theme tokens for UI roles (background, foreground, card, border)\n\u2022 Use Semantic tokens for contextual meaning (success, error, warning, info)",
    docColorDo: "Apply Theme/card to card surfaces. Use Theme/primary for primary actions.",
    docColorDont: "Do not hardcode hex values (#FFFFFF, #000000) when Theme or Semantic tokens exist.",
    docTypoWhatItIs: "Native Figma Text Styles representing product typography scale, organized by hierarchy.",
    docTypoHowToUse: "\u2022 Display \u2192 Hero sections and landing pages\n\u2022 Heading \u2192 Section headers and content hierarchy\n\u2022 Body \u2192 Paragraph content and reading text\n\u2022 Label / Caption \u2192 UI labels, badges, and metadata",
    docTypoDont: "Do not set font properties manually (size, weight, family) when Text Styles exist.",
    docLayoutWhatItIs: "Spacing tokens define layout grid rhythm. Radius tokens define corner rounding of surfaces and controls.",
    docLayoutHowToUse: "\u2022 Spacing/4 (16px) \u2014 base component padding\n\u2022 Spacing/6 (24px) \u2014 card and section padding\n\u2022 radius-md \u2014 inputs and buttons\n\u2022 radius-lg \u2014 cards and panels",
    docLayoutDont: "Do not use arbitrary pixel values not in the token system. Do not hardcode border-radius if Radius tokens exist.",
    docVisualWhatItIs: "Effect tokens define drop-shadow elevation levels. Motion tokens define transition timing and easing curves.",
    docVisualHowToUse: "\u2022 shadow/sm \u2014 subtle card and input elevation\n\u2022 shadow/lg \u2014 modal and drawer elevation\n\u2022 duration/fast + easing/decelerate \u2014 hover micro-interactions\n\u2022 duration/normal + easing/standard \u2014 component state transitions",
    docVisualNote: "STYLE-BOUND: Effect styles are native Figma Effect Styles. Direct variable binding for drop-shadows is not yet supported by Figma Plugin API.",
    docSystemWhatItIs: "Z-index layer tokens define stacking contexts. Icon tokens define icon dimensions and stroke weights.",
    docSystemHowToUse: "\u2022 Apply z-index tokens consistently across all components to prevent stacking conflicts\n\u2022 icon/size/md (20px) \u2014 default button and input icons\n\u2022 icon/size/lg (24px) \u2014 navigation and sidebar icons\n\u2022 icon/stroke/default (2px) \u2014 standard Lucide icon stroke weight",
    docSystemDont: "Do not create ComponentNodes for icon documentation. Do not create z-index values outside the token system."
  };

  // src/i18n/en/modals.ts
  var modals = {
    // Existing Variable Review Modal
    reviewTitle: "Review Scope & Existing Items",
    reviewNoExisting: "No color variables detected in selected scope.",
    reviewExistingWarning: "Color variables detected in selected scope.",
    reviewVarsReplace: "variables can be replaced or updated.",
    reviewAffectedScopes: "Affected scopes",
    reviewUnsafeBanner: "Generation cannot proceed safely.",
    reviewModalExisting: "\u26A0 Existing tokens detected in selected scope.",
    reviewModalNoExisting: "\u2713 No tokens detected. Ready to generate.",
    reviewTableCategory: "Category",
    reviewTableExisting: "Detected",
    reviewTableNew: "New/Upd.",
    reviewTableOutside: "Outside Scope",
    reviewTotalExistingLabel: "Total detected:",
    reviewTotalEstimatedNewLabel: "Estimated new:",
    reviewRuleNote: "Replacement Rule: Only tokens in selected scope will be updated.",
    reviewPreserveNote: "Tokens outside scope are fully preserved.",
    // Dynamic Summary Labels
    sumVarsToReplace: "Variables to Replace",
    sumNone: "None (0)",
    summaryHeader: "Generation Summary",
    summarySource: "Foundation Source",
    summaryBrand: "Brand",
    summaryBrandNone: "Not configured",
    summarySelected: "Selected Scope",
    summaryEstOutput: "Estimated Output",
    estVariables: "Variables",
    estStyles: "Text Styles",
    estFrames: "Documentation Frames",
    // Danger Zone & Reset Modal
    hdrDangerZone: "Danger Zone",
    descDangerZone: "Reset all plugin-generated foundation collections, variables, text styles, and canvas documentation.",
    btnResetFoundation: "Reset Foundation",
    lblModalResetTitle: "Reset Plugin Foundation?",
    lblModalResetBody: "This action will permanently delete all variable collections (Colors, Spacing, Radius, Effects, Motion, Layers, Icon, Typography), text styles, and documentation canvas frames created by the plugin.",
    btnModalResetConfirm: "Confirm Reset",
    btnModalResetCancel: "Cancel"
  };

  // src/i18n/en.ts
  var en = {
    ...common,
    ...dashboard,
    ...colors,
    ...typography,
    ...layout,
    ...visual,
    ...system,
    ...exportTokens,
    ...about,
    ...canvas,
    ...modals
  };

  // src/i18n/id/common.ts
  var common2 = {
    // Plugin Header
    pluginTitle: "Design System Generator",
    pluginSubtitle: "Foundation-first Design System Generator untuk Figma",
    langSelect: "Bahasa",
    // 8 Main Navigation Tabs
    navDashboard: "Dashboard",
    navColors: "Warna",
    navTypography: "Tipografi",
    navTypo: "Tipografi",
    navLayout: "Tata Letak",
    navVisual: "Visual",
    navSystem: "Sistem",
    navExport: "Ekspor & Impor",
    navAbout: "Tentang",
    navMore: "Lainnya",
    // Dropdown Headers
    dropHeaderColors: "WARNA",
    dropHeaderTypo: "TIPOGRAFI",
    dropHeaderLayout: "TATA LETAK",
    dropHeaderVisual: "VISUAL",
    dropHeaderSystem: "SISTEM",
    dropHeaderMore: "UTILITAS",
    // Dropdown sub-items common
    subOverview: "Ikhtisar",
    dropMoreExport: "Ekspor / Impor",
    dropMoreAbout: "Tentang",
    // Groups
    groupColors: "Warna",
    groupTypography: "Tipografi",
    groupLayout: "Tata Letak",
    groupVisual: "Visual",
    groupSystem: "Sistem",
    // Dashboard Section Headers & Stats
    statusHeader: "Foundation Status",
    statCollections: "Collections",
    statVariables: "Variables",
    statModes: "Modes",
    statStyles: "Text Styles",
    coverageHeader: "Foundation Coverage",
    quickActionsHeader: "Quick Actions",
    // Category Status Badges
    catStatusConfigured: "\u2713 Terkonfigurasi",
    catStatusPartial: "\u26A0 Terkonfigurasi sebagian",
    catStatusNotConfigured: "\u25CB Belum dikonfigurasi",
    catStatusConfiguredClean: "Configured",
    catStatusPartialClean: "Partial",
    catStatusNotConfiguredClean: "Not configured",
    catStatusConfiguredFull: "\u25CF Configured",
    catStatusPartialFull: "\u25D0 Partial",
    catStatusNotConfiguredFull: "\u25CB Not configured",
    // Common Action Buttons & Labels
    btnCancel: "Batal",
    btnConfirmReplace: "Replace & Generate",
    btnViewLog: "Hide Log",
    btnHideLog: "Hide Log",
    btnGenerating: "Generating\u2026",
    statusGenTitle: "Generation Status",
    statusGenSuccess: "\u2713 Foundation berhasil dibuat",
    statusGenIdle: "Siap untuk membuat foundation.",
    chipBound: "Bound",
    // CTAs
    btnGenerateFull: "\u26A1 Generate Full Foundation",
    btnGenerateBrand: "\u{1F3A8} Generate Custom Brand Colors",
    btnGenerateShadcnColors: "\u26A1 Generate Shadcn Colors",
    btnGenerateTypography: "\u26A1 Generate Typography Styles",
    btnGenerateLayout: "\u26A1 Generate Layout Foundation",
    btnGenerateVisual: "\u26A1 Generate Visual Foundation",
    btnGenerateSystem: "\u26A1 Generate System Foundation"
  };

  // src/i18n/id/dashboard.ts
  var dashboard2 = {
    dashTitle: "Design System Generator",
    dashSubtitle: "Ringkasan Sistem Desain untuk dokumen Figma ini.",
    statusConnected: "Terhubung",
    statusNoFoundation: "Belum ada fondasi terdeteksi",
    btnRefresh: "Muat Ulang",
    hdrOverview: "IKHTISAR FONDASI",
    hdrCoverage: "CAKUPAN FONDASI",
    hdrInventory: "INVENTARIS VARIABEL",
    lblSearchPlaceholder: "Cari variabel\u2026",
    hdrFoundationCollections: "KOLEKSI FONDASI",
    hdrOtherCollections: "KOLEKSI LAINNYA",
    hdrOwnership: "KEPEMILIKAN VARIABEL",
    lblPluginGenerated: "Dibuat Plugin",
    lblExternal: "Eksternal / Yang Ada",
    lblUnknown: "Tidak Diketahui",
    lblOwnershipNote: "Kepemilikan ditentukan dari metadata plugin & struktur token.",
    hdrLastGeneration: "GENERASI TERAKHIR",
    lblNoGenerationRecorded: "Belum ada riwayat generasi plugin.",
    lblRecentHeader: "Sesi Terakhir",
    lblLastGenerated: "Terakhir dibuat",
    lblSessionSource: "Kategori",
    lblSessionLang: "Bahasa",
    lblSessionVer: "Versi",
    lblLastGenMode: "Mode",
    hdrDangerZone: "Zona Bahaya",
    descDangerZone: "Reset semua koleksi variabel, gaya teks, dan dokumentasi kanvas yang dibuat plugin.",
    btnResetFoundation: "Reset Fondasi",
    // Units for dynamic counters
    lblUnitVariables: "variabel",
    lblUnitStyles: "gaya teks",
    lblUnitCollections: "koleksi",
    lblUnitItems: "item"
  };

  // src/i18n/id/colors.ts
  var colors2 = {
    dropHeaderColors: "WARNA",
    dropColorsShadcn: "Warna Shadcn",
    dropColorsBrand: "Warna Merek Kustom",
    dropColorsPrimitive: "Palet Shadcn",
    dropColorsTheme: "Warna Tema",
    dropColorsSemantic: "Warna Semantik",
    dropColorsSidebar: "Warna Sidebar",
    dropColorsChart: "Warna Grafik",
    subShadcnColors: "Warna Shadcn",
    subBrandColors: "Warna Merek Kustom",
    subPrimitive: "Primitif",
    subBrand: "Merek",
    subTheme: "Tema",
    subSemantic: "Semantik",
    subSidebar: "Sidebar",
    subChart: "Grafik",
    descColorsCard: "Warna brand, theme, dan semantic.",
    // Adobe Color Harmonies
    harmonyAnalogous: "Analogous",
    harmonyComplementary: "Complementary",
    harmonySplitComp: "Split Complementary",
    harmonyTriad: "Triad",
    harmonySquare: "Square",
    harmonyCompound: "Compound",
    harmonyShades: "Shades",
    harmonyMonochromatic: "Monochromatic",
    pageColorsTitle: "Fondasi Warna",
    pageColorsDesc: "Kelola palet Shadcn, brand colors, theme aliases, semantic colors, sidebar, dan chart.",
    srcHeader: "Color Source Intent",
    srcShadcn: "Warna Shadcn",
    srcShadcnDesc: "Hasilkan foundation warna Shadcn standar (Primitive, Theme, Semantic, Sidebar, Chart).",
    srcBrand: "Warna Merek Kustom",
    srcBrandDesc: "Hasilkan palet Brand kustom (50\u2013950) dan hubungkan ke token Theme & Semantic.",
    presetHeader: "Color Scope Preset",
    presetFull: "Full Color Foundation",
    presetBrand: "Brand Only",
    presetThemeSem: "Theme + Semantic",
    presetCustom: "Custom Selection",
    btnCfgColors: "Konfigurasi Warna \u2192",
    btnGenerateColors: "\u{1F3A8} Generate Color Foundation",
    btnGenerateBrand: "\u{1F3A8} Generate Custom Brand Colors",
    btnGenerateShadcnColors: "\u26A1 Generate Shadcn Colors",
    primaryBrand: "Primary Brand",
    secondaryBrand: "Secondary Brand",
    palettePreviewTitle: "Palette Preview",
    connectedFoundation: "Connected Foundation",
    lblPrimaryShades: "Primary (50\u2013950)",
    lblSecondaryShades: "Secondary (50\u2013950)"
  };

  // src/i18n/id/typography.ts
  var typography2 = {
    dropHeaderTypo: "TIPOGRAFI",
    dropTypoFont: "Family Font",
    dropTypoScale: "Skala Teks",
    dropTypoStyles: "Gaya Teks",
    subFont: "Font",
    subTypeScale: "Skala Teks",
    subTextStyles: "Gaya Teks",
    descTypoCard: "Native Figma text styles & font scale.",
    colTypeStyle: "Style",
    colTypeSize: "Ukuran",
    colTypeWeight: "Ketebalan",
    colTypeLineHeight: "Line Height",
    colTypeTracking: "Tracking",
    colTypePreview: "Pratinjau",
    btnCfgTypography: "Atur Tipografi \u2192",
    btnGenerateTypography: "\u26A1 Generate Typography Styles",
    pageTypographyTitle: "Fondasi Tipografi",
    pageTypographyDesc: "Kelola Native Figma Text Styles terorganisir berdasarkan hirarki tipografi.",
    lblFontPicker: "Font Family Discovery",
    lblFontSearch: "Cari font\u2026",
    lblAvailableWeights: "Available Font Weights",
    lblTypoScale: "Skala Teks & Gaya Teks"
  };

  // src/i18n/id/layout.ts
  var layout2 = {
    dropHeaderLayout: "TATA LETAK",
    dropLayoutSpacing: "Jarak",
    dropLayoutRadius: "Radius",
    subSpacing: "Jarak",
    subRadius: "Radius",
    descLayoutCard: "Spacing grid scale & corner radius tokens.",
    btnGenSpacingOnly: "Generate Spacing Only",
    btnGenRadiusOnly: "Generate Radius Only",
    btnGenLayoutBoth: "Generate Layout Foundation",
    btnCfgLayout: "Atur Tata Letak \u2192",
    btnGenerateLayout: "\u26A1 Generate Layout Foundation",
    pageLayoutTitle: "Fondasi Tata Letak",
    pageLayoutDesc: "Kelola Spacing grid scale dan corner radius tokens.",
    lblSpacingScale: "Skala Spacing (Kelipatan 4px)",
    lblRadiusScale: "Token Radius (Corner Scale)",
    lblSpacingRuler: "Pratinjau Batang Mistar"
  };

  // src/i18n/id/visual.ts
  var visual2 = {
    dropHeaderVisual: "VISUAL",
    dropVisualEffects: "Efek",
    dropVisualShadows: "Bayangan",
    dropVisualMotion: "Animasi",
    subEffects: "Efek",
    subShadows: "Bayangan",
    subMotion: "Animasi",
    descVisualCard: "Drop-shadow elevation & motion tokens.",
    btnCfgVisual: "Atur Visual \u2192",
    btnGenerateVisual: "\u26A1 Generate Visual Foundation",
    pageVisualTitle: "Fondasi Visual",
    pageVisualDesc: "Kelola Drop-Shadow elevation dan Motion transition tokens.",
    lblEffectsScale: "Effects & Drop Shadows (Elevation)",
    lblMotionScale: "Token Motion & Transisi",
    lblStyleBoundNote: "Figma Effect Binding: STYLE-BOUND (Native EffectStyle)",
    lblDurationScale: "Skala Durasi",
    lblEasingCurves: "Kurva Easing"
  };

  // src/i18n/id/system.ts
  var system2 = {
    dropHeaderSystem: "SISTEM",
    dropSystemLayers: "Layer",
    dropSystemIcons: "Ikon",
    subLayers: "Layer",
    subIcons: "Ikon",
    descSystemCard: "Z-index stacking & icon dimension tokens.",
    btnCfgSystem: "Atur Sistem \u2192",
    btnGenerateSystem: "\u26A1 Generate System Foundation",
    pageSystemTitle: "Fondasi Sistem",
    pageSystemDesc: "Kelola hirarki Layer Z-Index dan token dimensi sistem ikon.",
    lblLayersScale: "Layer & Hierarki Z-Index",
    lblIconsScale: "Token Sistem Ikon & Ketebalan Stroke",
    lblStackingTokens: "Token Urutan Tumpukan",
    lblOverlayTokens: "Z-Index Overlay Komponen",
    lblIconScale: "Skala Dimensi Ikon",
    lblStrokeWeights: "Ketebalan Stroke & Alias"
  };

  // src/i18n/id/export.ts
  var exportTokens2 = {
    dropHeaderMore: "UTILITIES",
    dropMoreExport: "Export / Import",
    exportHeader: "Export Foundation",
    exportTitle: "Export Tokens",
    exportCss: "Export CSS Variables",
    exportCssDesc: "Menghasilkan properti CSS kustom :root dan .dark.",
    exportTailwind: "Export Tailwind Config",
    exportTailwindDesc: "Menghasilkan konfigurasi tema Tailwind 3.",
    exportW3c: "Export W3C Design Tokens",
    exportW3cDesc: "Menghasilkan file JSON token W3C yang sesuai standar.",
    importHeader: "Import Tokens",
    importTitle: "Import Tokens",
    importDesc: "Tempelkan data token W3C JSON untuk mengimpor variables ke dokumen ini.",
    btnImport: "Import JSON Tokens",
    lblExportResultHeader: "Export Result",
    lblImportPlaceholder: "Tempelkan token JSON W3C atau Shadcn di sini\u2026"
  };

  // src/i18n/id/about.ts
  var about2 = {
    dropMoreAbout: "About",
    aboutTitle: "Design System Generator",
    aboutDesc: "Foundation-first Design System Generator untuk Figma. Buat komponen menggunakan token foundation terstruktur.",
    authorLabel: "Dibuat oleh",
    githubLabel: "GitHub",
    inspiredBy: "Terinspirasi oleh",
    versionLabel: "Version"
  };

  // src/i18n/id/canvas.ts
  var canvas2 = {
    // Canvas Documentation Labels
    docOverviewTitle: "Fondasi Sistem Desain Shadcn",
    docOverviewSub: "Token foundation dan primitif tema yang digunakan untuk membangun Design System.",
    docNavIndex: "FOUNDATION INDEX",
    docSectionOverview: "01 \u2014 Ikhtisar",
    docSectionColors: "02 \u2014 Warna",
    docSectionPrim: "02A \u2014 Warna Primitif",
    docSectionBrand: "02B \u2014 Warna Merek",
    docSectionTheme: "02C \u2014 Warna Tema",
    docSectionSemantic: "02D \u2014 Warna Semantik",
    docSectionSidebar: "02E \u2014 Warna Sidebar",
    docSectionChart: "02F \u2014 Warna Grafik",
    docSectionTypo: "03 \u2014 Tipografi",
    docSectionLayout: "04 \u2014 Tata Letak",
    docSectionVisual: "05 \u2014 Visual",
    docSectionSystem: "06 \u2014 Sistem",
    docPrimTitle: "Primitive Colors Palette",
    docPrimSub: "Palet Primitive Tailwind (100% Variable Bound)",
    docBrandTitle: "Brand Color System",
    docBrandSub: "Palet Brand Kustom (Accent 600 Light / 400 Dark)",
    docThemeTitle: "Theme Tokens",
    docThemeSub: "Perbandingan Berdampingan Mode Light & Dark",
    docWcagTitle: "Diagnostik Kontras WCAG 2.1 AA",
    docWcagSub: "Mengevaluasi Theme/primary & Theme/secondary vs Theme/background",
    docTypoTitle: "Typography Scale",
    docTypoSub: "Native Figma Text Styles Terorganisir Berdasarkan Hirarki",
    docSpacingTitle: "Spacing Scale",
    docSpacingSub: "Skala Spasi Grid Inkremental (Kelipatan 4px)",
    docRadiusTitle: "Radius Scale",
    docRadiusSub: "Corner Radius Tokens (0px hingga 9999px Full)",
    docEffectsTitle: "Effects & Elevation",
    docEffectsSub: "Drop-Shadow & Elevation Tokens",
    docMotionTitle: "Motion & Animation Tokens",
    docMotionSub: "Transition Duration & Easing Tokens",
    docLayersTitle: "Layers & Stacking Order",
    docLayersSub: "Z-Index Hierarchy Tokens",
    docIconsTitle: "Icon System Tokens",
    docIconsSub: "Icon Dimension & Stroke Weight Tokens",
    // Phase 19 — Label Blok Dokumentasi Canvas
    docWhatItIs: "WHAT IT IS",
    docHowToUse: "HOW TO USE",
    docDo: "DO",
    docDont: "DONT",
    docNotes: "NOTES",
    docUsageHierarchy: "USAGE HIERARCHY",
    docGeneratedBy: "Generated by Shadcn Foundation Generator",
    docFooterSource: "Source",
    docFooterLang: "Language",
    docColorHierarchy: "Primitive \u2192 Brand \u2192 Theme \u2192 Semantic",
    docTypoHierarchy: "Text Styles \u2192 Component Usage",
    docLayoutHierarchy: "Spacing \u2192 Radius",
    docVisualHierarchy: "Effects \u2192 Motion",
    docSystemHierarchy: "Layers \u2192 Icons",
    // Canvas Preview Specific Labels
    docStatVars: "VARIABLES",
    docStatColls: "COLLECTIONS",
    docStatStyles: "TEXT STYLES",
    docStatScore: "FOUNDATION SCORE",
    docStatWcag: "WCAG CONTRAST",
    docEmptyTypoTitle: "No Text Styles",
    docEmptyTypoDesc: "Tidak ada Text Styles ditemukan pada dokumen ini. Generate Typography terlebih dahulu.",
    docSampleText: "The quick brown fox jumps over the lazy dog",
    docSrcCustomBrand: "Custom Brand",
    docSrcShadcn: "Shadcn",
    docSrcFull: "Full Foundation",
    docLightMode: "LIGHT MODE",
    docDarkMode: "DARK MODE",
    // Dokumentasi kategori Warna
    docColorWhatItIs: "Mendefinisikan foundation warna yang digunakan di seluruh produk.",
    docColorHowToUse: "\u2022 Gunakan token Primitive sebagai sumber palet mentah (jangan langsung di komponen)\n\u2022 Gunakan token Brand untuk identitas warna brand\n\u2022 Gunakan token Theme untuk peran UI (background, foreground, card, border)\n\u2022 Gunakan token Semantic untuk makna kontekstual (success, error, warning, info)",
    docColorDo: "Terapkan Theme/card ke permukaan kartu. Gunakan Theme/primary untuk aksi utama.",
    docColorDont: "Jangan hardcode nilai hex (#FFFFFF, #000000) ketika token Theme atau Semantic tersedia.",
    // Dokumentasi kategori Tipografi
    docTypoWhatItIs: "Native Figma Text Styles yang merepresentasikan skala tipografi produk, terorganisir berdasarkan hirarki.",
    docTypoHowToUse: "\u2022 Display \u2192 Bagian hero dan landing page\n\u2022 Heading \u2192 Judul bagian dan hirarki konten\n\u2022 Body \u2192 Konten paragraf dan bacaan\n\u2022 Label / Caption \u2192 Label UI, badges, dan metadata",
    docTypoDont: "Jangan atur properti font secara manual (size, weight, family) ketika Text Styles sudah tersedia.",
    // Dokumentasi kategori Tata Letak
    docLayoutWhatItIs: "Spacing tokens mendefinisikan ritme grid layout. Radius tokens mendefinisikan pembulatan sudut permukaan dan kontrol.",
    docLayoutHowToUse: "\u2022 Spacing/4 (16px) \u2014 padding dasar komponen\n\u2022 Spacing/6 (24px) \u2014 padding kartu dan bagian\n\u2022 radius-md \u2014 inputs dan buttons\n\u2022 radius-lg \u2014 cards dan panels",
    docLayoutDont: "Jangan gunakan nilai piksel arbitrer yang tidak ada dalam token system. Jangan hardcode border-radius jika Radius tokens tersedia.",
    // Dokumentasi kategori Visual
    docVisualWhatItIs: "Effect tokens mendefinisikan level elevasi drop-shadow. Motion tokens mendefinisikan timing dan easing curves transisi.",
    docVisualHowToUse: "\u2022 shadow/sm \u2014 elevasi halus cards dan inputs\n\u2022 shadow/lg \u2014 elevasi modals dan drawers\n\u2022 duration/fast + easing/decelerate \u2014 micro-interaksi hover\n\u2022 duration/normal + easing/standard \u2014 transisi status komponen",
    docVisualNote: "STYLE-BOUND: Effect styles adalah Native Figma Effect Styles. Binding variabel langsung untuk drop-shadow belum didukung oleh Figma Plugin API.",
    // Dokumentasi kategori Sistem
    docSystemWhatItIs: "Z-index layer tokens mendefinisikan stacking context. Icon tokens mendefinisikan dimensi ikon dan stroke weights.",
    docSystemHowToUse: "\u2022 Terapkan z-index tokens secara konsisten di semua komponen untuk mencegah konflik stacking\n\u2022 icon/size/md (20px) \u2014 ikon button dan input default\n\u2022 icon/size/lg (24px) \u2014 ikon navigasi dan sidebar\n\u2022 icon/stroke/default (2px) \u2014 stroke weight ikon Lucide standar",
    docSystemDont: "Jangan buat ComponentNode untuk dokumentasi ikon. Jangan membuat nilai z-index di luar token system."
  };

  // src/i18n/id/modals.ts
  var modals2 = {
    // Phase 13 Existing Variable Review Modal / Confirmation
    reviewTitle: "Review Scope & Existing Items",
    reviewNoExisting: "Tidak ada variable warna terdeteksi pada scope terpilih.",
    reviewExistingWarning: "Variable warna terdeteksi pada scope terpilih.",
    reviewVarsReplace: "variables dapat diganti atau diperbarui.",
    reviewAffectedScopes: "Cakupan terdampak",
    reviewUnsafeBanner: "Generasi tidak dapat dilanjutkan dengan aman.",
    reviewModalExisting: "\u26A0 Existing tokens terdeteksi pada scope terpilih.",
    reviewModalNoExisting: "\u2713 Tidak ada tokens terdeteksi. Ready to generate.",
    reviewTableCategory: "Category",
    reviewTableExisting: "Detected",
    reviewTableNew: "New/Upd.",
    reviewTableOutside: "Outside Scope",
    reviewTotalExistingLabel: "Total detected:",
    reviewTotalEstimatedNewLabel: "Estimated new:",
    reviewRuleNote: "Replacement Rule: Hanya token dalam scope terpilih yang akan diperbarui.",
    reviewPreserveNote: "Token di luar scope sepenuhnya dipertahankan.",
    // Dynamic Summary Labels
    sumVarsToReplace: "Variables yang Diganti",
    sumNone: "Tidak Ada (0)",
    summaryHeader: "Generation Summary",
    summarySource: "Foundation Source",
    summaryBrand: "Brand",
    summaryBrandNone: "Belum dikonfigurasi",
    summarySelected: "Selected Scope",
    summaryEstOutput: "Estimated Output",
    estVariables: "Variables",
    estStyles: "Text Styles",
    estFrames: "Documentation Frames",
    // Phase 21 Danger Zone & Safe Reset
    hdrDangerZone: "Zona Bahaya",
    descDangerZone: "Reset semua koleksi variabel, gaya teks, dan dokumentasi kanvas yang dibuat plugin.",
    btnResetFoundation: "Reset Fondasi",
    lblModalResetTitle: "Reset Fondasi Plugin?",
    lblModalResetBody: "Tindakan ini akan menghapus secara permanen semua koleksi variabel (Warna, Spacing, Radius, Efek, Motion, Layer, Ikon, Tipografi), gaya teks, dan bingkai kanvas dokumentasi yang dibuat oleh plugin.",
    btnModalResetConfirm: "Konfirmasi Reset",
    btnModalResetCancel: "Batal"
  };

  // src/i18n/id.ts
  var id = {
    ...common2,
    ...dashboard2,
    ...colors2,
    ...typography2,
    ...layout2,
    ...visual2,
    ...system2,
    ...exportTokens2,
    ...about2,
    ...canvas2,
    ...modals2
  };

  // src/i18n/index.ts
  var translations = {
    en,
    id
  };
  function t(lang, key) {
    const dictionary = translations[lang] || translations.en;
    return dictionary[key] || translations.en[key] || key;
  }

  // src/services/audit.service.ts
  var AuditService = class {
    /**
     * Performs live inspection of local variable collections in Figma memory.
     */
    static async auditFoundation() {
      LoggerService.step("Running Live Foundation Integrity Audit");
      const checks = [];
      let brokenAliasesCount = 0;
      let namingViolationsCount = 0;
      let duplicateVariablesCount = 0;
      const modesDiscovered = /* @__PURE__ */ new Set();
      let collections = [];
      try {
        if (typeof figma !== "undefined" && figma.variables && typeof figma.variables.getLocalVariableCollectionsAsync === "function") {
          collections = await figma.variables.getLocalVariableCollectionsAsync();
        }
      } catch (_e) {
        collections = [];
      }
      const collectionNames = collections.map((c) => c.name);
      const requiredCollections = [
        COLLECTIONS.COLORS,
        COLLECTIONS.RADIUS,
        COLLECTIONS.TYPOGRAPHY,
        COLLECTIONS.SPACING,
        COLLECTIONS.SEMANTIC
      ];
      for (const reqColl of requiredCollections) {
        const exists = collectionNames.includes(reqColl);
        checks.push({
          checkName: `Collection "${reqColl}" Exists`,
          passed: exists,
          message: exists ? `Collection "${reqColl}" found in document.` : `Collection "${reqColl}" is missing from document.`
        });
      }
      let variables = [];
      try {
        if (typeof figma !== "undefined" && figma.variables && typeof figma.variables.getLocalVariablesAsync === "function") {
          variables = await figma.variables.getLocalVariablesAsync();
        }
      } catch (_e) {
        variables = [];
      }
      collections.forEach((c) => {
        c.modes.forEach((m) => modesDiscovered.add(m.name));
      });
      const hasLightMode = modesDiscovered.has(MODES.LIGHT);
      const hasDarkMode = modesDiscovered.has(MODES.DARK);
      checks.push({
        checkName: "Required Light/Dark Modes Exist",
        passed: hasLightMode && hasDarkMode,
        message: `Modes discovered: [${Array.from(modesDiscovered).join(", ")}].`
      });
      const variableNameSet = /* @__PURE__ */ new Set();
      const varMapById = /* @__PURE__ */ new Map();
      const varMapByName = /* @__PURE__ */ new Map();
      variables.forEach((v) => {
        varMapById.set(v.id, v);
        varMapByName.set(v.name, v);
      });
      for (const v of variables) {
        if (variableNameSet.has(v.name)) {
          duplicateVariablesCount++;
        } else {
          variableNameSet.add(v.name);
        }
        const isFormatValid = /^[a-zA-Z0-9_\-/]+$/.test(v.name);
        if (!isFormatValid) {
          namingViolationsCount++;
        }
        for (const modeId of Object.keys(v.valuesByMode)) {
          const val = v.valuesByMode[modeId];
          if (typeof val === "object" && val !== null && "type" in val && val.type === "VARIABLE_ALIAS") {
            const targetId = val.id;
            if (!varMapById.has(targetId)) {
              brokenAliasesCount++;
            }
          }
        }
      }
      checks.push({
        checkName: "Zero Duplicate Variable Names",
        passed: duplicateVariablesCount === 0,
        message: `${duplicateVariablesCount} duplicate variable names detected.`
      });
      checks.push({
        checkName: "Zero Broken Variable Aliases",
        passed: brokenAliasesCount === 0,
        message: `${brokenAliasesCount} broken variable aliases detected.`
      });
      checks.push({
        checkName: "Variable Path Naming Syntax",
        passed: namingViolationsCount === 0,
        message: `${namingViolationsCount} naming convention violations detected.`
      });
      const colorsColl = collections.find((c) => c.name === COLLECTIONS.COLORS);
      const lightModeId = colorsColl?.modes.find((m) => m.name === MODES.LIGHT)?.modeId;
      const darkModeId = colorsColl?.modes.find((m) => m.name === MODES.DARK)?.modeId;
      const resolveRGBForMode = (varName, modeId, visited = /* @__PURE__ */ new Set()) => {
        if (!varName || !modeId || visited.has(varName)) return void 0;
        visited.add(varName);
        const variable = varMapByName.get(varName);
        if (!variable) return void 0;
        const val = variable.valuesByMode[modeId];
        if (typeof val === "object" && val !== null) {
          if ("type" in val && val.type === "VARIABLE_ALIAS") {
            const aliasTargetId = val.id;
            const targetVar = varMapById.get(aliasTargetId);
            if (targetVar) {
              return resolveRGBForMode(targetVar.name, modeId, visited);
            }
          } else if ("r" in val && "g" in val && "b" in val) {
            return val;
          }
        }
        return void 0;
      };
      const contrastTargets = [
        { tokenName: "Theme/primary", modeName: MODES.LIGHT, modeId: lightModeId },
        { tokenName: "Theme/primary", modeName: MODES.DARK, modeId: darkModeId },
        { tokenName: "Theme/secondary", modeName: MODES.LIGHT, modeId: lightModeId },
        { tokenName: "Theme/secondary", modeName: MODES.DARK, modeId: darkModeId }
      ];
      for (const target of contrastTargets) {
        if (!target.modeId) continue;
        const fgRgb = resolveRGBForMode(target.tokenName, target.modeId);
        const bgRgb = resolveRGBForMode("Theme/background", target.modeId);
        if (fgRgb && bgRgb) {
          const ratio = contrastRatio(fgRgb, bgRgb);
          const passed = ratio >= 4.5;
          checks.push({
            checkName: `WCAG Contrast: ${target.tokenName} (${target.modeName})`,
            passed,
            message: `Contrast Ratio: ${ratio.toFixed(2)}:1 (Threshold: 4.5:1). Status: ${passed ? "PASS" : "WARNING"}`
          });
        } else {
          checks.push({
            checkName: `WCAG Contrast: ${target.tokenName} (${target.modeName})`,
            passed: true,
            message: `Unable to resolve color value for ${target.tokenName} (${target.modeName}). Skipped.`
          });
        }
      }
      const passedCount = checks.filter((c) => c.passed).length;
      const foundationScore = Math.round(passedCount / checks.length * 100);
      let status = "PASSED";
      if (foundationScore < 60) status = "FAILED";
      else if (foundationScore < 100) status = "NEEDS_IMPROVEMENT";
      const result = {
        collectionsCount: collections.length,
        variablesCount: variables.length,
        modesFound: Array.from(modesDiscovered),
        brokenAliasesCount,
        namingViolationsCount,
        duplicateVariablesCount,
        foundationScore,
        status,
        checks
      };
      LoggerService.info(
        `Foundation Audit Complete. Score: ${foundationScore}/100, Status: ${status}, Variables Inspected: ${variables.length}.`
      );
      return result;
    }
  };

  // src/types/options.ts
  var SHADCN_COLORS_SCOPE = {
    colors: {
      primitive: true,
      brand: false,
      theme: true,
      semantic: true,
      sidebar: true,
      chart: true
    },
    typography: false,
    spacing: false,
    radius: false,
    effects: false,
    motion: false,
    layers: false,
    icons: false
  };
  var BRAND_COLORS_SCOPE = {
    colors: {
      primitive: false,
      brand: true,
      theme: true,
      semantic: true,
      sidebar: false,
      chart: false
    },
    typography: false,
    spacing: false,
    radius: false,
    effects: false,
    motion: false,
    layers: false,
    icons: false
  };
  var DEFAULT_SCOPE = {
    colors: {
      primitive: true,
      brand: true,
      theme: true,
      semantic: true,
      sidebar: true,
      chart: true
    },
    typography: true,
    spacing: true,
    radius: true,
    effects: true,
    motion: true,
    layers: true,
    icons: true
  };
  function resolveScopeForMode(mode, userScope) {
    switch (mode) {
      case "shadcn-colors":
      case "shadcn":
        return SHADCN_COLORS_SCOPE;
      case "brand-colors":
      case "brand":
      case "custom":
        return BRAND_COLORS_SCOPE;
      case "full-foundation":
      case "selective":
        return userScope || DEFAULT_SCOPE;
      default:
        return userScope || DEFAULT_SCOPE;
    }
  }

  // src/generators/foundation-preview.ts
  var CATEGORY_WIDTH = 1344;
  var OVERVIEW_WIDTH = 800;
  var ROOT_ITEM_SPACING = 80;
  var DEFAULT_X_OFFSETS = {
    overview: 0,
    colors: 880,
    typography: 2304,
    layout: 3728,
    visual: 5152,
    system: 6576
  };
  function resolveVariableRGB(variable, modeId, varMapById, visited = /* @__PURE__ */ new Set()) {
    if (!variable || visited.has(variable.id)) return {};
    visited.add(variable.id);
    let val = variable.valuesByMode ? variable.valuesByMode[modeId] : void 0;
    if (!val && variable.valuesByMode) {
      const firstModeId = Object.keys(variable.valuesByMode)[0];
      if (firstModeId) {
        val = variable.valuesByMode[firstModeId];
      }
    }
    if (typeof val === "object" && val !== null) {
      if ("type" in val && val.type === "VARIABLE_ALIAS") {
        const aliasTargetId = val.id;
        const targetVar = varMapById.get(aliasTargetId);
        if (targetVar) {
          return resolveVariableRGB(targetVar, modeId, varMapById, visited);
        }
      } else if ("r" in val && "g" in val && "b" in val) {
        const rgb = val;
        return { rgb, hex: rgbToHex(rgb) };
      }
    }
    return {};
  }
  async function generateFoundationPreview(variableMap, optionsOrBrandConfig) {
    let options;
    if (optionsOrBrandConfig && "scope" in optionsOrBrandConfig) {
      options = optionsOrBrandConfig;
    } else {
      options = {
        mode: "shadcn",
        brandConfig: optionsOrBrandConfig,
        scope: DEFAULT_SCOPE,
        language: "en"
      };
    }
    const lang = options.language || "en";
    const scope = options.scope || DEFAULT_SCOPE;
    const brandConfig = options.brandConfig || DEFAULT_BRAND_CONFIG;
    const result = {
      generatorName: "Foundation Canvas Preview",
      stats: { created: 0, updated: 0, skipped: 0 }
    };
    LoggerService.step(`Executing Phase 19.1 Per-Frame Canvas Lifecycle (${lang.toUpperCase()})`);
    const page = await BaseComponentFactory.getOrCreatePage("Design System Foundation");
    const auditResult = await AuditService.auditFoundation();
    const allVars = Array.from(variableMap.values());
    const varMapById = /* @__PURE__ */ new Map();
    const varMapByName = /* @__PURE__ */ new Map();
    allVars.forEach((v) => {
      varMapById.set(v.id, v);
      varMapByName.set(v.name, v);
    });
    const themeCardVar = varMapByName.get("Theme/card") || varMapByName.get("Theme/background");
    const themeBorderVar = varMapByName.get("Theme/border");
    const themeFgVar = varMapByName.get("Theme/foreground");
    const themeMutedFgVar = varMapByName.get("Theme/muted-foreground");
    const themePrimaryVar = varMapByName.get("Theme/primary");
    const radiusLgVar = varMapByName.get("radius-lg") || varMapByName.get("Radius/lg") || varMapByName.get("radius/lg");
    const radiusMdVar = varMapByName.get("radius-md") || varMapByName.get("Radius/md") || varMapByName.get("radius/md");
    const radiusSmVar = varMapByName.get("radius-sm") || varMapByName.get("Radius/sm") || varMapByName.get("radius/sm");
    try {
      if (typeof figma.loadFontAsync === "function") {
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        await figma.loadFontAsync({ family: "Inter", style: "Bold" });
        await figma.loadFontAsync({ family: "Inter", style: "Medium" });
        await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
      }
    } catch (_e) {
    }
    let collections = [];
    try {
      if (typeof figma.variables?.getLocalVariableCollectionsAsync === "function") {
        collections = await figma.variables.getLocalVariableCollectionsAsync();
      }
    } catch (_e) {
    }
    const colorsColl = collections.find((c) => c.name === "Colors");
    const lightModeId = colorsColl?.modes.find((m) => m.name === "Light")?.modeId || "1:0";
    const darkModeId = colorsColl?.modes.find((m) => m.name === "Dark")?.modeId || "1:1";
    let localTextStyles = [];
    try {
      if (typeof figma.getLocalTextStylesAsync === "function") {
        localTextStyles = await figma.getLocalTextStylesAsync();
      }
    } catch (_e) {
    }
    const getOrCreateCategoryFrame = (categoryId, displayName, width = CATEGORY_WIDTH) => {
      let frame = BaseComponentFactory.findFoundationCategoryFrame(page, categoryId);
      let isNew = false;
      if (frame) {
        frame.name = displayName;
        [...frame.children].forEach((c) => c.remove());
        result.stats.updated++;
      } else {
        isNew = true;
        frame = figma.createFrame();
        frame.name = displayName;
        let calculatedX = DEFAULT_X_OFFSETS[categoryId] ?? 0;
        const existingManaged = page.children.filter((c) => {
          if (c.type !== "FRAME") return false;
          const f = c;
          return typeof f.getPluginData === "function" && f.getPluginData("foundation-category") === "true";
        });
        if (existingManaged.length > 0) {
          const maxX = Math.max(...existingManaged.map((f) => f.x + (f.width || CATEGORY_WIDTH)));
          calculatedX = Math.max(calculatedX, maxX + ROOT_ITEM_SPACING);
        }
        frame.x = calculatedX;
        frame.y = 0;
        frame.layoutMode = "VERTICAL";
        frame.primaryAxisSizingMode = "AUTO";
        frame.counterAxisSizingMode = "FIXED";
        frame.resize(width, 100);
        frame.paddingTop = 32;
        frame.paddingBottom = 32;
        frame.paddingLeft = 36;
        frame.paddingRight = 36;
        frame.itemSpacing = 24;
        frame.cornerRadius = 16;
        if (radiusLgVar) BaseComponentFactory.bindVariable(frame, "cornerRadius", radiusLgVar);
        frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
        if (themeCardVar) BaseComponentFactory.bindVariable(frame, "fills", themeCardVar);
        frame.strokes = [{ type: "SOLID", color: { r: 0.88, g: 0.88, b: 0.9 } }];
        if (themeBorderVar) BaseComponentFactory.bindVariable(frame, "strokes", themeBorderVar);
        frame.strokeWeight = 1;
        page.appendChild(frame);
        result.stats.created++;
      }
      BaseComponentFactory.tagCategoryFrame(frame, categoryId, lang);
      return { frame, isNew };
    };
    const createSectionHeader = (number, title, desc) => {
      const card = BaseComponentFactory.createStructuralFrame("Section Header", "VERTICAL", {}, 6);
      card.paddingTop = card.paddingBottom = card.paddingLeft = card.paddingRight = 0;
      const numTxt = figma.createText();
      numTxt.characters = number;
      numTxt.fontSize = 11;
      numTxt.textAutoResize = "WIDTH_AND_HEIGHT";
      try {
        numTxt.fontName = { family: "Inter", style: "Bold" };
      } catch (_e) {
      }
      numTxt.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.55 } }];
      if (themeMutedFgVar) BaseComponentFactory.bindVariable(numTxt, "fills", themeMutedFgVar);
      card.appendChild(numTxt);
      const titleTxt = figma.createText();
      titleTxt.characters = title;
      titleTxt.fontSize = 22;
      titleTxt.textAutoResize = "WIDTH_AND_HEIGHT";
      try {
        titleTxt.fontName = { family: "Inter", style: "Bold" };
      } catch (_e) {
      }
      titleTxt.fills = [{ type: "SOLID", color: { r: 0.05, g: 0.05, b: 0.08 } }];
      if (themeFgVar) BaseComponentFactory.bindVariable(titleTxt, "fills", themeFgVar);
      card.appendChild(titleTxt);
      const descTxt = figma.createText();
      descTxt.characters = desc;
      descTxt.fontSize = 12;
      descTxt.textAutoResize = "WIDTH_AND_HEIGHT";
      descTxt.fills = [{ type: "SOLID", color: { r: 0.45, g: 0.45, b: 0.5 } }];
      if (themeMutedFgVar) BaseComponentFactory.bindVariable(descTxt, "fills", themeMutedFgVar);
      card.appendChild(descTxt);
      return card;
    };
    const createDivider = (width = CATEGORY_WIDTH - 72) => {
      const div = figma.createRectangle();
      div.name = "Divider";
      div.resize(width, 1);
      div.fills = [{ type: "SOLID", color: { r: 0.88, g: 0.88, b: 0.9 } }];
      if (themeBorderVar) BaseComponentFactory.bindVariable(div, "fills", themeBorderVar);
      return div;
    };
    const createSubCard = (cardName, width = CATEGORY_WIDTH - 72) => {
      const card = figma.createFrame();
      card.name = cardName;
      card.layoutMode = "VERTICAL";
      card.primaryAxisSizingMode = "AUTO";
      card.counterAxisSizingMode = "FIXED";
      card.resize(width, 100);
      card.paddingTop = 18;
      card.paddingBottom = 18;
      card.paddingLeft = 20;
      card.paddingRight = 20;
      card.itemSpacing = 12;
      card.cornerRadius = 10;
      if (radiusMdVar) BaseComponentFactory.bindVariable(card, "cornerRadius", radiusMdVar);
      card.fills = [{ type: "SOLID", color: { r: 0.98, g: 0.98, b: 0.99 } }];
      if (themeCardVar) BaseComponentFactory.bindVariable(card, "fills", themeCardVar);
      card.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.92 } }];
      if (themeBorderVar) BaseComponentFactory.bindVariable(card, "strokes", themeBorderVar);
      card.strokeWeight = 1;
      return card;
    };
    const createCategoryFooter = (source) => {
      const footer = BaseComponentFactory.createStructuralFrame("Category Footer", "HORIZONTAL", {}, 16);
      const gen = figma.createText();
      gen.characters = `${t(lang, "docGeneratedBy")} \u2022 ${t(lang, "docFooterSource")}: ${source} \u2022 ${t(lang, "docFooterLang")}: ${lang.toUpperCase()}`;
      gen.fontSize = 9;
      gen.textAutoResize = "WIDTH_AND_HEIGHT";
      gen.fills = [{ type: "SOLID", color: { r: 0.6, g: 0.6, b: 0.65 } }];
      if (themeMutedFgVar) BaseComponentFactory.bindVariable(gen, "fills", themeMutedFgVar);
      footer.appendChild(gen);
      return footer;
    };
    const mkDocBlock = (opts) => BaseComponentFactory.createDocBlock({
      ...opts,
      labelWhatItIs: t(lang, "docWhatItIs"),
      labelHowToUse: t(lang, "docHowToUse"),
      labelDo: t(lang, "docDo"),
      labelDont: t(lang, "docDont"),
      labelNotes: t(lang, "docNotes"),
      fgVar: themeFgVar,
      mutedVar: themeMutedFgVar
    });
    {
      const { frame: overviewFrame } = getOrCreateCategoryFrame("overview", t(lang, "docSectionOverview"), OVERVIEW_WIDTH);
      const titleTxt = figma.createText();
      titleTxt.characters = t(lang, "docOverviewTitle");
      titleTxt.fontSize = 28;
      titleTxt.textAutoResize = "WIDTH_AND_HEIGHT";
      try {
        titleTxt.fontName = { family: "Inter", style: "Bold" };
      } catch (_e) {
      }
      titleTxt.fills = [{ type: "SOLID", color: { r: 0.05, g: 0.05, b: 0.08 } }];
      if (themeFgVar) BaseComponentFactory.bindVariable(titleTxt, "fills", themeFgVar);
      overviewFrame.appendChild(titleTxt);
      const subTxt = figma.createText();
      subTxt.characters = t(lang, "docOverviewSub");
      subTxt.fontSize = 12;
      subTxt.textAutoResize = "WIDTH_AND_HEIGHT";
      subTxt.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.55 } }];
      if (themeMutedFgVar) BaseComponentFactory.bindVariable(subTxt, "fills", themeMutedFgVar);
      overviewFrame.appendChild(subTxt);
      overviewFrame.appendChild(createDivider(OVERVIEW_WIDTH - 72));
      const activeBrand = { ...DEFAULT_BRAND_CONFIG, ...brandConfig };
      const contrastChecks = auditResult.checks.filter((c) => c.checkName.includes("WCAG Contrast"));
      const contrastPass = contrastChecks.filter((c) => c.passed).length;
      const statsGrid = BaseComponentFactory.createStructuralFrame("Stats Grid", "HORIZONTAL", {}, 10);
      const statItems = [
        { label: t(lang, "docStatVars"), value: `${auditResult.variablesCount}` },
        { label: t(lang, "docStatColls"), value: `${auditResult.collectionsCount}` },
        { label: t(lang, "docStatStyles"), value: `${localTextStyles.length}` },
        { label: t(lang, "docStatScore"), value: `${auditResult.foundationScore}/100` },
        { label: t(lang, "docStatWcag"), value: `${contrastPass}/${contrastChecks.length} AA` }
      ];
      statItems.forEach((s) => {
        const card = figma.createFrame();
        card.name = `Stat \u2014 ${s.label}`;
        card.layoutMode = "VERTICAL";
        card.primaryAxisSizingMode = "AUTO";
        card.counterAxisSizingMode = "FIXED";
        card.resize(130, 58);
        card.paddingTop = card.paddingBottom = 8;
        card.paddingLeft = card.paddingRight = 12;
        card.itemSpacing = 2;
        card.cornerRadius = 8;
        if (radiusMdVar) BaseComponentFactory.bindVariable(card, "cornerRadius", radiusMdVar);
        card.fills = [{ type: "SOLID", color: { r: 0.97, g: 0.97, b: 0.98 } }];
        if (themeCardVar) BaseComponentFactory.bindVariable(card, "fills", themeCardVar);
        card.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.92 } }];
        if (themeBorderVar) BaseComponentFactory.bindVariable(card, "strokes", themeBorderVar);
        card.strokeWeight = 1;
        const lbl = figma.createText();
        lbl.characters = s.label;
        lbl.fontSize = 8;
        lbl.textAutoResize = "WIDTH_AND_HEIGHT";
        try {
          lbl.fontName = { family: "Inter", style: "Bold" };
        } catch (_e) {
        }
        lbl.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.55 } }];
        if (themeMutedFgVar) BaseComponentFactory.bindVariable(lbl, "fills", themeMutedFgVar);
        card.appendChild(lbl);
        const val = figma.createText();
        val.characters = s.value;
        val.fontSize = 16;
        val.textAutoResize = "WIDTH_AND_HEIGHT";
        try {
          val.fontName = { family: "Inter", style: "Bold" };
        } catch (_e) {
        }
        val.fills = [{ type: "SOLID", color: { r: 0.05, g: 0.05, b: 0.08 } }];
        if (themeFgVar) BaseComponentFactory.bindVariable(val, "fills", themeFgVar);
        card.appendChild(val);
        statsGrid.appendChild(card);
      });
      overviewFrame.appendChild(statsGrid);
      overviewFrame.appendChild(createDivider(OVERVIEW_WIDTH - 72));
      const hierarchyCard = createSubCard("Usage Hierarchy", OVERVIEW_WIDTH - 72);
      hierarchyCard.appendChild(BaseComponentFactory.createSectionLabel(t(lang, "docUsageHierarchy"), themeFgVar));
      const hierItems = [
        { cat: t(lang, "groupColors"), hier: t(lang, "docColorHierarchy") },
        { cat: t(lang, "groupTypography"), hier: t(lang, "docTypoHierarchy") },
        { cat: t(lang, "groupLayout"), hier: t(lang, "docLayoutHierarchy") },
        { cat: t(lang, "groupVisual"), hier: t(lang, "docVisualHierarchy") },
        { cat: t(lang, "groupSystem"), hier: t(lang, "docSystemHierarchy") }
      ];
      hierItems.forEach((h) => {
        const row = BaseComponentFactory.createStructuralFrame(`Hier \u2014 ${h.cat}`, "HORIZONTAL", {}, 12);
        const catTxt = figma.createText();
        catTxt.characters = h.cat;
        catTxt.fontSize = 11;
        catTxt.textAutoResize = "WIDTH_AND_HEIGHT";
        try {
          catTxt.fontName = { family: "Inter", style: "Bold" };
        } catch (_e) {
        }
        catTxt.fills = [{ type: "SOLID", color: { r: 0.05, g: 0.05, b: 0.08 } }];
        if (themeFgVar) BaseComponentFactory.bindVariable(catTxt, "fills", themeFgVar);
        row.appendChild(catTxt);
        const hierTxt = figma.createText();
        hierTxt.characters = h.hier;
        hierTxt.fontSize = 11;
        hierTxt.textAutoResize = "WIDTH_AND_HEIGHT";
        hierTxt.fills = [{ type: "SOLID", color: { r: 0.45, g: 0.45, b: 0.5 } }];
        if (themeMutedFgVar) BaseComponentFactory.bindVariable(hierTxt, "fills", themeMutedFgVar);
        row.appendChild(hierTxt);
        hierarchyCard.appendChild(row);
      });
      overviewFrame.appendChild(hierarchyCard);
      const indexCard = createSubCard("Foundation Index", OVERVIEW_WIDTH - 72);
      indexCard.appendChild(BaseComponentFactory.createSectionLabel(t(lang, "docNavIndex"), themeFgVar));
      const activeSections = [];
      if (scope.colors.primitive || scope.colors.brand || scope.colors.theme || scope.colors.semantic || scope.colors.sidebar || scope.colors.chart) {
        activeSections.push(t(lang, "docSectionColors"));
      }
      if (scope.typography) activeSections.push(t(lang, "docSectionTypo"));
      if (scope.spacing || scope.radius) activeSections.push(t(lang, "docSectionLayout"));
      if (scope.effects || scope.motion) activeSections.push(t(lang, "docSectionVisual"));
      if (scope.layers || scope.icons) activeSections.push(t(lang, "docSectionSystem"));
      const idxTxt = figma.createText();
      idxTxt.characters = activeSections.length > 0 ? activeSections.join("  \u2022  ") : lang === "id" ? "Tidak ada kategori yang dipilih untuk generasi." : "No categories selected for generation.";
      idxTxt.fontSize = 10;
      idxTxt.textAutoResize = "WIDTH_AND_HEIGHT";
      idxTxt.fills = [{ type: "SOLID", color: { r: 0.45, g: 0.45, b: 0.5 } }];
      if (themeMutedFgVar) BaseComponentFactory.bindVariable(idxTxt, "fills", themeMutedFgVar);
      indexCard.appendChild(idxTxt);
      overviewFrame.appendChild(indexCard);
      const metaTxt = figma.createText();
      const metaSource = options.mode === "brand-colors" ? t(lang, "docSrcCustomBrand") : options.mode === "shadcn-colors" ? t(lang, "docSrcShadcn") : t(lang, "docSrcFull");
      metaTxt.characters = [
        `${t(lang, "docFooterSource")}: ${metaSource}`,
        `${t(lang, "docFooterLang")}: ${lang.toUpperCase()}`,
        options.mode === "brand-colors" ? `Brand: ${activeBrand.primary} / ${activeBrand.secondary}` : ""
      ].filter(Boolean).join("  \u2022  ");
      metaTxt.fontSize = 9;
      metaTxt.textAutoResize = "WIDTH_AND_HEIGHT";
      metaTxt.fills = [{ type: "SOLID", color: { r: 0.6, g: 0.6, b: 0.65 } }];
      if (themeMutedFgVar) BaseComponentFactory.bindVariable(metaTxt, "fills", themeMutedFgVar);
      overviewFrame.appendChild(metaTxt);
    }
    const colorActive = scope.colors.primitive || scope.colors.brand || scope.colors.theme || scope.colors.semantic || scope.colors.sidebar || scope.colors.chart;
    if (colorActive) {
      const { frame: colorsFrame } = getOrCreateCategoryFrame("colors", t(lang, "docSectionColors"));
      const primitiveVars = allVars.filter((v) => v.name.startsWith("Primitive/"));
      const brandVars = allVars.filter((v) => v.name.startsWith("Brand/"));
      const themeVarsArr = allVars.filter((v) => v.name.startsWith("Theme/"));
      const semanticVars = allVars.filter((v) => v.name.startsWith("Semantic/"));
      const sidebarVars = allVars.filter((v) => v.name.startsWith("Sidebar/") || v.name.startsWith("sidebar-"));
      const chartVars = allVars.filter((v) => v.name.startsWith("Chart/") || v.name.toLowerCase().includes("chart"));
      colorsFrame.appendChild(createSectionHeader("02", "Colors", t(lang, "pageColorsDesc")));
      colorsFrame.appendChild(createDivider());
      colorsFrame.appendChild(mkDocBlock({
        whatItIs: t(lang, "docColorWhatItIs"),
        howToUse: t(lang, "docColorHowToUse"),
        doText: t(lang, "docColorDo"),
        dontText: t(lang, "docColorDont")
      }));
      colorsFrame.appendChild(createDivider());
      if (scope.colors.primitive && primitiveVars.length > 0) {
        const primCard = createSubCard(`${t(lang, "docSectionPrim")} (${primitiveVars.length} ${t(lang, "estVariables")})`);
        primCard.appendChild(BaseComponentFactory.createSectionLabel(t(lang, "docPrimTitle"), themeFgVar));
        const paletteMap = /* @__PURE__ */ new Map();
        primitiveVars.forEach((v) => {
          const palette = v.name.split("/")[1] || "default";
          if (!paletteMap.has(palette)) paletteMap.set(palette, []);
          paletteMap.get(palette).push(v);
        });
        const primGrid = BaseComponentFactory.createStructuralFrame("Primitive Grid", "VERTICAL", {}, 10);
        paletteMap.forEach((vars, palName) => {
          const palRow = BaseComponentFactory.createStructuralFrame(`Palette ${palName}`, "VERTICAL", {}, 6);
          const pNameTxt = figma.createText();
          pNameTxt.characters = palName.toUpperCase();
          pNameTxt.fontSize = 10;
          pNameTxt.textAutoResize = "WIDTH_AND_HEIGHT";
          try {
            pNameTxt.fontName = { family: "Inter", style: "Bold" };
          } catch (_e) {
          }
          pNameTxt.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.12 } }];
          if (themeFgVar) BaseComponentFactory.bindVariable(pNameTxt, "fills", themeFgVar);
          palRow.appendChild(pNameTxt);
          const swatchRow = BaseComponentFactory.createStructuralFrame(`Swatches ${palName}`, "HORIZONTAL", {}, 5);
          vars.forEach((v) => {
            const step = v.name.split("/")[2] || "500";
            const resolved = resolveVariableRGB(v, lightModeId, varMapById);
            const rgb = resolved.rgb || { r: 0.8, g: 0.8, b: 0.8 };
            const lum = relativeLuminance(rgb);
            const textFill = lum > 0.4 ? { r: 0.1, g: 0.1, b: 0.1 } : { r: 1, g: 1, b: 1 };
            const box = figma.createFrame();
            box.name = v.name;
            box.layoutMode = "VERTICAL";
            box.primaryAxisSizingMode = "FIXED";
            box.counterAxisSizingMode = "FIXED";
            box.resize(88, 64);
            box.paddingTop = 6;
            box.paddingLeft = 8;
            box.itemSpacing = 2;
            box.cornerRadius = 5;
            if (radiusSmVar) BaseComponentFactory.bindVariable(box, "cornerRadius", radiusSmVar);
            BaseComponentFactory.bindVariable(box, "fills", v, rgb);
            const stepTxt = figma.createText();
            stepTxt.characters = step;
            stepTxt.fontSize = 10;
            stepTxt.textAutoResize = "WIDTH_AND_HEIGHT";
            try {
              stepTxt.fontName = { family: "Inter", style: "Bold" };
            } catch (_e) {
            }
            stepTxt.fills = [{ type: "SOLID", color: textFill }];
            box.appendChild(stepTxt);
            if (resolved.hex) {
              const hexTxt = figma.createText();
              hexTxt.characters = resolved.hex;
              hexTxt.fontSize = 8;
              hexTxt.textAutoResize = "WIDTH_AND_HEIGHT";
              hexTxt.fills = [{ type: "SOLID", color: textFill }];
              box.appendChild(hexTxt);
            }
            swatchRow.appendChild(box);
          });
          palRow.appendChild(swatchRow);
          primGrid.appendChild(palRow);
        });
        primCard.appendChild(primGrid);
        colorsFrame.appendChild(primCard);
      }
      if (scope.colors.brand && brandVars.length > 0) {
        const brandCard = createSubCard(`${t(lang, "docSectionBrand")} (${brandVars.length} ${t(lang, "estVariables")})`);
        brandCard.appendChild(BaseComponentFactory.createSectionLabel(t(lang, "docBrandTitle"), themeFgVar));
        const bPaletteMap = /* @__PURE__ */ new Map();
        brandVars.forEach((v) => {
          const groupName = v.name.split("/")[1] || "primary";
          if (!bPaletteMap.has(groupName)) bPaletteMap.set(groupName, []);
          bPaletteMap.get(groupName).push(v);
        });
        bPaletteMap.forEach((vars, gName) => {
          const brandTag = lang === "id" ? "MEREK" : "BRAND";
          const bGrpLabel = BaseComponentFactory.createSectionLabel(`${brandTag} / ${gName.toUpperCase()}`, themeFgVar);
          brandCard.appendChild(bGrpLabel);
          const bRow = BaseComponentFactory.createStructuralFrame(`Brand Swatches ${gName}`, "HORIZONTAL", {}, 5);
          vars.forEach((v) => {
            const step = v.name.split("/")[2] || "500";
            const resolved = resolveVariableRGB(v, lightModeId, varMapById);
            const rgb = resolved.rgb || { r: 0.8, g: 0.8, b: 0.8 };
            const lum = relativeLuminance(rgb);
            const textFill = lum > 0.4 ? { r: 0.1, g: 0.1, b: 0.1 } : { r: 1, g: 1, b: 1 };
            const box = figma.createFrame();
            box.name = v.name;
            box.layoutMode = "VERTICAL";
            box.primaryAxisSizingMode = "FIXED";
            box.counterAxisSizingMode = "FIXED";
            box.resize(88, 68);
            box.paddingTop = 6;
            box.paddingLeft = 8;
            box.itemSpacing = 2;
            box.cornerRadius = 5;
            if (radiusSmVar) BaseComponentFactory.bindVariable(box, "cornerRadius", radiusSmVar);
            BaseComponentFactory.bindVariable(box, "fills", v, rgb);
            if (step === "600" || step === "400") {
              if (themeBorderVar) BaseComponentFactory.bindVariable(box, "strokes", themeBorderVar);
              box.strokeWeight = 2;
            }
            const stepTxt = figma.createText();
            stepTxt.characters = step === "600" ? "600 (L)" : step === "400" ? "400 (D)" : step;
            stepTxt.fontSize = 10;
            stepTxt.textAutoResize = "WIDTH_AND_HEIGHT";
            try {
              stepTxt.fontName = { family: "Inter", style: "Bold" };
            } catch (_e) {
            }
            stepTxt.fills = [{ type: "SOLID", color: textFill }];
            box.appendChild(stepTxt);
            if (resolved.hex) {
              const hexTxt = figma.createText();
              hexTxt.characters = resolved.hex;
              hexTxt.fontSize = 8;
              hexTxt.textAutoResize = "WIDTH_AND_HEIGHT";
              hexTxt.fills = [{ type: "SOLID", color: textFill }];
              box.appendChild(hexTxt);
            }
            bRow.appendChild(box);
          });
          brandCard.appendChild(bRow);
        });
        colorsFrame.appendChild(brandCard);
      }
      if (scope.colors.theme && themeVarsArr.length > 0) {
        const themeCard = createSubCard(`${t(lang, "docSectionTheme")} (${themeVarsArr.length} ${t(lang, "estVariables")})`);
        themeCard.appendChild(BaseComponentFactory.createSectionLabel(t(lang, "docThemeTitle"), themeFgVar));
        const sideBySide = BaseComponentFactory.createStructuralFrame("Theme Side-by-Side", "HORIZONTAL", {}, 20);
        const buildThemeCol = async (title, modeId) => {
          const col = BaseComponentFactory.createStructuralFrame(`Theme ${title}`, "VERTICAL", {
            top: 16,
            right: 18,
            bottom: 16,
            left: 18
          }, 8);
          col.cornerRadius = 10;
          if (themeVarsArr.length > 0) {
            const colId = themeVarsArr[0].variableCollectionId;
            try {
              const targetCol = await figma.variables.getVariableCollectionByIdAsync(colId);
              if (targetCol) col.setExplicitVariableModeForCollection(targetCol, modeId);
            } catch (_e) {
            }
          }
          if (themeCardVar) {
            BaseComponentFactory.bindVariable(col, "fills", themeCardVar);
          }
          if (themeBorderVar) {
            BaseComponentFactory.bindVariable(col, "strokes", themeBorderVar);
            col.strokeWeight = 1;
          }
          const colTitle = figma.createText();
          colTitle.characters = title;
          colTitle.fontSize = 12;
          colTitle.textAutoResize = "WIDTH_AND_HEIGHT";
          try {
            colTitle.fontName = { family: "Inter", style: "Bold" };
          } catch (_e) {
          }
          colTitle.fills = [{ type: "SOLID", color: { r: 0.05, g: 0.05, b: 0.08 } }];
          if (themeFgVar) BaseComponentFactory.bindVariable(colTitle, "fills", themeFgVar);
          col.appendChild(colTitle);
          themeVarsArr.forEach(async (v) => {
            const resolved = resolveVariableRGB(v, modeId, varMapById);
            const row = BaseComponentFactory.createStructuralFrame(v.name, "HORIZONTAL", {}, 10);
            row.fills = [];
            const bar = figma.createFrame();
            bar.name = `Swatch ${v.name}`;
            bar.resize(100, 20);
            bar.cornerRadius = 4;
            if (radiusSmVar) BaseComponentFactory.bindVariable(bar, "cornerRadius", radiusSmVar);
            if (themeBorderVar) {
              BaseComponentFactory.bindVariable(bar, "strokes", themeBorderVar);
              bar.strokeWeight = 1;
            }
            const colId = v.variableCollectionId;
            try {
              const targetCol = await figma.variables.getVariableCollectionByIdAsync(colId);
              if (targetCol) {
                bar.setExplicitVariableModeForCollection(targetCol, modeId);
                row.setExplicitVariableModeForCollection(targetCol, modeId);
              }
            } catch (_e) {
            }
            const rgbFill = resolved.rgb || { r: 0.5, g: 0.5, b: 0.5 };
            const solidPaint = { type: "SOLID", color: rgbFill };
            try {
              if (typeof figma.variables?.setBoundVariableForPaint === "function") {
                const boundPaint = figma.variables.setBoundVariableForPaint(solidPaint, "color", v);
                bar.fills = [boundPaint];
              } else {
                bar.fills = [solidPaint];
              }
            } catch (_e) {
              bar.fills = [solidPaint];
            }
            row.appendChild(bar);
            const txt = figma.createText();
            txt.characters = `${v.name}${resolved.hex ? `  ${resolved.hex}` : ""}`;
            txt.fontSize = 10;
            txt.textAutoResize = "WIDTH_AND_HEIGHT";
            txt.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.12 } }];
            if (themeFgVar) BaseComponentFactory.bindVariable(txt, "fills", themeFgVar);
            row.appendChild(txt);
            col.appendChild(row);
          });
          return col;
        };
        sideBySide.appendChild(await buildThemeCol(t(lang, "docLightMode"), lightModeId));
        sideBySide.appendChild(await buildThemeCol(t(lang, "docDarkMode"), darkModeId));
        themeCard.appendChild(sideBySide);
        colorsFrame.appendChild(themeCard);
      }
      if (scope.colors.semantic && semanticVars.length > 0) {
        const semCard = createSubCard(`${t(lang, "docSectionSemantic")} (${semanticVars.length} ${t(lang, "estVariables")})`);
        semCard.appendChild(BaseComponentFactory.createSectionLabel(t(lang, "docSectionSemantic"), themeFgVar));
        const semGroupMap = /* @__PURE__ */ new Map();
        semanticVars.forEach((v) => {
          const parts = v.name.split("/");
          const groupName = parts.length > 1 ? parts[1] : "general";
          if (!semGroupMap.has(groupName)) semGroupMap.set(groupName, []);
          semGroupMap.get(groupName).push(v);
        });
        semGroupMap.forEach((vars, gName) => {
          const semTag = lang === "id" ? "SEMANTIK" : "SEMANTIC";
          const gLabel = BaseComponentFactory.createSectionLabel(`${semTag} / ${gName.toUpperCase()}`, themeFgVar);
          semCard.appendChild(gLabel);
          const gGrid = BaseComponentFactory.createStructuralFrame(`Semantic Grid ${gName}`, "VERTICAL", {}, 6);
          let currentRow = BaseComponentFactory.createStructuralFrame(`Row 0`, "HORIZONTAL", {}, 6);
          let rowWidth = 0;
          vars.forEach((v) => {
            const resolved = resolveVariableRGB(v, lightModeId, varMapById);
            const rgb = resolved.rgb || { r: 0.8, g: 0.8, b: 0.8 };
            const lum = relativeLuminance(rgb);
            const textFill = lum > 0.4 ? { r: 0.1, g: 0.1, b: 0.1 } : { r: 1, g: 1, b: 1 };
            const boxWidth = 140;
            if (rowWidth + boxWidth > 1200 && currentRow.children.length > 0) {
              gGrid.appendChild(currentRow);
              currentRow = BaseComponentFactory.createStructuralFrame(`Row ${gGrid.children.length}`, "HORIZONTAL", {}, 6);
              rowWidth = 0;
            }
            const box = figma.createFrame();
            box.name = v.name;
            box.layoutMode = "VERTICAL";
            box.primaryAxisSizingMode = "FIXED";
            box.counterAxisSizingMode = "FIXED";
            box.resize(boxWidth, 60);
            box.paddingTop = 6;
            box.paddingLeft = 8;
            box.itemSpacing = 2;
            box.cornerRadius = 5;
            if (radiusSmVar) BaseComponentFactory.bindVariable(box, "cornerRadius", radiusSmVar);
            BaseComponentFactory.bindVariable(box, "fills", v, rgb);
            const shortName = v.name.split("/").slice(2).join("/") || v.name.split("/").pop() || v.name;
            const nameTxt = figma.createText();
            nameTxt.characters = shortName;
            nameTxt.fontSize = 10;
            nameTxt.textAutoResize = "WIDTH_AND_HEIGHT";
            try {
              nameTxt.fontName = { family: "Inter", style: "Bold" };
            } catch (_e) {
            }
            nameTxt.fills = [{ type: "SOLID", color: textFill }];
            box.appendChild(nameTxt);
            if (resolved.hex) {
              const ht = figma.createText();
              ht.characters = resolved.hex;
              ht.fontSize = 8;
              ht.textAutoResize = "WIDTH_AND_HEIGHT";
              ht.fills = [{ type: "SOLID", color: textFill }];
              box.appendChild(ht);
            }
            currentRow.appendChild(box);
            rowWidth += boxWidth + 6;
          });
          if (currentRow.children.length > 0) {
            gGrid.appendChild(currentRow);
          }
          semCard.appendChild(gGrid);
        });
        colorsFrame.appendChild(semCard);
      }
      if (scope.colors.sidebar && sidebarVars.length > 0) {
        const sbCard = createSubCard(`${t(lang, "docSectionSidebar")} (${sidebarVars.length} ${t(lang, "estVariables")})`);
        sbCard.appendChild(BaseComponentFactory.createSectionLabel(t(lang, "docSectionSidebar"), themeFgVar));
        const sbRow = BaseComponentFactory.createStructuralFrame("Sidebar Swatches", "HORIZONTAL", {}, 6);
        sidebarVars.forEach((v) => {
          const resolved = resolveVariableRGB(v, lightModeId, varMapById);
          const rgb = resolved.rgb || { r: 0.8, g: 0.8, b: 0.8 };
          const lum = relativeLuminance(rgb);
          const textFill = lum > 0.4 ? { r: 0.1, g: 0.1, b: 0.1 } : { r: 1, g: 1, b: 1 };
          const box = figma.createFrame();
          box.name = v.name;
          box.layoutMode = "VERTICAL";
          box.primaryAxisSizingMode = "FIXED";
          box.counterAxisSizingMode = "FIXED";
          box.resize(140, 60);
          box.paddingTop = 6;
          box.paddingLeft = 8;
          box.itemSpacing = 2;
          box.cornerRadius = 5;
          if (radiusSmVar) BaseComponentFactory.bindVariable(box, "cornerRadius", radiusSmVar);
          BaseComponentFactory.bindVariable(box, "fills", v, rgb);
          const nt = figma.createText();
          nt.characters = v.name.split("/").pop() || v.name;
          nt.fontSize = 10;
          nt.textAutoResize = "WIDTH_AND_HEIGHT";
          try {
            nt.fontName = { family: "Inter", style: "Bold" };
          } catch (_e) {
          }
          nt.fills = [{ type: "SOLID", color: textFill }];
          box.appendChild(nt);
          if (resolved.hex) {
            const ht = figma.createText();
            ht.characters = resolved.hex;
            ht.fontSize = 8;
            ht.textAutoResize = "WIDTH_AND_HEIGHT";
            ht.fills = [{ type: "SOLID", color: textFill }];
            box.appendChild(ht);
          }
          sbRow.appendChild(box);
        });
        colorsFrame.appendChild(sbCard);
      }
      if (scope.colors.chart && chartVars.length > 0) {
        const chCard = createSubCard(`${t(lang, "docSectionChart")} (${chartVars.length} ${t(lang, "estVariables")})`);
        chCard.appendChild(BaseComponentFactory.createSectionLabel(t(lang, "docSectionChart"), themeFgVar));
        const chRow = BaseComponentFactory.createStructuralFrame("Chart Swatches", "HORIZONTAL", {}, 6);
        chartVars.forEach((v) => {
          const resolved = resolveVariableRGB(v, lightModeId, varMapById);
          const rgb = resolved.rgb || { r: 0.8, g: 0.8, b: 0.8 };
          const lum = relativeLuminance(rgb);
          const textFill = lum > 0.4 ? { r: 0.1, g: 0.1, b: 0.1 } : { r: 1, g: 1, b: 1 };
          const box = figma.createFrame();
          box.name = v.name;
          box.layoutMode = "VERTICAL";
          box.primaryAxisSizingMode = "FIXED";
          box.counterAxisSizingMode = "FIXED";
          box.resize(130, 60);
          box.paddingTop = 6;
          box.paddingLeft = 8;
          box.itemSpacing = 2;
          box.cornerRadius = 5;
          if (radiusSmVar) BaseComponentFactory.bindVariable(box, "cornerRadius", radiusSmVar);
          BaseComponentFactory.bindVariable(box, "fills", v, rgb);
          const nt = figma.createText();
          nt.characters = v.name.split("/").pop() || v.name;
          nt.fontSize = 10;
          nt.textAutoResize = "WIDTH_AND_HEIGHT";
          try {
            nt.fontName = { family: "Inter", style: "Bold" };
          } catch (_e) {
          }
          nt.fills = [{ type: "SOLID", color: textFill }];
          box.appendChild(nt);
          if (resolved.hex) {
            const ht = figma.createText();
            ht.characters = resolved.hex;
            ht.fontSize = 8;
            ht.textAutoResize = "WIDTH_AND_HEIGHT";
            ht.fills = [{ type: "SOLID", color: textFill }];
            box.appendChild(ht);
          }
          chRow.appendChild(box);
        });
        colorsFrame.appendChild(chCard);
      }
      const exCard = createSubCard(lang === "id" ? "Contoh Penggunaan Riil & Panduan Scope" : "Real-World UI Examples & Scope Rules");
      exCard.appendChild(BaseComponentFactory.createSectionLabel(lang === "id" ? "CONTOH PENGGUNAAN RIIL DENGAN VARIABLE ALIAS (100% DIBIASI VARIABLE)" : "REAL-WORLD UI USAGE EXAMPLES WITH VARIABLE ALIASES (100% VARIABLE BOUND)", themeFgVar));
      const exRow1 = BaseComponentFactory.createStructuralFrame("UI Examples Row 1", "HORIZONTAL", {}, 24);
      const exRow2 = BaseComponentFactory.createStructuralFrame("UI Examples Row 2", "HORIZONTAL", {}, 24);
      const exRow3 = BaseComponentFactory.createStructuralFrame("UI Examples Row 3", "HORIZONTAL", {}, 24);
      const colorColId = allVars.length > 0 ? allVars[0].variableCollectionId : void 0;
      const getVar = (...names) => {
        for (const n of names) {
          const found = allVars.find((v) => v.name === n || v.name.toLowerCase() === n.toLowerCase());
          if (found) return found;
        }
        return themeFgVar || allVars[0];
      };
      const themePrimaryVar2 = getVar("Theme/primary", "brand/primary");
      const themePrimaryFgVar = getVar("Theme/primary-foreground", "brand/on-primary");
      const themeSecondaryVar = getVar("Theme/secondary", "brand/secondary");
      const themeSecondaryFgVar = getVar("Theme/secondary-foreground", "brand/on-secondary");
      const themeCardVarRef = getVar("Theme/card", "surface/card");
      const themeCardFgVar = getVar("Theme/card-foreground", "content/primary");
      const themeMutedVarRef = getVar("Theme/muted", "surface/muted");
      const themeMutedFgVarRef = getVar("Theme/muted-foreground", "content/muted");
      const themeAccentVarRef = getVar("Theme/accent", "brand/accent");
      const themeAccentFgVarRef = getVar("Theme/accent-foreground", "content/accent");
      const themeDestructiveVarRef = getVar("Theme/destructive", "status/error");
      const themeDestructiveFgVarRef = getVar("Theme/destructive-foreground", "content/destructive");
      const themePopoverVar = getVar("Theme/popover", "surface/popover");
      const themePopoverFgVar = getVar("Theme/popover-foreground", "content/popover");
      const statusSuccessVar = getVar("status/success", "Theme/accent");
      const statusWarningVar = getVar("status/warning", "Theme/secondary");
      const statusErrorVar = getVar("status/error", "Theme/destructive");
      const statusInfoVar = getVar("status/info", "Theme/primary");
      const borderErrorVar = getVar("border/error", "Theme/destructive");
      const borderSuccessVar = getVar("border/success", "Theme/primary");
      const prepareExampleCard = async (cardNode) => {
        cardNode.resize(380, 200);
        cardNode.paddingTop = 14;
        cardNode.paddingBottom = 14;
        cardNode.paddingLeft = 14;
        cardNode.paddingRight = 14;
        cardNode.cornerRadius = 8;
        if (themeCardVarRef) BaseComponentFactory.bindVariable(cardNode, "fills", themeCardVarRef);
        if (themeBorderVar) {
          BaseComponentFactory.bindVariable(cardNode, "strokes", themeBorderVar);
          cardNode.strokeWeight = 1;
        }
        if (colorColId) {
          try {
            const targetCol = await figma.variables.getVariableCollectionByIdAsync(colorColId);
            if (targetCol) cardNode.setExplicitVariableModeForCollection(targetCol, lightModeId);
          } catch (_e) {
          }
        }
      };
      const createCardTitle = (text) => {
        const title = figma.createText();
        title.characters = text;
        title.fontSize = 11;
        title.textAutoResize = "WIDTH_AND_HEIGHT";
        try {
          title.fontName = { family: "Inter", style: "Bold" };
        } catch (_e) {
        }
        BaseComponentFactory.bindVariable(title, "fills", themeFgVar || themeCardFgVar);
        return title;
      };
      const createCardAnnotation = (text) => {
        const ann = figma.createText();
        ann.characters = text;
        ann.fontSize = 9;
        ann.textAutoResize = "WIDTH_AND_HEIGHT";
        BaseComponentFactory.bindVariable(ann, "fills", themeMutedFgVarRef);
        return ann;
      };
      const btnBox = BaseComponentFactory.createStructuralFrame("Button Example Card", "VERTICAL", {}, 8);
      await prepareExampleCard(btnBox);
      btnBox.appendChild(createCardTitle(lang === "id" ? "1. Komponen Tombol (Primary & Secondary)" : "1. Action Buttons (Primary & Secondary)"));
      const btnRow = figma.createFrame();
      btnRow.name = "Buttons Row";
      btnRow.layoutMode = "HORIZONTAL";
      btnRow.resize(348, 36);
      btnRow.itemSpacing = 10;
      btnRow.counterAxisAlignItems = "CENTER";
      const liveBtn1 = figma.createFrame();
      liveBtn1.name = "Primary Button";
      liveBtn1.layoutMode = "HORIZONTAL";
      liveBtn1.resize(150, 36);
      liveBtn1.primaryAxisAlignItems = "CENTER";
      liveBtn1.counterAxisAlignItems = "CENTER";
      liveBtn1.cornerRadius = 6;
      if (radiusSmVar) BaseComponentFactory.bindVariable(liveBtn1, "cornerRadius", radiusSmVar);
      BaseComponentFactory.bindVariable(liveBtn1, "fills", themePrimaryVar2);
      const liveBtnTxt1 = figma.createText();
      liveBtnTxt1.characters = "Primary Action";
      liveBtnTxt1.fontSize = 10;
      liveBtnTxt1.textAutoResize = "WIDTH_AND_HEIGHT";
      try {
        liveBtnTxt1.fontName = { family: "Inter", style: "Bold" };
      } catch (_e) {
      }
      BaseComponentFactory.bindVariable(liveBtnTxt1, "fills", themePrimaryFgVar);
      liveBtn1.appendChild(liveBtnTxt1);
      btnRow.appendChild(liveBtn1);
      const liveBtn2 = figma.createFrame();
      liveBtn2.name = "Secondary Button";
      liveBtn2.layoutMode = "HORIZONTAL";
      liveBtn2.resize(150, 36);
      liveBtn2.primaryAxisAlignItems = "CENTER";
      liveBtn2.counterAxisAlignItems = "CENTER";
      liveBtn2.cornerRadius = 6;
      if (radiusSmVar) BaseComponentFactory.bindVariable(liveBtn2, "cornerRadius", radiusSmVar);
      BaseComponentFactory.bindVariable(liveBtn2, "fills", themeSecondaryVar);
      const liveBtnTxt2 = figma.createText();
      liveBtnTxt2.characters = "Secondary Action";
      liveBtnTxt2.fontSize = 10;
      liveBtnTxt2.textAutoResize = "WIDTH_AND_HEIGHT";
      try {
        liveBtnTxt2.fontName = { family: "Inter", style: "Bold" };
      } catch (_e) {
      }
      BaseComponentFactory.bindVariable(liveBtnTxt2, "fills", themeSecondaryFgVar);
      liveBtn2.appendChild(liveBtnTxt2);
      btnRow.appendChild(liveBtn2);
      btnBox.appendChild(btnRow);
      btnBox.appendChild(createCardAnnotation(lang === "id" ? "\u2022 Primary Fill \u2794 Theme/primary (FRAME_FILL)\n\u2022 Primary Text \u2794 Theme/primary-foreground (TEXT_FILL)\n\u2022 Secondary Fill \u2794 Theme/secondary (FRAME_FILL)" : "\u2022 Primary Fill \u2794 Theme/primary (FRAME_FILL)\n\u2022 Primary Text \u2794 Theme/primary-foreground (TEXT_FILL)\n\u2022 Secondary Fill \u2794 Theme/secondary (FRAME_FILL)"));
      exRow1.appendChild(btnBox);
      const cardBox = BaseComponentFactory.createStructuralFrame("Card Example Card", "VERTICAL", {}, 8);
      await prepareExampleCard(cardBox);
      cardBox.appendChild(createCardTitle(lang === "id" ? "2. Kartu Statistik & Badge Trend" : "2. Dashboard Stat Card with Trend"));
      const liveCardNode = figma.createFrame();
      liveCardNode.name = "Card Container";
      liveCardNode.layoutMode = "VERTICAL";
      liveCardNode.resize(348, 64);
      liveCardNode.paddingTop = 8;
      liveCardNode.paddingLeft = 12;
      liveCardNode.paddingRight = 12;
      liveCardNode.itemSpacing = 2;
      liveCardNode.cornerRadius = 6;
      if (radiusSmVar) BaseComponentFactory.bindVariable(liveCardNode, "cornerRadius", radiusSmVar);
      BaseComponentFactory.bindVariable(liveCardNode, "fills", themeCardVarRef);
      if (themeBorderVar) {
        BaseComponentFactory.bindVariable(liveCardNode, "strokes", themeBorderVar);
        liveCardNode.strokeWeight = 1;
      }
      const cardHeaderRow = figma.createFrame();
      cardHeaderRow.name = "Header Row";
      cardHeaderRow.layoutMode = "HORIZONTAL";
      cardHeaderRow.resize(324, 20);
      cardHeaderRow.primaryAxisSizingMode = "FIXED";
      cardHeaderRow.counterAxisAlignItems = "CENTER";
      const liveCardHeading = figma.createText();
      liveCardHeading.characters = "Monthly Active Users";
      liveCardHeading.fontSize = 11;
      liveCardHeading.textAutoResize = "WIDTH_AND_HEIGHT";
      try {
        liveCardHeading.fontName = { family: "Inter", style: "Bold" };
      } catch (_e) {
      }
      BaseComponentFactory.bindVariable(liveCardHeading, "fills", themeCardFgVar);
      cardHeaderRow.appendChild(liveCardHeading);
      const trendBadge = figma.createFrame();
      trendBadge.name = "Trend Badge";
      trendBadge.layoutMode = "HORIZONTAL";
      trendBadge.paddingLeft = 6;
      trendBadge.paddingRight = 6;
      trendBadge.paddingTop = 2;
      trendBadge.paddingBottom = 2;
      trendBadge.cornerRadius = 10;
      BaseComponentFactory.bindVariable(trendBadge, "fills", statusSuccessVar);
      const trendTxt = figma.createText();
      trendTxt.characters = "+24.8%";
      trendTxt.fontSize = 8;
      trendTxt.textAutoResize = "WIDTH_AND_HEIGHT";
      try {
        trendTxt.fontName = { family: "Inter", style: "Bold" };
      } catch (_e) {
      }
      BaseComponentFactory.bindVariable(trendTxt, "fills", themePrimaryFgVar);
      trendBadge.appendChild(trendTxt);
      cardHeaderRow.appendChild(trendBadge);
      liveCardNode.appendChild(cardHeaderRow);
      const liveCardSub = figma.createText();
      liveCardSub.characters = "12,450 users joined in the last 30 days.";
      liveCardSub.fontSize = 9;
      liveCardSub.textAutoResize = "WIDTH_AND_HEIGHT";
      BaseComponentFactory.bindVariable(liveCardSub, "fills", themeMutedFgVarRef);
      liveCardNode.appendChild(liveCardSub);
      cardBox.appendChild(liveCardNode);
      cardBox.appendChild(createCardAnnotation(lang === "id" ? "\u2022 Surface Fill \u2794 Theme/card (FRAME_FILL)\n\u2022 Border Stroke \u2794 Theme/border (STROKE_COLOR)\n\u2022 Trend Badge \u2794 status/success & primary-foreground" : "\u2022 Surface Fill \u2794 Theme/card (FRAME_FILL)\n\u2022 Border Stroke \u2794 Theme/border (STROKE_COLOR)\n\u2022 Trend Badge \u2794 status/success & primary-foreground"));
      exRow1.appendChild(cardBox);
      const inputBox = BaseComponentFactory.createStructuralFrame("Input Example Card", "VERTICAL", {}, 8);
      await prepareExampleCard(inputBox);
      inputBox.appendChild(createCardTitle(lang === "id" ? "3. Formulir Input & Error Validation" : "3. Form Input Field & Error State"));
      const liveInputNode = figma.createFrame();
      liveInputNode.name = "Input Container";
      liveInputNode.layoutMode = "HORIZONTAL";
      liveInputNode.resize(348, 34);
      liveInputNode.paddingLeft = 10;
      liveInputNode.counterAxisAlignItems = "CENTER";
      liveInputNode.cornerRadius = 6;
      if (radiusSmVar) BaseComponentFactory.bindVariable(liveInputNode, "cornerRadius", radiusSmVar);
      BaseComponentFactory.bindVariable(liveInputNode, "fills", themePopoverVar || themeCardVarRef);
      BaseComponentFactory.bindVariable(liveInputNode, "strokes", borderErrorVar);
      liveInputNode.strokeWeight = 1.5;
      const liveInputTxt = figma.createText();
      liveInputTxt.characters = "invalid-email-address";
      liveInputTxt.fontSize = 10;
      liveInputTxt.textAutoResize = "WIDTH_AND_HEIGHT";
      BaseComponentFactory.bindVariable(liveInputTxt, "fills", themeFgVar);
      liveInputNode.appendChild(liveInputTxt);
      inputBox.appendChild(liveInputNode);
      const liveErrorMsg = figma.createText();
      liveErrorMsg.characters = "\u26A0 Please provide a valid email format.";
      liveErrorMsg.fontSize = 9;
      liveErrorMsg.textAutoResize = "WIDTH_AND_HEIGHT";
      BaseComponentFactory.bindVariable(liveErrorMsg, "fills", statusErrorVar);
      inputBox.appendChild(liveErrorMsg);
      inputBox.appendChild(createCardAnnotation(lang === "id" ? "\u2022 Border Stroke \u2794 border/error (STROKE_COLOR)\n\u2022 Error Text \u2794 status/error (TEXT_FILL)\n\u2022 Input Value \u2794 Theme/foreground (TEXT_FILL)" : "\u2022 Border Stroke \u2794 border/error (STROKE_COLOR)\n\u2022 Error Text \u2794 status/error (TEXT_FILL)\n\u2022 Input Value \u2794 Theme/foreground (TEXT_FILL)"));
      exRow1.appendChild(inputBox);
      const chartBox = BaseComponentFactory.createStructuralFrame("Chart Example Card", "VERTICAL", {}, 8);
      await prepareExampleCard(chartBox);
      chartBox.appendChild(createCardTitle(lang === "id" ? "4. Visualisasi Grafik (Chart 1\u20135 Tokens)" : "4. Multi-Series Data Chart (Chart 1\u20135)"));
      const chartCanvasFrame = figma.createFrame();
      chartCanvasFrame.name = "Bar Chart Container";
      chartCanvasFrame.layoutMode = "HORIZONTAL";
      chartCanvasFrame.resize(348, 68);
      chartCanvasFrame.paddingTop = 8;
      chartCanvasFrame.paddingBottom = 8;
      chartCanvasFrame.paddingLeft = 12;
      chartCanvasFrame.paddingRight = 12;
      chartCanvasFrame.itemSpacing = 16;
      chartCanvasFrame.counterAxisAlignItems = "MAX";
      chartCanvasFrame.cornerRadius = 6;
      if (radiusSmVar) BaseComponentFactory.bindVariable(chartCanvasFrame, "cornerRadius", radiusSmVar);
      BaseComponentFactory.bindVariable(chartCanvasFrame, "fills", themeCardVarRef);
      if (themeBorderVar) {
        BaseComponentFactory.bindVariable(chartCanvasFrame, "strokes", themeBorderVar);
        chartCanvasFrame.strokeWeight = 1;
      }
      const chartColorsList = [
        { varName: "Chart/chart-1", height: 48, fallbackName: "Theme/primary" },
        { varName: "Chart/chart-2", height: 32, fallbackName: "status/success" },
        { varName: "Chart/chart-3", height: 56, fallbackName: "status/warning" },
        { varName: "Chart/chart-4", height: 24, fallbackName: "Theme/secondary" },
        { varName: "Chart/chart-5", height: 40, fallbackName: "Theme/accent" }
      ];
      chartColorsList.forEach((cItem) => {
        const bar = figma.createFrame();
        bar.name = cItem.varName;
        bar.resize(48, cItem.height);
        bar.cornerRadius = 4;
        const cVar = getVar(cItem.varName, cItem.fallbackName);
        BaseComponentFactory.bindVariable(bar, "fills", cVar);
        chartCanvasFrame.appendChild(bar);
      });
      chartBox.appendChild(chartCanvasFrame);
      chartBox.appendChild(createCardAnnotation(lang === "id" ? "\u2022 Chart Bars \u2794 Chart/chart-1 s/d chart-5 (FRAME_FILL)\n\u2022 Grid Line \u2794 Theme/border (STROKE_COLOR)\n\u2022 Chart Legend \u2794 Theme/muted-foreground (TEXT_FILL)" : "\u2022 Chart Bars \u2794 Chart/chart-1 to chart-5 (FRAME_FILL)\n\u2022 Grid Line \u2794 Theme/border (STROKE_COLOR)\n\u2022 Chart Legend \u2794 Theme/muted-foreground (TEXT_FILL)"));
      exRow2.appendChild(chartBox);
      const sbBox = BaseComponentFactory.createStructuralFrame("Sidebar Example Card", "VERTICAL", {}, 8);
      await prepareExampleCard(sbBox);
      sbBox.appendChild(createCardTitle(lang === "id" ? "5. Navigasi Sidebar (Active & Hover)" : "5. Navigation Sidebar (Active & Hover)"));
      const sbFrame = figma.createFrame();
      sbFrame.name = "Sidebar Container";
      sbFrame.layoutMode = "VERTICAL";
      sbFrame.resize(348, 64);
      sbFrame.paddingTop = 6;
      sbFrame.paddingBottom = 6;
      sbFrame.paddingLeft = 8;
      sbFrame.paddingRight = 8;
      sbFrame.itemSpacing = 4;
      sbFrame.cornerRadius = 6;
      if (radiusSmVar) BaseComponentFactory.bindVariable(sbFrame, "cornerRadius", radiusSmVar);
      const sbBgVar = getVar("Sidebar/background", "Theme/card");
      const sbPrimaryVar = getVar("Sidebar/primary", "Theme/primary");
      const sbPrimaryFgVar = getVar("Sidebar/primary-foreground", "Theme/primary-foreground");
      const sbAccentVar = getVar("Sidebar/accent", "Theme/accent");
      const sbAccentFgVar = getVar("Sidebar/accent-foreground", "Theme/accent-foreground");
      BaseComponentFactory.bindVariable(sbFrame, "fills", sbBgVar);
      const sbActiveItem = figma.createFrame();
      sbActiveItem.name = "Sidebar Active Item";
      sbActiveItem.layoutMode = "HORIZONTAL";
      sbActiveItem.resize(332, 24);
      sbActiveItem.paddingLeft = 8;
      sbActiveItem.counterAxisAlignItems = "CENTER";
      sbActiveItem.cornerRadius = 4;
      BaseComponentFactory.bindVariable(sbActiveItem, "fills", sbPrimaryVar);
      const sbActiveTxt = figma.createText();
      sbActiveTxt.characters = "Dashboard Overview (Active)";
      sbActiveTxt.fontSize = 9;
      sbActiveTxt.textAutoResize = "WIDTH_AND_HEIGHT";
      try {
        sbActiveTxt.fontName = { family: "Inter", style: "Bold" };
      } catch (_e) {
      }
      BaseComponentFactory.bindVariable(sbActiveTxt, "fills", sbPrimaryFgVar);
      sbActiveItem.appendChild(sbActiveTxt);
      sbFrame.appendChild(sbActiveItem);
      const sbHoverItem = figma.createFrame();
      sbHoverItem.name = "Sidebar Hover Item";
      sbHoverItem.layoutMode = "HORIZONTAL";
      sbHoverItem.resize(332, 22);
      sbHoverItem.paddingLeft = 8;
      sbHoverItem.counterAxisAlignItems = "CENTER";
      sbHoverItem.cornerRadius = 4;
      BaseComponentFactory.bindVariable(sbHoverItem, "fills", sbAccentVar);
      const sbHoverTxt = figma.createText();
      sbHoverTxt.characters = "Analytics & Insights";
      sbHoverTxt.fontSize = 9;
      sbHoverTxt.textAutoResize = "WIDTH_AND_HEIGHT";
      BaseComponentFactory.bindVariable(sbHoverTxt, "fills", sbAccentFgVar);
      sbHoverItem.appendChild(sbHoverTxt);
      sbFrame.appendChild(sbHoverItem);
      sbBox.appendChild(sbFrame);
      sbBox.appendChild(createCardAnnotation(lang === "id" ? "\u2022 Sidebar Surface \u2794 Sidebar/background (FRAME_FILL)\n\u2022 Active Item \u2794 Sidebar/primary & primary-foreground\n\u2022 Hover Item \u2794 Sidebar/accent & accent-foreground" : "\u2022 Sidebar Surface \u2794 Sidebar/background (FRAME_FILL)\n\u2022 Active Item \u2794 Sidebar/primary & primary-foreground\n\u2022 Hover Item \u2794 Sidebar/accent & accent-foreground"));
      exRow2.appendChild(sbBox);
      const badgeBox = BaseComponentFactory.createStructuralFrame("Badge Example Card", "VERTICAL", {}, 8);
      await prepareExampleCard(badgeBox);
      badgeBox.appendChild(createCardTitle(lang === "id" ? "6. Status Badges & System Feedback" : "6. Status Badges & Feedback System"));
      const badgeRow = figma.createFrame();
      badgeRow.name = "Badges Container";
      badgeRow.layoutMode = "HORIZONTAL";
      badgeRow.resize(348, 48);
      badgeRow.itemSpacing = 8;
      badgeRow.counterAxisAlignItems = "CENTER";
      const badges = [
        { label: "Success", fillVar: statusSuccessVar, textVar: themePrimaryFgVar },
        { label: "Warning", fillVar: statusWarningVar, textVar: themePrimaryFgVar },
        { label: "Error", fillVar: statusErrorVar, textVar: themeDestructiveFgVarRef },
        { label: "Info", fillVar: statusInfoVar, textVar: themePrimaryFgVar }
      ];
      badges.forEach((b) => {
        const bPill = figma.createFrame();
        bPill.name = `${b.label} Badge`;
        bPill.layoutMode = "HORIZONTAL";
        bPill.paddingLeft = 10;
        bPill.paddingRight = 10;
        bPill.paddingTop = 4;
        bPill.paddingBottom = 4;
        bPill.cornerRadius = 12;
        BaseComponentFactory.bindVariable(bPill, "fills", b.fillVar);
        const bTxt = figma.createText();
        bTxt.characters = b.label;
        bTxt.fontSize = 9;
        bTxt.textAutoResize = "WIDTH_AND_HEIGHT";
        try {
          bTxt.fontName = { family: "Inter", style: "Bold" };
        } catch (_e) {
        }
        BaseComponentFactory.bindVariable(bTxt, "fills", b.textVar);
        bPill.appendChild(bTxt);
        badgeRow.appendChild(bPill);
      });
      badgeBox.appendChild(badgeRow);
      badgeBox.appendChild(createCardAnnotation(lang === "id" ? "\u2022 Success Badge \u2794 status/success (FRAME_FILL)\n\u2022 Warning Badge \u2794 status/warning (FRAME_FILL)\n\u2022 Destructive Badge \u2794 status/error (FRAME_FILL)" : "\u2022 Success Badge \u2794 status/success (FRAME_FILL)\n\u2022 Warning Badge \u2794 status/warning (FRAME_FILL)\n\u2022 Destructive Badge \u2794 status/error (FRAME_FILL)"));
      exRow2.appendChild(badgeBox);
      const alertBox = BaseComponentFactory.createStructuralFrame("Alert Example Card", "VERTICAL", {}, 8);
      await prepareExampleCard(alertBox);
      alertBox.appendChild(createCardTitle(lang === "id" ? "7. Banner Alert & Notifikasi System" : "7. Notification Alert Banner & Toast"));
      const alertBanner = figma.createFrame();
      alertBanner.name = "Alert Banner Container";
      alertBanner.layoutMode = "HORIZONTAL";
      alertBanner.resize(348, 64);
      alertBanner.paddingLeft = 0;
      alertBanner.paddingRight = 10;
      alertBanner.paddingTop = 8;
      alertBanner.paddingBottom = 8;
      alertBanner.itemSpacing = 10;
      alertBanner.cornerRadius = 6;
      if (radiusSmVar) BaseComponentFactory.bindVariable(alertBanner, "cornerRadius", radiusSmVar);
      BaseComponentFactory.bindVariable(alertBanner, "fills", themePopoverVar || themeCardVarRef);
      if (themeBorderVar) {
        BaseComponentFactory.bindVariable(alertBanner, "strokes", themeBorderVar);
        alertBanner.strokeWeight = 1;
      }
      const alertStrip = figma.createFrame();
      alertStrip.name = "Accent Bar";
      alertStrip.resize(6, 48);
      alertStrip.cornerRadius = 3;
      BaseComponentFactory.bindVariable(alertStrip, "fills", themePrimaryVar2);
      alertBanner.appendChild(alertStrip);
      const alertTextCol = figma.createFrame();
      alertTextCol.name = "Text Column";
      alertTextCol.layoutMode = "VERTICAL";
      alertTextCol.resize(320, 48);
      alertTextCol.itemSpacing = 2;
      const alertHeading = figma.createText();
      alertHeading.characters = "System Update Completed Successfully";
      alertHeading.fontSize = 10;
      alertHeading.textAutoResize = "WIDTH_AND_HEIGHT";
      try {
        alertHeading.fontName = { family: "Inter", style: "Bold" };
      } catch (_e) {
      }
      BaseComponentFactory.bindVariable(alertHeading, "fills", themePopoverFgVar || themeCardFgVar);
      alertTextCol.appendChild(alertHeading);
      const alertBody = figma.createText();
      alertBody.characters = "All design system tokens and variables have been synchronized.";
      alertBody.fontSize = 9;
      alertBody.textAutoResize = "WIDTH_AND_HEIGHT";
      BaseComponentFactory.bindVariable(alertBody, "fills", themeMutedFgVarRef);
      alertTextCol.appendChild(alertBody);
      alertBanner.appendChild(alertTextCol);
      alertBox.appendChild(alertBanner);
      alertBox.appendChild(createCardAnnotation(lang === "id" ? "\u2022 Banner Surface \u2794 Theme/popover (FRAME_FILL)\n\u2022 Accent Bar \u2794 Theme/primary (FRAME_FILL)\n\u2022 Heading Text \u2794 Theme/popover-foreground" : "\u2022 Banner Surface \u2794 Theme/popover (FRAME_FILL)\n\u2022 Accent Bar \u2794 Theme/primary (FRAME_FILL)\n\u2022 Heading Text \u2794 Theme/popover-foreground"));
      exRow3.appendChild(alertBox);
      const userBox = BaseComponentFactory.createStructuralFrame("User Example Card", "VERTICAL", {}, 8);
      await prepareExampleCard(userBox);
      userBox.appendChild(createCardTitle(lang === "id" ? "8. User Profile & Indikator Status" : "8. User Profile Card & Online Status"));
      const userCardFrame = figma.createFrame();
      userCardFrame.name = "User Card Container";
      userCardFrame.layoutMode = "HORIZONTAL";
      userCardFrame.resize(348, 64);
      userCardFrame.paddingLeft = 12;
      userCardFrame.paddingRight = 12;
      userCardFrame.paddingTop = 8;
      userCardFrame.paddingBottom = 8;
      userCardFrame.itemSpacing = 12;
      userCardFrame.counterAxisAlignItems = "CENTER";
      userCardFrame.cornerRadius = 6;
      if (radiusSmVar) BaseComponentFactory.bindVariable(userCardFrame, "cornerRadius", radiusSmVar);
      BaseComponentFactory.bindVariable(userCardFrame, "fills", themeCardVarRef);
      if (themeBorderVar) {
        BaseComponentFactory.bindVariable(userCardFrame, "strokes", themeBorderVar);
        userCardFrame.strokeWeight = 1;
      }
      const avatarCircle = figma.createFrame();
      avatarCircle.name = "Avatar Initials";
      avatarCircle.layoutMode = "HORIZONTAL";
      avatarCircle.resize(36, 36);
      avatarCircle.primaryAxisAlignItems = "CENTER";
      avatarCircle.counterAxisAlignItems = "CENTER";
      avatarCircle.cornerRadius = 18;
      BaseComponentFactory.bindVariable(avatarCircle, "fills", themeSecondaryVar);
      const avatarTxt = figma.createText();
      avatarTxt.characters = "AA";
      avatarTxt.fontSize = 11;
      avatarTxt.textAutoResize = "WIDTH_AND_HEIGHT";
      try {
        avatarTxt.fontName = { family: "Inter", style: "Bold" };
      } catch (_e) {
      }
      BaseComponentFactory.bindVariable(avatarTxt, "fills", themeSecondaryFgVar);
      avatarCircle.appendChild(avatarTxt);
      userCardFrame.appendChild(avatarCircle);
      const userDetailsCol = figma.createFrame();
      userDetailsCol.name = "User Details";
      userDetailsCol.layoutMode = "VERTICAL";
      userDetailsCol.itemSpacing = 2;
      const userNameTxt = figma.createText();
      userNameTxt.characters = "Ariyo Aziz (Lead Designer)";
      userNameTxt.fontSize = 10;
      userNameTxt.textAutoResize = "WIDTH_AND_HEIGHT";
      try {
        userNameTxt.fontName = { family: "Inter", style: "Bold" };
      } catch (_e) {
      }
      BaseComponentFactory.bindVariable(userNameTxt, "fills", themeCardFgVar);
      userDetailsCol.appendChild(userNameTxt);
      const userRoleTxt = figma.createText();
      userRoleTxt.characters = "Design System Lead \u2022 Online Now";
      userRoleTxt.fontSize = 8.5;
      userRoleTxt.textAutoResize = "WIDTH_AND_HEIGHT";
      BaseComponentFactory.bindVariable(userRoleTxt, "fills", themeMutedFgVarRef);
      userDetailsCol.appendChild(userRoleTxt);
      userCardFrame.appendChild(userDetailsCol);
      userBox.appendChild(userCardFrame);
      userBox.appendChild(createCardAnnotation(lang === "id" ? "\u2022 Avatar Fill \u2794 Theme/secondary (FRAME_FILL)\n\u2022 Avatar Text \u2794 Theme/secondary-foreground (TEXT_FILL)\n\u2022 Subtitle Text \u2794 Theme/muted-foreground" : "\u2022 Avatar Fill \u2794 Theme/secondary (FRAME_FILL)\n\u2022 Avatar Text \u2794 Theme/secondary-foreground (TEXT_FILL)\n\u2022 Subtitle Text \u2794 Theme/muted-foreground"));
      exRow3.appendChild(userBox);
      const tableBox = BaseComponentFactory.createStructuralFrame("Table Example Card", "VERTICAL", {}, 8);
      await prepareExampleCard(tableBox);
      tableBox.appendChild(createCardTitle(lang === "id" ? "9. Baris Tabel Data & Tag Kategori" : "9. Data Table Row & Category Tag"));
      const tableRowFrame = figma.createFrame();
      tableRowFrame.name = "Table Row Container";
      tableRowFrame.layoutMode = "HORIZONTAL";
      tableRowFrame.resize(348, 64);
      tableRowFrame.paddingLeft = 12;
      tableRowFrame.paddingRight = 12;
      tableRowFrame.paddingTop = 8;
      tableRowFrame.paddingBottom = 8;
      tableRowFrame.itemSpacing = 16;
      tableRowFrame.counterAxisAlignItems = "CENTER";
      tableRowFrame.cornerRadius = 6;
      if (radiusSmVar) BaseComponentFactory.bindVariable(tableRowFrame, "cornerRadius", radiusSmVar);
      BaseComponentFactory.bindVariable(tableRowFrame, "fills", themeCardVarRef);
      if (themeBorderVar) {
        BaseComponentFactory.bindVariable(tableRowFrame, "strokes", themeBorderVar);
        tableRowFrame.strokeWeight = 1;
      }
      const tableTextCol = figma.createFrame();
      tableTextCol.name = "Cell Details";
      tableTextCol.layoutMode = "VERTICAL";
      tableTextCol.resize(230, 44);
      tableTextCol.itemSpacing = 2;
      const cellTitle = figma.createText();
      cellTitle.characters = "Design System Variable Export.json";
      cellTitle.fontSize = 9.5;
      cellTitle.textAutoResize = "WIDTH_AND_HEIGHT";
      try {
        cellTitle.fontName = { family: "Inter", style: "Bold" };
      } catch (_e) {
      }
      BaseComponentFactory.bindVariable(cellTitle, "fills", themeCardFgVar);
      tableTextCol.appendChild(cellTitle);
      const cellSub = figma.createText();
      cellSub.characters = "Modified 2 minutes ago \u2022 242 Tokens";
      cellSub.fontSize = 8.5;
      cellSub.textAutoResize = "WIDTH_AND_HEIGHT";
      BaseComponentFactory.bindVariable(cellSub, "fills", themeMutedFgVarRef);
      tableTextCol.appendChild(cellSub);
      tableRowFrame.appendChild(tableTextCol);
      const tableTag = figma.createFrame();
      tableTag.name = "Category Tag";
      tableTag.layoutMode = "HORIZONTAL";
      tableTag.paddingLeft = 8;
      tableTag.paddingRight = 8;
      tableTag.paddingTop = 3;
      tableTag.paddingBottom = 3;
      tableTag.cornerRadius = 4;
      BaseComponentFactory.bindVariable(tableTag, "fills", themeMutedVarRef);
      const tagTxt = figma.createText();
      tagTxt.characters = "DTCG JSON";
      tagTxt.fontSize = 8;
      tagTxt.textAutoResize = "WIDTH_AND_HEIGHT";
      try {
        tagTxt.fontName = { family: "Inter", style: "Bold" };
      } catch (_e) {
      }
      BaseComponentFactory.bindVariable(tagTxt, "fills", themeMutedFgVarRef);
      tableTag.appendChild(tagTxt);
      tableRowFrame.appendChild(tableTag);
      tableBox.appendChild(tableRowFrame);
      tableBox.appendChild(createCardAnnotation(lang === "id" ? "\u2022 Row Fill \u2794 Theme/card (FRAME_FILL)\n\u2022 Tag Surface \u2794 Theme/muted (FRAME_FILL)\n\u2022 Tag Label \u2794 Theme/muted-foreground (TEXT_FILL)" : "\u2022 Row Fill \u2794 Theme/card (FRAME_FILL)\n\u2022 Tag Surface \u2794 Theme/muted (FRAME_FILL)\n\u2022 Tag Label \u2794 Theme/muted-foreground (TEXT_FILL)"));
      exRow3.appendChild(tableBox);
      exCard.appendChild(exRow1);
      exCard.appendChild(exRow2);
      exCard.appendChild(exRow3);
      colorsFrame.appendChild(exCard);
      colorsFrame.appendChild(createCategoryFooter("Colors"));
    }
    if (scope.typography) {
      const { frame: typoFrame } = getOrCreateCategoryFrame("typography", t(lang, "docSectionTypo"));
      typoFrame.appendChild(createSectionHeader("03", "Typography", t(lang, "pageTypographyDesc")));
      typoFrame.appendChild(createDivider());
      typoFrame.appendChild(mkDocBlock({
        whatItIs: t(lang, "docTypoWhatItIs"),
        howToUse: t(lang, "docTypoHowToUse"),
        dontText: t(lang, "docTypoDont")
      }));
      typoFrame.appendChild(createDivider());
      if (options.fontFamily) {
        const fontCard = createSubCard("Font Family", CATEGORY_WIDTH - 72);
        fontCard.appendChild(BaseComponentFactory.createSectionLabel("FONT FAMILY", themeFgVar));
        const fontTxt = figma.createText();
        fontTxt.characters = options.fontFamily;
        fontTxt.fontSize = 20;
        fontTxt.textAutoResize = "WIDTH_AND_HEIGHT";
        try {
          fontTxt.fontName = { family: "Inter", style: "Bold" };
        } catch (_e) {
        }
        fontTxt.fills = [{ type: "SOLID", color: { r: 0.05, g: 0.05, b: 0.08 } }];
        if (themeFgVar) BaseComponentFactory.bindVariable(fontTxt, "fills", themeFgVar);
        fontCard.appendChild(fontTxt);
        typoFrame.appendChild(fontCard);
      }
      if (localTextStyles.length > 0) {
        const stylesCard = createSubCard("Type Scale", CATEGORY_WIDTH - 72);
        stylesCard.appendChild(BaseComponentFactory.createSectionLabel(t(lang, "docTypoTitle"), themeFgVar));
        for (const style of localTextStyles) {
          const card = figma.createFrame();
          card.name = `Style Card \u2014 ${style.name}`;
          card.layoutMode = "VERTICAL";
          card.primaryAxisSizingMode = "AUTO";
          card.counterAxisSizingMode = "FIXED";
          card.resize(CATEGORY_WIDTH - 120, 60);
          card.paddingTop = 12;
          card.paddingBottom = 12;
          card.paddingLeft = 14;
          card.paddingRight = 14;
          card.itemSpacing = 4;
          card.cornerRadius = 8;
          if (radiusMdVar) BaseComponentFactory.bindVariable(card, "cornerRadius", radiusMdVar);
          card.fills = [{ type: "SOLID", color: { r: 0.98, g: 0.98, b: 0.99 } }];
          if (themeCardVar) BaseComponentFactory.bindVariable(card, "fills", themeCardVar);
          card.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.92 } }];
          if (themeBorderVar) BaseComponentFactory.bindVariable(card, "strokes", themeBorderVar);
          card.strokeWeight = 1;
          const metaTxt = figma.createText();
          metaTxt.characters = `${style.name.toUpperCase()} \u2014 ${style.fontSize}px`;
          metaTxt.fontSize = 9;
          metaTxt.textAutoResize = "WIDTH_AND_HEIGHT";
          try {
            metaTxt.fontName = { family: "Inter", style: "Bold" };
          } catch (_e) {
          }
          metaTxt.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.55 } }];
          if (themeMutedFgVar) BaseComponentFactory.bindVariable(metaTxt, "fills", themeMutedFgVar);
          card.appendChild(metaTxt);
          const sampleTxt = figma.createText();
          sampleTxt.characters = t(lang, "docSampleText");
          sampleTxt.textAutoResize = "WIDTH_AND_HEIGHT";
          sampleTxt.fills = [{ type: "SOLID", color: { r: 0.05, g: 0.05, b: 0.08 } }];
          if (themeFgVar) BaseComponentFactory.bindVariable(sampleTxt, "fills", themeFgVar);
          try {
            if ("setTextStyleIdAsync" in sampleTxt && typeof sampleTxt.setTextStyleIdAsync === "function") {
              await sampleTxt.setTextStyleIdAsync(style.id);
            }
          } catch (_e) {
          }
          card.appendChild(sampleTxt);
          stylesCard.appendChild(card);
        }
        typoFrame.appendChild(stylesCard);
      } else {
        const empty = createSubCard(t(lang, "docEmptyTypoTitle"));
        const emptyTxt = figma.createText();
        emptyTxt.characters = t(lang, "docEmptyTypoDesc");
        emptyTxt.fontSize = 11;
        emptyTxt.textAutoResize = "WIDTH_AND_HEIGHT";
        emptyTxt.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.55 } }];
        if (themeMutedFgVar) BaseComponentFactory.bindVariable(emptyTxt, "fills", themeMutedFgVar);
        empty.appendChild(emptyTxt);
        typoFrame.appendChild(empty);
      }
      typoFrame.appendChild(createCategoryFooter("Typography"));
    }
    if (scope.spacing || scope.radius) {
      const { frame: layoutFrame } = getOrCreateCategoryFrame("layout", t(lang, "docSectionLayout"));
      layoutFrame.appendChild(createSectionHeader("04", "Layout Foundations", t(lang, "pageLayoutDesc")));
      layoutFrame.appendChild(createDivider());
      layoutFrame.appendChild(mkDocBlock({
        whatItIs: t(lang, "docLayoutWhatItIs"),
        howToUse: t(lang, "docLayoutHowToUse"),
        dontText: t(lang, "docLayoutDont")
      }));
      layoutFrame.appendChild(createDivider());
      if (scope.spacing) {
        const spacingVars = allVars.filter((v) => v.name.startsWith("Spacing/") || v.name.startsWith("spacing/"));
        if (spacingVars.length > 0) {
          const spacingCard = createSubCard(`Spacing Scale (${spacingVars.length} ${t(lang, "estVariables")})`);
          spacingCard.appendChild(BaseComponentFactory.createSectionLabel(t(lang, "docSpacingTitle"), themeFgVar));
          const spacingGrid = BaseComponentFactory.createStructuralFrame("Spacing Ruler Grid", "VERTICAL", {}, 8);
          spacingVars.slice(0, 24).forEach((v) => {
            const row = BaseComponentFactory.createStructuralFrame(v.name, "HORIZONTAL", {}, 12);
            const bar = figma.createRectangle();
            bar.resize(80, 14);
            bar.cornerRadius = 3;
            if (radiusSmVar) BaseComponentFactory.bindVariable(bar, "cornerRadius", radiusSmVar);
            if (themePrimaryVar) BaseComponentFactory.bindVariable(bar, "fills", themePrimaryVar);
            try {
              if ("setBoundVariable" in bar && typeof bar.setBoundVariable === "function") {
                bar.setBoundVariable("width", v);
              }
            } catch (_e) {
            }
            row.appendChild(bar);
            const txt = figma.createText();
            txt.characters = v.name;
            txt.fontSize = 10;
            txt.textAutoResize = "WIDTH_AND_HEIGHT";
            txt.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.12 } }];
            if (themeFgVar) BaseComponentFactory.bindVariable(txt, "fills", themeFgVar);
            row.appendChild(txt);
            spacingGrid.appendChild(row);
          });
          spacingCard.appendChild(spacingGrid);
          layoutFrame.appendChild(spacingCard);
        }
      }
      if (scope.radius) {
        const radiusVars = allVars.filter(
          (v) => v.name.startsWith("Radius/") || v.name.startsWith("radius-") || v.name.startsWith("radius/")
        );
        if (radiusVars.length > 0) {
          const radiusCard = createSubCard(`Radius Scale (${radiusVars.length} ${t(lang, "estVariables")})`);
          radiusCard.appendChild(BaseComponentFactory.createSectionLabel(t(lang, "docRadiusTitle"), themeFgVar));
          const radiusGrid = BaseComponentFactory.createStructuralFrame("Radius Grid", "HORIZONTAL", {}, 12);
          radiusVars.forEach((v) => {
            const col = BaseComponentFactory.createStructuralFrame(`Radius ${v.name}`, "VERTICAL", {}, 6);
            const box = figma.createFrame();
            box.name = v.name;
            box.layoutMode = "NONE";
            box.resize(64, 64);
            box.fills = [{ type: "SOLID", color: { r: 0.93, g: 0.93, b: 0.97 } }];
            if (themeCardVar) BaseComponentFactory.bindVariable(box, "fills", themeCardVar);
            box.strokes = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.8 } }];
            if (themePrimaryVar) BaseComponentFactory.bindVariable(box, "strokes", themePrimaryVar);
            box.strokeWeight = 2;
            BaseComponentFactory.bindVariable(box, "cornerRadius", v);
            col.appendChild(box);
            const nameTxt = figma.createText();
            nameTxt.characters = v.name.split("/").pop() || v.name;
            nameTxt.fontSize = 9;
            nameTxt.textAutoResize = "WIDTH_AND_HEIGHT";
            try {
              nameTxt.fontName = { family: "Inter", style: "Bold" };
            } catch (_e) {
            }
            nameTxt.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.12 } }];
            if (themeFgVar) BaseComponentFactory.bindVariable(nameTxt, "fills", themeFgVar);
            col.appendChild(nameTxt);
            radiusGrid.appendChild(col);
          });
          radiusCard.appendChild(radiusGrid);
          layoutFrame.appendChild(radiusCard);
        }
      }
      layoutFrame.appendChild(createCategoryFooter("Layout"));
    }
    if (scope.effects || scope.motion) {
      const { frame: visualFrame } = getOrCreateCategoryFrame("visual", t(lang, "docSectionVisual"));
      visualFrame.appendChild(createSectionHeader("05", "Visual Foundations", t(lang, "pageVisualDesc")));
      visualFrame.appendChild(createDivider());
      visualFrame.appendChild(mkDocBlock({
        whatItIs: t(lang, "docVisualWhatItIs"),
        howToUse: t(lang, "docVisualHowToUse"),
        notes: t(lang, "docVisualNote")
      }));
      visualFrame.appendChild(createDivider());
      if (scope.effects) {
        const effectsVars = allVars.filter(
          (v) => v.name.startsWith("shadow/") || v.name.startsWith("blur/") || v.name.startsWith("opacity/") || v.name.startsWith("border-width/") || v.name.startsWith("outline/")
        );
        if (effectsVars.length > 0) {
          const effectsCard = createSubCard(`Effects & Shadows (${effectsVars.length} ${t(lang, "estVariables")})`);
          effectsCard.appendChild(BaseComponentFactory.createSectionLabel(t(lang, "docEffectsTitle"), themeFgVar));
          const noticeTxt = figma.createText();
          noticeTxt.characters = t(lang, "lblStyleBoundNote");
          noticeTxt.fontSize = 9;
          noticeTxt.textAutoResize = "WIDTH_AND_HEIGHT";
          noticeTxt.fills = [{ type: "SOLID", color: { r: 0.85, g: 0.45, b: 0.1 } }];
          effectsCard.appendChild(noticeTxt);
          const effectsGrid = BaseComponentFactory.createStructuralFrame("Effects Grid", "VERTICAL", {}, 6);
          effectsVars.forEach((v) => {
            const row = BaseComponentFactory.createStructuralFrame(v.name, "HORIZONTAL", {}, 12);
            const chip = figma.createFrame();
            chip.name = `Token Chip \u2014 ${v.name}`;
            chip.layoutMode = "HORIZONTAL";
            chip.primaryAxisSizingMode = "AUTO";
            chip.counterAxisSizingMode = "FIXED";
            chip.resize(10, 22);
            chip.paddingLeft = chip.paddingRight = 8;
            chip.itemSpacing = 4;
            chip.cornerRadius = 4;
            if (radiusSmVar) BaseComponentFactory.bindVariable(chip, "cornerRadius", radiusSmVar);
            chip.fills = [{ type: "SOLID", color: { r: 0.95, g: 0.95, b: 0.97 } }];
            if (themeCardVar) BaseComponentFactory.bindVariable(chip, "fills", themeCardVar);
            chip.strokes = [{ type: "SOLID", color: { r: 0.88, g: 0.88, b: 0.9 } }];
            if (themeBorderVar) BaseComponentFactory.bindVariable(chip, "strokes", themeBorderVar);
            chip.strokeWeight = 1;
            const chipTxt = figma.createText();
            chipTxt.characters = v.name;
            chipTxt.fontSize = 9;
            chipTxt.textAutoResize = "WIDTH_AND_HEIGHT";
            chipTxt.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.12 } }];
            if (themeFgVar) BaseComponentFactory.bindVariable(chipTxt, "fills", themeFgVar);
            chip.appendChild(chipTxt);
            const tagTxt = figma.createText();
            tagTxt.characters = "STYLE-BOUND";
            tagTxt.fontSize = 8;
            tagTxt.textAutoResize = "WIDTH_AND_HEIGHT";
            tagTxt.fills = [{ type: "SOLID", color: { r: 0.85, g: 0.45, b: 0.1 } }];
            row.appendChild(chip);
            row.appendChild(tagTxt);
            effectsGrid.appendChild(row);
          });
          effectsCard.appendChild(effectsGrid);
          visualFrame.appendChild(effectsCard);
        }
      }
      if (scope.motion) {
        const motionVars = allVars.filter(
          (v) => v.name.startsWith("duration/") || v.name.startsWith("delay/") || v.name.startsWith("easing/") || v.name.startsWith("scale/")
        );
        if (motionVars.length > 0) {
          const motionCard = createSubCard(`Motion Tokens (${motionVars.length} ${t(lang, "estVariables")})`);
          motionCard.appendChild(BaseComponentFactory.createSectionLabel(t(lang, "docMotionTitle"), themeFgVar));
          const motionGrid = BaseComponentFactory.createStructuralFrame("Motion Grid", "VERTICAL", {}, 6);
          motionVars.forEach((v) => {
            const row = BaseComponentFactory.createStructuralFrame(v.name, "HORIZONTAL", {}, 12);
            const nameTxt = figma.createText();
            nameTxt.characters = v.name;
            nameTxt.fontSize = 10;
            nameTxt.textAutoResize = "WIDTH_AND_HEIGHT";
            try {
              nameTxt.fontName = { family: "Inter", style: "Bold" };
            } catch (_e) {
            }
            nameTxt.fills = [{ type: "SOLID", color: { r: 0.05, g: 0.05, b: 0.08 } }];
            if (themeFgVar) BaseComponentFactory.bindVariable(nameTxt, "fills", themeFgVar);
            row.appendChild(nameTxt);
            const catTxt = figma.createText();
            catTxt.characters = v.name.split("/")[0].toUpperCase();
            catTxt.fontSize = 9;
            catTxt.textAutoResize = "WIDTH_AND_HEIGHT";
            catTxt.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.55 } }];
            if (themeMutedFgVar) BaseComponentFactory.bindVariable(catTxt, "fills", themeMutedFgVar);
            row.appendChild(catTxt);
            motionGrid.appendChild(row);
          });
          motionCard.appendChild(motionGrid);
          visualFrame.appendChild(motionCard);
        }
      }
      visualFrame.appendChild(createCategoryFooter("Visual"));
    }
    if (scope.layers || scope.icons) {
      const { frame: systemFrame } = getOrCreateCategoryFrame("system", t(lang, "docSectionSystem"));
      systemFrame.appendChild(createSectionHeader("06", "System Foundations", t(lang, "pageSystemDesc")));
      systemFrame.appendChild(createDivider());
      systemFrame.appendChild(mkDocBlock({
        whatItIs: t(lang, "docSystemWhatItIs"),
        howToUse: t(lang, "docSystemHowToUse"),
        dontText: t(lang, "docSystemDont")
      }));
      systemFrame.appendChild(createDivider());
      if (scope.layers) {
        const layerVars = allVars.filter(
          (v) => v.name.startsWith("Layers/") || v.name.startsWith("z-index/") || v.name.startsWith("overlay/") || v.name.startsWith("modal/") || v.name.startsWith("dropdown/") || v.name.startsWith("tooltip/") || v.name.startsWith("toast/")
        );
        const layerCard = createSubCard(`Layers & Stacking (${layerVars.length} ${t(lang, "estVariables")})`);
        layerCard.appendChild(BaseComponentFactory.createSectionLabel(t(lang, "docLayersTitle"), themeFgVar));
        const staticLayerTokens = [
          { name: "z-index/0", val: "0", role: lang === "id" ? "Alur Dasar" : "Base Flow" },
          { name: "z-index/10", val: "10", role: lang === "id" ? "Wadah" : "Container" },
          { name: "z-index/20", val: "20", role: lang === "id" ? "Kartu" : "Card" },
          { name: "z-index/30", val: "30", role: lang === "id" ? "Header Lengket" : "Sticky Header" },
          { name: "z-index/40", val: "40", role: lang === "id" ? "Navigasi Tetap" : "Fixed Nav" },
          { name: "z-index/50", val: "50", role: lang === "id" ? "Panel Drawer" : "Drawer Panel" },
          { name: "overlay/z-index", val: "100", role: lang === "id" ? "Overlay" : "Overlay" },
          { name: "modal/z-index", val: "200", role: lang === "id" ? "Modal" : "Modal" },
          { name: "dropdown/z-index", val: "300", role: lang === "id" ? "Dropdown" : "Dropdown" },
          { name: "tooltip/z-index", val: "400", role: lang === "id" ? "Tooltip" : "Tooltip" },
          { name: "toast/z-index", val: "500", role: lang === "id" ? "Toast" : "Toast" }
        ];
        const layersGrid = BaseComponentFactory.createStructuralFrame("Layers Grid", "HORIZONTAL", {}, 10);
        staticLayerTokens.forEach((tkn) => {
          const v = varMapByName.get(tkn.name);
          const card = figma.createFrame();
          card.name = `Layer \u2014 ${tkn.name}`;
          card.layoutMode = "VERTICAL";
          card.primaryAxisSizingMode = "AUTO";
          card.counterAxisSizingMode = "FIXED";
          card.resize(96, 76);
          card.paddingTop = 8;
          card.paddingBottom = 8;
          card.paddingLeft = 10;
          card.paddingRight = 10;
          card.itemSpacing = 2;
          card.cornerRadius = 6;
          if (radiusSmVar) BaseComponentFactory.bindVariable(card, "cornerRadius", radiusSmVar);
          card.fills = [{ type: "SOLID", color: { r: 0.98, g: 0.98, b: 0.99 } }];
          if (themeCardVar) BaseComponentFactory.bindVariable(card, "fills", themeCardVar);
          card.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.92 } }];
          if (themeBorderVar) BaseComponentFactory.bindVariable(card, "strokes", themeBorderVar);
          card.strokeWeight = 1;
          const nt = figma.createText();
          nt.characters = tkn.name;
          nt.fontSize = 8;
          nt.textAutoResize = "WIDTH_AND_HEIGHT";
          try {
            nt.fontName = { family: "Inter", style: "Bold" };
          } catch (_e) {
          }
          nt.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.12 } }];
          if (themeFgVar) BaseComponentFactory.bindVariable(nt, "fills", themeFgVar);
          card.appendChild(nt);
          const vt = figma.createText();
          vt.characters = `z: ${tkn.val}`;
          vt.fontSize = 14;
          vt.textAutoResize = "WIDTH_AND_HEIGHT";
          try {
            vt.fontName = { family: "Inter", style: "Bold" };
          } catch (_e) {
          }
          vt.fills = [{ type: "SOLID", color: { r: 0.05, g: 0.05, b: 0.5 } }];
          if (themePrimaryVar) BaseComponentFactory.bindVariable(vt, "fills", themePrimaryVar || themeFgVar);
          card.appendChild(vt);
          const rt = figma.createText();
          rt.characters = tkn.role;
          rt.fontSize = 8;
          rt.textAutoResize = "WIDTH_AND_HEIGHT";
          rt.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.55 } }];
          if (themeMutedFgVar) BaseComponentFactory.bindVariable(rt, "fills", themeMutedFgVar);
          card.appendChild(rt);
          if (v) BaseComponentFactory.bindVariable(card, "cornerRadius", v);
          layersGrid.appendChild(card);
        });
        layerCard.appendChild(layersGrid);
        systemFrame.appendChild(layerCard);
      }
      if (scope.icons) {
        const iconVars = allVars.filter((v) => v.name.startsWith("icon/size/"));
        const strokeVars = allVars.filter((v) => v.name.startsWith("icon/stroke/"));
        const iconCard = createSubCard(`Icon System Tokens (${iconVars.length + strokeVars.length} ${t(lang, "estVariables")})`);
        iconCard.appendChild(BaseComponentFactory.createSectionLabel(t(lang, "docIconsTitle"), themeFgVar));
        const iconSizes = [
          { name: "icon/size/xs", px: "12" },
          { name: "icon/size/sm", px: "16" },
          { name: "icon/size/md", px: "20" },
          { name: "icon/size/lg", px: "24" },
          { name: "icon/size/xl", px: "28" },
          { name: "icon/size/2xl", px: "32" },
          { name: "icon/size/3xl", px: "40" },
          { name: "icon/size/4xl", px: "48" },
          { name: "icon/size/5xl", px: "64" }
        ];
        const iconsGrid = BaseComponentFactory.createStructuralFrame("Icons Grid", "HORIZONTAL", {}, 10);
        iconSizes.forEach((sz) => {
          const v = varMapByName.get(sz.name);
          const card = figma.createFrame();
          card.name = `Icon \u2014 ${sz.name}`;
          card.layoutMode = "VERTICAL";
          card.primaryAxisSizingMode = "AUTO";
          card.counterAxisSizingMode = "FIXED";
          card.resize(90, 68);
          card.paddingTop = 8;
          card.paddingBottom = 8;
          card.paddingLeft = 10;
          card.paddingRight = 10;
          card.itemSpacing = 2;
          card.cornerRadius = 6;
          if (radiusSmVar) BaseComponentFactory.bindVariable(card, "cornerRadius", radiusSmVar);
          card.fills = [{ type: "SOLID", color: { r: 0.98, g: 0.98, b: 0.99 } }];
          if (themeCardVar) BaseComponentFactory.bindVariable(card, "fills", themeCardVar);
          card.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.92 } }];
          if (themeBorderVar) BaseComponentFactory.bindVariable(card, "strokes", themeBorderVar);
          card.strokeWeight = 1;
          const nt = figma.createText();
          nt.characters = sz.name;
          nt.fontSize = 8;
          nt.textAutoResize = "WIDTH_AND_HEIGHT";
          try {
            nt.fontName = { family: "Inter", style: "Bold" };
          } catch (_e) {
          }
          nt.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.12 } }];
          if (themeFgVar) BaseComponentFactory.bindVariable(nt, "fills", themeFgVar);
          card.appendChild(nt);
          const vt = figma.createText();
          vt.characters = `${sz.px}px`;
          vt.fontSize = 13;
          vt.textAutoResize = "WIDTH_AND_HEIGHT";
          try {
            vt.fontName = { family: "Inter", style: "Bold" };
          } catch (_e) {
          }
          vt.fills = [{ type: "SOLID", color: { r: 0.05, g: 0.05, b: 0.08 } }];
          if (themeFgVar) BaseComponentFactory.bindVariable(vt, "fills", themeFgVar);
          card.appendChild(vt);
          if (v) {
            const bindNote = figma.createText();
            bindNote.characters = "TOKEN-BOUND";
            bindNote.fontSize = 7;
            bindNote.textAutoResize = "WIDTH_AND_HEIGHT";
            bindNote.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.6, b: 0.3 } }];
            card.appendChild(bindNote);
          }
          iconsGrid.appendChild(card);
        });
        iconCard.appendChild(iconsGrid);
        systemFrame.appendChild(iconCard);
      }
      systemFrame.appendChild(createCategoryFooter("System"));
    }
    LoggerService.success(
      `Phase 19.1 Canvas Lifecycle complete (${lang.toUpperCase()}). Managed Frames: ${page.children.length}.`
    );
    return result;
  }

  // src/data/icon.ts
  var ICON_SIZE_TOKENS = [
    { name: "icon/size/xs", value: 12, description: "12px - Micro badges & compact table indicators", scopes: ["WIDTH_HEIGHT"] },
    { name: "icon/size/sm", value: 16, description: "16px - Inputs, badges, small buttons, accordions", scopes: ["WIDTH_HEIGHT"] },
    { name: "icon/size/md", value: 20, description: "20px - Standard buttons, select dropdowns, list items", scopes: ["WIDTH_HEIGHT"] },
    { name: "icon/size/lg", value: 24, description: "24px - Default base icon size, navigation, sidebar", scopes: ["WIDTH_HEIGHT"] },
    { name: "icon/size/xl", value: 28, description: "28px - Large cards & modal headers", scopes: ["WIDTH_HEIGHT"] },
    { name: "icon/size/2xl", value: 32, description: "32px - Display avatars & hero callouts", scopes: ["WIDTH_HEIGHT"] },
    { name: "icon/size/3xl", value: 40, description: "40px - Empty state container icons", scopes: ["WIDTH_HEIGHT"] },
    { name: "icon/size/4xl", value: 48, description: "48px - Hero section illustration graphics", scopes: ["WIDTH_HEIGHT"] },
    { name: "icon/size/5xl", value: 64, description: "64px - Large banner graphics", scopes: ["WIDTH_HEIGHT"] }
  ];
  var ICON_STROKE_TOKENS = [
    { name: "icon/stroke/thin", value: 1, description: "1.0px - Ultra-light decorative outlines" },
    { name: "icon/stroke/light", value: 1.5, description: "1.5px - Micro 12px icons" },
    { name: "icon/stroke/default", value: 2, description: "2.0px - Standard default stroke weight (Lucide)" },
    { name: "icon/stroke/medium", value: 2.5, description: "2.5px - Emphasized action icons" },
    { name: "icon/stroke/bold", value: 3, description: "3.0px - High-contrast status badges" }
  ];
  var ICON_GAP_TOKENS = [
    { name: "icon/gap/xs", fallbackValue: 4, aliasTarget: "spacing/1", description: "4px - Micro icon gap", scopes: ["GAP", "WIDTH_HEIGHT"] },
    { name: "icon/gap/sm", fallbackValue: 6, aliasTarget: "spacing/1.5", description: "6px - Small input & button icon label gap", scopes: ["GAP", "WIDTH_HEIGHT"] },
    { name: "icon/gap/md", fallbackValue: 8, aliasTarget: "spacing/2", description: "8px - Standard button icon label gap", scopes: ["GAP", "WIDTH_HEIGHT"] },
    { name: "icon/gap/lg", fallbackValue: 12, aliasTarget: "spacing/3", description: "12px - Sidebar item icon label gap", scopes: ["GAP", "WIDTH_HEIGHT"] },
    { name: "icon/gap/xl", fallbackValue: 16, aliasTarget: "spacing/4", description: "16px - Feature list item icon gap", scopes: ["GAP", "WIDTH_HEIGHT"] },
    { name: "icon/gap/2xl", fallbackValue: 24, aliasTarget: "spacing/6", description: "24px - Large section icon gap", scopes: ["GAP", "WIDTH_HEIGHT"] }
  ];
  var ICON_RADIUS_TOKENS = [
    { name: "icon/radius/none", fallbackValue: 0, aliasTarget: "radius-none", description: "0px - Sharp container corners", scopes: ["CORNER_RADIUS"] },
    { name: "icon/radius/sm", fallbackValue: 2, aliasTarget: "radius-sm", description: "2px - Small rounded icon backdrop", scopes: ["CORNER_RADIUS"] },
    { name: "icon/radius/md", fallbackValue: 4, aliasTarget: "radius-md", description: "4px - Standard rounded icon backdrop", scopes: ["CORNER_RADIUS"] },
    { name: "icon/radius/lg", fallbackValue: 8, aliasTarget: "radius-lg", description: "8px - Large rounded icon container", scopes: ["CORNER_RADIUS"] }
  ];
  var ICON_OPACITY_TOKENS = [
    { name: "icon/opacity/default", value: 1, description: "100% opacity - Normal active state", scopes: ["OPACITY"] },
    { name: "icon/opacity/subtle", value: 0.6, description: "60% opacity - Subtle tertiary icon", scopes: ["OPACITY"] },
    { name: "icon/opacity/disabled", value: 0.38, description: "38% opacity - Non-interactive disabled icon", scopes: ["OPACITY"] },
    { name: "icon/opacity/hover", value: 0.8, description: "80% opacity - Hover state feedback", scopes: ["OPACITY"] },
    { name: "icon/opacity/active", value: 0.9, description: "90% opacity - Active press feedback", scopes: ["OPACITY"] }
  ];
  var ICON_ROTATION_TOKENS = [
    { name: "icon/rotation/none", value: 0, description: "0deg - Normal orientation" },
    { name: "icon/rotation/90", value: 90, description: "90deg - Right/Down chevron indicator" },
    { name: "icon/rotation/180", value: 180, description: "180deg - Expanded accordion chevron" },
    { name: "icon/rotation/270", value: 270, description: "270deg - Left/Up indicator" },
    { name: "icon/rotation/360", value: 360, description: "360deg - Full circular spinner loop" }
  ];
  var ICON_ANIMATION_FLOAT_TOKENS = [
    { name: "icon/animation/duration-fast", value: 150, description: "150ms - Fast icon hover transition" },
    { name: "icon/animation/duration-normal", value: 300, description: "300ms - Standard accordion expansion" },
    { name: "icon/animation/duration-slow", value: 500, description: "500ms - Loading spinner rotation loop" }
  ];
  var ICON_ANIMATION_STRING_TOKENS = [
    { name: "icon/animation/easing-standard", value: "cubic-bezier(0.4, 0.0, 0.2, 1.0)", description: "Standard easing curve" },
    { name: "icon/animation/easing-emphasized", value: "cubic-bezier(0.2, 0.0, 0.0, 1.0)", description: "Emphasized easing curve" }
  ];

  // src/generators/icon.ts
  async function generateIconCollection(variableMap) {
    const result = {
      generatorName: COLLECTIONS.ICON,
      stats: { created: 0, updated: 0, skipped: 0 }
    };
    LoggerService.step(`Generating "${COLLECTIONS.ICON}" Collection`);
    const collection = await CollectionService.getOrCreateCollection(COLLECTIONS.ICON);
    const modeMap = ModeService.ensureModes(collection, [MODES.LIGHT]);
    const modeId = modeMap[MODES.LIGHT] || collection.defaultModeId;
    for (const token of ICON_SIZE_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of ICON_STROKE_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of ICON_GAP_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.fallbackValue,
        variableMap,
        token.description,
        result.stats,
        token.scopes,
        token.aliasTarget
      );
    }
    for (const token of ICON_RADIUS_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.fallbackValue,
        variableMap,
        token.description,
        result.stats,
        token.scopes,
        token.aliasTarget
      );
    }
    for (const token of ICON_OPACITY_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of ICON_ROTATION_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of ICON_ANIMATION_FLOAT_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of ICON_ANIMATION_STRING_TOKENS) {
      VariableService.createOrUpdateStringVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    LoggerService.success(
      `Completed "${COLLECTIONS.ICON}" Collection generation. Created: ${result.stats.created}, Updated: ${result.stats.updated}.`
    );
    return result;
  }

  // src/data/layers.ts
  var LAYER_Z_INDEX_TOKENS = [
    { name: "z-index/0", value: 0, description: "Base document flow stacking level" },
    { name: "z-index/10", value: 10, description: "Relative container level 10" },
    { name: "z-index/20", value: 20, description: "Floating card level 20" },
    { name: "z-index/30", value: 30, description: "Sticky header level 30" },
    { name: "z-index/40", value: 40, description: "Fixed navigation bar level 40" },
    { name: "z-index/50", value: 50, description: "Drawer panel level 50" }
  ];
  var LAYER_COMPONENT_TOKENS = [
    { name: "overlay/z-index", value: 100, description: "Backdrop scrim z-index 100" },
    { name: "modal/z-index", value: 200, description: "Modal dialog z-index 200" },
    { name: "dropdown/z-index", value: 300, description: "Select dropdown menu z-index 300" },
    { name: "popover/z-index", value: 300, description: "Floating popover container z-index 300" },
    { name: "tooltip/z-index", value: 400, description: "Hover tooltip z-index 400" },
    { name: "toast/z-index", value: 500, description: "Toast notification banner z-index 500" }
  ];

  // src/generators/layers.ts
  async function generateLayersCollection(variableMap) {
    const result = {
      generatorName: COLLECTIONS.LAYERS,
      stats: { created: 0, updated: 0, skipped: 0 }
    };
    LoggerService.step(`Generating "${COLLECTIONS.LAYERS}" Collection`);
    const collection = await CollectionService.getOrCreateCollection(COLLECTIONS.LAYERS);
    const modeMap = ModeService.ensureModes(collection, [MODES.LIGHT]);
    const modeId = modeMap[MODES.LIGHT] || collection.defaultModeId;
    for (const token of LAYER_Z_INDEX_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of LAYER_COMPONENT_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    LoggerService.success(
      `Completed "${COLLECTIONS.LAYERS}" Collection generation. Created: ${result.stats.created}, Updated: ${result.stats.updated}.`
    );
    return result;
  }

  // src/data/motion.ts
  var MOTION_DURATION_TOKENS = [
    { name: "duration/instant", value: 0, description: "0ms - Instant state change" },
    { name: "duration/fast", value: 150, description: "150ms - Fast micro-interaction hover" },
    { name: "duration/normal", value: 300, description: "300ms - Standard component expansion" },
    { name: "duration/slow", value: 500, description: "500ms - Modal dialog & page transition" },
    { name: "duration/slower", value: 700, description: "700ms - Heavy drawer expansion" }
  ];
  var MOTION_DELAY_TOKENS = [
    { name: "delay/0", value: 0, description: "0ms delay" },
    { name: "delay/75", value: 75, description: "75ms delay" },
    { name: "delay/100", value: 100, description: "100ms delay" },
    { name: "delay/150", value: 150, description: "150ms delay" },
    { name: "delay/200", value: 200, description: "200ms delay" },
    { name: "delay/300", value: 300, description: "300ms delay" },
    { name: "delay/500", value: 500, description: "500ms delay" },
    { name: "delay/1000", value: 1e3, description: "1000ms (1s) delay" }
  ];
  var MOTION_EASING_TOKENS = [
    { name: "easing/linear", value: "linear", description: "Linear constant speed curve" },
    { name: "easing/standard", value: "cubic-bezier(0.4, 0.0, 0.2, 1.0)", description: "Standard ease-in-out curve" },
    { name: "easing/emphasized", value: "cubic-bezier(0.2, 0.0, 0.0, 1.0)", description: "Emphasized spring curve" },
    { name: "easing/decelerate", value: "cubic-bezier(0.0, 0.0, 0.2, 1.0)", description: "Ease-out deceleration curve" },
    { name: "easing/accelerate", value: "cubic-bezier(0.4, 0.0, 1.0, 1.0)", description: "Ease-in acceleration curve" }
  ];
  var MOTION_SCALE_TOKENS = [
    { name: "scale/95", value: 0.95, description: "0.95x - Pressed down scale state" },
    { name: "scale/100", value: 1, description: "1.0x - Normal scale 100%" },
    { name: "scale/105", value: 1.05, description: "1.05x - Hover pop scale" },
    { name: "scale/110", value: 1.1, description: "1.1x - Emphasized card zoom scale" }
  ];

  // src/generators/motion.ts
  async function generateMotionCollection(variableMap) {
    const result = {
      generatorName: COLLECTIONS.MOTION,
      stats: { created: 0, updated: 0, skipped: 0 }
    };
    LoggerService.step(`Generating "${COLLECTIONS.MOTION}" Collection`);
    const collection = await CollectionService.getOrCreateCollection(COLLECTIONS.MOTION);
    const modeMap = ModeService.ensureModes(collection, [MODES.LIGHT]);
    const modeId = modeMap[MODES.LIGHT] || collection.defaultModeId;
    for (const token of MOTION_DURATION_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of MOTION_DELAY_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of MOTION_EASING_TOKENS) {
      VariableService.createOrUpdateStringVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of MOTION_SCALE_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    LoggerService.success(
      `Completed "${COLLECTIONS.MOTION}" Collection generation. Created: ${result.stats.created}, Updated: ${result.stats.updated}.`
    );
    return result;
  }

  // src/data/radius.ts
  var RADIUS_TOKENS = [
    {
      name: "radius",
      value: 8,
      description: "Default corner radius (0.5rem / 8px)",
      scopes: ["CORNER_RADIUS"]
    },
    {
      name: "radius-sm",
      value: 4,
      description: "Small corner radius (0.25rem / 4px)",
      scopes: ["CORNER_RADIUS"]
    },
    {
      name: "radius-md",
      value: 6,
      description: "Medium corner radius (0.375rem / 6px)",
      scopes: ["CORNER_RADIUS"]
    },
    {
      name: "radius-lg",
      value: 8,
      description: "Large corner radius (0.5rem / 8px)",
      scopes: ["CORNER_RADIUS"]
    },
    {
      name: "radius-xl",
      value: 12,
      description: "Extra large corner radius (0.75rem / 12px)",
      scopes: ["CORNER_RADIUS"]
    },
    {
      name: "radius-2xl",
      value: 16,
      description: "Double extra large corner radius (1rem / 16px)",
      scopes: ["CORNER_RADIUS"]
    },
    {
      name: "radius-3xl",
      value: 24,
      description: "Triple extra large corner radius (1.5rem / 24px)",
      scopes: ["CORNER_RADIUS"]
    },
    {
      name: "radius-4xl",
      value: 32,
      description: "Quadruple extra large corner radius (2rem / 32px)",
      scopes: ["CORNER_RADIUS"]
    }
  ];

  // src/generators/radius.ts
  async function generateRadiusCollection(variableMap) {
    const stats = { created: 0, updated: 0, skipped: 0 };
    LoggerService.step("Generating Radius Collection");
    const collection = await CollectionService.getOrCreateCollection(COLLECTIONS.RADIUS);
    const modeMap = ModeService.ensureModes(collection, []);
    const defaultModeId = Object.values(modeMap)[0] || collection.modes[0].modeId;
    for (const token of RADIUS_TOKENS) {
      const formattedTokenName = token.name.toLowerCase().replace(/\s+/g, "-");
      VariableService.createOrUpdateFloatVariable(
        collection,
        formattedTokenName,
        defaultModeId,
        token.value,
        variableMap,
        token.description ?? `Shadcn UI Corner Radius (${token.value}px)`,
        stats,
        token.scopes
      );
    }
    LoggerService.success(
      `Radius Tokens generated: ${stats.created} created, ${stats.updated} updated.`
    );
    return {
      generatorName: "Radius Tokens",
      stats
    };
  }

  // src/data/semantic.ts
  var SEMANTIC_SURFACE_TOKENS = [
    { name: "surface/background", value: { light: "#ffffff", dark: "#09090b" }, alias: { light: "Primitive/slate/50", dark: "Primitive/zinc/950" }, description: "Default screen canvas background", scopes: ["FRAME_FILL"] },
    { name: "surface/background-secondary", value: { light: "#f4f4f5", dark: "#18181b" }, alias: { light: "Primitive/zinc/100", dark: "Primitive/zinc/900" }, description: "Secondary page background container", scopes: ["FRAME_FILL"] },
    { name: "surface/background-tertiary", value: { light: "#e4e4e7", dark: "#27272a" }, alias: { light: "Primitive/zinc/200", dark: "Primitive/zinc/800" }, description: "Muted tertiary section background", scopes: ["FRAME_FILL"] },
    { name: "surface/card", value: { light: "#ffffff", dark: "#09090b" }, alias: { light: "Primitive/slate/50", dark: "Primitive/zinc/950" }, description: "Card component background surface", scopes: ["FRAME_FILL"] },
    { name: "surface/card-hover", value: { light: "#f4f4f5", dark: "#18181b" }, alias: { light: "Primitive/zinc/100", dark: "Primitive/zinc/900" }, description: "Card surface on hover state", scopes: ["FRAME_FILL"] },
    { name: "surface/card-active", value: { light: "#e4e4e7", dark: "#27272a" }, alias: { light: "Primitive/zinc/200", dark: "Primitive/zinc/800" }, description: "Card surface on active press state", scopes: ["FRAME_FILL"] },
    { name: "surface/panel", value: { light: "#ffffff", dark: "#09090b" }, alias: { light: "Primitive/slate/50", dark: "Primitive/zinc/950" }, description: "Panel container background", scopes: ["FRAME_FILL"] },
    { name: "surface/sidebar", value: { light: "#f8fafc", dark: "#09090b" }, alias: { light: "Primitive/slate/50", dark: "Primitive/zinc/950" }, description: "Sidebar navigation panel background", scopes: ["FRAME_FILL"] },
    { name: "surface/modal", value: { light: "#ffffff", dark: "#09090b" }, alias: { light: "Primitive/slate/50", dark: "Primitive/zinc/950" }, description: "Modal dialog background surface", scopes: ["FRAME_FILL"] },
    { name: "surface/popover", value: { light: "#ffffff", dark: "#09090b" }, alias: { light: "Primitive/slate/50", dark: "Primitive/zinc/950" }, description: "Popover and dropdown background surface", scopes: ["FRAME_FILL"] },
    { name: "surface/inset", value: { light: "#f4f4f5", dark: "#18181b" }, alias: { light: "Primitive/zinc/100", dark: "Primitive/zinc/900" }, description: "Recessed inset surface background", scopes: ["FRAME_FILL"] }
  ];
  var SEMANTIC_CONTENT_TOKENS = [
    { name: "content/primary", value: { light: "#09090b", dark: "#f8fafc" }, alias: { light: "Primitive/zinc/950", dark: "Primitive/slate/50" }, description: "Primary high-contrast text and icon content", scopes: ["TEXT_FILL"] },
    { name: "content/secondary", value: { light: "#71717a", dark: "#a1a1aa" }, alias: { light: "Primitive/zinc/500", dark: "Primitive/zinc/400" }, description: "Secondary body and label text", scopes: ["TEXT_FILL"] },
    { name: "content/tertiary", value: { light: "#a1a1aa", dark: "#71717a" }, alias: { light: "Primitive/zinc/400", dark: "Primitive/zinc/500" }, description: "Muted tertiary help text", scopes: ["TEXT_FILL"] },
    { name: "content/placeholder", value: { light: "#a1a1aa", dark: "#71717a" }, alias: { light: "Primitive/zinc/400", dark: "Primitive/zinc/500" }, description: "Form input placeholder text", scopes: ["TEXT_FILL"] },
    { name: "content/inverse", value: { light: "#ffffff", dark: "#09090b" }, alias: { light: "Primitive/slate/50", dark: "Primitive/zinc/950" }, description: "Inverse text content over dark/brand fills", scopes: ["TEXT_FILL"] },
    { name: "content/link", value: { light: "#2563eb", dark: "#60a5fa" }, alias: { light: "Primitive/blue/600", dark: "Primitive/blue/400" }, description: "Hyperlink text content", scopes: ["TEXT_FILL"] },
    { name: "content/link-hover", value: { light: "#1d4ed8", dark: "#93c5fd" }, alias: { light: "Primitive/blue/700", dark: "Primitive/blue/300" }, description: "Hyperlink text on hover state", scopes: ["TEXT_FILL"] },
    { name: "content/disabled", value: { light: "#a1a1aa", dark: "#52525b" }, alias: { light: "Primitive/zinc/400", dark: "Primitive/zinc/600" }, description: "Non-interactive disabled text content", scopes: ["TEXT_FILL"] }
  ];
  var SEMANTIC_BORDER_TOKENS = [
    { name: "border/default", value: { light: "#e4e4e7", dark: "#27272a" }, alias: { light: "Primitive/zinc/200", dark: "Primitive/zinc/800" }, description: "Default container and card border", scopes: ["STROKE_COLOR"] },
    { name: "border/subtle", value: { light: "#f4f4f5", dark: "#18181b" }, alias: { light: "Primitive/zinc/100", dark: "Primitive/zinc/900" }, description: "Subtle divider border line", scopes: ["STROKE_COLOR"] },
    { name: "border/strong", value: { light: "#a1a1aa", dark: "#52525b" }, alias: { light: "Primitive/zinc/400", dark: "Primitive/zinc/600" }, description: "High-contrast emphasis border", scopes: ["STROKE_COLOR"] },
    { name: "border/focus", value: { light: "#18181b", dark: "#f4f4f5" }, alias: { light: "Primitive/zinc/900", dark: "Primitive/zinc/100" }, description: "Focused control ring border", scopes: ["STROKE_COLOR"] },
    { name: "border/error", value: { light: "#ef4444", dark: "#7f1d1d" }, alias: { light: "Primitive/red/500", dark: "Primitive/red/900" }, description: "Error state border", scopes: ["STROKE_COLOR"] },
    { name: "border/success", value: { light: "#22c55e", dark: "#14532d" }, alias: { light: "Primitive/green/500", dark: "Primitive/green/900" }, description: "Success state border", scopes: ["STROKE_COLOR"] },
    { name: "border/warning", value: { light: "#f59e0b", dark: "#78350f" }, alias: { light: "Primitive/amber/500", dark: "Primitive/amber/900" }, description: "Warning state border", scopes: ["STROKE_COLOR"] }
  ];
  var SEMANTIC_BRAND_TOKENS = [
    { name: "brand/primary", value: { light: "#18181b", dark: "#fafafa" }, alias: { light: "Primitive/zinc/900", dark: "Primitive/zinc/50" }, description: "Primary brand accent color", scopes: ["FRAME_FILL"] },
    { name: "brand/secondary", value: { light: "#27272a", dark: "#e4e4e7" }, alias: { light: "Primitive/zinc/800", dark: "Primitive/zinc/200" }, description: "Secondary brand accent color", scopes: ["FRAME_FILL"] },
    { name: "brand/accent", value: { light: "#f4f4f5", dark: "#27272a" }, alias: { light: "Primitive/zinc/100", dark: "Primitive/zinc/800" }, description: "Light brand background accent tint", scopes: ["FRAME_FILL"] },
    { name: "brand/on-primary", value: { light: "#ffffff", dark: "#09090b" }, alias: { light: "Primitive/slate/50", dark: "Primitive/zinc/950" }, description: "Content placed on top of primary brand fill", scopes: ["TEXT_FILL"] },
    { name: "brand/on-secondary", value: { light: "#ffffff", dark: "#09090b" }, alias: { light: "Primitive/slate/50", dark: "Primitive/zinc/950" }, description: "Content placed on top of secondary brand fill", scopes: ["TEXT_FILL"] }
  ];
  var SEMANTIC_INTERACTIVE_TOKENS = [
    { name: "interactive/default", value: { light: "#18181b", dark: "#fafafa" }, alias: { light: "Primitive/zinc/900", dark: "Primitive/zinc/50" }, description: "Default state interactive control surface", scopes: ["FRAME_FILL"] },
    { name: "interactive/hover", value: { light: "#27272a", dark: "#e4e4e7" }, alias: { light: "Primitive/zinc/800", dark: "Primitive/zinc/200" }, description: "Hover state interactive control surface", scopes: ["FRAME_FILL"] },
    { name: "interactive/pressed", value: { light: "#3f3f46", dark: "#d4d4d8" }, alias: { light: "Primitive/zinc/700", dark: "Primitive/zinc/300" }, description: "Active press state interactive control surface", scopes: ["FRAME_FILL"] },
    { name: "interactive/selected", value: { light: "#f4f4f5", dark: "#27272a" }, alias: { light: "Primitive/zinc/100", dark: "Primitive/zinc/800" }, description: "Selected state interactive list item", scopes: ["FRAME_FILL"] },
    { name: "interactive/active", value: { light: "#e4e4e7", dark: "#3f3f46" }, alias: { light: "Primitive/zinc/200", dark: "Primitive/zinc/700" }, description: "Active tab or toggled button surface", scopes: ["FRAME_FILL"] }
  ];
  var SEMANTIC_STATUS_TOKENS = [
    { name: "status/success", value: { light: "#22c55e", dark: "#15803d" }, alias: { light: "Primitive/green/500", dark: "Primitive/green/700" }, description: "Positive success status indicator fill", scopes: ["FRAME_FILL"] },
    { name: "status/warning", value: { light: "#f59e0b", dark: "#b45309" }, alias: { light: "Primitive/amber/500", dark: "Primitive/amber/700" }, description: "Warning status indicator fill", scopes: ["FRAME_FILL"] },
    { name: "status/error", value: { light: "#ef4444", dark: "#b91c1c" }, alias: { light: "Primitive/red/500", dark: "Primitive/red/700" }, description: "Critical error status indicator fill", scopes: ["FRAME_FILL"] },
    { name: "status/info", value: { light: "#3b82f6", dark: "#1d4ed8" }, alias: { light: "Primitive/blue/500", dark: "Primitive/blue/700" }, description: "Informational status indicator fill", scopes: ["FRAME_FILL"] },
    { name: "status/on-success", value: { light: "#ffffff", dark: "#ffffff" }, alias: { light: "Primitive/slate/50", dark: "Primitive/slate/50" }, description: "Content placed over success fill", scopes: ["TEXT_FILL"] },
    { name: "status/on-warning", value: { light: "#ffffff", dark: "#ffffff" }, alias: { light: "Primitive/slate/50", dark: "Primitive/slate/50" }, description: "Content placed over warning fill", scopes: ["TEXT_FILL"] },
    { name: "status/on-error", value: { light: "#ffffff", dark: "#ffffff" }, alias: { light: "Primitive/slate/50", dark: "Primitive/slate/50" }, description: "Content placed over error fill", scopes: ["TEXT_FILL"] },
    { name: "status/on-info", value: { light: "#ffffff", dark: "#ffffff" }, alias: { light: "Primitive/slate/50", dark: "Primitive/slate/50" }, description: "Content placed over info fill", scopes: ["TEXT_FILL"] }
  ];
  var SEMANTIC_FOCUS_TOKENS = [
    { name: "focus/ring", value: { light: "#18181b", dark: "#d4d4d8" }, alias: { light: "Primitive/zinc/900", dark: "Primitive/zinc/300" }, description: "Focus ring halo outline color", scopes: ["STROKE_COLOR"] },
    { name: "focus/outline", value: { light: "#2563eb", dark: "#60a5fa" }, alias: { light: "Primitive/blue/600", dark: "Primitive/blue/400" }, description: "High contrast keyboard focus outline", scopes: ["STROKE_COLOR"] },
    { name: "focus/offset", value: { light: "#ffffff", dark: "#09090b" }, alias: { light: "Primitive/slate/50", dark: "Primitive/zinc/950" }, description: "Focus ring offset background spacing gap", scopes: ["STROKE_COLOR"] }
  ];
  var SEMANTIC_OVERLAY_TOKENS = [
    { name: "overlay/default", value: { light: "#000000", dark: "#000000" }, alias: { light: "Primitive/stone/950", dark: "Primitive/stone/950" }, description: "Standard backdrop scrim overlay", scopes: ["FRAME_FILL"] },
    { name: "overlay/light", value: { light: "#ffffff", dark: "#ffffff" }, alias: { light: "Primitive/slate/50", dark: "Primitive/slate/50" }, description: "Light tinted backdrop overlay", scopes: ["FRAME_FILL"] },
    { name: "overlay/dark", value: { light: "#09090b", dark: "#09090b" }, alias: { light: "Primitive/zinc/950", dark: "Primitive/zinc/950" }, description: "Dark translucent backdrop scrim", scopes: ["FRAME_FILL"] },
    { name: "overlay/scrim", value: { light: "#000000", dark: "#000000" }, alias: { light: "Primitive/stone/950", dark: "Primitive/stone/950" }, description: "Modal barrier scrim backdrop tint", scopes: ["FRAME_FILL"] }
  ];
  var SEMANTIC_SELECTION_TOKENS = [
    { name: "selection/background", value: { light: "#e4e4e7", dark: "#27272a" }, alias: { light: "Primitive/zinc/200", dark: "Primitive/zinc/800" }, description: "Text highlight selection background", scopes: ["FRAME_FILL"] },
    { name: "selection/content", value: { light: "#09090b", dark: "#fafafa" }, alias: { light: "Primitive/zinc/950", dark: "Primitive/zinc/50" }, description: "Text highlight selection text color", scopes: ["TEXT_FILL"] },
    { name: "selection/border", value: { light: "#18181b", dark: "#d4d4d8" }, alias: { light: "Primitive/zinc/900", dark: "Primitive/zinc/300" }, description: "Active selection bounding box outline", scopes: ["STROKE_COLOR"] }
  ];
  var SEMANTIC_DISABLED_TOKENS = [
    { name: "disabled/background", value: { light: "#f4f4f5", dark: "#18181b" }, alias: { light: "Primitive/zinc/100", dark: "Primitive/zinc/900" }, description: "Disabled control background surface", scopes: ["FRAME_FILL"] },
    { name: "disabled/content", value: { light: "#a1a1aa", dark: "#52525b" }, alias: { light: "Primitive/zinc/400", dark: "Primitive/zinc/600" }, description: "Disabled label and icon content color", scopes: ["TEXT_FILL"] },
    { name: "disabled/border", value: { light: "#e4e4e7", dark: "#27272a" }, alias: { light: "Primitive/zinc/200", dark: "Primitive/zinc/800" }, description: "Disabled control container border", scopes: ["STROKE_COLOR"] },
    { name: "disabled/opacity", value: { light: "#a1a1aa", dark: "#52525b" }, alias: { light: "Primitive/zinc/400", dark: "Primitive/zinc/600" }, description: "Disabled state visual opacity layer", scopes: ["FRAME_FILL"] }
  ];
  var SEMANTIC_ELEVATION_TOKENS = [
    { name: "elevation/level-0", value: { light: "#ffffff", dark: "#09090b" }, alias: { light: "Primitive/slate/50", dark: "Primitive/zinc/950" }, description: "Flat base surface elevation level 0", scopes: ["FRAME_FILL"] },
    { name: "elevation/level-1", value: { light: "#ffffff", dark: "#18181b" }, alias: { light: "Primitive/slate/50", dark: "Primitive/zinc/900" }, description: "Raised card surface elevation level 1", scopes: ["FRAME_FILL"] },
    { name: "elevation/level-2", value: { light: "#ffffff", dark: "#27272a" }, alias: { light: "Primitive/slate/50", dark: "Primitive/zinc/800" }, description: "Floating popover elevation level 2", scopes: ["FRAME_FILL"] },
    { name: "elevation/level-3", value: { light: "#ffffff", dark: "#3f3f46" }, alias: { light: "Primitive/slate/50", dark: "Primitive/zinc/700" }, description: "Modal dialog elevation level 3", scopes: ["FRAME_FILL"] },
    { name: "elevation/level-4", value: { light: "#ffffff", dark: "#52525b" }, alias: { light: "Primitive/slate/50", dark: "Primitive/zinc/600" }, description: "Topmost banner notification elevation level 4", scopes: ["FRAME_FILL"] }
  ];
  var SEMANTIC_INVERSE_TOKENS = [
    { name: "inverse/background", value: { light: "#09090b", dark: "#ffffff" }, alias: { light: "Primitive/zinc/950", dark: "Primitive/slate/50" }, description: "Inverse dark/light surface background", scopes: ["FRAME_FILL"] },
    { name: "inverse/content", value: { light: "#f8fafc", dark: "#09090b" }, alias: { light: "Primitive/slate/50", dark: "Primitive/zinc/950" }, description: "Inverse text content over inverse surface", scopes: ["TEXT_FILL"] },
    { name: "inverse/border", value: { light: "#27272a", dark: "#e4e4e7" }, alias: { light: "Primitive/zinc/800", dark: "Primitive/zinc/200" }, description: "Inverse container border stroke", scopes: ["STROKE_COLOR"] }
  ];
  var ALL_SEMANTIC_TOKENS = [
    ...SEMANTIC_SURFACE_TOKENS,
    ...SEMANTIC_CONTENT_TOKENS,
    ...SEMANTIC_BORDER_TOKENS,
    ...SEMANTIC_BRAND_TOKENS,
    ...SEMANTIC_INTERACTIVE_TOKENS,
    ...SEMANTIC_STATUS_TOKENS,
    ...SEMANTIC_FOCUS_TOKENS,
    ...SEMANTIC_OVERLAY_TOKENS,
    ...SEMANTIC_SELECTION_TOKENS,
    ...SEMANTIC_DISABLED_TOKENS,
    ...SEMANTIC_ELEVATION_TOKENS,
    ...SEMANTIC_INVERSE_TOKENS
  ];

  // src/generators/semantic.ts
  async function generateSemanticCollection(variableMap, brandConfig) {
    const result = {
      generatorName: COLLECTIONS.SEMANTIC,
      stats: { created: 0, updated: 0, skipped: 0 }
    };
    LoggerService.step(`Generating "${COLLECTIONS.SEMANTIC}" Collection`);
    const collection = await CollectionService.getOrCreateCollection(COLLECTIONS.SEMANTIC);
    const modeMap = ModeService.ensureModes(collection, [MODES.LIGHT, MODES.DARK]);
    for (const token of ALL_SEMANTIC_TOKENS) {
      const valuesByMode = {
        [MODES.LIGHT]: hexToRGB(token.value.light),
        [MODES.DARK]: hexToRGB(token.value.dark)
      };
      let lightAlias = token.alias?.light ?? "";
      let darkAlias = token.alias?.dark ?? "";
      if (brandConfig) {
        const isNeutralAvailable = Boolean(brandConfig.neutral);
        const isDestructiveAvailable = Boolean(brandConfig.destructive || brandConfig.error);
        const isWarningAvailable = Boolean(brandConfig.warning);
        const isSuccessAvailable = Boolean(brandConfig.success);
        const isInfoAvailable = Boolean(brandConfig.info);
        if (token.name === "brand/primary" && brandConfig.primary) {
          lightAlias = `${GROUPS.BRAND}/primary/600`;
          darkAlias = `${GROUPS.BRAND}/primary/400`;
        } else if (token.name === "brand/secondary" && brandConfig.secondary) {
          lightAlias = `${GROUPS.BRAND}/secondary/600`;
          darkAlias = `${GROUPS.BRAND}/secondary/400`;
        } else if (token.name === "brand/accent" && (brandConfig.accent || brandConfig.secondary)) {
          const accKey = brandConfig.accent ? "accent" : "secondary";
          lightAlias = `${GROUPS.BRAND}/${accKey}/500`;
          darkAlias = `${GROUPS.BRAND}/${accKey}/400`;
        } else if (token.name === "brand/on-primary" && isNeutralAvailable) {
          lightAlias = `${GROUPS.BRAND}/neutral/50`;
          darkAlias = `${GROUPS.BRAND}/neutral/950`;
        } else if (token.name === "brand/on-secondary" && isNeutralAvailable) {
          lightAlias = `${GROUPS.BRAND}/neutral/950`;
          darkAlias = `${GROUPS.BRAND}/neutral/50`;
        } else if (token.name === "interactive/default" && brandConfig.primary) {
          lightAlias = `${GROUPS.BRAND}/primary/600`;
          darkAlias = `${GROUPS.BRAND}/primary/400`;
        } else if (token.name === "interactive/hover" && brandConfig.primary) {
          lightAlias = `${GROUPS.BRAND}/primary/700`;
          darkAlias = `${GROUPS.BRAND}/primary/300`;
        } else if (token.name === "interactive/pressed" && brandConfig.primary) {
          lightAlias = `${GROUPS.BRAND}/primary/800`;
          darkAlias = `${GROUPS.BRAND}/primary/200`;
        } else if (token.name === "interactive/selected" && isNeutralAvailable) {
          lightAlias = `${GROUPS.BRAND}/neutral/100`;
          darkAlias = `${GROUPS.BRAND}/neutral/800`;
        } else if (token.name === "interactive/active" && isNeutralAvailable) {
          lightAlias = `${GROUPS.BRAND}/neutral/200`;
          darkAlias = `${GROUPS.BRAND}/neutral/700`;
        } else if (token.name === "status/error" && isDestructiveAvailable) {
          const destKey = brandConfig.destructive ? "destructive" : "error";
          lightAlias = `${GROUPS.BRAND}/${destKey}/600`;
          darkAlias = `${GROUPS.BRAND}/${destKey}/400`;
        } else if (token.name === "status/warning" && isWarningAvailable) {
          lightAlias = `${GROUPS.BRAND}/warning/600`;
          darkAlias = `${GROUPS.BRAND}/warning/400`;
        } else if (token.name === "status/success" && isSuccessAvailable) {
          lightAlias = `${GROUPS.BRAND}/success/600`;
          darkAlias = `${GROUPS.BRAND}/success/400`;
        } else if (token.name === "status/info" && isInfoAvailable) {
          lightAlias = `${GROUPS.BRAND}/info/600`;
          darkAlias = `${GROUPS.BRAND}/info/400`;
        } else if (token.name === "status/on-error" && isDestructiveAvailable) {
          const destKey = brandConfig.destructive ? "destructive" : "error";
          lightAlias = `${GROUPS.BRAND}/${destKey}/50`;
          darkAlias = `${GROUPS.BRAND}/${destKey}/50`;
        } else if (token.name === "status/on-warning" && isWarningAvailable) {
          lightAlias = `${GROUPS.BRAND}/warning/50`;
          darkAlias = `${GROUPS.BRAND}/warning/50`;
        } else if (token.name === "status/on-success" && isSuccessAvailable) {
          lightAlias = `${GROUPS.BRAND}/success/50`;
          darkAlias = `${GROUPS.BRAND}/success/50`;
        } else if (token.name === "status/on-info" && isInfoAvailable) {
          lightAlias = `${GROUPS.BRAND}/info/50`;
          darkAlias = `${GROUPS.BRAND}/info/50`;
        } else if (token.name === "content/link" && brandConfig.primary) {
          lightAlias = `${GROUPS.BRAND}/primary/600`;
          darkAlias = `${GROUPS.BRAND}/primary/400`;
        } else if (token.name === "content/link-hover" && brandConfig.primary) {
          lightAlias = `${GROUPS.BRAND}/primary/700`;
          darkAlias = `${GROUPS.BRAND}/primary/300`;
        } else if (token.name === "border/focus" && brandConfig.primary) {
          lightAlias = `${GROUPS.BRAND}/primary/600`;
          darkAlias = `${GROUPS.BRAND}/primary/400`;
        } else if (token.name === "border/error" && isDestructiveAvailable) {
          const destKey = brandConfig.destructive ? "destructive" : "error";
          lightAlias = `${GROUPS.BRAND}/${destKey}/500`;
          darkAlias = `${GROUPS.BRAND}/${destKey}/900`;
        } else if (token.name === "border/success" && isSuccessAvailable) {
          lightAlias = `${GROUPS.BRAND}/success/500`;
          darkAlias = `${GROUPS.BRAND}/success/900`;
        } else if (token.name === "border/warning" && isWarningAvailable) {
          lightAlias = `${GROUPS.BRAND}/warning/500`;
          darkAlias = `${GROUPS.BRAND}/warning/900`;
        } else if (token.name === "focus/ring" && brandConfig.primary) {
          lightAlias = `${GROUPS.BRAND}/primary/600`;
          darkAlias = `${GROUPS.BRAND}/primary/400`;
        } else if (token.name === "focus/outline" && brandConfig.primary) {
          lightAlias = `${GROUPS.BRAND}/primary/600`;
          darkAlias = `${GROUPS.BRAND}/primary/400`;
        } else if (token.name === "selection/border" && brandConfig.primary) {
          lightAlias = `${GROUPS.BRAND}/primary/600`;
          darkAlias = `${GROUPS.BRAND}/primary/400`;
        } else if (isNeutralAvailable) {
          if (token.name.startsWith("surface/")) {
            lightAlias = `${GROUPS.BRAND}/neutral/50`;
            darkAlias = `${GROUPS.BRAND}/neutral/950`;
          } else if (token.name.startsWith("border/")) {
            lightAlias = `${GROUPS.BRAND}/neutral/200`;
            darkAlias = `${GROUPS.BRAND}/neutral/800`;
          } else if (token.name.startsWith("content/primary") || token.name.startsWith("content/inverse") || token.name.startsWith("selection/content")) {
            lightAlias = token.name.includes("inverse") ? `${GROUPS.BRAND}/neutral/50` : `${GROUPS.BRAND}/neutral/950`;
            darkAlias = token.name.includes("inverse") ? `${GROUPS.BRAND}/neutral/950` : `${GROUPS.BRAND}/neutral/50`;
          } else if (token.name.startsWith("content/secondary")) {
            lightAlias = `${GROUPS.BRAND}/neutral/500`;
            darkAlias = `${GROUPS.BRAND}/neutral/400`;
          } else if (token.name.startsWith("content/tertiary") || token.name.startsWith("content/placeholder") || token.name.startsWith("content/disabled")) {
            lightAlias = `${GROUPS.BRAND}/neutral/400`;
            darkAlias = `${GROUPS.BRAND}/neutral/500`;
          } else if (token.name.startsWith("focus/offset")) {
            lightAlias = `${GROUPS.BRAND}/neutral/50`;
            darkAlias = `${GROUPS.BRAND}/neutral/950`;
          } else if (token.name.startsWith("selection/background")) {
            lightAlias = `${GROUPS.BRAND}/neutral/200`;
            darkAlias = `${GROUPS.BRAND}/neutral/800`;
          } else if (token.name.startsWith("disabled/background")) {
            lightAlias = `${GROUPS.BRAND}/neutral/100`;
            darkAlias = `${GROUPS.BRAND}/neutral/900`;
          } else if (token.name.startsWith("disabled/content") || token.name.startsWith("disabled/opacity")) {
            lightAlias = `${GROUPS.BRAND}/neutral/400`;
            darkAlias = `${GROUPS.BRAND}/neutral/600`;
          } else if (token.name.startsWith("disabled/border")) {
            lightAlias = `${GROUPS.BRAND}/neutral/200`;
            darkAlias = `${GROUPS.BRAND}/neutral/800`;
          } else if (token.name.startsWith("elevation/")) {
            lightAlias = `${GROUPS.BRAND}/neutral/50`;
            darkAlias = `${GROUPS.BRAND}/neutral/900`;
          } else if (token.name.startsWith("inverse/background")) {
            lightAlias = `${GROUPS.BRAND}/neutral/950`;
            darkAlias = `${GROUPS.BRAND}/neutral/50`;
          } else if (token.name.startsWith("inverse/content")) {
            lightAlias = `${GROUPS.BRAND}/neutral/50`;
            darkAlias = `${GROUPS.BRAND}/neutral/950`;
          } else if (token.name.startsWith("inverse/border")) {
            lightAlias = `${GROUPS.BRAND}/neutral/800`;
            darkAlias = `${GROUPS.BRAND}/neutral/200`;
          }
        }
      }
      const aliasesByMode = {};
      if (lightAlias) aliasesByMode[MODES.LIGHT] = lightAlias;
      if (darkAlias) aliasesByMode[MODES.DARK] = darkAlias;
      VariableService.createOrUpdateColorVariable(
        collection,
        token.name,
        modeMap,
        valuesByMode,
        variableMap,
        token.description,
        result.stats,
        aliasesByMode,
        token.scopes
      );
    }
    LoggerService.success(
      `Completed "${COLLECTIONS.SEMANTIC}" Collection generation. Created: ${result.stats.created}, Updated: ${result.stats.updated}.`
    );
    return result;
  }

  // src/data/spacing.ts
  var FOUNDATION_SPACING_SCALE = [
    { name: "spacing/0", value: 0, description: "0px / 0rem - Zero spacing" },
    { name: "spacing/px", value: 1, description: "1px - Single pixel border/spacing" },
    { name: "spacing/0.5", value: 2, description: "2px / 0.125rem - Micro gap" },
    { name: "spacing/1", value: 4, description: "4px / 0.25rem - Extra small spacing" },
    { name: "spacing/1.5", value: 6, description: "6px / 0.375rem - Small badge padding" },
    { name: "spacing/2", value: 8, description: "8px / 0.5rem - Small component gap" },
    { name: "spacing/2.5", value: 10, description: "10px / 0.625rem - Compact element spacing" },
    { name: "spacing/3", value: 12, description: "12px / 0.75rem - Medium component padding" },
    { name: "spacing/3.5", value: 14, description: "14px / 0.875rem - Standard input padding" },
    { name: "spacing/4", value: 16, description: "16px / 1rem - Standard grid & component padding" },
    { name: "spacing/5", value: 20, description: "20px / 1.25rem - Medium section gap" },
    { name: "spacing/6", value: 24, description: "24px / 1.5rem - Card padding & content margin" },
    { name: "spacing/7", value: 28, description: "28px / 1.75rem - Medium container padding" },
    { name: "spacing/8", value: 32, description: "32px / 2rem - Large section margin" },
    { name: "spacing/9", value: 36, description: "36px / 2.25rem - Display gap" },
    { name: "spacing/10", value: 40, description: "40px / 2.5rem - Control height / large gap" },
    { name: "spacing/11", value: 44, description: "44px / 2.75rem - Minimum touch target size" },
    { name: "spacing/12", value: 48, description: "48px / 3rem - Extra large section gap" },
    { name: "spacing/14", value: 56, description: "56px / 3.5rem - Header bar height / layout gap" },
    { name: "spacing/16", value: 64, description: "64px / 4rem - Page section layout gap" },
    { name: "spacing/20", value: 80, description: "80px / 5rem - Hero container spacing" },
    { name: "spacing/24", value: 96, description: "96px / 6rem - Display banner padding" },
    { name: "spacing/28", value: 112, description: "112px / 7rem - Large display container" },
    { name: "spacing/32", value: 128, description: "128px / 8rem - Hero section margin" },
    { name: "spacing/36", value: 144, description: "144px / 9rem - Display section margin" },
    { name: "spacing/40", value: 160, description: "160px / 10rem - Page layout container" },
    { name: "spacing/44", value: 176, description: "176px / 11rem - Large page layout" },
    { name: "spacing/48", value: 192, description: "192px / 12rem - Section break margin" },
    { name: "spacing/52", value: 208, description: "208px / 13rem - Extra large page layout" },
    { name: "spacing/56", value: 224, description: "224px / 14rem - Giant section break" },
    { name: "spacing/60", value: 240, description: "240px / 15rem - Hero display gap" },
    { name: "spacing/64", value: 256, description: "256px / 16rem - Maximum section margin" },
    { name: "spacing/72", value: 288, description: "288px / 18rem - Sidebar drawer width" },
    { name: "spacing/80", value: 320, description: "320px / 20rem - Compact modal width" },
    { name: "spacing/96", value: 384, description: "384px / 24rem - Standard modal width" }
  ];
  var CONTAINER_TOKENS = [
    { name: "container/xs", fallbackValue: 320, aliasTarget: "spacing/80", description: "320px - Extra small container max-width", scopes: ["WIDTH_HEIGHT"] },
    { name: "container/sm", fallbackValue: 384, aliasTarget: "spacing/96", description: "384px - Small container max-width", scopes: ["WIDTH_HEIGHT"] },
    { name: "container/md", fallbackValue: 448, aliasTarget: "spacing/28", description: "448px - Medium container max-width", scopes: ["WIDTH_HEIGHT"] },
    { name: "container/lg", fallbackValue: 512, aliasTarget: "spacing/32", description: "512px - Large container max-width", scopes: ["WIDTH_HEIGHT"] },
    { name: "container/xl", fallbackValue: 576, aliasTarget: "spacing/36", description: "576px - Extra large container max-width", scopes: ["WIDTH_HEIGHT"] },
    { name: "container/2xl", fallbackValue: 672, aliasTarget: "spacing/40", description: "672px - 2XL container max-width", scopes: ["WIDTH_HEIGHT"] }
  ];
  var GAP_TOKENS = [
    { name: "gap/xs", fallbackValue: 4, aliasTarget: "spacing/1", description: "4px - Micro element item gap", scopes: ["GAP", "WIDTH_HEIGHT"] },
    { name: "gap/sm", fallbackValue: 8, aliasTarget: "spacing/2", description: "8px - Small control item gap", scopes: ["GAP", "WIDTH_HEIGHT"] },
    { name: "gap/md", fallbackValue: 16, aliasTarget: "spacing/4", description: "16px - Standard grid & flex item gap", scopes: ["GAP", "WIDTH_HEIGHT"] },
    { name: "gap/lg", fallbackValue: 24, aliasTarget: "spacing/6", description: "24px - Large section item gap", scopes: ["GAP", "WIDTH_HEIGHT"] },
    { name: "gap/xl", fallbackValue: 32, aliasTarget: "spacing/8", description: "32px - Extra large card grid gap", scopes: ["GAP", "WIDTH_HEIGHT"] },
    { name: "gap/2xl", fallbackValue: 48, aliasTarget: "spacing/12", description: "48px - Hero section grid gap", scopes: ["GAP", "WIDTH_HEIGHT"] }
  ];
  var INSET_TOKENS = [
    { name: "inset/xs", fallbackValue: 4, aliasTarget: "spacing/1", description: "4px - Micro container padding inset" },
    { name: "inset/sm", fallbackValue: 8, aliasTarget: "spacing/2", description: "8px - Compact container padding inset" },
    { name: "inset/md", fallbackValue: 16, aliasTarget: "spacing/4", description: "16px - Standard component padding inset" },
    { name: "inset/lg", fallbackValue: 24, aliasTarget: "spacing/6", description: "24px - Card & modal padding inset" },
    { name: "inset/xl", fallbackValue: 32, aliasTarget: "spacing/8", description: "32px - Large section padding inset" }
  ];
  var LAYOUT_TOKENS = [
    { name: "layout/page", fallbackValue: 32, aliasTarget: "spacing/8", description: "32px - Page outer gutter margin" },
    { name: "layout/section", fallbackValue: 64, aliasTarget: "spacing/16", description: "64px - Major section layout gap" },
    { name: "layout/content", fallbackValue: 24, aliasTarget: "spacing/6", description: "24px - Content block layout padding" },
    { name: "layout/card", fallbackValue: 16, aliasTarget: "spacing/4", description: "16px - Card container padding" },
    { name: "layout/sidebar", fallbackValue: 16, aliasTarget: "spacing/4", description: "16px - Sidebar panel padding" },
    { name: "layout/modal", fallbackValue: 24, aliasTarget: "spacing/6", description: "24px - Modal dialog body padding" }
  ];

  // src/generators/spacing.ts
  async function generateSpacingCollection(variableMap) {
    const result = {
      generatorName: COLLECTIONS.SPACING,
      stats: { created: 0, updated: 0, skipped: 0 }
    };
    LoggerService.step(`Generating "${COLLECTIONS.SPACING}" Collection`);
    const collection = await CollectionService.getOrCreateCollection(COLLECTIONS.SPACING);
    const modeMap = ModeService.ensureModes(collection, [MODES.LIGHT]);
    const modeId = modeMap[MODES.LIGHT] || collection.defaultModeId;
    for (const token of FOUNDATION_SPACING_SCALE) {
      const scopes = token.scopes ?? ["GAP", "WIDTH_HEIGHT"];
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        scopes
      );
    }
    for (const token of CONTAINER_TOKENS) {
      const scopes = token.scopes ?? ["WIDTH_HEIGHT"];
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.fallbackValue,
        variableMap,
        token.description,
        result.stats,
        scopes,
        token.aliasTarget
      );
    }
    for (const token of GAP_TOKENS) {
      const scopes = token.scopes ?? ["GAP", "WIDTH_HEIGHT"];
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.fallbackValue,
        variableMap,
        token.description,
        result.stats,
        scopes,
        token.aliasTarget
      );
    }
    for (const token of INSET_TOKENS) {
      const scopes = token.scopes ?? ["GAP", "WIDTH_HEIGHT"];
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.fallbackValue,
        variableMap,
        token.description,
        result.stats,
        scopes,
        token.aliasTarget
      );
    }
    for (const token of LAYOUT_TOKENS) {
      const scopes = token.scopes ?? ["GAP", "WIDTH_HEIGHT"];
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.fallbackValue,
        variableMap,
        token.description,
        result.stats,
        scopes,
        token.aliasTarget
      );
    }
    LoggerService.success(
      `Completed "${COLLECTIONS.SPACING}" Collection generation. Created: ${result.stats.created}, Updated: ${result.stats.updated}.`
    );
    return result;
  }

  // src/data/typography.ts
  var FONT_FAMILY_TOKENS = [
    { name: "font-family/sans", value: "Inter", description: "Default sans-serif font family for UI" },
    { name: "font-family/serif", value: "Georgia", description: "Serif font family for editorial typography" },
    { name: "font-family/mono", value: "JetBrains Mono", description: "Monospace font family for code snippets" }
  ];
  var FONT_SIZE_TOKENS = [
    { name: "font-size/xs", value: 12, description: "12px / 0.75rem - Micro text & badges" },
    { name: "font-size/sm", value: 14, description: "14px / 0.875rem - Form labels & compact body" },
    { name: "font-size/base", value: 16, description: "16px / 1rem - Default body text" },
    { name: "font-size/lg", value: 18, description: "18px / 1.125rem - Large body & section leads" },
    { name: "font-size/xl", value: 20, description: "20px / 1.25rem - Card titles & H6" },
    { name: "font-size/2xl", value: 24, description: "24px / 1.5rem - H5 headings" },
    { name: "font-size/3xl", value: 30, description: "30px / 1.875rem - H4 headings" },
    { name: "font-size/4xl", value: 36, description: "36px / 2.25rem - H3 headings" },
    { name: "font-size/5xl", value: 48, description: "48px / 3rem - H2 headings" },
    { name: "font-size/6xl", value: 60, description: "60px / 3.75rem - H1 display headings" },
    { name: "font-size/7xl", value: 72, description: "72px / 4.5rem - Hero display text" },
    { name: "font-size/8xl", value: 96, description: "96px / 6rem - Large display banners" },
    { name: "font-size/9xl", value: 128, description: "128px / 8rem - Ultra display headline" }
  ];
  var FONT_WEIGHT_TOKENS = [
    { name: "font-weight/thin", value: 100, description: "Font weight 100" },
    { name: "font-weight/extra-light", value: 200, description: "Font weight 200" },
    { name: "font-weight/light", value: 300, description: "Font weight 300" },
    { name: "font-weight/normal", value: 400, description: "Font weight 400 (Regular)" },
    { name: "font-weight/medium", value: 500, description: "Font weight 500" },
    { name: "font-weight/semi-bold", value: 600, description: "Font weight 600" },
    { name: "font-weight/bold", value: 700, description: "Font weight 700" },
    { name: "font-weight/extra-bold", value: 800, description: "Font weight 800" },
    { name: "font-weight/black", value: 900, description: "Font weight 900" }
  ];
  var LINE_HEIGHT_TOKENS = [
    { name: "line-height/none", value: 1, description: "Line height 1.0" },
    { name: "line-height/tight", value: 1.25, description: "Line height 1.25 - Headings" },
    { name: "line-height/snug", value: 1.375, description: "Line height 1.375" },
    { name: "line-height/normal", value: 1.5, description: "Line height 1.5 - Default body" },
    { name: "line-height/relaxed", value: 1.625, description: "Line height 1.625" },
    { name: "line-height/loose", value: 2, description: "Line height 2.0" }
  ];
  var LETTER_SPACING_TOKENS = [
    { name: "letter-spacing/tighter", value: -0.05, description: "Letter spacing -0.05em" },
    { name: "letter-spacing/tight", value: -0.025, description: "Letter spacing -0.025em" },
    { name: "letter-spacing/normal", value: 0, description: "Default letter spacing" },
    { name: "letter-spacing/wide", value: 0.025, description: "Letter spacing 0.025em" },
    { name: "letter-spacing/wider", value: 0.05, description: "Letter spacing 0.05em" },
    { name: "letter-spacing/widest", value: 0.1, description: "Letter spacing 0.1em" }
  ];
  var PARAGRAPH_SPACING_TOKENS = [
    { name: "paragraph-spacing/none", value: 0, description: "No paragraph spacing" },
    { name: "paragraph-spacing/xs", value: 4, description: "4px paragraph spacing" },
    { name: "paragraph-spacing/sm", value: 8, description: "8px paragraph spacing" },
    { name: "paragraph-spacing/md", value: 12, description: "12px paragraph spacing" },
    { name: "paragraph-spacing/lg", value: 16, description: "16px paragraph spacing" },
    { name: "paragraph-spacing/xl", value: 24, description: "24px paragraph spacing" }
  ];
  var TEXT_CASE_TOKENS = [
    { name: "text-case/none", value: "ORIGINAL", description: "Normal text case" },
    { name: "text-case/uppercase", value: "UPPER", description: "UPPERCASE text" },
    { name: "text-case/lowercase", value: "LOWER", description: "lowercase text" },
    { name: "text-case/capitalize", value: "TITLE", description: "Capitalize Words" }
  ];
  var TEXT_DECORATION_TOKENS = [
    { name: "text-decoration/none", value: "NONE", description: "No text decoration" },
    { name: "text-decoration/underline", value: "UNDERLINE", description: "Underline text" },
    { name: "text-decoration/line-through", value: "STRIKETHROUGH", description: "Strikethrough text" }
  ];
  var FIGMA_TEXT_STYLES = [
    { name: "Display XL", fontFamily: "Inter", fontSize: 72, fontWeightName: "Bold", fontWeightValue: 700, lineHeightPx: 90, letterSpacingPx: -1.8, description: "Hero display headline style" },
    { name: "Display LG", fontFamily: "Inter", fontSize: 60, fontWeightName: "Bold", fontWeightValue: 700, lineHeightPx: 75, letterSpacingPx: -1.2, description: "Large section display headline" },
    { name: "Heading 1", fontFamily: "Inter", fontSize: 48, fontWeightName: "Bold", fontWeightValue: 700, lineHeightPx: 60, letterSpacingPx: -0.96, description: "Page Title (H1)" },
    { name: "Heading 2", fontFamily: "Inter", fontSize: 36, fontWeightName: "SemiBold", fontWeightValue: 600, lineHeightPx: 45, letterSpacingPx: -0.72, description: "Section Title (H2)" },
    { name: "Heading 3", fontFamily: "Inter", fontSize: 30, fontWeightName: "SemiBold", fontWeightValue: 600, lineHeightPx: 38, letterSpacingPx: -0.6, description: "Subsection Header (H3)" },
    { name: "Heading 4", fontFamily: "Inter", fontSize: 24, fontWeightName: "SemiBold", fontWeightValue: 600, lineHeightPx: 32, letterSpacingPx: -0.48, description: "Card Header (H4)" },
    { name: "Heading 5", fontFamily: "Inter", fontSize: 20, fontWeightName: "Medium", fontWeightValue: 500, lineHeightPx: 28, letterSpacingPx: -0.2, description: "Group Header (H5)" },
    { name: "Heading 6", fontFamily: "Inter", fontSize: 18, fontWeightName: "Medium", fontWeightValue: 500, lineHeightPx: 26, letterSpacingPx: 0, description: "Small Subheader (H6)" },
    { name: "Body Large", fontFamily: "Inter", fontSize: 18, fontWeightName: "Regular", fontWeightValue: 400, lineHeightPx: 28, letterSpacingPx: 0, description: "Lead paragraph body text" },
    { name: "Body Medium", fontFamily: "Inter", fontSize: 16, fontWeightName: "Regular", fontWeightValue: 400, lineHeightPx: 24, letterSpacingPx: 0, description: "Standard body text" },
    { name: "Body Small", fontFamily: "Inter", fontSize: 14, fontWeightName: "Regular", fontWeightValue: 400, lineHeightPx: 20, letterSpacingPx: 0, description: "Secondary body text" },
    { name: "Label Large", fontFamily: "Inter", fontSize: 16, fontWeightName: "Medium", fontWeightValue: 500, lineHeightPx: 24, letterSpacingPx: 0, description: "Primary interactive button/form label" },
    { name: "Label Medium", fontFamily: "Inter", fontSize: 14, fontWeightName: "Medium", fontWeightValue: 500, lineHeightPx: 20, letterSpacingPx: 0, description: "Standard form input label" },
    { name: "Label Small", fontFamily: "Inter", fontSize: 12, fontWeightName: "Medium", fontWeightValue: 500, lineHeightPx: 16, letterSpacingPx: 0, description: "Badge and tag label" },
    { name: "Caption", fontFamily: "Inter", fontSize: 12, fontWeightName: "Regular", fontWeightValue: 400, lineHeightPx: 16, letterSpacingPx: 0, description: "Helper caption & timestamp text" },
    { name: "Overline", fontFamily: "Inter", fontSize: 12, fontWeightName: "Bold", fontWeightValue: 700, lineHeightPx: 16, letterSpacingPx: 1.2, textCase: "UPPER", description: "Uppercase category tracking overline" }
  ];

  // src/services/font.service.ts
  var FontDiscoveryService = class {
    /**
     * Fetches available fonts from Figma environment via listAvailableFontsAsync(),
     * grouped by font family.
     */
    static async getAvailableFonts() {
      try {
        if (typeof figma?.listAvailableFontsAsync !== "function") {
          return [{ family: "Inter", styles: ["Regular", "Medium", "SemiBold", "Bold"] }];
        }
        const fonts = await figma.listAvailableFontsAsync();
        const map = /* @__PURE__ */ new Map();
        fonts.forEach((f) => {
          const family = f.fontName.family;
          const style = f.fontName.style;
          if (!map.has(family)) map.set(family, /* @__PURE__ */ new Set());
          map.get(family).add(style);
        });
        const result = Array.from(map.entries()).map(([family, stylesSet]) => ({
          family,
          styles: Array.from(stylesSet)
        }));
        result.sort((a, b) => a.family.localeCompare(b.family));
        return result;
      } catch (_e) {
        return [{ family: "Inter", styles: ["Regular", "Medium", "SemiBold", "Bold"] }];
      }
    }
    /**
     * Resolves a valid font style/weight for a given family.
     * If requested style (e.g. 'SemiBold') is unavailable, picks closest fallback style.
     */
    static resolveStyleFallback(availableStyles, preferredStyle) {
      if (availableStyles.includes(preferredStyle)) {
        return { resolvedStyle: preferredStyle, isFallback: false };
      }
      const fallbackChain = {
        "SemiBold": ["Bold", "Medium", "Regular"],
        "Bold": ["SemiBold", "Medium", "Regular"],
        "Medium": ["Regular", "SemiBold", "Bold"],
        "Regular": ["Medium", "Book", "Normal"]
      };
      const chain = fallbackChain[preferredStyle] || ["Regular", "Medium", "Bold"];
      for (const candidate of chain) {
        if (availableStyles.includes(candidate)) {
          return { resolvedStyle: candidate, isFallback: true };
        }
      }
      return { resolvedStyle: availableStyles[0] || "Regular", isFallback: true };
    }
  };

  // src/services/text-style.service.ts
  var TextStyleService = class {
    /**
     * Fetches local text styles and creates or updates a native Figma TextStyle idempotently.
     */
    static async createOrUpdateTextStyle(def) {
      try {
        const textStyles = await figma.getLocalTextStylesAsync();
        let style = textStyles.find((s) => s.name === def.name);
        let effectiveFontName = {
          family: def.fontFamily,
          style: def.fontWeightName
        };
        try {
          await figma.loadFontAsync(effectiveFontName);
        } catch {
          try {
            const regFont = { family: def.fontFamily, style: "Regular" };
            await figma.loadFontAsync(regFont);
            effectiveFontName = regFont;
          } catch {
            const interFont = { family: "Inter", style: "Regular" };
            await figma.loadFontAsync(interFont);
            effectiveFontName = interFont;
          }
        }
        if (!style) {
          style = figma.createTextStyle();
          style.name = def.name;
          StatsService.trackStyleCreated();
          LoggerService.info(`Created new TextStyle: "${def.name}" (${effectiveFontName.family} ${effectiveFontName.style})`);
        } else {
          StatsService.trackStyleUpdated();
        }
        if (def.description) {
          style.description = def.description;
        }
        style.fontName = effectiveFontName;
        style.fontSize = def.fontSize;
        style.lineHeight = { value: def.lineHeightPx, unit: "PIXELS" };
        style.letterSpacing = { value: def.letterSpacingPx, unit: "PIXELS" };
        if (def.paragraphSpacingPx !== void 0) {
          style.paragraphSpacing = def.paragraphSpacingPx;
        }
        if (def.textCase !== void 0) {
          style.textCase = def.textCase;
        }
        if (def.textDecoration !== void 0) {
          style.textDecoration = def.textDecoration;
        }
        return style;
      } catch (err) {
        LoggerService.error(`Failed to create/update TextStyle "${def.name}"`, err);
        throw err;
      }
    }
  };

  // src/generators/typography.ts
  async function generateTypographyCollection(variableMap, customFontFamily, availableStylesForFamily) {
    const result = {
      generatorName: COLLECTIONS.TYPOGRAPHY,
      stats: { created: 0, updated: 0, skipped: 0 }
    };
    const selectedFamily = customFontFamily || "Inter";
    LoggerService.step(`Generating "${COLLECTIONS.TYPOGRAPHY}" Collection & Text Styles (Font: ${selectedFamily})`);
    const collection = await CollectionService.getOrCreateCollection(COLLECTIONS.TYPOGRAPHY);
    const modeMap = ModeService.ensureModes(collection, [MODES.LIGHT]);
    const modeId = modeMap[MODES.LIGHT] || collection.defaultModeId;
    const fontFamilyTokens = FONT_FAMILY_TOKENS.map(
      (t2) => t2.name === "font-family/sans" ? { ...t2, value: selectedFamily } : t2
    );
    for (const token of fontFamilyTokens) {
      VariableService.createOrUpdateStringVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of FONT_SIZE_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of FONT_WEIGHT_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of LINE_HEIGHT_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of LETTER_SPACING_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of PARAGRAPH_SPACING_TOKENS) {
      VariableService.createOrUpdateFloatVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of TEXT_CASE_TOKENS) {
      VariableService.createOrUpdateStringVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    for (const token of TEXT_DECORATION_TOKENS) {
      VariableService.createOrUpdateStringVariable(
        collection,
        token.name,
        modeId,
        token.value,
        variableMap,
        token.description,
        result.stats,
        token.scopes
      );
    }
    LoggerService.step(`Generating Native Figma Text Styles with Family "${selectedFamily}"`);
    const stylesList = availableStylesForFamily || ["Regular", "Medium", "SemiBold", "Bold"];
    for (const baseDef of FIGMA_TEXT_STYLES) {
      const { resolvedStyle } = FontDiscoveryService.resolveStyleFallback(stylesList, baseDef.fontWeightName);
      const def = {
        ...baseDef,
        fontFamily: selectedFamily,
        fontWeightName: resolvedStyle
      };
      await TextStyleService.createOrUpdateTextStyle(def);
    }
    LoggerService.success(
      `Completed "${COLLECTIONS.TYPOGRAPHY}" Collection generation. Created: ${result.stats.created}, Updated: ${result.stats.updated}.`
    );
    return result;
  }

  // src/services/benchmark.service.ts
  var BenchmarkService = class {
    static {
      this.records = [];
    }
    static {
      this.startTime = 0;
    }
    static startOverall() {
      this.records = [];
      this.startTime = Date.now();
    }
    static async measure(name, fn) {
      const start = Date.now();
      try {
        return await fn();
      } finally {
        const durationMs = Date.now() - start;
        this.records.push({ name, durationMs });
        LoggerService.debug(`Benchmark "${name}": ${durationMs} ms`);
      }
    }
    static getReport() {
      const totalDuration = Date.now() - this.startTime;
      const lines = [
        "==================================================",
        "\u{1F4CA} Execution Benchmark Report",
        "=================================================="
      ];
      for (const record of this.records) {
        lines.push(`${record.name.padEnd(25)} : ${record.durationMs} ms`);
      }
      lines.push("--------------------------------------------------");
      lines.push(`Total Execution Time      : ${totalDuration} ms`);
      lines.push("==================================================");
      return lines.join("\n");
    }
    static printReport() {
      console.log(this.getReport());
    }
  };

  // src/services/error-handler.service.ts
  var ErrorHandlerService = class {
    static {
      this.errors = [];
    }
    static reset() {
      this.errors = [];
    }
    static handleRecoverableError(context, message, error) {
      const err = { context, message, error, isFatal: false };
      this.errors.push(err);
      LoggerService.warn(`[Recoverable Error in ${context}] ${message}`);
    }
    static handleFatalError(context, message, error) {
      const err = { context, message, error, isFatal: true };
      this.errors.push(err);
      LoggerService.error(`[Fatal Error in ${context}] ${message}`, error);
    }
    static async executeWithRecovery(generatorName, fn, fallbackValue) {
      try {
        return await fn();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.handleRecoverableError(generatorName, `Generator failed: ${msg}`, err);
        LoggerService.warn(`Skipped failed generator "${generatorName}" cleanly. Continuing system pipeline.`);
        return fallbackValue;
      }
    }
    static hasErrors() {
      return this.errors.length > 0;
    }
    static getErrorReport() {
      if (this.errors.length === 0) {
        return "\u2705 No system errors occurred during execution.";
      }
      const lines = [
        "==================================================",
        "\u26A0\uFE0F Error Diagnostic Report",
        "=================================================="
      ];
      for (const err of this.errors) {
        const typeStr = err.isFatal ? "FATAL" : "RECOVERABLE";
        lines.push(`[${typeStr}] Location: ${err.context} | Message: ${err.message}`);
      }
      lines.push("==================================================");
      return lines.join("\n");
    }
    static printReport() {
      if (this.hasErrors()) {
        console.warn(this.getErrorReport());
      }
    }
  };

  // src/services/export.service.ts
  var ExportService = class {
    /**
     * Exports all variables formatted as CSS Custom Properties (:root & .dark).
     */
    static exportCssVariables(variableMap) {
      const rootVars = [];
      const darkVars = [];
      variableMap.forEach((v) => {
        const cleanName = v.name.replace(/\//g, "-").toLowerCase();
        if (v.resolvedType === "COLOR") {
          rootVars.push(`  --${cleanName}: #18181b;`);
          darkVars.push(`  --${cleanName}: #fafafa;`);
        } else if (v.resolvedType === "FLOAT") {
          rootVars.push(`  --${cleanName}: ${v.name.includes("radius") || v.name.includes("spacing") ? "16px" : "1"};`);
        }
      });
      return [
        ":root {",
        ...rootVars.sort(),
        "}",
        "",
        ".dark {",
        ...darkVars.sort(),
        "}"
      ].join("\n");
    }
    /**
     * Exports variables formatted as a Tailwind CSS theme extension object.
     */
    static exportTailwindConfig(variableMap) {
      const colors3 = {};
      const borderRadius = {};
      const spacing = {};
      variableMap.forEach((v) => {
        const cleanName = v.name.replace(/\//g, "-").toLowerCase();
        if (v.resolvedType === "COLOR") {
          colors3[cleanName] = `var(--${cleanName})`;
        } else if (v.name.startsWith("radius")) {
          borderRadius[cleanName] = `var(--${cleanName})`;
        } else if (v.name.startsWith("spacing")) {
          spacing[cleanName] = `var(--${cleanName})`;
        }
      });
      return JSON.stringify(
        {
          theme: {
            extend: {
              colors: colors3,
              borderRadius,
              spacing
            }
          }
        },
        null,
        2
      );
    }
    /**
     * Exports variables formatted to the W3C Design Tokens JSON Format.
     */
    static exportW3CTokens(variableMap) {
      const w3cTree = {};
      variableMap.forEach((v) => {
        const parts = v.name.split("/");
        let current = w3cTree;
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (i === parts.length - 1) {
            current[part] = {
              $type: v.resolvedType === "COLOR" ? "color" : v.resolvedType === "FLOAT" ? "dimension" : "string",
              $value: v.resolvedType === "COLOR" ? "#18181b" : "16px",
              $description: v.description || ""
            };
          } else {
            if (!current[part]) current[part] = {};
            current = current[part];
          }
        }
      });
      return JSON.stringify(w3cTree, null, 2);
    }
  };

  // src/services/foundation-state.service.ts
  var REQUIRED_COLLECTIONS = ["Colors", "Radius", "Spacing", "Typography", "Semantic"];
  var COLOR_COLLECTION = "Colors";
  var FoundationStateService = class {
    /**
     * Inspects the current Figma document and returns a FoundationState
     * describing which parts of the Design System already exist.
     */
    static async detectState(variableMap) {
      const allVars = Array.from(variableMap.values());
      let presentCollections = [];
      try {
        if (typeof figma.variables?.getLocalVariableCollectionsAsync === "function") {
          const cols = await figma.variables.getLocalVariableCollectionsAsync();
          presentCollections = cols.map((c) => c.name);
        }
      } catch (_e) {
        presentCollections = [];
      }
      let hasTypography = false;
      try {
        if (typeof figma.getLocalTextStylesAsync === "function") {
          const styles = await figma.getLocalTextStylesAsync();
          hasTypography = styles.length > 0;
        }
      } catch (_e) {
        hasTypography = false;
      }
      const hasPrimitive = allVars.some((v) => v.name.startsWith("Primitive/"));
      const hasBrand = allVars.some((v) => v.name.startsWith("Brand/"));
      const hasTheme = allVars.some((v) => v.name.startsWith("Theme/"));
      const hasSemantic = allVars.some((v) => v.name.startsWith("Semantic/"));
      const hasSpacing = allVars.some((v) => v.name.startsWith("Spacing/") || v.name.startsWith("spacing/"));
      const hasRadius = allVars.some((v) => v.name.startsWith("Radius/") || v.name.startsWith("radius-"));
      const hasEffects = allVars.some((v) => v.name.startsWith("Effects/") || v.name.startsWith("shadow-") || v.name.startsWith("blur-") || v.name.startsWith("opacity-"));
      const hasMotion = allVars.some((v) => v.name.startsWith("Motion/") || v.name.startsWith("duration-") || v.name.startsWith("ease-"));
      const hasLayers = allVars.some((v) => v.name.startsWith("Layers/") || v.name.startsWith("z-"));
      const hasIcons = allVars.some((v) => v.name.startsWith("Icon/") || v.name.startsWith("icon-"));
      const colorVariableCount = allVars.filter(
        (v) => v.name.startsWith("Primitive/") || v.name.startsWith("Brand/") || v.name.startsWith("Theme/") || v.name.startsWith("Semantic/") || v.name.startsWith("Sidebar/") || v.name.startsWith("Chart/")
      ).length;
      const hasColorsCollection = presentCollections.includes(COLOR_COLLECTION);
      const hasRequiredCollections = REQUIRED_COLLECTIONS.every((c) => presentCollections.includes(c));
      let status;
      if (allVars.length === 0 && !hasTypography) {
        status = "NO_FOUNDATION";
      } else if (hasColorsCollection && !hasSpacing && !hasRadius && !hasTypography) {
        status = "COLORS_ONLY";
      } else if (hasRequiredCollections && hasTypography) {
        status = "FOUNDATION_EXISTS";
      } else {
        status = "PARTIAL";
      }
      const state = {
        status,
        presentCollections,
        totalVariables: allVars.length,
        hasPrimitive,
        hasBrand,
        hasTheme,
        hasSemantic,
        hasSpacing,
        hasRadius,
        hasTypography,
        hasEffects,
        hasMotion,
        hasLayers,
        hasIcons,
        colorVariableCount
      };
      LoggerService.info(`Foundation State: ${status} | ${allVars.length} variables | Collections: [${presentCollections.join(", ")}]`);
      return state;
    }
    /**
     * Inspects existing variables belonging strictly to the requested color scope.
     */
    static inspectScopeVariables(variableMap, colorScope) {
      const allVars = Array.from(variableMap.values());
      const affectedScopes = [];
      let count = 0;
      if (colorScope.primitive) {
        const prim = allVars.filter((v) => v.name.startsWith("Primitive/"));
        count += prim.length;
        if (prim.length > 0) affectedScopes.push("Primitive");
      }
      if (colorScope.brand) {
        const brand = allVars.filter((v) => v.name.startsWith("Brand/"));
        count += brand.length;
        if (brand.length > 0) affectedScopes.push("Brand");
      }
      if (colorScope.theme) {
        const theme = allVars.filter((v) => v.name.startsWith("Theme/"));
        count += theme.length;
        if (theme.length > 0) affectedScopes.push("Theme");
      }
      if (colorScope.semantic) {
        const sem = allVars.filter((v) => v.name.startsWith("Semantic/"));
        count += sem.length;
        if (sem.length > 0) affectedScopes.push("Semantic");
      }
      if (colorScope.sidebar) {
        const sb = allVars.filter((v) => v.name.startsWith("Sidebar/"));
        count += sb.length;
        if (sb.length > 0) affectedScopes.push("Sidebar");
      }
      if (colorScope.chart) {
        const ch = allVars.filter((v) => v.name.startsWith("Chart/"));
        count += ch.length;
        if (ch.length > 0) affectedScopes.push("Chart");
      }
      return {
        existingCount: count,
        affectedScopes,
        affectedCollections: count > 0 ? ["Colors"] : [],
        variablesToReplace: count
      };
    }
    /**
     * Inspects existing Spacing & Radius layout variables.
     */
    static inspectLayoutVariables(variableMap, layoutScope) {
      const allVars = Array.from(variableMap.values());
      const affectedScopes = [];
      let count = 0;
      if (layoutScope.spacing) {
        const spacing = allVars.filter((v) => v.name.startsWith("Spacing/") || v.name.startsWith("spacing/"));
        count += spacing.length;
        if (spacing.length > 0) affectedScopes.push("Spacing");
      }
      if (layoutScope.radius) {
        const radius = allVars.filter((v) => v.name.startsWith("Radius/") || v.name.startsWith("radius-") || v.name.startsWith("radius/"));
        count += radius.length;
        if (radius.length > 0) affectedScopes.push("Radius");
      }
      return {
        existingCount: count,
        affectedScopes,
        affectedCollections: count > 0 ? Array.from(new Set(affectedScopes)) : [],
        variablesToReplace: count
      };
    }
    /**
     * Inspects existing Effects & Motion visual variables and effect styles.
     */
    static async inspectVisualVariables(variableMap, visualScope) {
      const allVars = Array.from(variableMap.values());
      const affectedScopes = [];
      let count = 0;
      if (visualScope.effects) {
        const fxVars = allVars.filter((v) => v.name.startsWith("Effects/") || v.name.startsWith("shadow-"));
        let fxStylesCount = 0;
        try {
          if (typeof figma.getLocalEffectStylesAsync === "function") {
            const styles = await figma.getLocalEffectStylesAsync();
            fxStylesCount = styles.length;
          }
        } catch (_e) {
          fxStylesCount = 0;
        }
        const totalFx = fxVars.length + fxStylesCount;
        count += totalFx;
        if (totalFx > 0) affectedScopes.push("Effects / Shadows");
      }
      if (visualScope.motion) {
        const motionVars = allVars.filter((v) => v.name.startsWith("Motion/") || v.name.startsWith("duration-") || v.name.startsWith("ease-"));
        count += motionVars.length;
        if (motionVars.length > 0) affectedScopes.push("Motion");
      }
      return {
        existingCount: count,
        affectedScopes,
        affectedCollections: count > 0 ? Array.from(new Set(affectedScopes)) : [],
        variablesToReplace: count
      };
    }
    /**
     * Inspects existing Layers & Icon system variables.
     */
    static inspectSystemVariables(variableMap, systemScope) {
      const allVars = Array.from(variableMap.values());
      const affectedScopes = [];
      let count = 0;
      if (systemScope.layers) {
        const layerVars = allVars.filter((v) => v.name.startsWith("Layers/") || v.name.startsWith("z-") || v.name.startsWith("z-index/"));
        count += layerVars.length;
        if (layerVars.length > 0) affectedScopes.push("Layers / Z-Index");
      }
      if (systemScope.icons) {
        const iconVars = allVars.filter((v) => v.name.startsWith("Icon/") || v.name.startsWith("icon-") || v.name.startsWith("icon/"));
        count += iconVars.length;
        if (iconVars.length > 0) affectedScopes.push("Icons");
      }
      return {
        existingCount: count,
        affectedScopes,
        affectedCollections: count > 0 ? Array.from(new Set(affectedScopes)) : [],
        variablesToReplace: count
      };
    }
    /**
     * Returns a compact summary object suitable for postMessage to the UI.
     */
    static toUIPayload(state) {
      return {
        status: state.status,
        totalVariables: state.totalVariables,
        colorVariableCount: state.colorVariableCount,
        collections: state.presentCollections.length,
        hasPrimitive: state.hasPrimitive,
        hasBrand: state.hasBrand,
        hasTheme: state.hasTheme,
        hasSemantic: state.hasSemantic,
        hasSpacing: state.hasSpacing,
        hasRadius: state.hasRadius,
        hasTypography: state.hasTypography,
        hasEffects: state.hasEffects,
        hasMotion: state.hasMotion,
        hasLayers: state.hasLayers,
        hasIcons: state.hasIcons
      };
    }
  };

  // src/services/reset.service.ts
  var FOUNDATION_COLLECTION_NAMES = [
    "Colors",
    "Spacing",
    "Radius",
    "Effects",
    "Motion",
    "Layers",
    "Icon",
    "Typography",
    "Semantic"
  ];
  var DOCUMENTATION_FRAME_NAMES = [
    "01 \u2014 Overview",
    "02 \u2014 Colors",
    "03 \u2014 Typography",
    "04 \u2014 Layout",
    "05 \u2014 Visual",
    "06 \u2014 System",
    "Design System Generator \u2014 Overview",
    "Design System Generator \u2014 Colors",
    "Design System Generator \u2014 Typography",
    "Design System Generator \u2014 Layout",
    "Design System Generator \u2014 Visual",
    "Design System Generator \u2014 System"
  ];
  var ResetService = class {
    /**
     * Resets and deletes all plugin-generated foundation collections, variables,
     * text styles, and documentation canvas frames.
     */
    static async resetFoundation() {
      let collectionsDeleted = 0;
      let variablesDeleted = 0;
      let stylesDeleted = 0;
      let framesDeleted = 0;
      LoggerService.info("[ResetService] Initiating foundation reset cleanup\u2026");
      try {
        if (typeof figma.variables?.getLocalVariableCollectionsAsync === "function") {
          const collections = await figma.variables.getLocalVariableCollectionsAsync();
          for (const col of [...collections]) {
            let isPluginCol = false;
            try {
              if (col.getPluginData("generator") === "shadcn-foundation") {
                isPluginCol = true;
              }
            } catch (_e) {
            }
            if (!isPluginCol && FOUNDATION_COLLECTION_NAMES.includes(col.name)) {
              isPluginCol = true;
            }
            if (isPluginCol) {
              variablesDeleted += col.variableIds ? col.variableIds.length : 0;
              col.remove();
              collectionsDeleted++;
              LoggerService.info(`[ResetService] Deleted collection: "${col.name}"`);
            }
          }
        }
      } catch (err) {
        LoggerService.error("[ResetService] Failed during variable collection reset", err);
      }
      try {
        if (typeof figma.getLocalTextStylesAsync === "function") {
          const styles = await figma.getLocalTextStylesAsync();
          for (const style of [...styles]) {
            let isPluginStyle = false;
            try {
              if (style.getPluginData("generator") === "shadcn-foundation") {
                isPluginStyle = true;
              }
            } catch (_e) {
            }
            if (!isPluginStyle && (style.name.startsWith("Display") || style.name.startsWith("Heading") || style.name.startsWith("Body") || style.name.startsWith("Label") || style.name === "Caption" || style.name === "Overline")) {
              isPluginStyle = true;
            }
            if (isPluginStyle) {
              style.remove();
              stylesDeleted++;
              LoggerService.info(`[ResetService] Deleted text style: "${style.name}"`);
            }
          }
        }
      } catch (err) {
        LoggerService.error("[ResetService] Failed during text style reset", err);
      }
      try {
        const page = figma.currentPage;
        if (page && page.children) {
          const framesToRemove = page.children.filter((node) => {
            if (node.type !== "FRAME") return false;
            return DOCUMENTATION_FRAME_NAMES.includes(node.name) || node.name.startsWith("0");
          });
          for (const frame of framesToRemove) {
            frame.remove();
            framesDeleted++;
            LoggerService.info(`[ResetService] Deleted canvas frame: "${frame.name}"`);
          }
        }
      } catch (err) {
        LoggerService.error("[ResetService] Failed during canvas frames reset", err);
      }
      LoggerService.info(`[ResetService] Reset complete. Deleted: ${collectionsDeleted} cols, ${variablesDeleted} vars, ${stylesDeleted} styles, ${framesDeleted} frames.`);
      return {
        collectionsDeleted,
        variablesDeleted,
        stylesDeleted,
        framesDeleted
      };
    }
  };

  // src/services/inspector.service.ts
  var FOUNDATION_COLLECTION_NAMES2 = [
    "Colors",
    "Spacing",
    "Radius",
    "Effects",
    "Motion",
    "Layers",
    "Icon",
    "Typography",
    "Semantic"
  ];
  var FoundationInspectorService = class {
    /**
     * Evaluates variable ownership strictly from metadata (Part 8, 9, 10).
     * METADATA -> OWNERSHIP
     * NO OWNERSHIP METADATA -> UNKNOWN
     */
    static getOwnershipState(v, col) {
      try {
        const varGenTag = v.getPluginData("generator");
        if (varGenTag === "shadcn-foundation") {
          return "plugin";
        }
        if (varGenTag && varGenTag !== "shadcn-foundation") {
          return "external";
        }
        const varSourceTag = v.getPluginData("source");
        if (varSourceTag === "external") {
          return "external";
        }
        if (col) {
          const colGenTag = col.getPluginData("generator");
          if (colGenTag === "shadcn-foundation") {
            return "plugin";
          }
          if (colGenTag && colGenTag !== "shadcn-foundation") {
            return "external";
          }
        }
      } catch (_e) {
      }
      return "unknown";
    }
    /**
     * Classifies category based strictly on naming convention (Part 6).
     * PREFIX -> CATEGORY
     */
    static getFoundationCategory(name) {
      if (name.startsWith("Primitive/") || name.startsWith("Brand/") || name.startsWith("Theme/") || name.startsWith("Semantic/") || name.startsWith("Sidebar/") || name.startsWith("Chart/")) {
        return "colors";
      }
      if (name.startsWith("Spacing/") || name.startsWith("spacing/") || name.startsWith("Radius/") || name.startsWith("radius-") || name.startsWith("radius/")) {
        return "layout";
      }
      if (name.startsWith("Effects/") || name.startsWith("shadow-") || name.startsWith("blur-") || name.startsWith("opacity-") || name.startsWith("Motion/") || name.startsWith("duration-") || name.startsWith("ease-")) {
        return "visual";
      }
      if (name.startsWith("Layers/") || name.startsWith("z-") || name.startsWith("Icon/") || name.startsWith("icon-")) {
        return "system";
      }
      return "other";
    }
    /**
     * Performs full read-only inspection of the current Figma document.
     */
    static async inspectDocument() {
      let collections = [];
      let variables = [];
      let textStyles = [];
      try {
        if (typeof figma.variables?.getLocalVariableCollectionsAsync === "function") {
          collections = await figma.variables.getLocalVariableCollectionsAsync();
        }
      } catch (_e) {
        collections = [];
      }
      try {
        if (typeof figma.variables?.getLocalVariablesAsync === "function") {
          variables = await figma.variables.getLocalVariablesAsync();
        }
      } catch (_e) {
        variables = [];
      }
      try {
        if (typeof figma.getLocalTextStylesAsync === "function") {
          textStyles = await figma.getLocalTextStylesAsync();
        }
      } catch (_e) {
        textStyles = [];
      }
      const varsByCollectionId = /* @__PURE__ */ new Map();
      for (const v of variables) {
        const list = varsByCollectionId.get(v.variableCollectionId) || [];
        list.push(v);
        varsByCollectionId.set(v.variableCollectionId, list);
      }
      let pluginGenCount = 0;
      let externalCount = 0;
      let unknownCount = 0;
      let pluginGenCols = 0;
      let externalCols = 0;
      let unknownCols = 0;
      let totalModes = 0;
      const foundationCollections = [];
      const otherCollections = [];
      for (const col of collections) {
        const colVars = varsByCollectionId.get(col.id) || [];
        totalModes += col.modes.length;
        let colPluginCount = 0;
        let colExternalCount = 0;
        let colUnknownCount = 0;
        const subGroupMap = /* @__PURE__ */ new Map();
        for (const v of colVars) {
          const ownership = this.getOwnershipState(v, col);
          const category = this.getFoundationCategory(v.name);
          if (ownership === "plugin") {
            pluginGenCount++;
            colPluginCount++;
          } else if (ownership === "external") {
            externalCount++;
            colExternalCount++;
          } else {
            unknownCount++;
            colUnknownCount++;
          }
          const parts = v.name.split("/");
          const subGroupName = parts.length > 1 ? parts[0] : "General";
          const itemDetail = {
            id: v.id,
            name: v.name,
            type: v.resolvedType,
            ownership,
            category,
            subGroup: subGroupName
          };
          const existingGroup = subGroupMap.get(subGroupName) || [];
          existingGroup.push(itemDetail);
          subGroupMap.set(subGroupName, existingGroup);
        }
        if (colPluginCount > 0) pluginGenCols++;
        if (colExternalCount > 0) externalCols++;
        if (colUnknownCount > 0 && colPluginCount === 0 && colExternalCount === 0) unknownCols++;
        let colOwnership = "unknown";
        if (colPluginCount > 0) colOwnership = "plugin";
        else if (colExternalCount > 0) colOwnership = "external";
        const subGroups = Array.from(subGroupMap.entries()).map(([name, vars]) => ({
          name,
          count: vars.length,
          variables: vars
        }));
        const isFoundation = FOUNDATION_COLLECTION_NAMES2.includes(col.name) || colPluginCount > 0 || colVars.some((v) => this.getFoundationCategory(v.name) !== "other");
        const colCategory = col.name === "Colors" ? "colors" : col.name === "Spacing" || col.name === "Radius" ? "layout" : col.name === "Effects" || col.name === "Motion" ? "visual" : col.name === "Layers" || col.name === "Icon" ? "system" : isFoundation ? "colors" : "other";
        const detail = {
          id: col.id,
          name: col.name,
          variableCount: colVars.length,
          modeCount: col.modes.length,
          modes: col.modes.map((m) => m.name),
          ownership: colOwnership,
          pluginVariablesCount: colPluginCount,
          externalVariablesCount: colExternalCount,
          unknownVariablesCount: colUnknownCount,
          category: colCategory,
          subGroups
        };
        if (isFoundation) {
          foundationCollections.push(detail);
        } else {
          otherCollections.push(detail);
        }
      }
      const colorVars = variables.filter((v) => this.getFoundationCategory(v.name) === "colors");
      let colorsStatus = "NOT_CONFIGURED";
      if (colorVars.length > 0) {
        colorsStatus = "CONFIGURED";
      }
      let typoStatus = "NOT_CONFIGURED";
      if (textStyles.length > 0) {
        typoStatus = "CONFIGURED";
      }
      const layoutVars = variables.filter((v) => this.getFoundationCategory(v.name) === "layout");
      let layoutStatus = "NOT_CONFIGURED";
      if (layoutVars.length > 0) {
        layoutStatus = "CONFIGURED";
      }
      const visualVars = variables.filter((v) => this.getFoundationCategory(v.name) === "visual");
      let visualStatus = "NOT_CONFIGURED";
      if (visualVars.length > 0) {
        visualStatus = "CONFIGURED";
      }
      const systemVars = variables.filter((v) => this.getFoundationCategory(v.name) === "system");
      let systemStatus = "NOT_CONFIGURED";
      if (systemVars.length > 0) {
        systemStatus = "CONFIGURED";
      }
      let lastGenRecorded = false;
      let lastGenData = null;
      try {
        const raw = await figma.clientStorage.getAsync("last-generation-session");
        if (raw) {
          lastGenData = typeof raw === "string" ? JSON.parse(raw) : raw;
          lastGenRecorded = true;
        }
      } catch (_e) {
        lastGenRecorded = false;
      }
      const connectedStatus = variables.length > 0 || collections.length > 0 || textStyles.length > 0 ? "CONNECTED" : "NO_FOUNDATION";
      return {
        connectedStatus,
        metrics: {
          totalCollections: collections.length,
          totalVariables: variables.length,
          totalModes,
          totalTextStyles: textStyles.length
        },
        ownership: {
          pluginGenerated: pluginGenCount,
          pluginGeneratedCollections: pluginGenCols,
          external: externalCount,
          externalCollections: externalCols,
          unknown: unknownCount,
          unknownCollections: unknownCols
        },
        coverage: {
          colors: {
            status: colorsStatus,
            count: colorVars.length,
            details: `${colorVars.length} color variables`
          },
          typography: {
            status: typoStatus,
            count: textStyles.length,
            details: `${textStyles.length} text styles`
          },
          layout: {
            status: layoutStatus,
            count: layoutVars.length,
            details: `${layoutVars.length} layout variables`
          },
          visual: {
            status: visualStatus,
            count: visualVars.length,
            details: `${visualVars.length} visual variables`
          },
          system: {
            status: systemStatus,
            count: systemVars.length,
            details: `${systemVars.length} system variables`
          }
        },
        foundationCollections,
        otherCollections,
        lastGeneration: {
          recorded: lastGenRecorded,
          mode: lastGenData?.mode || "Brand Colors",
          categories: lastGenData?.categories || "Colors",
          language: lastGenData?.language?.toUpperCase() || "EN",
          timestamp: lastGenData?.timestamp || (/* @__PURE__ */ new Date()).toLocaleString(),
          pluginVersion: "v1.0.0"
        }
      };
    }
  };

  // src/services/import.service.ts
  var ImportService = class {
    /**
     * Imports design tokens from JSON content into the local variable map.
     */
    static importJsonTokens(jsonContent, _variableMap) {
      try {
        const parsed = JSON.parse(jsonContent);
        let count = 0;
        const traverse = (obj) => {
          for (const key in obj) {
            const val = obj[key];
            if (val && typeof val === "object" && ("$value" in val || "value" in val)) {
              count++;
            } else if (val && typeof val === "object") {
              traverse(val);
            }
          }
        };
        if (typeof parsed === "object" && parsed !== null) {
          traverse(parsed);
        }
        return {
          parsedTokensCount: count,
          success: true,
          message: `Successfully parsed ${count} imported design tokens!`
        };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return {
          parsedTokensCount: 0,
          success: false,
          message: `JSON Import Error: ${errorMsg}`
        };
      }
    }
  };

  // src/services/notification.service.ts
  var NotificationService = class {
    static showSuccess(message, lang = "en") {
      const defaultMsg = lang === "id" ? "\u2728 Fondasi Sistem Desain Shadcn berhasil dibuat.\nDibuat oleh Ariyo Aziz (@ariyoaziz_)" : BRANDING.SUCCESS_NOTIFICATION;
      const text = message ?? defaultMsg;
      figma.notify(text, { timeout: 4e3 });
      LoggerService.success("Notification displayed to user.");
    }
    static showError(message) {
      figma.notify(`\u274C Error: ${message}`, { error: true, timeout: 6e3 });
      LoggerService.error(message);
    }
    static showInfo(message) {
      figma.notify(`\u2139\uFE0F ${message}`, { timeout: 3e3 });
    }
  };

  // src/services/replacement-review.service.ts
  function estimateColorTokenCount(scope) {
    let count = 0;
    if (scope.primitive) count += 242;
    if (scope.brand) count += 66;
    if (scope.theme) count += 19;
    if (scope.semantic) count += 5;
    if (scope.sidebar) count += 8;
    if (scope.chart) count += 5;
    return count;
  }
  var EFFECTS_TOKEN_COUNT = SHADOW_TOKENS.length + BLUR_TOKENS.length + OPACITY_TOKENS.length + BORDER_WIDTH_TOKENS.length + OUTLINE_TOKENS.length;
  var MOTION_TOKEN_COUNT = MOTION_DURATION_TOKENS.length + MOTION_DELAY_TOKENS.length + MOTION_EASING_TOKENS.length + MOTION_SCALE_TOKENS.length;
  var LAYERS_TOKEN_COUNT = LAYER_Z_INDEX_TOKENS.length + LAYER_COMPONENT_TOKENS.length;
  var ICONS_TOKEN_COUNT = ICON_SIZE_TOKENS.length + ICON_STROKE_TOKENS.length + ICON_GAP_TOKENS.length + ICON_RADIUS_TOKENS.length + ICON_OPACITY_TOKENS.length + ICON_ROTATION_TOKENS.length + ICON_ANIMATION_FLOAT_TOKENS.length + ICON_ANIMATION_STRING_TOKENS.length;
  var RADIUS_TOKEN_COUNT = RADIUS_TOKENS.length;
  var SPACING_TOKEN_COUNT = 56;
  var TYPOGRAPHY_STYLE_COUNT = 16;
  var ReplacementReviewService = class _ReplacementReviewService {
    /**
     * Inspects the current variable map against the requested generation scope
     * and returns a structured ReplacementReview for UI display and safety gating.
     *
     * This is the ONLY entry-point for pre-generation inspection.
     * All category CTAs must call this before executing any generator.
     */
    static async inspect(variableMap, scope) {
      const allVars = Array.from(variableMap.values());
      const categories = [];
      const colorActive = scope.colors.primitive || scope.colors.brand || scope.colors.theme || scope.colors.semantic || scope.colors.sidebar || scope.colors.chart;
      if (colorActive) {
        const colorReview = _ReplacementReviewService.inspectColors(allVars, scope.colors);
        categories.push(colorReview);
      }
      if (scope.typography) {
        const typoReview = await _ReplacementReviewService.inspectTypography();
        categories.push(typoReview);
      }
      if (scope.spacing || scope.radius) {
        const layoutReview = _ReplacementReviewService.inspectLayout(allVars, scope);
        categories.push(layoutReview);
      }
      if (scope.effects || scope.motion) {
        const visualReview = _ReplacementReviewService.inspectVisual(allVars, scope);
        categories.push(visualReview);
      }
      if (scope.layers || scope.icons) {
        const systemReview = _ReplacementReviewService.inspectSystem(allVars, scope);
        categories.push(systemReview);
      }
      const totalExisting = categories.reduce((s, c) => s + c.existingCount, 0);
      const totalEstimatedNew = categories.reduce((s, c) => s + c.estimatedNewCount, 0);
      const safetyStatus = "SAFE";
      return {
        categories,
        totalExisting,
        totalEstimatedNew,
        safetyStatus
      };
    }
    // ─── Per-category helpers (also exported for unit tests) ─────────────────
    static inspectColors(allVars, colorScope) {
      const affectedScopes = [];
      let existingCount = 0;
      let outsideScopeCount = 0;
      const COUNT_PRIM = allVars.filter((v) => v.name.startsWith("Primitive/")).length;
      const COUNT_BRAND = allVars.filter((v) => v.name.startsWith("Brand/")).length;
      const COUNT_THEME = allVars.filter((v) => v.name.startsWith("Theme/")).length;
      const COUNT_SEM = allVars.filter((v) => v.name.startsWith("Semantic/")).length;
      const COUNT_SIDEBAR = allVars.filter((v) => v.name.startsWith("Sidebar/")).length;
      const COUNT_CHART = allVars.filter((v) => v.name.startsWith("Chart/")).length;
      if (colorScope.primitive && COUNT_PRIM > 0) {
        existingCount += COUNT_PRIM;
        affectedScopes.push("Primitive");
      } else if (!colorScope.primitive) outsideScopeCount += COUNT_PRIM;
      if (colorScope.brand && COUNT_BRAND > 0) {
        existingCount += COUNT_BRAND;
        affectedScopes.push("Brand");
      } else if (!colorScope.brand) outsideScopeCount += COUNT_BRAND;
      if (colorScope.theme && COUNT_THEME > 0) {
        existingCount += COUNT_THEME;
        affectedScopes.push("Theme");
      } else if (!colorScope.theme) outsideScopeCount += COUNT_THEME;
      if (colorScope.semantic && COUNT_SEM > 0) {
        existingCount += COUNT_SEM;
        affectedScopes.push("Semantic");
      } else if (!colorScope.semantic) outsideScopeCount += COUNT_SEM;
      if (colorScope.sidebar && COUNT_SIDEBAR > 0) {
        existingCount += COUNT_SIDEBAR;
        affectedScopes.push("Sidebar");
      } else if (!colorScope.sidebar) outsideScopeCount += COUNT_SIDEBAR;
      if (colorScope.chart && COUNT_CHART > 0) {
        existingCount += COUNT_CHART;
        affectedScopes.push("Chart");
      } else if (!colorScope.chart) outsideScopeCount += COUNT_CHART;
      return {
        category: "Colors",
        existingCount,
        estimatedNewCount: estimateColorTokenCount(colorScope),
        outsideScopeCount,
        affectedCollections: existingCount > 0 ? ["Colors"] : [],
        affectedScopes
      };
    }
    static async inspectTypography() {
      let existingStyleCount = 0;
      try {
        if (typeof figma.getLocalTextStylesAsync === "function") {
          const styles = await figma.getLocalTextStylesAsync();
          existingStyleCount = styles.length;
        }
      } catch (_e) {
        existingStyleCount = 0;
      }
      return {
        category: "Typography",
        existingCount: existingStyleCount,
        estimatedNewCount: TYPOGRAPHY_STYLE_COUNT,
        outsideScopeCount: 0,
        // typography is all-or-nothing
        affectedCollections: existingStyleCount > 0 ? ["Typography (Text Styles)"] : [],
        affectedScopes: existingStyleCount > 0 ? ["Text Styles"] : []
      };
    }
    static inspectLayout(allVars, scope) {
      const affectedScopes = [];
      let existingCount = 0;
      let outsideScopeCount = 0;
      let estimated = 0;
      const affectedCollections = [];
      const spacingVars = allVars.filter((v) => v.name.startsWith("Spacing/") || v.name.startsWith("spacing/"));
      const radiusVars = allVars.filter((v) => v.name.startsWith("Radius/") || v.name.startsWith("radius-") || v.name.startsWith("radius/"));
      if (scope.spacing) {
        existingCount += spacingVars.length;
        estimated += SPACING_TOKEN_COUNT;
        if (spacingVars.length > 0) {
          affectedScopes.push("Spacing");
          affectedCollections.push("Spacing");
        }
      } else {
        outsideScopeCount += spacingVars.length;
      }
      if (scope.radius) {
        existingCount += radiusVars.length;
        estimated += RADIUS_TOKEN_COUNT;
        if (radiusVars.length > 0) {
          affectedScopes.push("Radius");
          affectedCollections.push("Radius");
        }
      } else {
        outsideScopeCount += radiusVars.length;
      }
      return {
        category: "Layout",
        existingCount,
        estimatedNewCount: estimated,
        outsideScopeCount,
        affectedCollections,
        affectedScopes
      };
    }
    static inspectVisual(allVars, scope) {
      const affectedScopes = [];
      let existingCount = 0;
      let outsideScopeCount = 0;
      let estimated = 0;
      const affectedCollections = [];
      const effectsVars = allVars.filter(
        (v) => v.name.startsWith("Effects/") || v.name.startsWith("shadow/") || v.name.startsWith("blur/") || v.name.startsWith("opacity/") || v.name.startsWith("border-width/") || v.name.startsWith("outline/")
      );
      const motionVars = allVars.filter(
        (v) => v.name.startsWith("Motion/") || v.name.startsWith("duration/") || v.name.startsWith("delay/") || v.name.startsWith("easing/") || v.name.startsWith("scale/")
      );
      if (scope.effects) {
        existingCount += effectsVars.length;
        estimated += EFFECTS_TOKEN_COUNT;
        if (effectsVars.length > 0) {
          affectedScopes.push("Effects");
          affectedCollections.push("Effects");
        }
      } else {
        outsideScopeCount += effectsVars.length;
      }
      if (scope.motion) {
        existingCount += motionVars.length;
        estimated += MOTION_TOKEN_COUNT;
        if (motionVars.length > 0) {
          affectedScopes.push("Motion");
          affectedCollections.push("Motion");
        }
      } else {
        outsideScopeCount += motionVars.length;
      }
      return {
        category: "Visual",
        existingCount,
        estimatedNewCount: estimated,
        outsideScopeCount,
        affectedCollections,
        affectedScopes
      };
    }
    static inspectSystem(allVars, scope) {
      const affectedScopes = [];
      let existingCount = 0;
      let outsideScopeCount = 0;
      let estimated = 0;
      const affectedCollections = [];
      const layerVars = allVars.filter(
        (v) => v.name.startsWith("Layers/") || v.name.startsWith("z-index/") || v.name.startsWith("overlay/") || v.name.startsWith("modal/") || v.name.startsWith("dropdown/") || v.name.startsWith("tooltip/") || v.name.startsWith("toast/")
      );
      const iconVars = allVars.filter(
        (v) => v.name.startsWith("Icon/") || v.name.startsWith("icon/")
      );
      if (scope.layers) {
        existingCount += layerVars.length;
        estimated += LAYERS_TOKEN_COUNT;
        if (layerVars.length > 0) {
          affectedScopes.push("Layers / Z-Index");
          affectedCollections.push("Layers");
        }
      } else {
        outsideScopeCount += layerVars.length;
      }
      if (scope.icons) {
        existingCount += iconVars.length;
        estimated += ICONS_TOKEN_COUNT;
        if (iconVars.length > 0) {
          affectedScopes.push("Icons");
          affectedCollections.push("Icon");
        }
      } else {
        outsideScopeCount += iconVars.length;
      }
      return {
        category: "System",
        existingCount,
        estimatedNewCount: estimated,
        outsideScopeCount,
        affectedCollections,
        affectedScopes
      };
    }
  };

  // src/code.ts
  async function executeFoundationPipeline(optionsOrBrandConfig) {
    let options;
    if (optionsOrBrandConfig && ("mode" in optionsOrBrandConfig || "scope" in optionsOrBrandConfig)) {
      options = optionsOrBrandConfig;
    } else if (optionsOrBrandConfig) {
      const rawMode = optionsOrBrandConfig.mode || "brand-colors";
      options = {
        mode: rawMode,
        brandConfig: optionsOrBrandConfig,
        language: "en"
      };
    } else {
      options = {
        mode: "brand-colors",
        language: "en"
      };
    }
    const effectiveScope = resolveScopeForMode(options.mode, options.scope);
    const isBrandMode = options.mode === "brand-colors" || options.mode === "brand" || options.mode === "custom";
    const hr = options.harmonyResult;
    const st = options.statusOptions;
    const brandConfig = isBrandMode ? options.brandConfig || {
      primary: options.brandPrimary || hr?.primaryHex || "#6750A4",
      secondary: options.brandSecondary || hr?.secondaryHex || "#8B5CF6",
      accent: options.brandAccent || hr?.accentHex || "#9BB710",
      neutral: st?.neutral !== false ? hr?.neutralHex || "#64748B" : void 0,
      destructive: st?.destructive !== false ? hr?.destructiveHex || "#EF4444" : void 0,
      success: st?.success ? hr?.successHex || "#10B981" : void 0,
      warning: st?.warning ? hr?.warningHex || "#F59E0B" : void 0,
      info: st?.info ? hr?.infoHex || "#3B82F6" : void 0
    } : void 0;
    LoggerService.printBanner();
    LoggerService.info(`Foundation generation started \u2014 Mode: ${options.mode.toUpperCase()}`);
    BenchmarkService.startOverall();
    StatsService.reset();
    ErrorHandlerService.reset();
    sendToUI({ type: "generation-started", mode: options.mode });
    const variableMap = await BenchmarkService.measure(
      "Fetch Local Variables",
      () => VariableService.getLocalVariablesMap()
    );
    if (effectiveScope.colors.primitive || effectiveScope.colors.brand || effectiveScope.colors.theme || effectiveScope.colors.sidebar || effectiveScope.colors.chart) {
      sendToUI({ type: "progress", percent: 15, step: "Generating Colors\u2026" });
      await BenchmarkService.measure(
        "Colors & Brand Collection",
        () => ErrorHandlerService.executeWithRecovery(
          "Colors Collection",
          () => generateColorsCollection(variableMap, brandConfig, effectiveScope.colors, options.selectedPalettes, options.brandGroupPrefix)
        )
      );
    }
    if (effectiveScope.colors.semantic) {
      sendToUI({ type: "progress", percent: 30, step: "Generating Semantic Colors\u2026" });
      await BenchmarkService.measure(
        "Semantic Collection",
        () => ErrorHandlerService.executeWithRecovery(
          "Semantic Collection",
          () => generateSemanticCollection(variableMap, brandConfig)
        )
      );
    }
    if (effectiveScope.radius) {
      sendToUI({ type: "progress", percent: 40, step: "Generating Radius\u2026" });
      await BenchmarkService.measure(
        "Radius Collection",
        () => ErrorHandlerService.executeWithRecovery(
          "Radius Collection",
          () => generateRadiusCollection(variableMap)
        )
      );
    }
    if (effectiveScope.typography) {
      sendToUI({ type: "progress", percent: 50, step: "Generating Typography\u2026" });
      await BenchmarkService.measure(
        "Typography Collection",
        () => ErrorHandlerService.executeWithRecovery(
          "Typography Collection",
          () => generateTypographyCollection(variableMap, options.fontFamily)
        )
      );
    }
    if (effectiveScope.spacing) {
      sendToUI({ type: "progress", percent: 60, step: "Generating Spacing\u2026" });
      await BenchmarkService.measure(
        "Spacing Collection",
        () => ErrorHandlerService.executeWithRecovery(
          "Spacing Collection",
          () => generateSpacingCollection(variableMap)
        )
      );
    }
    if (effectiveScope.icons) {
      sendToUI({ type: "progress", percent: 70, step: "Generating Icons\u2026" });
      await BenchmarkService.measure(
        "Icon Collection",
        () => ErrorHandlerService.executeWithRecovery(
          "Icon Collection",
          () => generateIconCollection(variableMap)
        )
      );
    }
    if (effectiveScope.effects) {
      sendToUI({ type: "progress", percent: 75, step: "Generating Effects\u2026" });
      await BenchmarkService.measure(
        "Effects Collection",
        () => ErrorHandlerService.executeWithRecovery(
          "Effects Collection",
          () => generateEffectsCollection(variableMap)
        )
      );
    }
    if (effectiveScope.motion) {
      sendToUI({ type: "progress", percent: 80, step: "Generating Motion\u2026" });
      await BenchmarkService.measure(
        "Motion Collection",
        () => ErrorHandlerService.executeWithRecovery(
          "Motion Collection",
          () => generateMotionCollection(variableMap)
        )
      );
    }
    if (effectiveScope.layers) {
      sendToUI({ type: "progress", percent: 85, step: "Generating Layers\u2026" });
      await BenchmarkService.measure(
        "Layers Collection",
        () => ErrorHandlerService.executeWithRecovery(
          "Layers Collection",
          () => generateLayersCollection(variableMap)
        )
      );
    }
    sendToUI({ type: "progress", percent: 90, step: "Building Foundation Canvas\u2026" });
    await BenchmarkService.measure(
      "Foundation Canvas Preview",
      () => ErrorHandlerService.executeWithRecovery(
        "Foundation Canvas Preview",
        () => generateFoundationPreview(variableMap, { ...options, scope: effectiveScope })
      )
    );
    sendToUI({ type: "progress", percent: 97, step: "Running Foundation Audit\u2026" });
    await BenchmarkService.measure("Live Foundation Audit", () => AuditService.auditFoundation());
    BenchmarkService.printReport();
    StatsService.printSummary();
    ErrorHandlerService.printReport();
    const stats = StatsService.getStats();
    LoggerService.success(
      `Foundation Complete \u2014 Mode: ${options.mode.toUpperCase()} | Variables: ${stats.variablesCreated} created, ${stats.variablesUpdated} updated | Collections: ${stats.collectionsCreated} created.`
    );
    const lastGenSession = {
      recorded: true,
      mode: (options.mode || "full-foundation").replace(/-/g, " ").toUpperCase(),
      categories: options.scope ? Object.keys(options.scope).filter((k) => options.scope[k]).map((k) => k.charAt(0).toUpperCase() + k.slice(1)).join(", ") : "Colors, Typography, Layout, Visual, System",
      language: (options.language || "en").toUpperCase(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      pluginVersion: "v1.0.0"
    };
    try {
      await figma.clientStorage.setAsync("last-generation-session", JSON.stringify(lastGenSession));
    } catch (_e) {
    }
    const updatedMap = await VariableService.getLocalVariablesMap();
    const updatedState = await FoundationStateService.detectState(updatedMap);
    const updatedInspection = await FoundationInspectorService.inspectDocument();
    sendToUI({
      type: "complete",
      stats,
      foundationState: FoundationStateService.toUIPayload(updatedState),
      payload: updatedInspection
    });
    NotificationService.showSuccess(void 0, options.language);
  }
  function sendToUI(payload) {
    try {
      if (typeof figma.ui !== "undefined" && figma.ui) {
        figma.ui.postMessage(payload);
      }
    } catch (_e) {
    }
  }
  function initPlugin() {
    if (typeof figma.showUI === "function") {
      figma.showUI(__html__, { width: 500, height: 680 });
      figma.ui.onmessage = async (msg) => {
        switch (msg.type) {
          // ── Generation ───────────────────────────────────────────────────────
          case "generate-all":
          case "generate-foundations":
          case "generate-foundation":
          case "generate-colors":
          case "generate-brand-colors":
            await executeFoundationPipeline(msg.options || msg.brandConfig);
            break;
          // ── Phase 21: Safe Reset Foundation ──────────────────────────────────
          case "reset-foundation": {
            try {
              await figma.clientStorage.deleteAsync("last-generation-session");
            } catch (_e) {
            }
            const resetRes = await ResetService.resetFoundation();
            figma.notify(`Foundation Reset Complete: ${resetRes.collectionsDeleted} collections & ${resetRes.variablesDeleted} variables deleted.`);
            const payload = await FoundationInspectorService.inspectDocument();
            sendToUI({ type: "reset-complete", result: resetRes, payload });
            break;
          }
          // ── Export ───────────────────────────────────────────────────────────
          case "export-tokens": {
            const variableMap = await VariableService.getLocalVariablesMap();
            let exported = "";
            if (msg.format === "css") exported = ExportService.exportCssVariables(variableMap);
            if (msg.format === "tailwind") exported = ExportService.exportTailwindConfig(variableMap);
            if (msg.format === "w3c") exported = ExportService.exportW3CTokens(variableMap);
            sendToUI({ type: "export-result", format: msg.format, content: exported });
            break;
          }
          // ── Import ───────────────────────────────────────────────────────────
          case "import-tokens": {
            const variableMap = await VariableService.getLocalVariablesMap();
            const res = ImportService.importJsonTokens(msg.content, variableMap);
            figma.notify(res.message);
            break;
          }
          // ── Language persistence ──────────────────────────────────────────────
          case "save-language":
            await figma.clientStorage.setAsync("preferred-language", msg.language);
            break;
          case "load-language": {
            const stored = await figma.clientStorage.getAsync("preferred-language");
            sendToUI({ type: "language-loaded", language: stored || "en" });
            break;
          }
          // ── Foundation State & Scope Inspection ──────────────────────────────
          case "detect-state":
          case "inspect-document": {
            const variableMap = await VariableService.getLocalVariablesMap();
            const state = await FoundationStateService.detectState(variableMap);
            sendToUI({ type: "foundation-state", state: FoundationStateService.toUIPayload(state) });
            const payload = await FoundationInspectorService.inspectDocument();
            sendToUI({ type: "document-inspection", payload });
            break;
          }
          // ── Phase 18: Unified Replacement Review ─────────────────────────────
          // All category CTAs route through this single handler.
          // Returns a rich ReplacementReview for the enhanced modal.
          case "inspect-foundation-scope": {
            const variableMap = await VariableService.getLocalVariablesMap();
            const effectiveScope = resolveScopeForMode(
              msg.options?.mode || "full-foundation",
              msg.options?.scope
            );
            const review = await ReplacementReviewService.inspect(variableMap, effectiveScope);
            sendToUI({ type: "foundation-review", review, options: msg.options });
            break;
          }
          // ── Legacy inspect-scope (backward-compat alias) ──────────────────────
          case "inspect-scope": {
            const variableMap = await VariableService.getLocalVariablesMap();
            const effectiveScope = resolveScopeForMode(msg.options?.mode || "shadcn-colors", msg.options?.scope);
            const inspection = FoundationStateService.inspectScopeVariables(variableMap, effectiveScope.colors);
            sendToUI({ type: "scope-inspection", inspection, options: msg.options });
            break;
          }
          // ── Font Discovery ────────────────────────────────────────────────────
          case "list-fonts": {
            const fonts = await FontDiscoveryService.getAvailableFonts();
            sendToUI({ type: "available-fonts", fonts });
            break;
          }
          // ── Legacy per-category handlers (backward-compat) ────────────────────
          // These now internally delegate to inspect-foundation-scope.
          case "inspect-typography": {
            let styles = [];
            try {
              if (typeof figma.getLocalTextStylesAsync === "function") {
                styles = await figma.getLocalTextStylesAsync();
              }
            } catch (_e) {
              styles = [];
            }
            sendToUI({
              type: "typography-inspection",
              existingCount: styles.length,
              existingNames: styles.map((s) => s.name),
              options: msg.options
            });
            break;
          }
          case "inspect-layout": {
            const variableMap = await VariableService.getLocalVariablesMap();
            const inspection = FoundationStateService.inspectLayoutVariables(variableMap, { spacing: true, radius: true });
            sendToUI({ type: "layout-inspection", inspection, options: msg.options });
            break;
          }
          case "inspect-visual": {
            const variableMap = await VariableService.getLocalVariablesMap();
            const inspection = await FoundationStateService.inspectVisualVariables(variableMap, { effects: true, motion: true });
            sendToUI({ type: "visual-inspection", inspection, options: msg.options });
            break;
          }
          case "inspect-system": {
            const variableMap = await VariableService.getLocalVariablesMap();
            const inspection = FoundationStateService.inspectSystemVariables(variableMap, { layers: true, icons: true });
            sendToUI({ type: "system-inspection", inspection, options: msg.options });
            break;
          }
          default:
            LoggerService.warn(`Unknown message type received: "${msg.type}"`);
        }
      };
    } else {
      executeFoundationPipeline().finally(() => figma.closePlugin());
    }
  }
  initPlugin();
})();
