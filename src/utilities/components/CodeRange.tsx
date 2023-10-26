
import { PureComponent } from "react";
import { Range } from "../../core/documents/Range";

type Props = {
    range: Range;
}
    
export class CodeRange extends PureComponent<Props> {
    render() {
        const start = this.props.range.start;
        const end = this.props.range.end;
    
        return (
            <span className="code-range">
            {start.row};{start.column}–{end.row};{end.column}</span>
        );
    }
}