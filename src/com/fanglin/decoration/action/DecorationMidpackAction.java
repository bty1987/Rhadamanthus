/**
 * @File Name		: DecorationContractAction
 * @Package   	: com.fanglin.action.quotation
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationMidpackService;
import com.fanglin.decoration.vo.DecorationMidpackVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationMidpackAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548111L;

	@Autowired
	private DecorationMidpackService decorationMidpackService;

	private DecorationMidpackVO decorationMidpack;

	@Action(value = "queryDecorationMidpack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationMidpack() throws FLException {

		decorationMidpack = decorationMidpackService.queryDecorationMidpack(decorationMidpack);

		return SUCCESS;
	}

	@Action(value = "makeDecorationMidpack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeDecorationMidpack() throws FLException {

		decorationMidpackService.makeDecorationMidpack(decorationMidpack, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateDecorationMidpack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDecorationMidpack() throws FLException {

		decorationMidpackService.updateDecorationMidpack(decorationMidpack, queryUserId());

		return SUCCESS;
	}

	public DecorationMidpackVO getDecorationMidpack() {
		return decorationMidpack;
	}

	public void setDecorationMidpack(DecorationMidpackVO decorationMidpack) {
		this.decorationMidpack = decorationMidpack;
	}

}
