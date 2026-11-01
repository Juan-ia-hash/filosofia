import test from 'node:test';
import assert from 'node:assert/strict';
import {destination,directionFromKey,directionFromPoint,FINALE_INDEX} from '../src/lib/navigation.mjs';
test('academic boundaries and controlled finale restart',()=>{
 assert.equal(destination(0,-1),0);
 assert.equal(destination(0,1),1);
 assert.equal(destination(1,-1),0);
 assert.equal(destination(9,-1),8);
 assert.equal(destination(16,1),FINALE_INDEX);
 assert.equal(destination(FINALE_INDEX,-1),16);
 assert.equal(destination(FINALE_INDEX,1),0);
});
test('physical zones use the full stage, including offset screens',()=>{
 assert.equal(directionFromPoint(25,0,100),-1);
 assert.equal(directionFromPoint(50,0,100),1);
 assert.equal(directionFromPoint(110,100,100),-1);
 assert.equal(directionFromPoint(190,100,100),1);
});
test('all required navigation shortcuts',()=>{
 for(const key of ['ArrowRight',' ','PageDown'])assert.equal(directionFromKey(key),1);
 for(const key of ['ArrowLeft','PageUp'])assert.equal(directionFromKey(key),-1);
 for(const key of ['Tab','Enter','f','p','Escape'])assert.equal(directionFromKey(key),0);
});
