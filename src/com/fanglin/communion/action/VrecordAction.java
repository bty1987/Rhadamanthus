package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.VrecordService;
import com.fanglin.communion.vo.VrecordVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VrecordAction extends BaseListAction {

	private static final long serialVersionUID = -1598912214963548181L;
	
	@Autowired
	private VrecordService vrecordService;
	
	private VrecordVO vrecord;
	
	private List<VrecordVO> vrecords;
	
	@Action(value="queryVrecordByVid", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryVrecordByVid() {
		
		vrecords = vrecordService.queryVrecordByVid(getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="addVrecord", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addVrecord() throws FLException{
		
		vrecordService.addVrecord(vrecord, queryUserId());
		
		return SUCCESS;
	}

	public VrecordVO getVrecord() {
		return vrecord;
	}

	public void setVrecord(VrecordVO vrecord) {
		this.vrecord = vrecord;
	}

	public List<VrecordVO> getVrecords() {
		return vrecords;
	}

	public void setVrecords(List<VrecordVO> vrecords) {
		this.vrecords = vrecords;
	}
	
}
