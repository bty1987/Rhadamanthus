/**
 * @File Name		: MaterialBrandAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date			: 2014-8-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.right.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.right.service.BrandUserRightService;
import com.fanglin.right.vo.BrandUserRightVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BrandUserRightAction extends BaseListAction {

	private static final long serialVersionUID = -8757510015221587308L;
	
	@Autowired
	private BrandUserRightService brandUserRightService;
	
	private BrandUserRightVO brandUserRight;
	
	@Action(value="queryBrandUserRightByUid", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryBrandUserRightByUid() throws FLException{
		
		brandUserRight = brandUserRightService.queryBrandUserRightByUid(brandUserRight);
		
		return SUCCESS;
	}
	
	@Action(value="queryBrandUserRightForLogin", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryBrandUserRightForLogin() throws FLException{
		
		brandUserRight = brandUserRightService.queryBrandUserRightForLogin(queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="updateBrandUserRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateBrandUserRight() throws FLException{
		
		brandUserRightService.updateBrandUserRight(brandUserRight);
		
		return SUCCESS;
	}

	public BrandUserRightVO getBrandUserRight() {
		return brandUserRight;
	}

	public void setBrandUserRight(BrandUserRightVO brandUserRight) {
		this.brandUserRight = brandUserRight;
	}

}
