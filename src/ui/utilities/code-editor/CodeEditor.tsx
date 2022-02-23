import React from "react";
import AceEditor, { IMarker } from "react-ace";
import "./code-editor.css";

// Configuration files for the Ace editor.
import "ace-builds/src-min-noconflict/mode-typescript";
import "ace-builds/src-min-noconflict/mode-json";
import "ace-builds/src-min-noconflict/mode-css";
import "ace-builds/src-noconflict/theme-tomorrow";

import { Language } from "../../../core/languages/Language";
import { Range } from "../../../core/documents/Range";
import { Document } from "../../../core/documents/Document";
import { MarkerSet } from "./MarkerSet";
import { RangeToHighlight } from "./RangeToHighlight";
import { Position } from "../../../core/documents/Position";

export function getCursorPositionInEditor(aceEditor: any, document: Document): Position {
  const cursorLine = aceEditor.cursor.row;
  const cursorColumn = aceEditor.cursor.column;
  return document.getPositionAtLineAndColumn(cursorLine, cursorColumn);
}

export function getSelectionInEditor(aceEditor: any, document: Document): Range {
  const anchorLine = aceEditor.anchor.row ;
  const anchorColumn = aceEditor.anchor.column;
  const anchorPosition = document.getPositionAtLineAndColumn(anchorLine, anchorColumn);

  const cursorLine = aceEditor.cursor.row;
  const cursorColumn = aceEditor.cursor.column;
  const cursorPosition = document.getPositionAtLineAndColumn(cursorLine, cursorColumn);

  return Range.fromUnsortedPositions(anchorPosition, cursorPosition);
}

type Props = {
  language: Language;
  initialContent?: string;
  onContentChange?: (newContent: string) => void;
  onSelectionChange?: (aceEditor: any) => void;
  onCursorChange?: (aceEditor: any) => void;
  rangesToHighlight?: RangeToHighlight[];
};

type State = {
  theme: string;
}

export class CodeEditor extends React.Component<Props, State> {
  private aceEditorRef: React.RefObject<AceEditor>;

  constructor(props: Props) {
    super(props);

    this.aceEditorRef = React.createRef();
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
      className: `${rangeToHighlight.className} marker-unique-id-${rangeToHighlight.id}`
    };
  }

  getMarkersWithId(id: number): HTMLElement[] {
    const ref = this.aceEditorRef.current;
    if (!ref) {
      return [];
    }

    return [...ref.refEditor.querySelectorAll(`.ace_marker-layer .marker-unique-id-${id}`)] as HTMLElement[];
  }

  getMarkerSetWithId(id: number): MarkerSet {
    const markers = this.getMarkersWithId(id);
    return new MarkerSet(markers);
  }

  getEditorBoundingRect(): DOMRect {
    const ref = this.aceEditorRef.current;
    if (!ref) {
      return new DOMRect(0, 0, 0, 0);
    }

    return ref.refEditor.getBoundingClientRect();
  }

  render() {
    const markers = (this.props.rangesToHighlight || [])
      .map(rangeToHiglight => this.createMarkerFromRangeToHighlight(rangeToHiglight));

    return (
      <AceEditor
        className="code-editor"
        value={this.props.initialContent ?? ""}
        mode={this.props.language.codeEditorLanguageId}
        theme={this.state.theme}
        onChange={newContent => {this.props.onContentChange && this.props.onContentChange(newContent)}}
        onSelectionChange={aceEditor => {this.props.onSelectionChange && this.props.onSelectionChange(aceEditor)}}
        onCursorChange={aceEditor => {this.props.onCursorChange && this.props.onCursorChange(aceEditor)}}
        editorProps={{ $blockScrolling: true }}
        placeholder="Write your code here!"
        ref={this.aceEditorRef}
        style={{
          width: "100%",
          height: "100%"
        }}
        markers={markers}
      />
    );
  }
};
