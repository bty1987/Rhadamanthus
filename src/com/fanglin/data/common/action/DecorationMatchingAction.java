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
import com.fanglin.data.common.service.DecorationMatchingService;
import com.fanglin.data.common.vo.DecorationMatchingVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationMatchingAction extends BaseListAction {

	private static final long serialVersionUID = 8908947098024848781L;

	@Autowired
	private DecorationMatchingService decorationMatchingService;

	private DecorationMatchingVO decorationMatching;

	private List<DecorationMatchingVO> decorationMatchings;

	private List<Short> type;

	private List<Short> typeness;

	@Action(value = "pageDecorationMatching", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationMatching() throws FLException {

		decorationMatchingService.pageDecorationMatching(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryDecorationMatching", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationMatching() throws FLException {

		decorationMatchings = decorationMatchingService.queryDecorationMatching(type, typeness, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addDecorationMatching", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationMatching() throws FLException {

		decorationMatchingService.addDecorationMatching(decorationMatching, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateDecorationMatching", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDecorationMatching() throws FLException {

		decorationMatchingService.updateDecorationMatching(decorationMatching, queryCompany());

		return SUCCESS;
	}

	public DecorationMatchingVO getDecorationMatching() {
		return decorationMatching;
	}

	public void setDecorationMatching(DecorationMatchingVO decorationMatching) {
		this.decorationMatching = decorationMatching;
	}

	public List<DecorationMatchingVO> getDecorationMatchings() {
		return decorationMatchings;
	}

	public void setDecorationMatchings(List<DecorationMatchingVO> decorationMatchings) {
		this.decorationMatchings = decorationMatchings;
	}

	public List<Short> getType() {
		return type;
	}

	public void setType(List<Short> type) {
		this.type = type;
	}

	public List<Short> getTypeness() {
		return typeness;
	}

	public void setTypeness(List<Short> typeness) {
		this.typeness = typeness;
	}

}
