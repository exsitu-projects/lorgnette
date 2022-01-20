import React from "react";
import "./CodeEditor.css";
import AceEditor, { IMarker } from "react-ace";
import { Site } from "../../core/sites/Site";
import { Pattern } from "../../core/code-patterns/Pattern";
import { CodeVisualisation } from "../../core/visualisations/CodeVisualisation";

// Configuration files for the Ace editor.
import "ace-builds/src-min-noconflict/mode-typescript";
import "ace-builds/src-noconflict/theme-tomorrow";
import { Language } from "../../core/languages/Language";
import { CodeEditorRanges } from "../../context";
import { Range } from "../../core/documents/Range";
import { Document } from "../../core/documents/Document";

/* `start` and `end` use 0-based row and column indices. */
export interface RangeToHighlight {
  start: { row: number, column: number},
  end: { row: number, column: number},
  className: string
}

export function createRangeTohighlight(range: Range, className: string): RangeToHighlight {
  return {
    start: range.start,
    end: range.end,
    className: className
  };
}

function createRangeToHiglightForPattern(pattern: Pattern): RangeToHighlight {
  return createRangeTohighlight(pattern.range, "highlight pattern");
}

function createRangeToHiglightForSite(site: Site, pattern: Pattern): RangeToHighlight {
  const absoluteSiteRange = site.range.relativeTo(pattern.range.start);
  return createRangeTohighlight(absoluteSiteRange, "highlight site");
}

export function createRangesToHighlightForCodeVisualisations(visualisations: CodeVisualisation[]): RangeToHighlight[] {
  const rangesToHiglight: RangeToHighlight[] = [];

  for (let visualisation of visualisations) {
    const pattern = visualisation.pattern;

    rangesToHiglight.push(createRangeToHiglightForPattern(pattern));
    for (let site of visualisation.sites) {
      rangesToHiglight.push(createRangeToHiglightForSite(site, pattern));
    }
  }

  return rangesToHiglight;
}

export function createRangesToHighlightFromGlobalCodeEditorRanges(ranges: CodeEditorRanges): RangeToHighlight[] {
  const rangesToHiglight: RangeToHighlight[] = [];

  // Ranges to highlight on mouse hover
  for (let range of ranges.hovered) {
    rangesToHiglight.push(createRangeTohighlight(range, "highlight hovered"));
  }

  // Ranges to highlight on selection
  for (let range of ranges.selected) {
    rangesToHiglight.push(createRangeTohighlight(range, "highlight selected"));
  }

  return rangesToHiglight;
}

export function createSelectionRange(aceEditor: any, document: Document): Range {
  const anchorLine = aceEditor.anchor.row - 1;
  const anchorColumn = aceEditor.anchor.column - 1;
  const anchorPosition = document.getPositionAtLineAndColumn(anchorLine, anchorColumn);

  const cursorLine = aceEditor.cursor.row - 1;
  const cursorColumn = aceEditor.cursor.column - 1;
  const cursorPosition = document.getPositionAtLineAndColumn(cursorLine, cursorColumn);

  return new Range(anchorPosition, cursorPosition);
  
}

type Props = {
  language: Language;
  initialContent?: string;
  onContentChange: (newContent: string) => void;
  onSelectionChange: (aceEditor: any) => void;
  rangesToHighlight?: RangeToHighlight[];
};

export class CodeEditor extends React.Component<Props> {
  state: {
    theme: string;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
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
        value={this.props.initialContent ?? this.props.language.codeExample}
        mode={this.props.language.codeEditorLanguageId}
        theme={this.state.theme}
        onChange={newContent => {this.props.onContentChange(newContent)}}
        onSelectionChange={aceEditor => {this.props.onSelectionChange(aceEditor)}}
        editorProps={{ $blockScrolling: true }}
        placeholder="Write your code here!"
        
        style={{
          width: "100%",
          height: "100%"
        }}
        markers={markers}
      />
    );
  }
};
