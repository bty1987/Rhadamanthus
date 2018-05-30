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
import com.fanglin.store.service.MorderService;
import com.fanglin.store.vo.MorderItemVO;
import com.fanglin.store.vo.MorderVO;

@ParentPackage("login")
@Namespace("/")
@Controller
public class MorderAction extends BaseListAction{

	private static final long serialVersionUID = -6773935450546457207L;

	@Autowired
	private MorderService morderService;
	
	private List<MorderVO> morders;
	
	private MorderVO morder; 
	
	private List<MorderItemVO> morderItems;
	
	private List<Long> cids;
	
	@Action(value="pageMorder", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMorder(){
		
		morderService.pageMorder(getPaging(), getFilters());
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMorderByUid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMorderByUid(){
		
		morders = morderService.queryMorderByUid(morder);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMorderByStatus", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMorderByStatus(){
		
		morders = morderService.queryMorderByStatus(morder);
		
		return SUCCESS;
		
	}
	
	@Action(value="addMorder", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMorder() throws FLException{
		
		morderService.addMorder(morder, morderItems, cids);
		
		return SUCCESS;
		
	}
	
	@Action(value="updateMorderForStatus", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMorderForStatus() throws FLException{
		
		morderService.updateMorderForStatus(morder);
		
		return SUCCESS;
		
	}
	
	@Action(value="deleteMorder", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteMorder() throws FLException{
		
		morderService.deleteMorder(morder);
		
		return SUCCESS;
		
	}

	public List<MorderVO> getMorders() {
		return morders;
	}

	public void setMorders(List<MorderVO> morders) {
		this.morders = morders;
	}

	public MorderVO getMorder() {
		return morder;
	}

	public void setMorder(MorderVO morder) {
		this.morder = morder;
	}

	public List<MorderItemVO> getMorderItems() {
		return morderItems;
	}

	public void setMorderItems(List<MorderItemVO> morderItems) {
		this.morderItems = morderItems;
	}

	public List<Long> getCids() {
		return cids;
	}

	public void setCids(List<Long> cids) {
		this.cids = cids;
	}
	
}
