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
import com.fanglin.store.service.MuserService;
import com.fanglin.store.vo.MuserVO;

@ParentPackage("login")
@Namespace("/")
@Controller
public class MuserAction extends BaseListAction{

	private static final long serialVersionUID = 6605965645950300464L;

	@Autowired
	private MuserService muserService;
	
	private MuserVO muser;
	
	private List<MuserVO> musers;
	
	private String pinyinName;
	
	private List<KeyValueVO> autoFillKeyValue;
	
	private List<String> autoFillList;
	
	@Action(value="pageMuser", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMuser(){
		
		muserService.pageMuser(getPaging(), getFilters());
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMuserByPinyinName", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMuserByPinyinName(){
		
		musers = muserService.queryMuserByPinyinName(pinyinName);
		
		packageMuserName(musers);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMuserByUid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMuserByUid(){
		
		muser = muserService.queryMuserByUid(muser);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMuserByUnion", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMuserByUnion(){
		
		muser = muserService.queryMuserByUnion(muser);
		
		return SUCCESS;
		
	}
	
	@Action(value="addMuser", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMuser() throws FLException{
		
		muserService.addMuser(muser);
		
		return SUCCESS;
		
	}
	
	@Action(value="updateMuser", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMuser() throws FLException{
		
		muserService.updateMuser(muser);
		
		return SUCCESS;
		
	}
	
	private void packageMuserName(List<MuserVO> musers){
		for(MuserVO muser: musers){
			KeyValueVO keyValueVO = new KeyValueVO();
			
			StringBuffer value = new StringBuffer();
			value.append(muser.getName());
			
			keyValueVO.setKey(String.valueOf(muser.getUid()));
			keyValueVO.setValue(value.toString());
			
			getAutoFillKeyValue().add(keyValueVO);
			getAutoFillList().add(muser.getName());
		}
	}

	public MuserVO getMuser() {
		return muser;
	}

	public void setMuser(MuserVO muser) {
		this.muser = muser;
	}

	public List<MuserVO> getMusers() {
		return musers;
	}

	public void setMusers(List<MuserVO> musers) {
		this.musers = musers;
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
