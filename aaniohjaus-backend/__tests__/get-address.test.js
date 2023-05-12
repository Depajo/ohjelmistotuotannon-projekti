const { describe, expect, test } = require('@jest/globals');
const request = require('supertest');
const app = require('../app');

describe('GET address information', () => {
    test('using LATITUDE and LONGITUDE with values that are not in database, should return statuscode 204', async () => {
        const response = await request(app)
        .get('/api/katutiedot/81.498139/23.7515')
        .set('Accept', 'application/json');

        expect(response.status).toEqual(204);  
    });
    test('using LATITUDE and LONGITUDE with values that are in database, should return statuscode 200 and json data', async () => {
        const response = await request(app)
        .get('/api/katutiedot/61.498139/23.7515')
        .set('Accept', 'application/json');

        expect(response.status).toEqual(200);
        expect(response.body).toContainEqual(
            expect.objectContaining({
                latitude: 61.497979,
                longitude: 23.752048,
                katu: "Hämeenpuisto",
                katunumero: "27c",
                postinumero: "33210",
                kunta: "Tampere",
                distance_in_kms: 0.0340883601772967
            }),
        );
    });
    test('using LATITUDE and LONGITUDE with values that are not numbers, should return statuscode 400', async () => {
        const response = await request(app)
        .get('/api/katutiedot/kissa/GET*FROMkatutiedot;')
        .set('Accept', 'application/json');

        expect(response.status).toEqual(400);  
    });
    test('using LATITUDE that is a number and LONGITUDE that is not number, should return statuscode 400', async () => {
        const response = await request(app)
        .get('/api/katutiedot/123.456/GET*FROMkatutiedot;')
        .set('Accept', 'application/json');

        expect(response.status).toEqual(400);
    });
    test('using LATITUDE that is not a number and LONGITUDE that is a number, should return statuscode 400', async () => {
        const response = await request(app)
        .get('/api/katutiedot/GET*FROMkatutiedot;/123.456')
        .set('Accept', 'application/json');

        expect(response.status).toEqual(400);
    });
});