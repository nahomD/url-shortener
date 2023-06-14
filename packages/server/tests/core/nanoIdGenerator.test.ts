import { NanoIdGenerator } from '../../src/core/nanoIdGenerator';

test('generates 1000 unique ids', async () => {
  const generated: Array<string> = [];
  const generator = new NanoIdGenerator();

  for (let index = 0; index < 1000; index++) {
    const id = (await generator.generateUrlId()).getId();

    expect(generated.includes(id)).toBe(false);
    generated.push(id);
  }
});
