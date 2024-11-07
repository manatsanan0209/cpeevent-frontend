export const posts = [
    {
        _id: '67248ec00a58d813af6eec26',
        kind: 'post',
        assignTo: ['everyone', 'activity'],
        title: 'Hello Worlddddddddd  dddddddddd  dddddddddddd',
        description:'This is a testrtjgigj  ogrkojgotjogjwkoetkgeosktttttttttttttttttttttt tttttttttttttt tttttttttt t tttt  post',
        postDate: '2024-11-07T15:00:00.000+00:00',
        endDate: null,
        author: '65070501003',
        markdown: '### Hello Krub',
    },
    {
        _id: '67248ec00a58d813af6eec27',
        kind: 'post',
        assignTo: ['everyone', 'activity'],
        title: 'Hello World',
        description: 'This is a test post',
        postDate: '2024-11-04T00:00:00.000+00:00',
        endDate: '2024-11-10T00:00:00.000+00:00',
        author: '65070501003',
        markdown: '### Hello Krub',
    },
    {
        _id: '67248ec00a58d813af6eec29',
        kind: 'vote',
        assignTo: ['everyone','activity'],
        title: 'Vote for all',
        description: 'Vote for all',
        postDate: '2023-11-06T00:00:00.000+00:00',
        endDate: '2024-01-11T00:00:00.000+00:00',
        author: '65070501087',
        markdown: '',
        questions: [
            {
                question: 'Do you like this?',
                type: 'single',
                options: ['Yes', 'No'],
            },
            {
                question: 'Do you like that?',
                type: 'multiple',
                options: ['Yes', 'No', 'Maybe'],
            },
        ],
    },
   
];
