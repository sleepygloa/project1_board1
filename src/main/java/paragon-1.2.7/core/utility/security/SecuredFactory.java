package paragon.core.utility.security;

import java.io.PrintStream;
import java.io.UnsupportedEncodingException;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.FactoryBean;

public class SecuredFactory implements FactoryBean<Object>
{
  private static final Log LOG = LogFactory.getLog(SecuredFactory.class);
  private String encryptedData;
  public static final String ISO8859_1 = "ISO8859-1";
  
  public SecuredFactory() {
    encryptedData = null;
  }
  
  public Object getObject() throws UnsupportedEncodingException {
    String decryptedData = EncryptUtil.decryptAsString(
      Base64.decodeBase64(encryptedData.getBytes("ISO8859-1")), 
      "qjxprdkdlelvmfpdladnjzm".getBytes("ISO8859-1"), "ISO8859-1");
    return decryptedData;
  }
  
  public static String encryptData(String data)
  {
    try
    {
      decryptedData = new String(Base64.encodeBase64(
        EncryptUtil.encrypt(data.getBytes("ISO8859-1"), 
        "qjxprdkdlelvmfpdladnjzm".getBytes("ISO8859-1"))), 
        "ISO8859-1");
    } catch (UnsupportedEncodingException e) { String decryptedData;
      e.printStackTrace();
      LOG.error("Exception", e);
      return null; }
    String decryptedData;
    return decryptedData;
  }
  
  public String getEncryptedData() {
    return encryptedData;
  }
  
  public void setEncryptedData(String encryptedData) {
    this.encryptedData = encryptedData;
  }
  

  public Class<?> getObjectType()
  {
    return String.class;
  }
  
  public boolean isSingleton()
  {
    return false;
  }
  
  public static void main(String[] args) {
    SecuredFactory sf = new SecuredFactory();
    try
    {
      System.out.println(encryptData("PWMS"));
      sf.setEncryptedData("Fm1oqEZfdMmZTj/WzvlfEQ==");
      
      System.out.println(sf.getObject().toString());
    } catch (UnsupportedEncodingException e) {
      e.printStackTrace();
    }
  }
}
