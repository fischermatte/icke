import {Int} from "apikana/default-types";

export interface Project {
    id: string // the id

    /**
     * The given title
     * @pattern [A-Z][a-z]+
     *
     */
    title: string

}

