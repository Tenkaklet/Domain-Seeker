export interface DomainWords {
    splice: (any);
    domain: string;
    word: string[];
    score: number;
    available: boolean;
    registerURL: string;
    status: string;
}

export interface Domain {
    domain: string;
    registerURL: string;
    status: string;
}
