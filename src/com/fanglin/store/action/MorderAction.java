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
import com.fanglin.store.vo.MuserVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MorderAction extends BaseListAction{

	private static final long serialVersionUID = -6773935450546457207L;

	@Autowired
	private MorderService morderService;
	
	private List<MorderVO> morders;
	
	private MorderVO morder;
	
	private MuserVO muser;
	
	private List<MorderItemVO> morderItems;
	
	private List<Long> cids;
	
	@Action(value="pageMorder", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMorder(){
		
		morderService.pageMorder(getPaging(), getFilters(), false);
		
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

	public MuserVO getMuser() {
		return muser;
	}

	public void setMuser(MuserVO muser) {
		this.muser = muser;
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
