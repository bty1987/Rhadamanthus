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
import com.fanglin.store.service.MpriceService;
import com.fanglin.store.vo.MpriceVO;

@ParentPackage("login")
@Namespace("/")
@Controller
public class MpriceAction extends BaseListAction{

	private static final long serialVersionUID = -5794510974803054616L;
	
	@Autowired
	private MpriceService mpriceService;
	
	private MpriceVO mprice;
	
	private List<MpriceVO> mprices;
	
	private String pinyinName;
	
	@Action(value="queryMprice", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMprice(){
		
		mprices = mpriceService.queryMprice(mprice);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMpriceByGid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMpriceByGid(){
		
		mprices = mpriceService.queryMpriceByGid(mprice);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMpriceByBid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMpriceByBid(){
		
		mprices = mpriceService.queryMpriceByBid(mprice);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMpriceByPinyinName", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMpriceByPinyinName(){
		
		mprices = mpriceService.queryMpriceByPinyinName(pinyinName);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMpriceByStatus", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMpriceByStatus(){
		
		mprices = mpriceService.queryMpriceByStatus(mprice);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMpriceByGidAndCid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMpriceByGidAndCid(){
		
		mprices = mpriceService.queryMpriceByGidAndCid(mprice);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMpriceByGidAndFid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMpriceByGidAndFid(){
		
		mprices = mpriceService.queryMpriceByGidAndFid(mprice);
		
		return SUCCESS;
		
	}
	
	@Action(value="addMprice", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMprice() throws FLException{
		
		mpriceService.addMprice(mprice);
		
		return SUCCESS;
		
	}

	@Action(value="updateMpriceForStatus", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMpriceForStatus() throws FLException{
		
		mpriceService.updateMpriceForStatus(mprice);
		
		return SUCCESS;
		
	}

	public MpriceVO getMprice() {
		return mprice;
	}

	public void setMprice(MpriceVO mprice) {
		this.mprice = mprice;
	}

	public List<MpriceVO> getMprices() {
		return mprices;
	}

	public void setMprices(List<MpriceVO> mprices) {
		this.mprices = mprices;
	}

	public String getPinyinName() {
		return pinyinName;
	}

	public void setPinyinName(String pinyinName) {
		this.pinyinName = pinyinName;
	}
		
	
}
