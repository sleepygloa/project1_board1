package paragon.core.utility.security;

public class AnsiX923Padding implements CryptoPadding {
  private String name;
  private static final byte paddingValue = 0;
  
  public AnsiX923Padding() {
    name = "ANSI-X.923-Padding";
  }
  
  public byte[] addPadding(byte[] source, int blockSize) {
    int paddingCnt = source.length % blockSize;
    byte[] paddingResult = null;
    
    if (paddingCnt != 0) {
      paddingResult = new byte[source.length + blockSize - paddingCnt];
      
      System.arraycopy(source, 0, paddingResult, 0, source.length);
      
      int addPaddingCnt = blockSize - paddingCnt;
      for (int i = 0; i < addPaddingCnt; i++) {
        paddingResult[(source.length + i)] = 0;
      }
      
      paddingResult[(paddingResult.length - 1)] = ((byte)addPaddingCnt);
    } else {
      paddingResult = source;
    }
    
    return paddingResult;
  }
  
  public byte[] removePadding(byte[] source, int blockSize) {
    byte[] paddingResult = null;
    boolean isPadding = false;
    
    int lastValue = source[(source.length - 1)];
    if (lastValue < blockSize) {
      int zeroPaddingCount = lastValue - 1;
      
      for (int i = 2; i < zeroPaddingCount + 2; i++) {
        if (source[(source.length - i)] != 0) {
          isPadding = false;
          break;
        }
      }
      
      isPadding = true;
    } else {
      isPadding = false;
    }
    
    if (isPadding) {
      paddingResult = new byte[source.length - lastValue];
      System.arraycopy(source, 0, paddingResult, 0, paddingResult.length);
    } else {
      paddingResult = source;
    }
    
    return paddingResult;
  }
  
  public String getName() {
    return name;
  }
}
