package com.fanglin.store.action;


import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.vo.KeyValueVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.service.MgoodsService;
import com.fanglin.store.vo.MgoodsVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MgoodsAction extends BaseListAction{

	private static final long serialVersionUID = 6606011256580300464L;

	@Autowired
	private MgoodsService mgoodsService;
	
	private MgoodsVO mgoods;
	
	private List<MgoodsVO> mgoodses;
	
	private List<KeyValueVO> autoFillKeyValue;
	
	private List<String> autoFillList;
	
	@Action(value="pageMgoods", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMgoods(){
		
		mgoodsService.pageMgoods(getPaging(), getFilters(), false);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryBaseMgoodsByPinyin", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryBaseMgoodsByPinyin(){
		
		mgoodses= mgoodsService.queryMgoodsByPinyin(mgoods);
		
		packageMgoodsName(mgoodses);
		
		return SUCCESS;
		
	}
	
	@Action(value="addMgoods", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMgoods(){
		
		mgoodsService.addMgoods(mgoods);
		
		return SUCCESS;
		
	}
	
	@Action(value="updateMgoods", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMgoods() throws FLException{
		
		mgoodsService.updateMgoods(mgoods);
		
		return SUCCESS;
		
	}
	
	@Action(value="updateMgoodsForStatus", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMgoodsForStatus() throws FLException{
		
		mgoodsService.updateMgoodsForStatus(mgoods);
		
		return SUCCESS;
		
	}
	
	private void packageMgoodsName(List<MgoodsVO> mgoodses){
		for(MgoodsVO mgoods: mgoodses){
			KeyValueVO keyValueVO = new KeyValueVO();
			
			StringBuffer value = new StringBuffer();
			value.append(mgoods.getMbrand().getName());
			value.append("-");
			value.append(mgoods.getTitle());
			
			keyValueVO.setKey(String.valueOf(mgoods.getGid()));
			keyValueVO.setValue(value.toString());
			
			getAutoFillKeyValue().add(keyValueVO);
			getAutoFillList().add(mgoods.getName());
		}
	}

	public MgoodsVO getMgoods() {
		return mgoods;
	}

	public void setMgoods(MgoodsVO mgoods) {
		this.mgoods = mgoods;
	}

	public List<MgoodsVO> getMgoodses() {
		return mgoodses;
	}

	public void setMgoodses(List<MgoodsVO> mgoodses) {
		this.mgoodses = mgoodses;
	}
	
	public List<KeyValueVO> getAutoFillKeyValue(){
		if(autoFillKeyValue == null){
			autoFillKeyValue = new ArrayList<KeyValueVO>();
		}
		return autoFillKeyValue;
	}

	public void setAutoFillKeyValue(List<KeyValueVO> autoFillKeyValue){
		this.autoFillKeyValue = autoFillKeyValue;
	}

	public List<String> getAutoFillList(){
		if(autoFillList == null){
			autoFillList = new ArrayList<String>();
		}
		return autoFillList;
	}

	public void setAutoFillList(List<String> autoFillList){
		this.autoFillList = autoFillList;
	}
	
}
