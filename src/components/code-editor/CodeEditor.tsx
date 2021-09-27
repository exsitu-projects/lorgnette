import React from "react";
import AceEditor, { IMarker } from "react-ace";

import "./CodeEditor.css";

// Configuration files for the Ace editor.
import "ace-builds/src-min-noconflict/mode-typescript";
import "ace-builds/src-noconflict/theme-tomorrow";
import { Site } from "../../core/sites/Site";
import { Pattern } from "../../core/code-patterns/Pattern";
import { CodeVisualisation } from "../../core/visualisations/CodeVisualisation";

/* `start` and `end` use 0-based row and column indices. */
export interface RangeToHighlight {
  start: { row: number, column: number},
  end: { row: number, column: number},
  className: string
}

export function createCodeRangesToHighlightForCodeVisualisations(visualisations: CodeVisualisation[]): RangeToHighlight[] {
{
  const rangesToHiglight: RangeToHighlight[] = [];

  for (let visualisation of visualisations) {
    const pattern = visualisation.pattern;

    rangesToHiglight.push(createRangesToHiglightForPattern(pattern));
    for (let site of visualisation.sites) {
      rangesToHiglight.push(createRangesToHiglightForSite(site, pattern))
    }
  }

  return rangesToHiglight;
}

function createRangesToHiglightForPattern(pattern: Pattern): RangeToHighlight {
  return {
    start: pattern.range.start,
    end: pattern.range.end,
    className: "highlight pattern"
  };
}

function createRangesToHiglightForSite(site: Site, pattern: Pattern): RangeToHighlight {
  const absoluteSiteCodeRange = site.range.relativeTo(pattern.range.start);
  return {
        start: absoluteSiteCodeRange.start,
        end: absoluteSiteCodeRange.end,
        className: "highlight site"
      };
    };
}

type Props = {
  language: string;
  onContentChange: (newContent: string) => void;
  initialContent?: string;
  rangesToHighlight?: RangeToHighlight[];
};

export default class CodeEditor extends React.Component<Props> {
  state: {
    language: string;
    theme: string;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      language: props.language,
      theme: "tomorrow"
    };
  }

  createMarkerFromRangeToHighlight(rangeToHighlight: RangeToHighlight): IMarker {
    return {
      type: "text",
      startRow: rangeToHighlight.start.row,
      startCol: rangeToHighlight.start.column,
      endRow: rangeToHighlight.end.row,
      endCol: rangeToHighlight.end.column,
      className: rangeToHighlight.className
    };
  }

  render() {
    const markers = (this.props.rangesToHighlight || [])
      .map(rangeToHiglight => this.createMarkerFromRangeToHighlight(rangeToHiglight));

    return (
      <AceEditor
        className="code-editor"
        value={this.props.initialContent ?? ""}
        mode={this.state.language}
        theme={this.state.theme}
        onChange={(newContent, e) => {console.log("event", e); this.props.onContentChange(newContent)}}
        editorProps={{ $blockScrolling: true }}
        placeholder="Write your code here!"
        enableLiveAutocompletion={true}
        style={{
          width: "100%",
          height: "100%"
        }}
        markers={markers}
      />
    );
  }
};
