package paragon.core.utility.common;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.RSAPrivateKeySpec;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.util.ResourceUtils;
import paragon.core.exception.SystemException;
import paragon.core.utility.config.Config;
import paragon.core.utility.date.DateUtil;



public class LicenseUtil
{
  private static final Log LOG = LogFactory.getLog(LicenseUtil.class);
  private static String resourcePath;
  
  public LicenseUtil() {}
  
  public static String getResourcePath() {
    return resourcePath;
  }
  
  public void setResourcePath(String resourcePath)
  {
    resourcePath = resourcePath;
  }
  
  public static void check() {
    int mb = 1048576;
    long heapSize = Runtime.getRuntime().totalMemory();
    
    if (("WKR".equals(Config.getString("operation.mode"))) && (heapSize / mb < 1024L)) {
      if (LOG.isInfoEnabled()) {
        LOG.info("License Check: pass the license check");
      }
      
      return;
    }
    
    String path = getResourcePath();
    
    if (path == null) {
      if (LOG.isErrorEnabled()) {
        LOG.error("ERROR: Failed to pass the license check");
        LOG.error("ERROR: file path is empty");
      }
      throw new SystemException();
    }
    if (LOG.isInfoEnabled()) {
      LOG.info("License file path : " + path);
    }
    
    String content = fileCheck(path);
    if (content != null) {
      decodeContent(content);
    } else {
      LOG.error("ERROR: Failed to pass the license check");
      LOG.error("ERROR: file is empty");
      throw new SystemException();
    }
  }
  
  private static String fileCheck(String path) {
    String content = null;
    File file = null;
    try {
      file = ResourceUtils.getFile(path);
      RandomAccessFile dat = new RandomAccessFile(file, "rw");
      
      String line = null;
      int count = 0;
      while ((line = dat.readLine()) != null) {
        if (count == 0) {
          content = line;
          count++;
        }
        
        content = content + line;
      }
      dat.close();
    } catch (FileNotFoundException e) {
      LOG.error("ERROR: Failed to pass the license check");
      LOG.error("ERROR: file not found");
      e.printStackTrace();
      throw new SystemException(e);
    } catch (IOException e) {
      e.printStackTrace();
      throw new SystemException(e);
    }
    return content;
  }
  
  private static void decodeContent(String content) {
    byte[] bytes = Base64.decodeBase64(content.getBytes());
    content = new String(bytes);
    String[] dsInfo = content.split("]");
    String hostName = null;
    String publicKey = null;
    String privateKey = null;
    LOG.error("dsInfo : " + dsInfo);
    if (dsInfo != null) {
      for (String info : dsInfo) {
        LOG.error("info : " + info);
        info = info.substring(1, info.length());
        
        String[] keywords = info.split(":");
        int i = 0;
        
        if ((keywords != null) && (keywords[i] != null) && (keywords.length > 1))
        {

          if (keywords[i].contains("HOSTNAME")) {
            hostName = keywords[(i + 1)];
          } else if (keywords[i].contains("KEY")) {
            String[] keyword = keywords[(i + 1)].split(",");
            
            if ((keyword != null) && (keyword.length > 1)) {
              publicKey = keyword[i];
              
              privateKey = keyword[(i + 1)];
            }
          }
          else if (keywords[i].contains("EXPIRY DATE"))
          {
            String date = keywords[(i + 1)];
            
            Calendar cal = Calendar.getInstance();
            
            cal.setTime(new Date(System.currentTimeMillis()));
            
            String toDay = new SimpleDateFormat("yyyy-MM-dd").format(cal.getTime());
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
            
            try
            {
              Date currentDate = formatter.parse(toDay);
              expireDate = formatter.parse(date);
            } catch (ParseException e) { Date expireDate;
              e.printStackTrace();
              LOG.error("ERROR: parsing error");
              throw new SystemException(e); }
            Date expireDate;
            Date currentDate;
            if (currentDate.compareTo(expireDate) > 0) {
              LOG.error("ERROR: Failed to pass the license check");
              LOG.error("ERROR: Date check, EXPIRY DATE =" + date);
              throw new SystemException();
            }
            
            int diffDate = DateUtil.getDiffDayCount(DateUtil.formatDateString(currentDate), DateUtil.formatDateString(expireDate));
            
            if (diffDate <= 30) {
              LOG.error("Please check the license expiration. The remain days are " + diffDate + ", expiration date is " + DateUtil.formatDateString(expireDate));
            }
          }
        }
      }
    }
    

    if ((hostName != null) && (publicKey != null) && (privateKey != null)) {
      PrivateKey pk = getPrivateKey(publicKey, privateKey);
      
      hostName = decrypt(hostName, pk);
      
      if ((hostName == null) || (hostName.compareTo(ResourceUtil.getWasHostname()) != 0)) {
        LOG.error("ERROR: Failed to pass the license check");
        LOG.error("ERROR: use a different HostName");
        LOG.error("File hostname : " + hostName);
        LOG.error("Was hostname : " + ResourceUtil.getWasHostname());
        throw new SystemException();
      }
      LOG.info("License Check Complete");
    } else {
      LOG.error("ERROR: invalid License error");
      LOG.error("ERROR: check license file");
      throw new SystemException();
    }
  }
  
  private static PrivateKey getPrivateKey(String modulu, String privateExponent) {
    BigInteger modulus = new BigInteger(modulu, 32);
    BigInteger pExponent = new BigInteger(privateExponent, 32);
    PrivateKey privateKey = null;
    try {
      privateKey = KeyFactory.getInstance("RSA").generatePrivate(new RSAPrivateKeySpec(modulus, pExponent));
    } catch (InvalidKeySpecException e) {
      e.printStackTrace();
      throw new SystemException(e);
    } catch (NoSuchAlgorithmException e) {
      e.printStackTrace();
      throw new SystemException(e);
    }
    
    return privateKey;
  }
  
  private static String decrypt(String encryptedBase64Text, PrivateKey privateKey) {
    byte[] bytes = Base64.decodeBase64(encryptedBase64Text.getBytes());
    String decryptedText = null;
    try {
      Cipher cipher = Cipher.getInstance("RSA");
      
      cipher.init(2, privateKey);
      
      decryptedText = new String(cipher.doFinal(bytes));
    } catch (NoSuchAlgorithmException e) {
      e.printStackTrace();
      throw new SystemException(e);
    } catch (NoSuchPaddingException e) {
      e.printStackTrace();
      throw new SystemException(e);
    } catch (InvalidKeyException e) {
      e.printStackTrace();
      throw new SystemException();
    } catch (IllegalBlockSizeException e) {
      e.printStackTrace();
      throw new SystemException(e);
    } catch (BadPaddingException e) {
      e.printStackTrace();
      throw new SystemException(e);
    }
    
    return decryptedText;
  }
}
