import { ReactElement } from "react";
import { UserInterfaceSettings } from "../../../core/user-interfaces/UserInterfaceSettings";

export interface FormSettings extends UserInterfaceSettings {
    content: ReactElement;
}

export const DEFAULT_FORM_SETTINGS: FormSettings = {
    content: <div>No form content (<code>content</code> setting) was specified.</div>
};

export const deriveFormSettingsFrom = (partialSettings: Partial<FormSettings>): FormSettings => {
    return {
        ...DEFAULT_FORM_SETTINGS,
        ...partialSettings
    };
};
