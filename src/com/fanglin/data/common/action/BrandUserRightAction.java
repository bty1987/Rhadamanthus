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

package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.BrandUserRightService;
import com.fanglin.data.common.vo.BrandUserRightVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BrandUserRightAction extends BaseListAction {

	private static final long serialVersionUID = -8757510015221587308L;
	
	@Autowired
	private BrandUserRightService brandUserRightService;
	
	private BrandUserRightVO brandUserRight;
	
	private List<BrandUserRightVO> brandUserRights;
	
	private List<Long> bids;
	
	@Action(value="queryBrandUserRightForLogin", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialBrandRightForLogin() throws FLException{
		
		brandUserRights = brandUserRightService.queryBrandUserRightForLogin(queryUserId());
		
		return SUCCESS;
	}

	public BrandUserRightVO getBrandUserRight() {
		return brandUserRight;
	}

	public void setBrandUserRight(BrandUserRightVO brandUserRight) {
		this.brandUserRight = brandUserRight;
	}

	public List<BrandUserRightVO> getBrandUserRights() {
		return brandUserRights;
	}

	public void setBrandUserRights(List<BrandUserRightVO> brandUserRights) {
		this.brandUserRights = brandUserRights;
	}

	public List<Long> getBids() {
		return bids;
	}

	public void setBids(List<Long> bids) {
		this.bids = bids;
	}

}
