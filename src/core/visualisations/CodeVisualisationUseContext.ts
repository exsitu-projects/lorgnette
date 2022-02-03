export interface CodeVisualisationUseContext {
    /**
     * Specify the IDs of the languages that are supported by a code visualisation.
     * Not specifying the parameter is equivalent to specifying all languages.
     */
    languages?: string[];
}