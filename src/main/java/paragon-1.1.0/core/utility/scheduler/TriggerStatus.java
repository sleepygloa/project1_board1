package paragon.core.utility.scheduler;

public class TriggerStatus
{
  public static int STATE_NONE = -1;
  public static int STATE_NORMAL = 0;
  public static int STATE_PAUSED = 1;
  public static int STATE_COMPLETE = 2;
  public static int STATE_ERROR = 3;
  public static int STATE_BLOCKED = 4;
  
  public TriggerStatus() {}
}
