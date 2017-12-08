/**
 * RAM
 */

class RAM {
  constructor(size) {
    this.mem = new Array(size);
    this.mem.fill(0);
  }

  /**
   * Write (store) MDR at address MAR
   *
   * @returns MDR
   */
  write(MAR, MDR) {
    return this.access(MAR, MDR, true);
  }

  /**
   * Read (load) MDR from MAR
   *
   * @returns MDR
   */
  read(MAR) {
    return this.access(MAR, null, false);
  }

  /**
   * General Helper function to access RAM
   * @param {Number} MAR Memory Address Register
   * @param {Number} MDR Memory Address Register
   * @param {Boolean} write True if writing, false if reading
   */
  access(MAR, MDR, write) {
    if (write) {
      this.mem[MAR] = MDR;
    } else {
      //read
      MDR = this.mem[MAR];
    }
    return MDR;
  }
}
module.exports = RAM;
