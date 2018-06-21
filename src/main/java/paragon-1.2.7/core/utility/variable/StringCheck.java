package paragon.core.utility.variable;

public class StringCheck {
  public StringCheck() {}
  
  public static String nullToBlank(String tmp) {
    return (tmp == null) || (tmp.trim().length() == 0) ? "" : tmp;
  }
}
