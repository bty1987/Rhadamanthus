/**
 * @File Name		: OrderDesignPictureAction
 * @Package   	: com.fanglin.action.orderDesignPicture
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email			: 739061411@qqcom
 * @Describing	: 
 */

package com.fanglin.decoration.action;

import java.util.Date;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.OrderDesignPictureService;
import com.fanglin.decoration.vo.OrderDesignPictureVO;
import com.fanglin.utils.DateUtil;

@ParentPackage("base")
@Namespace("/")
@Controller
public class OrderDesignPictureAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548192L;
	
	@Autowired
	private OrderDesignPictureService orderDesignPictureService;

	private OrderDesignPictureVO orderDesignPicture;
	
	private List<OrderDesignPictureVO> orderDesignPictures;
	
	@Action(value = "queryOrderDesignPictureByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOrderDesignPictureByOrderId(){

		orderDesignPictures = orderDesignPictureService.queryOrderDesignPictureByOrderId(orderDesignPicture);
	    
		return SUCCESS;
	}

	@Action(value = "queryOrderDesignPictureForCADByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOrderDesignPictureForCADByOrderId() throws Exception {

		orderDesignPictures = orderDesignPictureService.queryOrderDesignPictureForCADByOrderId(orderDesignPicture);
	    
		return SUCCESS;
	}
	
	@Action(value = "addOrderDesignPicture", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addOrderDesignPicture() throws FLException{

		orderDesignPicture.setUserId(getUserId());
		orderDesignPicture.setUploadTime(DateUtil.getDateToTimestamp(new Date()));
		orderDesignPicture.setPictureType(1);
		
		orderDesignPictureService.addOrderDesignPicture(orderDesignPicture);

		return SUCCESS;
	}
	
	@Action(value = "addOrderDesignPictureForCAD", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addOrderDesignPictureForCAD() throws Exception {

		orderDesignPicture.setUserId(getUserId());
		orderDesignPicture.setUploadTime(DateUtil.getDateToTimestamp(new Date()));
		orderDesignPicture.setPictureType(0);
		orderDesignPictureService.addOrderDesignPicture(orderDesignPicture);

	    return SUCCESS;
	}

	@Action(value = "deleteOrderDesignPictureByIdAndOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteOrderDesignPictureByIdAndOrderId() throws FLException{

		orderDesignPictureService.deleteOrderDesignPictureByIdAndOrderId(orderDesignPicture);
	    
		return SUCCESS;
	}
	
	public OrderDesignPictureVO getOrderDesignPicture(){
		return orderDesignPicture;
	}

	public void setOrderDesignPicture(OrderDesignPictureVO orderDesignPicture){
		this.orderDesignPicture = orderDesignPicture;
	}

	public void setOrderDesignPictures(List<OrderDesignPictureVO> orderDesignPictures){
		this.orderDesignPictures = orderDesignPictures;
	}

	public List<OrderDesignPictureVO> getOrderDesignPictures(){
		return orderDesignPictures;
	}

}
