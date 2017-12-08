// TO DO! change bytes to a systematic order (reserved)

const INIT = 0b00000001;
const SET = 0b00000010;
const SAVE = 0b00000100;
const MUL = 0b00000101;
const PRN = 0b00000110;
const HALT = 0b00000000;
const ADD = 0b00001111;
const SUB = 0b00010000;
const DIV = 0b00010001;
const INC = 0b00010100;

// TO DO! Make a helper function to print for debugging

// setting up 'memory' aka array
class CPU {
  //FIND OUT REASON RAM IS A PARAMETER
  constructor(ram) {
    this.ram = ram;

    this.curReg = 0;

    this.reg = new Array(256);
    this.reg.fill(0); // fills them with 0s

    // program counter
    this.reg.PC = 0;

    this.buildBranchTable();
  }

  /**
   * Build the branch table (Does?? --Controls Program Flow)
   */
  buildBranchTable() {
    this.branchTable = {
      [INIT]: this.INIT,
      [SET]: this.SET,
      [SAVE]: this.SAVE,
      [MUL]: this.MUL,
      [PRN]: this.PRN,
      [HALT]: this.HALT,
      [ADD]: this.ADD,
      [SUB]: this.SUB,
      [DIV]: this.DIV
      // [INC]: this.INC
    };
  }

  /**
   * Poke values into memory (fills it)
   */
  poke(address, value) {
    this.ram.write(address, value);
  }

  /**
   * start the clock
   */
  startClock() {
    this.clock = setInterval(() => {
      this.tick();
    }, 1);
  }

  /**
   * Stop the clock
   */
  stopClock() {
    clearInterval(this.clock);
  }

  /**
   * Each tick of the clock
   */
  tick() {
    // Run the instructions

    // run instructions depending on where is the clock (starts at 0)
    const currentInstruction = this.ram.read(this.reg.PC);

    // controls branch table
    const handler = this.branchTable[currentInstruction];

    if (handler === undefined) {
      console.error('ERROR: invalid instruction ' + currentInstruction);
      this.stopClock();
      return;
    }

    handler.call(this); // set this explicitly in handler (.call)
  }

  /**
   * Handle INIT (1 bit instuction)
   */
  INIT() {
    console.log('INIT');
    this.curReg = 0;

    this.reg.PC++; // go to next instruction
  }

  /**
   * Handle SET (2 byte instruction)
   */
  SET() {
    const reg = this.ram.read(this.reg.PC + 1); // sets current register
    console.log('SET ' + reg);

    this.curReg = reg;

    this.reg.PC += 2; // go to next instruction
  }

  /**
   * Handle SAVE
   */
  SAVE() {
    const val = this.ram.read(this.reg.PC + 1);
    console.log('SAVE ' + val);

    // Store the value in the current register
    this.reg[this.curReg] = val;

    this.reg.PC += 2; // go to next instruction
  }

  /**
   * Handle MULTIPLY
   */
  MUL() {
    // sets the registry to R0 and R1
    const reg0 = this.ram.read(this.reg.PC + 1);
    const reg1 = this.ram.read(this.reg.PC + 2);

    console.log('MUL ' + reg0 + ' ' + reg1);

    // gets the values of R1 and R2
    const regVal0 = this.reg[reg0];
    const regVal1 = this.reg[reg1];

    this.reg[this.curReg] = regVal0 * regVal1;
    //const product = this.reg[this.curReg];

    this.reg.PC += 3;
  }

  /**
   * Handle ADD
   */
  ADD() {
    // sets the registry to R0 and R1
    const reg0 = this.ram.read(this.reg.PC + 1);
    const reg1 = this.ram.read(this.reg.PC + 2);

    console.log('ADD ' + reg0 + ' ' + reg1);

    // gets the values of R1 and R2
    const regVal0 = this.reg[reg0];
    const regVal1 = this.reg[reg1];

    this.reg[this.curReg] = regVal0 + regVal1;
    //const product = this.reg[this.curReg];

    this.reg.PC += 3;
  }

  /**
   * Handle SUB
   */
  SUB() {
    // sets the registry to R0 and R1
    const reg0 = this.ram.read(this.reg.PC + 1);
    const reg1 = this.ram.read(this.reg.PC + 2);

    console.log('SUB ' + reg0 + ' ' + reg1);

    // gets the values of R1 and R2
    const regVal0 = this.reg[reg0];
    const regVal1 = this.reg[reg1];

    this.reg[this.curReg] = regVal0 - regVal1;
    //const product = this.reg[this.curReg];

    this.reg.PC += 3;
  }

  /**
   * Handle DIV
   */
  DIV() {
    // sets the registry to R0 and R1
    const reg0 = this.ram.read(this.reg.PC + 1);
    const reg1 = this.ram.read(this.reg.PC + 2);

    console.log('DIV ' + reg0 + ' ' + reg1);

    // gets the values of R1 and R2
    const regVal0 = this.reg[reg0];
    const regVal1 = this.reg[reg1];

    if (regVal1 === 0) {
      console.error('ERROR: Cant divide by 0 ' + currentInstruction);
      this.stopClock();
      return;
    }

    this.reg[this.curReg] = regVal0 / regVal1;

    //const product = this.reg[this.curReg];

    this.reg.PC += 3;
  }

  /**
   * Handle PRN
   */
  PRN() {
    console.log('PRN');

    //print the current register
    console.log(this.reg[this.curReg]);

    this.reg.PC++;
  }

  /**
   * Handle HALT
   */
  HALT() {
    //stops the clock
    this.stopClock();
  }
}

module.exports = CPU;
