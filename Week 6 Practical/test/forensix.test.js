const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');

const app = require('../src/app');                 
const Challenge = require('../models/Challenge');  

let mongo;

describe('ForensiX API (Mongo in-memory)', function () {
  this.timeout(20000);

  before(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
  });

  beforeEach(async () => {
    await Challenge.deleteMany({});
    await Challenge.insertMany([
      {
        id: 'wf101',
        title: 'Windows Forensics 101',
        description: 'Find the persistence mechanism used by the malware.',
        points: 100,
        // store only the hash in DB
        flagHash: await bcrypt.hash('FLAG{registry_run_keys}', 10),
        // extra fields your app might use:
        solutionSteps: ['check Run keys', 'review services'],
      },
      {
        id: 'dfir2',
        title: 'Memory Triage',
        description: 'Identify the suspicious process from a Win7 dump.',
        points: 150,
        flagHash: await bcrypt.hash('FLAG{lsass_handle_hunting}', 10),
      }
    ]);
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
  });

  it('lists challenges without exposing secret fields', async () => {
    const res = await request(app).get('/api/challenges');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array').with.length.greaterThan(0);
    res.body.forEach(ch => {
      // must include core public fields
      expect(ch).to.include.keys('title', 'description', 'points');
      // allow either id or _id depending on your API
      expect( ('id' in ch) || ('_id' in ch) ).to.equal(true);
      // must NOT leak flag secrets
      expect(ch).to.not.have.property('flag');
      expect(ch).to.not.have.property('flagHash');
    });
  });

  it('fetches a single challenge by id (no secret fields)', async () => {
    // first get a real id from the list so we don’t assume wf101 exists
    const list = await request(app).get('/api/challenges');
    expect(list.status).to.equal(200);
    const first = list.body[0];
    const idForRoute = first.id || first._id;  // whichever your API exposes

    const res = await request(app).get(`/api/challenges/${idForRoute}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.include.keys('title', 'description', 'points');
    expect(res.body).to.not.have.property('flag');
    expect(res.body).to.not.have.property('flagHash');
  });

  it('rejects submit with missing flag', async () => {
    const list = await request(app).get('/api/challenges');
    const target = list.body[0];
    const idForRoute = target.id || target._id;

    const res = await request(app).post(`/submit/${idForRoute}`).send({}); // body missing { flag }
    expect(res.status).to.equal(400);  // submission controller should send 400 on validation error
    expect(res.body).to.have.property('error');
  });

  it('rejects incorrect flag', async () => {
    const list = await request(app).get('/api/challenges');
    const target = list.body[0];
    const idForRoute = target.id || target._id;

    const res = await request(app)
      .post(`/submit/${idForRoute}`)
      .send({ flag: 'FLAG{nope}' });
    expect(res.status).to.equal(400);
    expect(res.body.correct).to.equal(false);
  });

  it('accepts correct flag and awards points', async () => {
    // We know wf101’s correct flag from our seed
    // Get its route id dynamically (id or _id)
    const list = await request(app).get('/api/challenges');
    const wf = list.body.find(x => x.id === 'wf101' || x.title === 'Windows Forensics 101') || list.body[0];
    const idForRoute = wf.id || wf._id;

    const res = await request(app)
      .post(`/submit/${idForRoute}`)
      .send({ flag: 'FLAG{registry_run_keys}' });
    expect(res.status).to.equal(200);
    expect(res.body.correct).to.equal(true);
    expect(res.body).to.have.property('pointsAwarded').that.is.a('number');
  });
});
