import { NanoIdGenerator } from '../../src/core/nanoIdGenerator';

test('generates 2000 9-character unique ids', async () => {
  const generated: Array<string> = [];
  const generator = new NanoIdGenerator();

  for (let index = 0; index < 2000; index++) {
    const id = await generator.generateId();

    expect(generated.includes(id)).toBe(false);
    expect(id.length).toBe(9);
    generated.push(id);
  }
});
