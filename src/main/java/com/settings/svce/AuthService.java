package com.settings.svce;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import paragon.core.mvc.stereotype.ParagonService;
import paragon.core.paramaters.CommParams;
import paragon.core.paramaters.LinkedParams;
import paragon.core.paramaters.Params;
import paragon.core.paramaters.ParamsFactory;
import paragon.core.paramaters.datatable.DataTable;
import paragon.core.paramaters.datatable.datarow.DataRow;
import paragon.core.utility.variable.CommUtil;

@Service
public class AuthService extends ParagonService {

	private static final Log LOG = LogFactory.getLog(AuthService.class);

	/**
	 * 메뉴별 권한 목록
	 *
	 * @Author "Kim Jin Ho"
	 * @Date 2016. 11. 28.
	 */
	public Params getMenuAuthList(Params inParams) {
		DataTable dt_columns =  getSqlManager().selectDataTable("AuthService.getAuthColunms", inParams);
		inParams.setDataTable("dt_columns",dt_columns);
		Params outParma =  getSqlManager().selectGridParams("AuthService.getMenuAuthList", inParams);
		LinkedParams lkp = new LinkedParams(outParma,"MENU_PARENT_SEQ","MENU_SEQ","MENU_ORDER");
		return lkp;
	}

	/**
	 * 동적 해더값으로 인한 언어 조회 (언어관리외 별도 개발)
	 *
	 * @Author "Kim Jin Ho"
	 * @Date 2016. 11. 28.
	 */
	public Params getLangAuthColumns(Params inParams) {
//		String val =getSqlManager().selectOne("LanguageService.getLangColumns",inParams);
//		LOG.debug(val);
//		if(val !=null && !val.equals("")){
//			List<String> list = Arrays.asList(val.split("\\|"));
//			inParams.setParam("colNames",list);
	    LOG.debug(inParams);
			DataTable dt_columns =  getSqlManager().selectDataTable("AuthService.getAuthColunms", inParams);
			inParams.setParam("customModel", dt_columns);
//		}else{
//			throw new ParagonException("MSG_COM_ERR_007");
//		}
		return inParams;
	}

	/**
	 * 권한그룹 목롭(콤보박스)
	 *
	 * @Author "Kim Jin Ho"
	 * @Date 2016. 11. 28.
	 */
	public DataTable getAuthGroupList(Params inParams) {
		return getSqlManager().selectDataTable("AuthService.getAuthGroupList");
	}

	/**
	 * 해당그룹의 권한 사용자 목록
	 *
	 * @Author "Kim Jin Ho"
	 * @Date 2016. 11. 29.
	 */
	public DataTable getAuthUserList(Params inParams) {
		return getSqlManager().selectDataTable("AuthService.getAuthUserList",inParams);

	}

	/**
	 * 권한 미등록자 조회
	 *
	 * @Author "Kim Jin Ho"
	 * @Date 2016. 11. 28.
	 */
	public DataTable getAuthSearchUserList(Params inParams) {
		return getSqlManager().selectDataTable("AuthService.getAuthSearchUserList",inParams);
	}

	/**
	 * 로그인 성공 이후 로그 저장
	 * @Author "Kim Jin Ho"
	 * @Date 2016. 11. 22.
	*/
	public void processAfterLoginSuccess(HttpServletRequest request, Params inParams) {
		// TODO Auto-generated method stub
	}

	/**
	 * [기능 설명]
	 * @Author "Kim Jin Ho"
	 * @Date 2016. 11. 22.
	*/
	public CommParams getUserData(CommParams inParams) {
		return null;
	}

	/**
	 * 권한구룹 정보
	 * @Author "Kim Jin Ho"
	 * @Date 2016. 11. 23.
	*/
	public Params getAuthGroupView(Params inParams) {
		return getSqlManager().selectOneParams("AuthService.getAuthGroupView",inParams);
	}

	/**
	 * 그룹 저장
	 *
	 * @Author Kim Jin Ho
	 * @Date 2016. 11. 24.
	*/
	public Params saveAuthGroup(Params inParams) {
		Params outParam = ParamsFactory.createOutParams(inParams);
		int cnt = 0;
		String modFlag = inParams.getStrParam("modFlag");
		if(modFlag.equals("INSERT")){
			cnt = getSqlManager().insert("AuthService.insertAuthGroup",inParams);
		}else if(modFlag.equals("UPDATE")){
			cnt = getSqlManager().update("AuthService.updateAuthGroup",inParams);
		}else if(modFlag.equals("DELETE")){
			cnt = getSqlManager().delete("AuthService.deleteAuthGroup",inParams);
		}
		outParam.setMsgCd("MSG_COM_SUC_007", new Object[]{cnt});
		return outParam;
	}
	/**
	 * 권한 전체저장
	 *
	 * @Author "Kim Jin Ho"
	 * @Date 2016. 11. 28.
	*/
	public Params saveMenuAuth(Params inParams) {
		LOG.debug("saveMenuAuth inParams : " + inParams);
		Params outParam = ParamsFactory.createOutParams(inParams);
		String authGroupSeq = inParams.getStrParam("authGroupSeq");
		String s_userId = inParams.getStrParam("s_userId");
		int cnt = 0;

		// 권한 사용자 등록
		DataTable userAuthDt = inParams.getDataTable("dt_userauth");
		cnt = getSqlManager().delete("AuthService.deleteUserAuth", authGroupSeq);
		for (DataRow userDr :userAuthDt) {
			userDr.setVal("authGroupSeq", authGroupSeq);
			userDr.setVal("s_userId", s_userId);
			getSqlManager().insert("AuthService.insertUserAuth",userDr);
		}
		outParam.setMsgCd("MSG_COM_SUC_007", new Object[]{cnt});

		// 권한 YN 등록
		DataTable menuAuthDt =  inParams.getDataTable("dt_menuauth");
		DataTable columnsDt =  getSqlManager().selectDataTable("AuthService.getAuthColunms", inParams);
		for (DataRow saveDr :menuAuthDt) {
			for (DataRow colDr :columnsDt) {
				String authCode = colDr.getString("CODE_CD");
				colDr.setVal("authYn", saveDr.getVal(CommUtil.strCamel(authCode)));
				colDr.setVal("authCd", authCode);
				colDr.setVal("menuSeq", saveDr.getVal("menuSeq"));
				colDr.setVal("authGroupSeq", authGroupSeq);
				colDr.setVal("s_userId", s_userId);
				cnt += getSqlManager().update("AuthService.saveMenuAuth",colDr);
			}
		}
		return outParam;
	}

	/**
	 * 권한그룹
	 * @Author "Kim Jin Ho"
	 * @Date 2016. 11. 23.
	*/
	public Params getAuthCheckList(Params inParams) {
		Params outParams = getSqlManager().selectParams("AuthService.getAuthCheckList",inParams);

		return outParams;
	}
}
