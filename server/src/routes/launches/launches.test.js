const request = require('supertest');
const app = require('../../app');
const { 
    mongoConnect,
    mongoDissconnect 
} = require('../../services/mongo');

describe('Launches API', () => {

    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDissconnect();
    });

    describe('Test GET /launches', () => {
        test('It should respond with 200', async () => {
            const response = await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200);
    
        });
    });
    
    
    describe('Test POST /launch', () => {
    
        const completeLaunchData = {
            mission: 'USS Enterprise',
            rocket: 'dlfjdlkfj',
            target: 'test target',
            launchDate: 'January 4, 2028'
        };
    
        const launchDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'dlfjdlkfj',
            target: 'Kepler-62 f',
        };
    
        const launchDataWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'dlfjdlkfj',
            target: 'Kepler-62 f',
            launchDate: 'January 114, 2028'
        };
    
        test('It should respond with 201 created', async () => {
            const response = await request(app)
            .post('/v1/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
    
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });
    
        test('It should catch missing property', async () => {
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(422);
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            });
    
        });
    
        test('It should catch invalid dates', async () => {
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(422);
    
            expect(response.body).toStrictEqual({
                error: 'Invalid launch date',
            });
        });
    
    });

});

