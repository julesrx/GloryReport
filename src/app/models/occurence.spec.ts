import { Occurence } from './occurence';

describe('Occurence', () => {
  it('should create an instance', () => {
    expect(new Occurence('0123456789', 'Name')).toBeTruthy();
  });
});
