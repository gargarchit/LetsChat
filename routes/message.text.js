var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {
  it('message object', () => {
    var from = 'Archit';
    var text = 'Some message';
    var message = generateMessage(from, text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, text});
  });
});