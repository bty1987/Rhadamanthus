/**
 * @File Name		: AddOrReduceItemAction
 * @Package   	: com.fanglin.action.quotation
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.decoration.service.AddOrReduceItemService;
import com.fanglin.decoration.vo.AddReduceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AddOrReduceItemAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548111L;

	protected Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private AddOrReduceItemService addOrReduceItemService;
	
	private AddReduceVO addReduce;
	
	private Long orderPaymentId;
	
	@Action(value = "pageAddOrReduceItemByPaymentId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAddOrReduceItemByPaymentId(){

		addOrReduceItemService.pageAddOrReduceItemByPaymentId(getPaging(), getFilters(), addReduce);
	    
		return SUCCESS;
	}
	
	public Long getOrderPaymentId(){
		return orderPaymentId;
	}

	public void setOrderPaymentId(Long orderPaymentId){
		this.orderPaymentId = orderPaymentId;
	}

	public AddReduceVO getAddReduce() {
		return addReduce;
	}

	public void setAddReduce(AddReduceVO addReduce) {
		this.addReduce = addReduce;
	}

}
