package paragon.core.session;


public class SessionVo
{
  private String login_id;
  
  private String login_nm;
  
  private String dept_cd;
  private String up_id;
  private String dept_nm;
  private String dept_list;
  private String auth_gubun;
  private String auth_gubun_name;
  private String system_date;
  private String dept_cd_list;
  
  public SessionVo() {}
  
  public String getLogin_id()
  {
    return login_id;
  }
  
  public void setLogin_id(String login_id) { this.login_id = login_id; }
  
  public String getUp_id() {
    return up_id;
  }
  
  public String getLogin_nm() { return login_nm; }
  
  public void setLogin_nm(String login_nm) {
    this.login_nm = login_nm;
  }
  
  public void setUp_id(String up_id) { this.up_id = up_id; }
  
  public String getDept_cd() {
    return dept_cd;
  }
  
  public void setDept_cd(String dept_cd) { this.dept_cd = dept_cd; }
  
  public String getDept_nm() {
    return dept_nm;
  }
  
  public void setDept_nm(String dept_nm) { this.dept_nm = dept_nm; }
  
  public String getDept_list() {
    return dept_list;
  }
  
  public void setDept_list(String dept_list) { this.dept_list = dept_list; }
  
  public String getAuth_gubun() {
    return auth_gubun;
  }
  
  public void setAuth_gubun(String auth_gubun) { this.auth_gubun = auth_gubun; }
  
  public String getAuth_gubun_name() {
    return auth_gubun_name;
  }
  
  public void setAuth_gubun_name(String auth_gubun_name) { this.auth_gubun_name = auth_gubun_name; }
  
  public String getSystem_date() {
    return system_date;
  }
  
  public void setSystem_date(String system_date) { this.system_date = system_date; }
  
  public String getDept_cd_list() {
    return dept_cd_list;
  }
  
  public void setDept_cd_list(String dept_cd_list) { this.dept_cd_list = dept_cd_list; }
  
  public String toString()
  {
    return 
    



      "SessionVo [login_id=" + login_id + ", login_nm=" + login_nm + ", dept_cd=" + dept_cd + ", up_id=" + up_id + ", dept_nm=" + dept_nm + ", dept_list=" + dept_list + ", auth_gubun=" + auth_gubun + ", auth_gubun_name=" + auth_gubun_name + ", system_date=" + system_date + ", dept_cd_list=" + dept_cd_list + "]";
  }
}
