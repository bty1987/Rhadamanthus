package com.fanglin.salary.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.salary.service.WithholdService;
import com.fanglin.salary.vo.WithholdVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WithholdAction extends BaseListAction {

	private static final long serialVersionUID = 7852458050731739973L;
	
	@Autowired
	private WithholdService withholdService;
	
	private List<WithholdVO> withholds;
	
	private WithholdVO withhold;

	@Action(value="pageWithhold", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageWithhold() throws FLException{
	  
		withholdService.pageWithhold(getPaging(), getFilters());
    
		return "success";
	}
	
	@Action(value="queryWithhold", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryWithhold() throws FLException{
	  
		withholds = withholdService.queryWithhold(withhold);
    
		return "success";
	}
	
	@Action(value="addWithhold", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addWithhold() throws FLException{
	  
		withholdService.addWithhold(withhold, queryUserId());
		
		return "success";
	}
	
	@Action(value="updateWithholdForStatus", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateWithholdForStatus() throws FLException{
	  
		withholdService.updateWithholdForStatus(withhold, queryUserId());
    
		return "success";
	}
	
	public List<WithholdVO> getWithholds() {
		return withholds;
	}

	public void setWithholds(List<WithholdVO> withholds) {
		this.withholds = withholds;
	}

	public WithholdVO getWithhold() {
		return withhold;
	}

	public void setWithhold(WithholdVO withhold) {
		this.withhold = withhold;
	}
	
}
