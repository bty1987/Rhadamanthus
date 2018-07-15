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
import com.fanglin.store.service.MformatService;
import com.fanglin.store.vo.MformatVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MformatAction extends BaseListAction{

	private static final long serialVersionUID = -1187121746359627763L;

	@Autowired
	private MformatService mformatService;
	
	private MformatVO mformat;
	
	private List<MformatVO> mformats;
	
	@Action(value="queryMformatByGid", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMformatByGid(){
		
		mformats = mformatService.queryMformatByGid(mformat);
		
		return SUCCESS;
	}
	
	@Action(value="addMformat", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMformat(){
		
		mformatService.addMformat(mformat);
		
		return SUCCESS;
	}

	@Action(value="updateMformatForStatus", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMformatForStatus() throws FLException{
		
		mformatService.updateMformatForStatus(mformat);
		
		return SUCCESS;
	}

	public MformatVO getMformat() {
		return mformat;
	}

	public void setMformat(MformatVO mformat) {
		this.mformat = mformat;
	}

	public List<MformatVO> getMformats() {
		return mformats;
	}

	public void setMformats(List<MformatVO> mformats) {
		this.mformats = mformats;
	}

}
