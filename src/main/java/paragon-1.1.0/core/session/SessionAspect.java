package paragon.core.session;

import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;

public class SessionAspect
{
  @Autowired
  HttpSession session;
  
  public SessionAspect() {}
}
