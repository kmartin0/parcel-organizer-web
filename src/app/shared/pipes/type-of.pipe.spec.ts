import {TypeOfPipe} from './type-of.pipe';

describe('TypeOfPipe', () => {

  class TestStub {

  }

  it('should return constructor name', () => {
    let typeOfPipe = new TypeOfPipe();
    let input = new TestStub();

    expect(typeOfPipe.transform(input)).toEqual('TestStub')
  });
})
