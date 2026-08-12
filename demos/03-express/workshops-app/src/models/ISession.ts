type Level = 'Basic' | 'Intermediate' | 'Advanced';

interface ISession {
    id: number;
    workshopId: number; // foreign key reference to Workshop.id
    sequenceId: number;
    name: string;
    speaker: string;
    duration: number;
    level: Level;
    abstract: string;
    upvoteCount: number;
}

export { ISession as default, Level };
