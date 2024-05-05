package com.fanglin.construction.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.QualiterService;
import com.fanglin.construction.vo.QualiterVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QualiterAction extends BaseListAction {

	private static final long serialVersionUID = 4546616455814867368L;

	@Autowired
	private QualiterService qualiterService;

	private QualiterVO qualiter;

	private List<QualiterVO> qualiters;

	@Action(value = "queryQualiter", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQualiter() throws FLException {

		qualiters = qualiterService.queryQualiter(qualiter);

		return SUCCESS;
	}

	@Action(value = "addQualiter", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQualiter() throws FLException {

		qualiterService.addQualiter(qualiter, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deleteQualiter", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQualiter() throws FLException {

		qualiterService.deleteQualiter(qualiter);

		return SUCCESS;
	}

	public QualiterVO getQualiter() {
		return qualiter;
	}

	public void setQualiter(QualiterVO qualiter) {
		this.qualiter = qualiter;
	}

	public List<QualiterVO> getQualiters() {
		return qualiters;
	}

	public void setQualiters(List<QualiterVO> qualiters) {
		this.qualiters = qualiters;
	}

}
