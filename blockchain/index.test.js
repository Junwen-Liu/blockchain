const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain', ()=>{
    let bc, bc2;

    beforeEach(()=>{
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it('starts with genesis block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block', () => {
        const data = 'foo';
        bc.addBlock(data);

        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    });

    it('validate a valid chain', ()=>{
        bc2.addBlock('foo');
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    it('invalidate a corrupted chain on genesis block', ()=>{
        bc.chain[0].data = 'bad data';
        expect(bc2.isValidChain(bc.chain)).toBe(false);
    });

    it('invalidate a corrupeted chain not on genesis block', ()=>{
        bc.addBlock('foo');
        bc.chain[1].data = 'bad data';
        expect(bc2.isValidChain(bc.chain)).toBe(false);
    });

    it('replace the chain with a valid chain', ()=>{
        bc2.addBlock('good');
        bc.replaceChain(bc2.chain);
        expect(bc.chain).toEqual(bc2.chain);
    });

    it('replace the chain with an invalid chain', ()=>{
        bc.addBlock('good');
        bc.replaceChain(bc2.chain);
        expect(bc.chain).not.toEqual(bc2.chain);
    })
});