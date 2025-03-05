export const OPMModeSettings: { active: boolean } = {
    active: false,
  };
  
  export const g: { 
    completionDebounceInterval: number; 
    saveDebounceInterval: number; 
    EDITOR_LOCALSTORAGE_KEY: string;
  } = {
    completionDebounceInterval: 150,    
    saveDebounceInterval: 500,         
    EDITOR_LOCALSTORAGE_KEY: 'editor_content',
  }

  export const placeholderCode: string = `
  #include <cassert>
  #include <cstdlib>
  #include <iostream>
  
  class Cpu {
    public:
      virtual int dummy( int, int ) {}
    private:
      virtual int add_( int a, int b ) { return a + b; }  // A
      virtual int sub_( int a, int b ) { return a - b; }  // B
      virtual int mul_( int a, int b ) { return a * b; }  // C
      virtual int div_( int a, int b ) { return a / b; }  // D
      virtual int mod_( int a, int b ) { return a % b; }  // E
      virtual int and_( int a, int b ) { return a & b; }  // F
      virtual int or_( int a, int b )  { return a | b; }  // G
      virtual int xor_( int a, int b ) { return a ^ b; }  // H
  };
  
  int main( int argc, char* argv[] ) {
      typedef int (Cpu::*Memfun)( int, int );
  
      union {
          Memfun fn;
          unsigned char ptr[6];
      } u;
  
      Cpu    cpu;
  
      u.fn = &Cpu::dummy;
  
      assert( argc == 4 );
  
      int p1 = atoi( argv[ 1 ] );
      int p2 = atoi( argv[ 3 ] );
      char op = argv[2][0];
  
      assert( op >= 'A' && op <= 'H' );
  
      u.ptr[0] = 1 + 4 * ( op - 'A' + 1 );  // Don't look here!
  
      std::cout << "The answer is " << ( (cpu.*(u.fn))( p1, p2 ) ) << std::endl;
  }
  `;
  
  