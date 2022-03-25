/**
 * @File Name		: AddOrReduceAction.java
 * @Package   	: com.fanglin.action.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.AddReduceService;
import com.fanglin.quotation.vo.AddReduceVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class QuotationCommonAction extends BaseListAction {

	private static final long serialVersionUID = -5889050147580497735L;

	@Autowired
	private AddReduceService addReduceService;

	private List<AddReduceVO> addReduces;

	private AddReduceVO addReduce;

	@Action(value = "queryAddReduceByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAddReduceByOrderId() throws FLException {

		addReduces = addReduceService.queryAddReduceByOrderId(addReduce);

		return SUCCESS;
	}

	@Action(value = "affirmAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String affirmAddReduce() throws FLException {

		addReduceService.affirmAddReduce(addReduces);

		return SUCCESS;
	}

	@Action(value = "sendAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendAddReduce() throws FLException {

		addReduceService.sendAddReduce(addReduce);

		return SUCCESS;
	}

	public AddReduceVO getAddReduce() {
		return addReduce;
	}

	public void setAddReduce(AddReduceVO addReduce) {
		this.addReduce = addReduce;
	}

	public List<AddReduceVO> getAddReduces() {
		return addReduces;
	}

	public void setAddReduces(List<AddReduceVO> addReduces) {
		this.addReduces = addReduces;
	}

}
