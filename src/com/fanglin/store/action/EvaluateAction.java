package com.fanglin.store.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.service.EvaluateService;
import com.fanglin.store.vo.EvaluateVO;
import com.fanglin.store.vo.MorderVO;
import com.fanglin.store.vo.MuserVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class EvaluateAction extends BaseListAction {

	private static final long serialVersionUID = -6818679723083046266L;

	@Autowired
	private EvaluateService evaluateService;

	private EvaluateVO evaluate;

	private List<EvaluateVO> evaluates;

	private MuserVO muser;

	private MorderVO morder;

	@Action(value = "pageEvaluate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageEvaluate() {

		evaluateService.pageEvaluate(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "addEvaluate", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addEvaluate() throws FLException {

		evaluateService.addEvaluate(evaluates, muser, morder);

		return SUCCESS;
	}

	public EvaluateVO getEvaluate() {
		return evaluate;
	}

	public void setEvaluate(EvaluateVO evaluate) {
		this.evaluate = evaluate;
	}

	public List<EvaluateVO> getEvaluates() {
		return evaluates;
	}

	public void setEvaluates(List<EvaluateVO> evaluates) {
		this.evaluates = evaluates;
	}

	public MuserVO getMuser() {
		return muser;
	}

	public void setMuser(MuserVO muser) {
		this.muser = muser;
	}

	public MorderVO getMorder() {
		return morder;
	}

	public void setMorder(MorderVO morder) {
		this.morder = morder;
	}

}
