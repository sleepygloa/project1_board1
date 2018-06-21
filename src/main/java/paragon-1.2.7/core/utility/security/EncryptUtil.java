package paragon.core.utility.security;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.logging.Log;

public class EncryptUtil
{
  private static final Log LOG = org.apache.commons.logging.LogFactory.getLog(EncryptUtil.class);
  
  public EncryptUtil() {}
  
  public static byte[] encrypt(byte[] sbuffer, byte[] szKey) { SeedCipher cipher = new SeedCipher();
    return cipher.encrypt(sbuffer, szKey);
  }
  
  public static final String ISO8859_1 = "iso8859-1";
  public static byte[] encrypt(String inData, byte[] szKey) { return encrypt(inData.getBytes(), szKey); }
  

  public static byte[] encrypt(String inData, byte[] szKey, String charset) throws UnsupportedEncodingException
  {
    return encrypt(inData.getBytes(charset), szKey);
  }
  
  public static byte[] decrypt(byte[] encryptBytes, byte[] szKey) {
    SeedCipher cipher = new SeedCipher();
    return cipher.decrypt(encryptBytes, szKey);
  }
  
  public static String decryptAsString(byte[] encryptBytes, byte[] szKey) {
    return new String(decrypt(encryptBytes, szKey));
  }
  
  public static String decryptAsString(byte[] encryptBytes, byte[] szKey, String charset) throws UnsupportedEncodingException
  {
    return new String(decrypt(encryptBytes, szKey), charset);
  }
  
  public static String digestMD5(String str) {
    byte[] defaultBytes = str.getBytes();
    try {
      MessageDigest algorithm = MessageDigest.getInstance("MD5");
      algorithm.reset();
      algorithm.update(defaultBytes);
      byte[] messageDigest = algorithm.digest();
      
      StringBuilder hexString = new StringBuilder();
      
      for (int i = 0; i < messageDigest.length; i++)
      {
        hexString.append(String.format("%02X", new Object[] {
          Integer.valueOf(0xFF & messageDigest[i]) }));
      }
      
      return hexString.toString();
    } catch (NoSuchAlgorithmException e) {}
    return null;
  }
  
  public static byte[] digestSHA256(byte[] sbuffer)
  {
    try
    {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      digest.reset();
      return digest.digest(sbuffer);
    } catch (NoSuchAlgorithmException e) {
      LOG.error("Exception", e);
    }
    return null;
  }
  
  public static String digestSHA256(String data)
  {
    try
    {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      digest.reset();
      byte[] bin = digest.digest(data.getBytes("ISO8859-1"));
      String mdData = "";
      for (byte b : bin) {
        String t = Integer.toHexString(b);
        if (t.length() < 2) {
          mdData = mdData + "0" + t;
        } else {
          mdData = mdData + t.substring(t.length() - 2);
        }
      }
      return mdData;
    } catch (NoSuchAlgorithmException e) {
      LOG.error("Exception", e);
      return null;
    } catch (UnsupportedEncodingException e) {
      LOG.error("Exception", e); }
    return null;
  }
  
  public static String digestSHA256Base64(String data) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      digest.reset();
      byte[] bin = digest.digest(data.getBytes("ISO8859-1"));
      return Base64.encodeBase64String(bin);
    } catch (NoSuchAlgorithmException e) {
      LOG.error("Exception", e);
      return null;
    } catch (UnsupportedEncodingException e) {
      LOG.error("Exception", e);
    }
    return null;
  }
}
