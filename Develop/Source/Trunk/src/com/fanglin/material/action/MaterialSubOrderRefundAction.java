/**
 * @File Name		: MaterialSubOrderRefundAction.java
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
import com.fanglin.material.service.MaterialSubOrderRefundService;
import com.fanglin.material.service.MaterialSubOrderService;
import com.fanglin.material.vo.MaterialSubOrderRefundVO;
import com.fanglin.material.vo.MaterialSubOrderVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialSubOrderRefundAction extends BaseListAction{
	
	private static final long serialVersionUID = -9013915161875932989L;
	
	@Autowired
	private MaterialSubOrderService materialSubOrderService;
	
	@Autowired
	private MaterialSubOrderRefundService materialSubOrderRefundService;
	
	private MaterialSubOrderVO materialSubOrder;
	
	private MaterialSubOrderRefundVO materialSubOrderRefund;
	
	private List<MaterialSubOrderRefundVO> materialSubOrderRefunds;
	
	private List<Long> msorIds;
	
	private List<Integer> idents;
	
	private long msoId;
	
	private long msorId;
	
	@Action(value="queryMaterialSubOrderRefund", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialSubOrderRefund(){
		
		materialSubOrderRefunds = materialSubOrderRefundService.queryMaterialSubOrderRefundByMsoIdAIdents(materialSubOrder.getMsoId(), idents);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialSubOrderRefundByMsoIdAIdent", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialSubOrderRefundByMsoIdAIdent(){
		
		long msoId = materialSubOrder.getMsoId();
		
		materialSubOrder = materialSubOrderService.queryMaterialSubOrderByMsoId(msoId);
		materialSubOrderRefunds = materialSubOrderRefundService.queryMaterialSubOrderRefundByMsoIdAIdents(msoId, idents);
		
		return SUCCESS;
	}
	
	@Action(value="cancelMaterialSubOrderRefundForModel", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String cancelMaterialSubOrderRefundForModel(){
		
		materialSubOrderRefundService.cancelMaterialSubOrderRefundForModel(materialSubOrderRefund.getMsorId());
		
		return SUCCESS;
	}
	
	@Action(value="cancelMaterialSubOrderRefundForPackage", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String cancelMaterialSubOrderRefundForPackage(){
		
		materialSubOrderRefundService.cancelMaterialSubOrderRefundForPackage(msorIds, msoId);
		
		return SUCCESS;
	}

	public MaterialSubOrderRefundVO getMaterialSubOrderRefund(){
		return materialSubOrderRefund;
	}

	public void setMaterialSubOrderRefund(MaterialSubOrderRefundVO materialSubOrderRefund){
		this.materialSubOrderRefund = materialSubOrderRefund;
	}

	public List<MaterialSubOrderRefundVO> getMaterialSubOrderRefunds(){
		return materialSubOrderRefunds;
	}

	public void setMaterialSubOrderRefunds(List<MaterialSubOrderRefundVO> materialSubOrderRefunds){
		this.materialSubOrderRefunds = materialSubOrderRefunds;
	}

	public List<Long> getMsorIds(){
		return msorIds;
	}

	public void setMsorIds(List<Long> msorIds){
		this.msorIds = msorIds;
	}

	public long getMsorId(){
		return msorId;
	}

	public void setMsorId(long msorId){
		this.msorId = msorId;
	}

	public MaterialSubOrderVO getMaterialSubOrder(){
		return materialSubOrder;
	}

	public void setMaterialSubOrder(MaterialSubOrderVO materialSubOrder){
		this.materialSubOrder = materialSubOrder;
	}

	public long getMsoId(){
		return msoId;
	}

	public void setMsoId(long msoId){
		this.msoId = msoId;
	}

	public List<Integer> getIdents(){
		return idents;
	}

	public void setIdents(List<Integer> idents){
		this.idents = idents;
	}
	
}

