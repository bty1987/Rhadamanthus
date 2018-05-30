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
import com.fanglin.store.service.PictureService;
import com.fanglin.store.vo.PictureVO;

@ParentPackage("login")
@Namespace("/")
@Controller
public class PictureAction extends BaseListAction{

	private static final long serialVersionUID = 6606015125690300464L;

	@Autowired
	private  PictureService  pictureService;
	
	private  PictureVO  picture;
	
	private List<PictureVO> pictures;
	
	private List<String> picturnUrls;
	
	@Action(value="queryPictureByGid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryPictureByGid(){
		
		pictures = pictureService.queryPictureByGid(picture);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryPictureByType", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryPictureByType(){
		
		pictures = pictureService.queryPictureByType(picture);
		
		return SUCCESS;
		
	}
	
	@Action(value="addPicture", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addPicture(){
		
		pictures = pictureService.addPicture(picture, picturnUrls);
		
		return SUCCESS;
		
	}
	
	@Action(value="updatePicture", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updatePicture() throws FLException{
		
		pictureService.updatePicture(picture);
		
		return SUCCESS;
		
	}
	
	@Action(value="updatePictureForSort", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updatePictureForSort() throws FLException{
		
		pictureService.updatePictureForSort(pictures);
		
		return SUCCESS;
		
	}
	
	@Action(value="deletePicture", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deletePicture() throws FLException{
		
		pictureService.deletePicture(picture);
		
		return SUCCESS;
		
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

	public List<String> getPicturnUrls() {
		return picturnUrls;
	}

	public void setPicturnUrls(List<String> picturnUrls) {
		this.picturnUrls = picturnUrls;
	}
	
}
