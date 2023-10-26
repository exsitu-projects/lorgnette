import React, { PropsWithChildren } from "react";
import { Document, DocumentChangeEvent, DocumentChangeOrigin } from "../documents/Document";
import { ABSOLUTE_ORIGIN_POSITION, Position } from "../documents/Position";
import { Projection } from "../projections/Projection";
import { Debouncer } from "../../utilities/tasks/Debouncer";
import { LorgnetteContext } from "./LorgnetteContext";
import { EMPTY_RANGE, Range } from "../documents/Range";
import { ConfigurableUserInterfaceProvider, UserInterfaceProvider } from "../user-interfaces/UserInterfaceProvider";
import { ConfigurableRendererProvider, RendererProvider } from "../renderers/RendererProvider";
import { ProjectionProvider } from "../projections/ProjectionProvider";
import { Language } from "../languages/Language";
import { PLAIN_TEXT_LANGUAGE } from "../languages/plain-text";
import { ProjectionSpecification, RendererSpecification, UserInterfaceSpecification } from "../projections/ProjectionSpecification";
import { UserInterfaceSettings } from "../user-interfaces/UserInterfaceSettings";
import { RendererSettings } from "../renderers/RendererSettings";

export type LorgnetteEnvironmentProps = PropsWithChildren<{ }>;

export interface LorgnetteEnvironmentState {
    codeEditorCursorPosition: Position;
    setCodeEditorCursorPosition(position: Position): void;
    
    codeEditorVisibleRange: Range;
    setCodeEditorVisibleRange(range: Range): void;
    
    codeEditorHoveredRanges: Range[];
    setCodeEditorHoveredRanges(ranges: Range[]): void;
    
    codeEditorSelectedRanges: Range[];
    setCodeEditorSelectedRanges(ranges: Range[]): void;
    
    document: Document;
    setDocument(document: Document): void;
    setDocumentContent(content: string): void;

    languages: Language[];
    registerLanguage(language: Language): void;
    unregisterLanguage(name: string): void;
    
    userInterfaceNamesToConfigurableProviders: Map<string, ConfigurableUserInterfaceProvider>;
    registerUserInterface(name: string, configurableProvider: ConfigurableUserInterfaceProvider): void;
    unregisterUserInterface(name: string): void;
    
    rendererNamesToConfigurableProviders: Map<string, ConfigurableRendererProvider>;
    registerRenderer(name: string, configurableProvider: ConfigurableRendererProvider): void;
    unregisterRenderer(name: string): void;
    
    projectionProviders: ProjectionProvider[];
    registerProjection(specification: ProjectionSpecification): void;
    unregisterProjection(name: string): void;

    projections: Projection[];
}

export class LorgnetteEnvironment<
    P extends LorgnetteEnvironmentProps = LorgnetteEnvironmentProps
> extends React.Component<P, LorgnetteEnvironmentState> {
    private projectionUpdateDebouncer: Debouncer;
    private readonly documentChangeObserver = {
        processChange: (event: DocumentChangeEvent) => this.onDocumentChange(event)
    };

    protected get initialCodeEditorCursorPosition(): Position {
        return ABSOLUTE_ORIGIN_POSITION;
    }

    protected get initialCodeEditorVisibleRange(): Range {
        return EMPTY_RANGE;
    }

    protected get initialCodeEditorHoveredRanges(): Range[] {
        return [];
    }

    protected get initialCodeEditorSelectedRanges(): Range[] {
        return [];
    }

    protected get initialDocument(): Document {
        const document = new Document(PLAIN_TEXT_LANGUAGE, "");
        this.addChangeObserverToDocument(document);

        return document;
    }

    protected get initialLanguages(): Language[] {
        return [PLAIN_TEXT_LANGUAGE];
    }

    protected get initialUserInterfaceNamesToConfigurableProviders(): Map<string, ConfigurableUserInterfaceProvider> {
        return new Map();
    }

    protected get initialRendererNamesToConfigurableProviders(): Map<string, ConfigurableRendererProvider> {
        return new Map();
    }

    protected get initialProjectionProviders(): ProjectionProvider[] {
        return [];
    }

    protected get initialProjectionSpecificationsToResolve(): ProjectionSpecification[] {
        return [];
    }
    
    constructor(props: P) {
        super(props);
        
        const initialProjectionUpdateDebounceDelay = 200; // ms
        this.projectionUpdateDebouncer = new Debouncer(initialProjectionUpdateDebounceDelay);
        
        this.state = {
            codeEditorCursorPosition: this.initialCodeEditorCursorPosition,
            setCodeEditorCursorPosition: (position) => this.setCodeEditorCursorPosition(position),
        
            codeEditorVisibleRange: this.initialCodeEditorVisibleRange,
            setCodeEditorVisibleRange: (range) => this.setCodeEditorVisibleRange(range),
        
            codeEditorHoveredRanges: this.initialCodeEditorHoveredRanges,
            setCodeEditorHoveredRanges: (ranges) => this.setCodeEditorHoveredRanges(ranges),
        
            codeEditorSelectedRanges: this.initialCodeEditorSelectedRanges,
            setCodeEditorSelectedRanges: (ranges) => this.setCodeEditorSelectedRanges(ranges),
        
            document: this.initialDocument,
            setDocument: (document) => this.setDocument(document),
            setDocumentContent: (content) => this.setDocumentContent(content),

            languages: this.initialLanguages,
            registerLanguage: (language) => this.registerLanguage(language),
            unregisterLanguage: (name) => this.unregisterLanguage(name),

            userInterfaceNamesToConfigurableProviders: this.initialUserInterfaceNamesToConfigurableProviders,
            registerUserInterface: (name, configurableProvider) => this.registerUserInterface(name, configurableProvider),
            unregisterUserInterface: (name) => this.unregisterUserInterface(name),

            rendererNamesToConfigurableProviders: this.initialRendererNamesToConfigurableProviders,
            registerRenderer: (name, configurableProvider) => this.registerRenderer(name, configurableProvider),
            unregisterRenderer: (name) => this.unregisterRenderer(name),

            projectionProviders: this.initialProjectionProviders,
            registerProjection: (specification) => this.registerProjection(specification),
            unregisterProjection: (name) => this.unregisterProjection(name),

            projections: []
        };

        this.createProjectionProvidersFromInitialSpecifications();
    }

    protected createProjectionProvidersFromInitialSpecifications(): void {
        const specifications = this.initialProjectionSpecificationsToResolve;
        const providers = specifications.map(specification =>
            this.createProjectionProviderFromSpecification(specification)
        );
        
        this.state = {...this.state, projectionProviders: providers };
    }

    protected addChangeObserverToDocument(document: Document): void {
        document.addChangeObserver(this.documentChangeObserver);
    }

    getLanguageWithId(languageId: string): Language | null {
        return this.state.languages.find(language => language.id === languageId) ?? null;
    }
    
    // This method must return the minimum time (in milliseconds)
    // to wait before updating the projections upon request, so as to
    // debounce the update if another request occurs before it happens.
    protected updateProjectionUpdateDebounceDelayForDocument(document: Document): void {
        // Heuristic to improve performance based on the length of the document.
        const documentLength = document.nbCharacters;
        const debounceDelay =
            documentLength < 1000 ? 200 : // Less than 1,000 characters
            documentLength < 10000 ? 500 : // Less than 10,000 characters
            1000; // Over 10,000 characters
        
        this.projectionUpdateDebouncer.minimumDelayBetweenTasks = debounceDelay;
    }
    
    // The purpose of this method is to provide a callback for state changes
    // that can be used in child classes extending this environment provider.
    protected setEnvironment<K extends keyof LorgnetteEnvironmentState>(
        environmentChanges: Pick<LorgnetteEnvironmentState, K>
    ): void {
        this.setState(environmentChanges);
        this.onEnvironmentDidChange(environmentChanges);
    }
        
    // Callback that can be extended by child classes extending this class.
    // Note that child classes must call super.onEnvironmentDidChange!
    // See the setEnvironment method for details.
    protected onEnvironmentDidChange(environmentChanges: Partial<LorgnetteEnvironmentState>): void {
        // If the document changed, the debounce delay may have to be updated.
        if (environmentChanges.document) {
            this.updateProjectionUpdateDebounceDelayForDocument(environmentChanges.document);
        }

        // If the list of available languages changed, the document needs to be updated.
        if (environmentChanges.languages) {
            const newLanguages = environmentChanges.languages;

            // The language of the current document must have already existed before the change.
            // The only situation in which the document needs to be re-created
            // is the situation in which the document's language was removed.
            const currentDocumentLanguageId = this.state.document.language.id;
            if (!newLanguages.find(language => language.id === currentDocumentLanguageId)) {
                this.setDocument(new Document(PLAIN_TEXT_LANGUAGE, this.state.document.content));
            }
        }

        // If one of the lists of providers changed, the projections need to be updated.
        if (
            environmentChanges.userInterfaceNamesToConfigurableProviders ||
            environmentChanges.rendererNamesToConfigurableProviders ||
            environmentChanges.projectionProviders
        ) {
            this.updateProjectionsForDocument(this.state.document);
        }
    }

    setCodeEditorCursorPosition(position: Position): void {
        this.setEnvironment({ codeEditorCursorPosition: position });
    }

    setCodeEditorVisibleRange(range: Range): void {
        this.setEnvironment({ codeEditorVisibleRange: range });
    }

    setCodeEditorHoveredRanges(ranges: Range[]): void {
        this.setEnvironment({ codeEditorHoveredRanges: ranges });
    }

    setCodeEditorSelectedRanges(ranges: Range[]): void {
        this.setEnvironment({ codeEditorSelectedRanges: ranges });
    }

    setDocument(document: Document): void {
        // Update the document change observers.
        this.state.document.removeChangeObserver(this.documentChangeObserver);
        document.addChangeObserver(this.documentChangeObserver);

        this.setEnvironment({ document: document });

        // Create projections for the new document.
        this.updateProjectionsForDocument(document);
    }

    setDocumentContent(content: string): void {
        this.setDocument(new Document(this.state.document.language, content));
    }

    registerLanguage(language: Language): void {
        this.setEnvironment({ languages: [ ...this.state.languages, language ] });
    }

    unregisterLanguage(name: string): void {
        const newLanguageProviders = this.state.languages.filter(language => language.name !== name);
        this.setEnvironment({ languages: newLanguageProviders });
    }

    registerUserInterface(name: string, configurableProvider: ConfigurableUserInterfaceProvider): void {
        const namesToProviders = this.state.userInterfaceNamesToConfigurableProviders;
        namesToProviders.set(name, configurableProvider);

        this.setEnvironment({ userInterfaceNamesToConfigurableProviders: new Map(namesToProviders) });
    }

    unregisterUserInterface(name: string): void {
        const namesToProviders = this.state.userInterfaceNamesToConfigurableProviders;
        namesToProviders.delete(name);

        this.setEnvironment({ userInterfaceNamesToConfigurableProviders: new Map(namesToProviders) });
    }

    registerRenderer(name: string, configurableProvider: ConfigurableRendererProvider): void {
        const namesToProviders = this.state.rendererNamesToConfigurableProviders;
        namesToProviders.set(name, configurableProvider);

        this.setEnvironment({ rendererNamesToConfigurableProviders: new Map(namesToProviders) });
    }

    unregisterRenderer(name: string): void {
        const namesToProviders = this.state.rendererNamesToConfigurableProviders;
        namesToProviders.delete(name);

        this.setEnvironment({ rendererNamesToConfigurableProviders: new Map(namesToProviders) });
    }

    registerProjection(specification: ProjectionSpecification): void {
        const currentProviders = this.state.projectionProviders;
        const newProvider = this.createProjectionProviderFromSpecification(specification);

        this.setEnvironment({ projectionProviders: [...currentProviders, newProvider] });
    }

    unregisterProjection(name: string): void {
        const filteredProviders = this.state.projectionProviders.filter(provider => provider.name !== name);
        this.setEnvironment({ projectionProviders: filteredProviders });
    }

    private createUserInterfaceProviderNamed(name: string, settings: UserInterfaceSettings = {}): UserInterfaceProvider {
        const configureProvider = this.state.userInterfaceNamesToConfigurableProviders.get(name);
        if (!configureProvider) {
            throw new Error(`There is no user interface provider named "${name}"`);
        }

        return configureProvider(settings);
    }

    private createRendererProviderNamed(name: string, settings: RendererSettings = {}): RendererProvider {
        const configureProvider = this.state.rendererNamesToConfigurableProviders.get(name);
        if (!configureProvider) {
            throw new Error(`There is no renderer provider named "${name}"`);
        }

        return configureProvider(settings);
    }

    private resolveUserInterfaceProviderFromSpecification(specification: UserInterfaceSpecification): UserInterfaceProvider {
        const type = typeof specification;

        if (typeof specification === "string") {
            return this.createUserInterfaceProviderNamed(specification, {});
        }
        else if ("name" in specification) {
            return this.createUserInterfaceProviderNamed(specification.name, specification.settings);
        }
        else {
            return specification;
        }
    }

    private resolveRendererProviderFromSpecification(specification: RendererSpecification): RendererProvider {
        const type = typeof specification;

        if (typeof specification === "string") {
            return this.createRendererProviderNamed(specification);
        }
        else if ("name" in specification) {
            return this.createRendererProviderNamed(specification.name, specification.settings);
        }
        else {
            return specification;
        }
    }

    protected createProjectionProviderFromSpecification(specification: ProjectionSpecification): ProjectionProvider {
        const userInterfaceProvider = this.resolveUserInterfaceProviderFromSpecification(specification.userInterface);
        const rendererSpecification = this.resolveRendererProviderFromSpecification(specification.renderer);

        return new ProjectionProvider(
            specification.name,
            specification.requirements,
            specification.pattern,
            specification.runtimeRequest ?? null,
            specification.forwardMapping,
            specification.backwardMapping ?? null,
            userInterfaceProvider,
            rendererSpecification,
        );
    }

    protected onDocumentChange(event: DocumentChangeEvent): void {
        // If the change is transient, the document should only be modified internally until the transient state ends,
        // without recreating a new document for each successive transient change.
        if (event.changeContext.origin === DocumentChangeOrigin.Projection && event.changeContext.isTransientChange) {
            return;
        }

        // Create a new document based on the current one.
        const newDocument = new Document(
            this.state.document.language,
            event.document.content
        );
            
        // Update the document change observers.
        this.state.document.removeChangeObserver(this.documentChangeObserver);
        newDocument.addChangeObserver(this.documentChangeObserver);
        
        this.setState({ document: newDocument });
        
        // If the change originates from a projection, it might have to be preserved.
        // In this case, projection providers should take it into account when creating new projections.
        let projectionToPreserve = undefined;
        if (event.changeContext.origin === DocumentChangeOrigin.Projection && event.changeContext.preservesProjection) {
            projectionToPreserve = event.changeContext.projection;
            projectionToPreserve.state.isActive = true; // TODO: this should already be done elsewhere!
        }
        
        this.updateProjectionsForDocument(newDocument, projectionToPreserve);
    }

    // Create new projections for the given document.
    protected async createProjectionsForDocument(document: Document, projectionToPreserve?: Projection): Promise<Projection[]> {
        const projections: Projection[] = [];
        
        for (let projectionProvider of this.state.projectionProviders) {
            // If a projection to preserve is provided, the projection provider of this projection should attempt
            // to transfer the state of this projection to the best match among the new projections it provides.
            const useProjectionToPreserve = projectionToPreserve && projectionToPreserve.provider === projectionProvider;
            
            projections.push(...await projectionProvider.provideForDocument(
                document,
                useProjectionToPreserve ? projectionToPreserve : undefined
            ));
        }
            
        console.log("[ New projections ]", projections);
        return projections;
    }
        
    protected updateProjectionsForDocument(document: Document, projectionToPreserve?: Projection): void {
        this.projectionUpdateDebouncer.addTask(async () => {
            const newProjections = await this.createProjectionsForDocument(document, projectionToPreserve);
            this.setEnvironment({ projections: newProjections });
        });
    }
        
    componentDidMount(): void {
        this.updateProjectionUpdateDebounceDelayForDocument(this.state.document);
        this.updateProjectionsForDocument(this.state.document);
    }
        
    render() {
        return <LorgnetteContext.Provider value={this.state}>
            { this.props.children }
        </LorgnetteContext.Provider>;
    }
}
