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
import com.fanglin.market.service.CardService;
import com.fanglin.market.vo.CardPhotoVO;
import com.fanglin.market.vo.CardVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CardAction extends BaseListAction {

	private static final long serialVersionUID = 5406386221489003981L;

	@Autowired
	private CardService cardService;

	@Autowired
	private CardPhotoService cardPhotoService;

	private CardVO card;

	private List<CardPhotoVO> cardPhotos;

	private CardPhotoVO cardPhoto;

	@Action(value = "pageCard", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCard() throws FLException {

		cardService.pageCard(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryCardByCuid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCardByCuid() throws FLException {

		card = cardService.queryCardByCuid(card);

		return SUCCESS;
	}

	@Action(value = "queryCardPhotoByCaid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCardPhotoByCaid() throws FLException {

		cardPhotos = cardPhotoService.queryCardPhotoByCaid(cardPhoto);

		return SUCCESS;
	}

	@Action(value = "addCard", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCard() throws FLException {

		cardService.addCard(card);

		return SUCCESS;
	}

	@Action(value = "updateCard", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCard() throws FLException {

		cardService.updateCard(card);

		return SUCCESS;
	}

	@Action(value = "deleteCard", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCard() throws FLException {

		cardService.deleteCard(card);

		return SUCCESS;
	}

	@Action(value = "addCardPhoto", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCardPhoto() throws FLException {

		cardPhotoService.addCardPhoto(cardPhotos);

		return SUCCESS;
	}

	@Action(value = "deleteCardPhoto", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCardPhoto() throws FLException {

		cardPhotoService.deleteCardPhoto(cardPhoto);

		return SUCCESS;
	}

	public CardVO getCard() {
		return card;
	}

	public void setCard(CardVO card) {
		this.card = card;
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
