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

@ParentPackage("base")
@Namespace("/")
@Controller
public class AddReduceAction extends BaseListAction {

	private static final long serialVersionUID = 2068579060275398311L;

	@Autowired
	private AddReduceService addReduceService;

	private List<AddReduceVO> addReduces;

	private AddReduceVO addReduce;

	@Action(value = "pageAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAddReduce() throws FLException {

		addReduceService.pageAddReduce(getPaging(), getFilters(), addReduce, queryCompany());

		return SUCCESS;
	}

	@Action(value = "pageAddReduceByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAddReduceByOrderId() throws FLException {

		addReduceService.pageAddReduceByOrderId(getPaging(), getFilters(), addReduce);

		return SUCCESS;
	}

	@Action(value = "queryAddReduceForPayedByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAddReduceForPayedByOrderId() throws FLException {

		addReduces = addReduceService.queryAddReduceForPayedByOrderId(addReduce);

		return SUCCESS;
	}

	@Action(value = "queryAddReduceByArid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAddReduceByArid() throws FLException {

		addReduce = addReduceService.queryAddReduceByArid(addReduce);

		return SUCCESS;
	}

	@Action(value = "queryAddReduceByDecorationPaymentId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAddReduceByDecorationPaymentId() throws FLException {

		addReduce = addReduceService.queryAddReduceByDecorationPaymentId(addReduce);

		return SUCCESS;
	}

	@Action(value = "addAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAddReduce() throws FLException {

		addReduceService.addAddReduce(addReduce, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAddReduce() throws FLException {

		addReduceService.updateAddReduce(addReduce);

		return SUCCESS;
	}

	@Action(value = "updateAddReduceForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAddReduceForAdvance() throws FLException {

		addReduceService.updateAddReduceForAdvance(addReduce);

		return SUCCESS;
	}

	@Action(value = "submitAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitAddReduce() throws FLException {

		addReduceService.submitAddReduce(addReduce, queryUserId());

		return SUCCESS;
	}

	@Action(value = "unpayAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unpayAddReduce() throws FLException {

		addReduceService.unpayAddReduce(addReduce);

		return SUCCESS;
	}

	@Action(value = "confirmAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmAddReduce() throws FLException {

		addReduceService.confirmAddReduce(addReduce);

		return SUCCESS;
	}

	@Action(value = "deleteAddReduce", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteAddReduce() throws FLException {

		addReduceService.deleteAddReduceByArId(addReduce);

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
