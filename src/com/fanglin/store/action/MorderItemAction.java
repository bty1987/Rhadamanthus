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
import com.fanglin.store.service.MorderItemService;
import com.fanglin.store.vo.MorderItemVO;

@ParentPackage("login")
@Namespace("/")
@Controller
public class MorderItemAction extends BaseListAction{

	private static final long serialVersionUID = -4587634162177356129L;

	@Autowired 
	private MorderItemService morderItemService;
	
	private MorderItemVO morderItem;
	
	private List<MorderItemVO> morderItems;
	
	@Action(value="queryMorderItemByUidAndStatus", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMorderItemByUidAndStatus(){
		
		morderItems = morderItemService.queryMorderItemByUidAndStatus(morderItem);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMorderItemByOid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMorderItemByOid(){
		
		morderItems = morderItemService.queryMorderItemByOid(morderItem);
		
		return SUCCESS;
		
	}
	
	@Action(value="updateMorderItemForStatus", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMorderItemForStatus() throws FLException{
		
		morderItemService.updateMorderItemForStatus(morderItem);
		
		return SUCCESS;
		
	}

	public MorderItemVO getMorderItem() {
		return morderItem;
	}

	public void setMorderItem(MorderItemVO morderItem) {
		this.morderItem = morderItem;
	}

	public List<MorderItemVO> getMorderItems() {
		return morderItems;
	}

	public void setMorderItems(List<MorderItemVO> morderItems) {
		this.morderItems = morderItems;
	}

}
