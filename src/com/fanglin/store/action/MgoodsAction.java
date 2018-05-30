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

@ParentPackage("login")
@Namespace("/")
@Controller
public class MgoodsAction extends BaseListAction{

	private static final long serialVersionUID = 6606011256580300464L;

	@Autowired
	private MgoodsService mgoodsService;
	
	private MgoodsVO mgood;
	
	private List<MgoodsVO> mgoods;
	
	private String  pinyinName;
	
	private List<KeyValueVO> autoFillKeyValue;
	
	private List<String> autoFillList;
	
	@Action(value="pageMgoods", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMgoods(){
		
		mgoodsService.pageMgoods(getPaging(), getFilters());
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMgoodsByPinyinName", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMgoodsByPinyinName(){
		
		mgoods= mgoodsService.queryMgoodsByPinyinName(pinyinName);
		
		packageMgoodsName(mgoods);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMgoodsByBid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMgoodsByBid(){
		
		mgoods = mgoodsService.queryMgoodsByBid(mgood);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMgoodsByStatus", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMgoodsByStatus(){
		
		mgoods = mgoodsService.queryMgoodsByStatus(mgood);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMgoodsByGid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMgoodsByGid(){
		
		mgood = mgoodsService.queryMgoodsByGid(mgood);
		
		return SUCCESS;
		
	}
	
	@Action(value="addMgoods", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMgoods() throws FLException{
		
		mgoodsService.addMgoods(mgood);
		
		return SUCCESS;
		
	}
	
	@Action(value="updateMgoods", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMgoods() throws FLException{
		
		mgoodsService.updateMgoods(mgood);
		
		return SUCCESS;
		
	}
	
	@Action(value="updateMgoodsForDefaultImg", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMgoodsForDefaultImg() throws FLException{
		
		mgoodsService.updateMgoodsForDefaultImg(mgood);
		
		return SUCCESS;
		
	}
	
	@Action(value="updateMgoodsForStatus", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMgoodsForStatus() throws FLException{
		
		mgoodsService.updateMgoodsForStatus(mgood);
		
		return SUCCESS;
		
	}
	
	private void packageMgoodsName(List<MgoodsVO> mgoods){
		for(MgoodsVO mgood: mgoods){
			KeyValueVO keyValueVO = new KeyValueVO();
			
			StringBuffer value = new StringBuffer();
			value.append(mgood.getMbrand().getName());
			value.append("-");
			value.append(mgood.getName());
			
			keyValueVO.setKey(String.valueOf(mgood.getGid()));
			keyValueVO.setValue(value.toString());
			
			getAutoFillKeyValue().add(keyValueVO);
			getAutoFillList().add(mgood.getName());
		}
	}

	public MgoodsVO getMgood() {
		return mgood;
	}

	public void setMgood(MgoodsVO mgood) {
		this.mgood = mgood;
	}

	public List<MgoodsVO> getMgoods() {
		return mgoods;
	}

	public void setMgoods(List<MgoodsVO> mgoods) {
		this.mgoods = mgoods;
	}
	
	public String getPinyinName() {
		return pinyinName;
	}

	public void setPinyinName(String pinyinName) {
		this.pinyinName = pinyinName;
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
