package paragon.core.paramaters;

import java.util.List;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;


public class FileParams
  extends BaseParams
{
  private static final long serialVersionUID = 1L;
  
  public FileParams() {}
  
  public FileParams(Params p)
  {
    super.putAll(p);
    super.setFileable(true);
  }
  
  public FileParams(Map<String, Object> result) { if (result != null) {
      putAll(result);
    }
  }
  
  public List<MultipartFile> getFiles(String key) {
    return (List)get(key);
  }
  
  public MultipartFile getFile(String key) {
    if (getFiles(key).size() == 0) {
      return null;
    }
    return (MultipartFile)getFiles(key).get(0);
  }
  
  public MultipartFile getFile(String key, int idx) { if (getFiles(key).size() == 0) {
      return null;
    }
    return (MultipartFile)getFiles(key).get(idx);
  }
}
