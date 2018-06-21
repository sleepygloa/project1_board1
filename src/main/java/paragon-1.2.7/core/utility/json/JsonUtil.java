package paragon.core.utility.json;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import java.io.IOException;
import java.util.Iterator;
import net.sf.json.JSONException;
import net.sf.json.JSONObject;
import paragon.core.paramaters.Params;

public class JsonUtil
{
  public JsonUtil() {}
  
  public static String marshallingJson(Object object) throws com.fasterxml.jackson.core.JsonGenerationException, JsonMappingException, IOException
  {
    ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
    String jsonText = ow.writeValueAsString(object);
    jsonText = jsonText.replaceAll("\r\n", "");
    
    return jsonText;
  }
  
  public static <T> T unmarshallingJson(String jsonText, Class<T> valueType) throws JsonParseException, JsonMappingException, IOException
  {
    ObjectMapper objectMapper = new ObjectMapper();
    return objectMapper.readValue(jsonText, valueType);
  }
  
  public static <T> T unmarshallingJson(String jsonText)
    throws JsonParseException, JsonMappingException, IOException
  {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.readValue(jsonText, new com.fasterxml.jackson.core.type.TypeReference() {});
  }
  
  public static Params jsonStringToParameters(String jsonText, Params inParams) throws JSONException
  {
    JSONObject js = JSONObject.fromObject(jsonText);
    
    Iterator<String> i = js.keys();
    
    while (i.hasNext()) {
      String key = (String)i.next();
      Object variable = js.get(key);
      inParams.setParam(key, variable);
    }
    
    return inParams;
  }
}
