package paragon.core.utility.security;

public abstract interface CryptoPadding
{
  public abstract byte[] addPadding(byte[] paramArrayOfByte, int paramInt);
  
  public abstract byte[] removePadding(byte[] paramArrayOfByte, int paramInt);
}
