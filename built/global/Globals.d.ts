export namespace OPMModeSettings {
    let active: boolean;
}
export namespace g {
    let completionDebounceInterval: number;
    let saveDebounceInterval: number;
    let EDITOR_LOCALSTORAGE_KEY: string;
}
export const placeholderCode: "\n#include <cassert>\n#include <cstdlib>\n#include <iostream>\n\nclass Cpu {\n  public:\n    virtual int dummy( int, int ) {}\n  private:\n    virtual int add_( int a, int b ) { return a + b; }  // A\n    virtual int sub_( int a, int b ) { return a - b; }  // B\n    virtual int mul_( int a, int b ) { return a * b; }  // C\n    virtual int div_( int a, int b ) { return a / b; }  // D\n    virtual int mod_( int a, int b ) { return a % b; }  // E\n    virtual int and_( int a, int b ) { return a & b; }  // F\n    virtual int or_( int a, int b )  { return a | b; }  // G\n    virtual int xor_( int a, int b ) { return a ^ b; }  // H\n};\n\nint main( int argc, char* argv[] ) {\n    typedef int (Cpu::*Memfun)( int, int );\n\n    union {\n        Memfun fn;\n        unsigned char ptr[6];\n    } u;\n\n    Cpu    cpu;\n\n    u.fn = &Cpu::dummy;\n\n    assert( argc == 4 );\n\n    int p1 = atoi( argv[ 1 ] );\n    int p2 = atoi( argv[ 3 ] );\n    char op = argv[2][0];\n\n    assert( op >= 'A' && op <= 'H' );\n\n    u.ptr[0] = 1 + 4 * ( op - 'A' + 1 );  // Don't look here!\n\n    std::cout << \"The answer is \" << ( (cpu.*(u.fn))( p1, p2 ) ) << std::endl;\n}\n";
//# sourceMappingURL=Globals.d.ts.map