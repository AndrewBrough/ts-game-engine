import { createView } from "./view";
import type { DeepPartial } from "../types";
import type { InteractiveView } from "./types";

export const createInteractiveView = (props: DeepPartial<InteractiveView>) => {
    const viewInstance = createView(props);

    return {
        ...viewInstance,
        // Add interactive-specific methods here if needed
    };
};
