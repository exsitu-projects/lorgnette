export interface ValueHistorySettings {
    maximumNbValues: number;
}

export const DEFAULT_VALUE_HISTORY_SETTINGS: ValueHistorySettings = {
    maximumNbValues: 64
};

export const deriveValueHistorySettingsFrom = (partialSettings: Partial<ValueHistorySettings>): ValueHistorySettings => {
    return {
        ...DEFAULT_VALUE_HISTORY_SETTINGS,
        ...partialSettings
    };
};
