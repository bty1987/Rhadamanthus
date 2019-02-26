/**
 * @File Name		: MaterialRefundAction.java
 * @Package   	: com.fanglin.action.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-16
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.material.service.MaterialRefundService;
import com.fanglin.material.vo.MaterialRefundVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialRefundAction extends BaseListAction {

	private static final long serialVersionUID = -9013915161875932989L;

	@Autowired
	private MaterialRefundService materialRefundService;

	private MaterialRefundVO materialRefund;

	private List<MaterialRefundVO> materialRefunds;

	private List<Integer> idents;

	@Action(value = "queryMaterialRefundByMid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMaterialRefundByMid() {

		materialRefunds = materialRefundService.queryMaterialRefundByMidAIdents(materialRefund.getMid(), idents);

		return SUCCESS;
	}

	public MaterialRefundVO getMaterialRefund() {
		return materialRefund;
	}

	public void setMaterialRefund(MaterialRefundVO materialRefund) {
		this.materialRefund = materialRefund;
	}

	public List<MaterialRefundVO> getMaterialRefunds() {
		return materialRefunds;
	}

	public void setMaterialRefunds(List<MaterialRefundVO> materialRefunds) {
		this.materialRefunds = materialRefunds;
	}

	public List<Integer> getIdents() {
		return idents;
	}

	public void setIdents(List<Integer> idents) {
		this.idents = idents;
	}

}
