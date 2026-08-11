interface ITime {
    hours: number;
    minutes: number;
}

interface ILocation {
    address: string;
    city: string;
    state: string;
}

interface IModes {
    inPerson: boolean;
    online: boolean;
}

interface IWorkshop {
    id: number; // primary key in PostgreSQL
    name: string;
    category: 'frontend' | 'backend' | 'database' | 'devops' | 'language' | 'mobile';
    description: string;
    startDate: Date;
    endDate: Date;
    startTime: ITime;
    endTime: ITime;
    location: ILocation;
    modes: IModes;
    imageUrl: string;
    speakers: string[];
}

export { IWorkshop as default, ITime, ILocation, IModes };
