package paragon.core.paramaters;

import java.util.Map;

public class CommParams
  extends BaseParams implements Params
{
  private static final long serialVersionUID = -3659932678501916354L;
  
  public CommParams() {}
  
  public CommParams(Params p)
  {
    super.putAll(p);
  }
  
  public CommParams(Map<String, Object> result)
  {
    if (result != null) {
      putAll(result);
    }
  }
}
