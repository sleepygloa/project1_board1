package paragon.core.utility.encoder;

import java.io.UnsupportedEncodingException;

public class Encoder
{
  public Encoder() {}
  
  public static String isoToEuc(String tmp) {
    String euc = "";
    try {
      euc = new String(tmp.getBytes("ISO-8859-1"), "EUC-KR");
    } catch (UnsupportedEncodingException e) {
      e.printStackTrace();
    }
    return euc;
  }
  
  public static String isoToUtf(String tmp) { String utf = "";
    try {
      utf = new String(tmp.getBytes("ISO-8859-1"), "UTF-8");
    } catch (UnsupportedEncodingException e) {
      e.printStackTrace();
    }
    return utf;
  }
  
  public static String eucToIso(String tmp) {
    String iso = "";
    try {
      iso = new String(tmp.getBytes("EUC-KR"), "ISO-8859-1");
    } catch (UnsupportedEncodingException e) {
      e.printStackTrace();
    }
    return iso;
  }
  
  public static String utfToEuc(String tmp) {
    String euc = "";
    try {
      euc = new String(tmp.getBytes("UTF-8"), "EUC-KR");
    } catch (UnsupportedEncodingException e) {
      e.printStackTrace();
    }
    return euc;
  }
  
  public static String eucToUtf(String tmp) {
    String utf = "";
    try {
      utf = new String(tmp.getBytes("EUC-KR"), "UTF-8");
    } catch (UnsupportedEncodingException e) {
      e.printStackTrace();
    }
    return utf;
  }
  
  public static java.util.Map<String, String> isoToUtfMap(java.util.Map<String, String> tmp)
  {
    if (tmp != null) {
      java.util.Set key = tmp.keySet();
      for (java.util.Iterator iterator = key.iterator(); iterator.hasNext();) {
        String keyName = (String)iterator.next();
        String valueName = (String)tmp.get(keyName);
        tmp.put(keyName, isoToUtf(valueName));
      }
    }
    return tmp;
  }
  
  public static String utfToiso(String tmp) { String utf = "";
    try {
      utf = new String(tmp.getBytes("UTF-8"), "ISO-8859-1");
    } catch (UnsupportedEncodingException e) {
      e.printStackTrace();
    }
    return utf;
  }
}
