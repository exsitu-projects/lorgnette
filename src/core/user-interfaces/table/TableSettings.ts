export interface TableSettings {
    
}

export const DEFAULT_TABLE_SETTINGS: TableSettings = {
    
};

export const deriveTableSettingsFrom = (partialSettings: Partial<TableSettings>): TableSettings => {
    return {
        ...DEFAULT_TABLE_SETTINGS,
        ...partialSettings
    };
};
