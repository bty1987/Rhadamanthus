/**
 * @File Name		: OrderBelongInfoAction
 * @Package   	: com.fanglin.action.orderBelongInfo
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.service.DecorationBelongService;
import com.fanglin.decoration.vo.DecorationBelongVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationBelongAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548192L;

	@Autowired
	private DecorationBelongService decorationBelongService;

	private DecorationBelongVO decorationBelong;

	private List<DecorationBelongVO> decorationBelongs;

	@Action(value = "queryDecorationBelongForDesignAChangeByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationBelongForDesignAChangeByOrderId() {

		Short belongType = DecorationBelongPO.BELONGTYPE_DESIGN_INT;

		decorationBelongs = decorationBelongService.queryDecorationBelongForChangeByOrderIdAType(decorationBelong.getOrderId(), belongType);

		return SUCCESS;
	}

	@Action(value = "queryDecorationBelongForDesignByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOrderBelongInfoForDesignByOrderId() {

		Short belongType = DecorationBelongPO.BELONGTYPE_DESIGN_INT;

		decorationBelongs = decorationBelongService.queryDecorationBelongForCurrentByOrderIdAType(decorationBelong.getOrderId(), belongType);

		return SUCCESS;
	}

	@Action(value = "queryDecorationBelongForBusinessnAChangeByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationBelongForBusinessnAChangeByOrderId() {

		Short belongType = DecorationBelongPO.BELONGTYPE_SALESMAN_INT;

		decorationBelongs = decorationBelongService.queryDecorationBelongForChangeByOrderIdAType(decorationBelong.getOrderId(), belongType);

		return SUCCESS;
	}

	@Action(value = "queryDecorationBelongForBusinessnByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOrderBelongInfoForBusinessnByOrderId() {

		Short belongType = DecorationBelongPO.BELONGTYPE_SALESMAN_INT;

		decorationBelongs = decorationBelongService.queryDecorationBelongForCurrentByOrderIdAType(decorationBelong.getOrderId(), belongType);

		return SUCCESS;
	}

	@Action(value = "queryDecorationBelongByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOrderBelongInfoByOrderId() {

		decorationBelongs = decorationBelongService.queryDecorationBelongByOrderId(decorationBelong);

		return SUCCESS;
	}

	public DecorationBelongVO getDecorationBelong() {
		return decorationBelong;
	}

	public void setDecorationBelong(DecorationBelongVO decorationBelong) {
		this.decorationBelong = decorationBelong;
	}

	public List<DecorationBelongVO> getDecorationBelongs() {
		return decorationBelongs;
	}

	public void setDecorationBelongs(List<DecorationBelongVO> decorationBelongs) {
		this.decorationBelongs = decorationBelongs;
	}

}
