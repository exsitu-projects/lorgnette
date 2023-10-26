
import { Range } from "../../../core/documents/Range";
import { Projection } from "../../../core/projections/Projection";
import { UserInterface, UserInterfaceOutput } from "../../../core/user-interfaces/UserInterface";
import { ConfigurableUserInterfaceProvider } from "../../../core/user-interfaces/UserInterfaceProvider";
import { NodeMoveData, TreeComponent } from "./TreeComponent";
import { UserInterfaceSettings } from "../../../core/user-interfaces/UserInterfaceSettings";


export interface TreeNode<T = any> {
    title: string;
    preTitle?: string;
    postTitle?: string;
    data: T;
    children?: TreeNode<T>[];
    canMove?: boolean;
}

export type TreeNodeWithRange<T = { data: Range; }> = TreeNode<T>;

export type Input<T> = TreeNode<T>;
export interface Output<T> extends UserInterfaceOutput {
    rootNode: TreeNode<T> | null;
    lastNodeMoveData: NodeMoveData<T> | null;
}

export class Tree<T = any> extends UserInterface<Input<T>, Output<T>> {
    readonly className = "tree";

    private rootNode: TreeNode<T> | null;
    private lastNodeMoveData: NodeMoveData<T> | null;

    constructor(projection: Projection) {
        super(projection);

        this.rootNode = null;
        this.lastNodeMoveData = null;
    }

    setTopLevelNodes(topLevelNodes: TreeNode<T>): void {
        this.rootNode = topLevelNodes;
    }

    createViewContent(): JSX.Element {
        return <TreeComponent
            rootNode={this.rootNode}
            onNodesMove={(moveData: NodeMoveData<T>) => {
                console.log("tree node move data", moveData);

                this.lastNodeMoveData = moveData;
                this.declareModelChange();
            }}
        />;
    }

    protected get modelOutput(): Output<T> {
        // console.log("model output", {
        //     ...this.getPartialModelOutput(),
        //     data: {
        //         rootNode: this.rootNode,
        //         lastNodeMoveData: this.lastNodeMoveData
        //     }
        // })

        return {
            rootNode: this.rootNode,
            lastNodeMoveData: this.lastNodeMoveData
        };
    }

    protected processInput(input: TreeNode<T>): void {
        // TODO: check input
        this.setTopLevelNodes(input);
    }

    static makeConfigurableProvider(): ConfigurableUserInterfaceProvider {
        return (settings: Partial<UserInterfaceSettings> = {}) => {
            return {
                provide: (projection: Projection) => {
                    return new Tree<any>(projection);
                }
            };  
        };
    }
}