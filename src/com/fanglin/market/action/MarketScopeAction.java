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
import com.fanglin.market.po.CnoticePO;
import com.fanglin.market.service.CardPhotoService;
import com.fanglin.market.service.CardService;
import com.fanglin.market.service.CnoticeService;
import com.fanglin.market.service.EcaseService;
import com.fanglin.market.service.CuserService;
import com.fanglin.market.service.EcityService;
import com.fanglin.market.service.EcustomerService;
import com.fanglin.market.service.EpersonService;
import com.fanglin.market.vo.CardPhotoVO;
import com.fanglin.market.vo.CardVO;
import com.fanglin.market.vo.CnoticeVO;
import com.fanglin.market.vo.EcaseVO;
import com.fanglin.market.vo.CuserVO;
import com.fanglin.market.vo.EcityVO;
import com.fanglin.market.vo.EcustomerVO;
import com.fanglin.market.vo.EpersonVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class MarketScopeAction extends BaseListAction{
	
	private static final long serialVersionUID = 2775369665896294411L;

	@Autowired
	private EcaseService caseService;
	
	@Autowired
	private EpersonService euserService;
	
	@Autowired
	private EcustomerService ecustomerService;
	
	@Autowired
	private EcityService ecityService;
	
	@Autowired
	private CuserService cuserService;
	
	@Autowired
	private CardService cardService;
	
	@Autowired
	private CardPhotoService cardPhotoService;
	
	@Autowired
	private CnoticeService cnoticeService;
	
	private List<EcaseVO> cases;
	
	private EcaseVO caser;
	
	private EpersonVO eperson;
	
	private EcustomerVO ecustomer;
	
	private EcityVO ecity;
	
	private CuserVO cuser;
	
	private CardVO card;
	
	private List<CardPhotoVO> cardPhotos;
	
	private CardPhotoVO cardPhoto;
	
	private List<CnoticeVO> cnotices;
	
	private CnoticeVO cnotice;
	
	private int cnoticeCount;
	
	private String unionId;
	
	private String securityCode;
	
	private String verifyCode;
	
	@Action(value = "queryEcaseByCid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryEcaseByCid() throws FLException{
		
		caser = caseService.queryEcaseByCid(caser);
		
		return SUCCESS;
	}
	
	@Action(value = "queryEcaseByTypeAndStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryEcaseByTypeAndStatus() throws FLException{
		
		cases = caseService.queryEcaseByTypeAndStatus(caser);
		
		return SUCCESS;
	}
	
	@Action(value = "queryEpersonByEuid", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String queryEpersonByEuid() throws FLException{
		
		eperson = euserService.queryEpersonByEuid(eperson);

		return SUCCESS;
	}
	
	@Action(value = "addEcustomer", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String addEcustomer() throws FLException{
		
		ecustomerService.addEcustomer(ecustomer, securityCode, verifyCode);

		return SUCCESS;
	}
	
	@Action(value = "queryEcityByXandY", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String queryEcityByXandY() throws FLException{
		
		ecity = ecityService.queryEcityByXandY(ecity);

		return SUCCESS;
	}
	
	@Action(value="queryCuserByUnionId", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryCuserByUnionId() throws FLException{
	
		cuser = cuserService.queryCuserByUnionId (cuser);

		return SUCCESS;	
	}
	
	@Action(value="addCuser", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addCuser() throws FLException{
		
		cuserService.addCuser(cuser);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryCardByCuid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryCardByCuid() throws FLException{
	
		card = cardService.queryCardByCuid (card);

		return SUCCESS;	
	}
	
	@Action(value="addCard", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addCard() throws FLException{
	
		cardService.addCard(card);

		return SUCCESS;	
	}
	
	@Action(value = "updateCard", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCard() throws FLException{
		
		cardService.updateCard(card);
		
		return SUCCESS;
	}
	
	@Action(value = "addCardPhoto", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCardPhoto() throws FLException{
		
		cardPhotoService.addCardPhoto(cardPhotos);
	
		return SUCCESS;
	}
	
	@Action(value = "deleteCardPhoto", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCardPhoto() throws FLException{
		
		cardPhotoService.deleteCardPhoto(cardPhoto);
	
		return SUCCESS;
	}
	
	@Action(value = "queryCnoticeBySender", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCnoticeBySender() throws FLException{
		
		cnotices = cnoticeService.queryCnoticeByUid(cnotice, CnoticePO.TYPE_SENDER_INT);
		
		return SUCCESS;
	}
	
	@Action(value = "queryCnoticeByReceiver", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCnoticeByReceiver() throws FLException{
		
		cnotices = cnoticeService.queryCnoticeByUid(cnotice, CnoticePO.TYPE_RECEIVER_INT);
		
		return SUCCESS;
	}
	
	@Action(value = "countCnoticeByReceiver", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String countCnoticeByReceiver() throws FLException{
		
		cnoticeCount = cnoticeService.countCnotice(cnotice, CnoticePO.TYPE_RECEIVER_INT);
		
		return SUCCESS;
	}
	
	@Action(value = "addCnotice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCnotice() throws FLException{
		
		cnoticeService.addCnotice(cnotice,unionId);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteCnotice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCnotice() throws FLException{
		
		cnoticeService.deleteCnotice(cnotice);
		
		return SUCCESS;
	}
	
	@Action(value = "updateCnoticeStatusByCnid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCnoticeStatusByCnid() throws FLException{
		
		cnoticeService.updateCnoticeStatusByCnid(cnotice);
		
		return SUCCESS;
	}
	
	public List<EcaseVO> getCases() {
		return cases;
	}

	public void setCases(List<EcaseVO> cases) {
		this.cases = cases;
	}

	public EcaseVO getCaser() {
		return caser;
	}

	public void setCaser(EcaseVO caser) {
		this.caser = caser;
	}

	public EpersonVO getEperson() {
		return eperson;
	}

	public void setEperson(EpersonVO eperson) {
		this.eperson = eperson;
	}

	public EcustomerVO getEcustomer() {
		return ecustomer;
	}

	public void setEcustomer(EcustomerVO ecustomer) {
		this.ecustomer = ecustomer;
	}

	public EcityVO getEcity() {
		return ecity;
	}

	public void setEcity(EcityVO ecity) {
		this.ecity = ecity;
	}

	public CuserVO getCuser() {
		return cuser;
	}

	public void setCuser(CuserVO cuser) {
		this.cuser = cuser;
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

	public List<CnoticeVO> getCnotices() {
		return cnotices;
	}

	public void setCnotices(List<CnoticeVO> cnotices) {
		this.cnotices = cnotices;
	}

	public CnoticeVO getCnotice() {
		return cnotice;
	}

	public void setCnotice(CnoticeVO cnotice) {
		this.cnotice = cnotice;
	}

	public int getCnoticeCount() {
		return cnoticeCount;
	}

	public void setCnoticeCount(int cnoticeCount) {
		this.cnoticeCount = cnoticeCount;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}
	
}
