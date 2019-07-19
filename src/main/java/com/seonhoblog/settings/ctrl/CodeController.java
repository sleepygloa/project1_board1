package com.seonhoblog.settings.ctrl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.core.parameters.Params;
import com.core.parameters.datatable.DataTable;
import com.seonhoblog.settings.svce.CodeService;

@Controller
@RequestMapping("/ctrl/settings/code")
public class CodeController {
	
	@Autowired
	private CodeService codeService;

	//메뉴 선택시 페이지 이동
	@RequestMapping("")
	public String toCodePage(Params inParams)  {
		return "settings/code";
	}

	//그리드 조회
	@RequestMapping("/listCodeCombo")
	public DataTable listCodeCombo(Params inParams)  {
		return codeService.listCodeCombo(inParams);
	}
	
	//그리드 조회
	@RequestMapping("/listCode")
	public Params listCode(Params inParams)  {
		return codeService.listCode(inParams);
	}


	//추가, 수정, 삭제
	@RequestMapping("/updateCode")
	public Params updateCode(Params inParams) {
		return codeService.listCode(inParams);
	}
	
}
