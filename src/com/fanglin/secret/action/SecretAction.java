/**
 * @File Name		: DecorationOrderAction.java
 * @Package   	: com.fanglin.secret.action
 * @Version		: 1.0
 * @Date			: 2017-5-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.secret.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseAction;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.secret.service.SecretService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SecretAction extends BaseAction {

	private static final long serialVersionUID = 4846642991702813595L;
	
	@Autowired
	private SecretService secretService;
	
	@Autowired
	private DecorationService decorationService;
	
	private String VZYKHFFK;
	
	private String FAKKGDAZ;
	
	private List<String> OTCVCJSC;
	
	private List<DecorationVO> AJIGRRVT;
	
	//Action(value = "CVLIBHQMVWFSPQWU", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String CVLIBHQMVWFSPQWU(){
		
		OTCVCJSC = secretService.CVLIBHQMVWFSPQWU(VZYKHFFK);
		
		return SUCCESS;
	}
	
	//Action(value = "KGZPHFBAOKWVMWGW", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String KGZPHFBAOKWVMWGW(){
		
		AJIGRRVT = secretService.KGZPHFBAOKWVMWGW(FAKKGDAZ);
		
		return SUCCESS;
	}
	
	@Action(value = "KGZPHFBAOKWVMWGW", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String baitianyu(){
		
		decorationService.sendMessage("1601010001", "装修单", "测试");
		
		return SUCCESS;
	}

	public String getVZYKHFFK() {
		return VZYKHFFK;
	}

	public void setVZYKHFFK(String vZYKHFFK) {
		VZYKHFFK = vZYKHFFK;
	}

	public String getFAKKGDAZ() {
		return FAKKGDAZ;
	}

	public void setFAKKGDAZ(String fAKKGDAZ) {
		FAKKGDAZ = fAKKGDAZ;
	}

	public List<String> getOTCVCJSC() {
		return OTCVCJSC;
	}

	public void setOTCVCJSC(List<String> oTCVCJSC) {
		OTCVCJSC = oTCVCJSC;
	}

	public List<DecorationVO> getAJIGRRVT() {
		return AJIGRRVT;
	}

	public void setAJIGRRVT(List<DecorationVO> aJIGRRVT) {
		AJIGRRVT = aJIGRRVT;
	}
	
}
