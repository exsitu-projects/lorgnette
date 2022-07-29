import React from "react";
import { MonocleEnvironmentProvider } from "../../MonocleEnvironment";
import { Playground } from "../../ui/playground/Playground";
import "./playground-app.css";

export class PlaygroundApp extends React.PureComponent {
    render() {
        return <section id="monocle-playground-app">
            <MonocleEnvironmentProvider>
                <Playground />
            </MonocleEnvironmentProvider>
        </section>;
    }
}