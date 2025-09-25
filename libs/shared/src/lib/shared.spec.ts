import { shared } from './shared';

describe('shared', () => {
  it('should return shared string', () => {
    expect(shared()).toEqual('shared');
  });
});
