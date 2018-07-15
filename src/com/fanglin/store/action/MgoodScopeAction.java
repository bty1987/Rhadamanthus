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
import com.fanglin.store.service.McolorService;
import com.fanglin.store.service.MformatService;
import com.fanglin.store.service.MgoodsService;
import com.fanglin.store.service.MpriceService;
import com.fanglin.store.service.PictureService;
import com.fanglin.store.vo.McolorVO;
import com.fanglin.store.vo.MformatVO;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.store.vo.MpriceVO;
import com.fanglin.store.vo.PictureVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class MgoodScopeAction extends BaseListAction {

	private static final long serialVersionUID = 3945695019546966632L;
	
	@Autowired
	private MgoodsService mgoodsService;
	
	@Autowired
	private McolorService mcolorService;
	
	@Autowired
	private MformatService mformatService;
	
	@Autowired
	private PictureService pictureService;
	
	@Autowired
	private MpriceService mpriceService;
	
	private MgoodsVO mgoods;
	
	private List<MgoodsVO> mgoodses;
	
	private McolorVO mcolor;
	
	private List<McolorVO> mcolors;
		
	private MformatVO mformat;
	
	private List<MformatVO> mformats;
	
	private PictureVO  picture;
	
	private List<PictureVO> pictures;
	
	private MpriceVO mprice;
	
	private List<MpriceVO> mprices;
	
	private List<KeyValueVO> autoFillKeyValue;
	
	private List<String> autoFillList;
	
	@Action(value="queryMgoods", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMgoods (){
		
		mgoodsService.pageMgoods(getPaging(), getFilters(), true);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMgoodsByPinyin", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMgoodsByPinyin(){
		
		mgoodses= mgoodsService.queryMgoodsByPinyin(mgoods);
		
		packageMgoodsName(mgoodses);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMcolor", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String  queryMcolor(){
		
		mcolors = mcolorService.queryMcolor(mcolor);
		
		return SUCCESS;
	}
	
	@Action(value="queryMformat", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMformat(){
		
		mformats = mformatService.queryMformat(mformat);
		
		return SUCCESS;
	}
	
	@Action(value="queryPicture", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryPicture(){
		
		pictures = pictureService.queryPicture(picture);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMprice", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMprice(){
		
		mprices = mpriceService.queryMprice(mprice);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMpriceByPinyin", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMpriceByPinyin(){
		
		mprices = mpriceService.queryMpriceByPinyin(mprice);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryMpriceForShow", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMpriceForShow(){
		
		mprices = mpriceService.queryMpriceForShow(mprice);
		
		return SUCCESS;
		
	}
	
	private void packageMgoodsName(List<MgoodsVO> mgoodses){
		for(MgoodsVO mgoods: mgoodses){
			KeyValueVO keyValueVO = new KeyValueVO();
			
			StringBuffer value = new StringBuffer();
			value.append(mgoods.getNo());
			value.append("-");
			value.append(mgoods.getMbrand().getName());
			value.append("-");
			value.append(mgoods.getName());
			
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

	public List<McolorVO> getMcolors() {
		return mcolors;
	}

	public void setMcolors(List<McolorVO> mcolors) {
		this.mcolors = mcolors;
	}

	public McolorVO getMcolor() {
		return mcolor;
	}

	public void setMcolor(McolorVO mcolor) {
		this.mcolor = mcolor;
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
	
	public PictureVO getPicture() {
		return picture;
	}

	public void setPicture(PictureVO picture) {
		this.picture = picture;
	}

	public List<PictureVO> getPictures() {
		return pictures;
	}

	public void setPictures(List<PictureVO> pictures) {
		this.pictures = pictures;
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

}
