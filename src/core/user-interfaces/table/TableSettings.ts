export interface TableSettings {
    columns: {
        canBeInserted: boolean;
        canBeMoved: boolean;
        canBeDeleted: boolean;
        newColumnName: (newColumnIndex: number) => string;
    };
    rows: {
        canBeInserted: boolean;
        canBeMoved: boolean;
        canBeDeleted: boolean;
        newRowName: (newRowIndex: number) => string;
    };
}

export const DEFAULT_TABLE_SETTINGS: TableSettings = {
    columns: {
        canBeInserted: true,
        canBeMoved: true,
        canBeDeleted: true,
        newColumnName: (newColumnIndex: number) => newColumnIndex.toString()
    },
    rows: {
        canBeInserted: true,
        canBeMoved: true,
        canBeDeleted: true,
        newRowName: (newRowIndex: number) => newRowIndex.toString()
    }
};

export const deriveTableSettingsFrom = (partialSettings: Partial<TableSettings>): TableSettings => {
    return {
        ...DEFAULT_TABLE_SETTINGS,
        ...partialSettings
    };
};
