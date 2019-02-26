package com.fanglin.market.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.market.service.CardPhotoService;
import com.fanglin.market.service.EcaseService;
import com.fanglin.market.service.EpictureService;
import com.fanglin.market.service.EpersonService;
import com.fanglin.market.vo.CardPhotoVO;
import com.fanglin.market.vo.EpictureVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class MarketPublicAction extends BaseListAction{
	
	private static final long serialVersionUID = 8048014090226834203L;

	@Autowired
	private EcaseService caseService;
	
	@Autowired
	private EpersonService epersonService;
	
	@Autowired
	private EpictureService epictureService;
	
	@Autowired
	private CardPhotoService cardPhotoService;
	
	private List<EpictureVO> epictures;
	
	private EpictureVO epicture;
	
	private List<CardPhotoVO> cardPhotos;
	
	private CardPhotoVO cardPhoto;
	
	@Action(value = "queryEcase", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryEcase() throws FLException{
		
		caseService.pageEcase(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryEperson", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String queryEperson(){
		
		epersonService.pageEperson(getPaging(), getFilters());

		return SUCCESS;
	}
	
	@Action(value = "queryEpicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryEpicture() throws FLException{
		
		epictures = epictureService.queryEpictureByCid(epicture);
	
		return SUCCESS;
	}
	
	@Action(value = "queryCardPhotoByCaid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCardPhotoByCaid() throws FLException{
		
		cardPhotos = cardPhotoService.queryCardPhotoByCaid(cardPhoto);
	
		return SUCCESS;
	}

	public List<EpictureVO> getEpictures() {
		return epictures;
	}

	public void setEpictures(List<EpictureVO> epictures) {
		this.epictures = epictures;
	}

	public EpictureVO getEpicture() {
		return epicture;
	}

	public void setEpicture(EpictureVO epicture) {
		this.epicture = epicture;
	}

	public List<CardPhotoVO> getCardPhotos() {
		return cardPhotos;
	}

	public void setCardPhotos(List<CardPhotoVO> cardPhotos) {
		this.cardPhotos = cardPhotos;
	}

	public CardPhotoVO getCardPhoto() {
		return cardPhoto;
	}

	public void setCardPhoto(CardPhotoVO cardPhoto) {
		this.cardPhoto = cardPhoto;
	}

}
