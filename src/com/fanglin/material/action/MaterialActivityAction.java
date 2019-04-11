package com.fanglin.material.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.material.service.MaterialActivityService;
import com.fanglin.material.vo.MaterialActivityItemVO;
import com.fanglin.material.vo.MaterialVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialActivityAction extends BaseListAction {

	private static final long serialVersionUID = -356652609484684378L;

	@Autowired
	private MaterialActivityService materialActivityService;

	private List<MaterialActivityItemVO> materialActivityItems;

	private MaterialActivityItemVO materialActivityItem;

	private Object materialActivitys;

	private String orderId;

	private MaterialVO material;

	@Action(value = "queryMaterialActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMaterialActivityItem() {

		materialActivityItems = materialActivityService.queryMaterialActivityItem(orderId);

		return SUCCESS;
	}

	@Action(value = "addMaterialActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addMaterialActivityItem() throws FLException {

		materialActivityService.addMaterialActivityItem(materialActivityItems);

		return SUCCESS;
	}

	@Action(value = "queryMaterialActivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMaterialActivity() throws FLException {

		materialActivitys = materialActivityService.queryMaterialActivity(orderId);

		return SUCCESS;
	}

	@Action(value = "updateMaterialForActivity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMaterialForActivity() throws FLException {

		materialActivityService.updateMaterialForActivity(material);

		return SUCCESS;
	}

	@Action(value = "abateMaterialActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String abateMaterialActivityItem() throws FLException {

		materialActivityService.abateMaterialActivityItem(materialActivityItem);

		return SUCCESS;
	}

	@Action(value = "receiveMaterialActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String receiveMaterialActivityItem() throws FLException {

		materialActivityService.receiveMaterialActivityItem(materialActivityItem, queryUserId(), queryUserName());

		return SUCCESS;
	}
	
	@Action(value = "deliveMaterialActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deliveMaterialActivityItem() throws FLException {

		materialActivityService.deliveMaterialActivityItem(materialActivityItem);

		return SUCCESS;
	}
	
	@Action(value = "unrefundMaterialActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unrefundMaterialActivityItem() throws FLException {

		materialActivityService.unrefundMaterialActivityItem(materialActivityItem);

		return SUCCESS;
	}
	
	@Action(value = "upgradeMaterialActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String upgradeMaterialActivityItem() throws FLException {

		materialActivityService.upgradeMaterialActivityItem(materialActivityItem);

		return SUCCESS;
	}
	
	@Action(value = "expendMaterialActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String expendMaterialActivityItem() throws FLException {

		materialActivityService.expendMaterialActivityItem(materialActivityItem);

		return SUCCESS;
	}
	
	@Action(value = "refundMaterialActivityItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refundMaterialActivityItem() throws FLException {

		materialActivityService.refundMaterialActivityItem(materialActivityItem, queryUserId(), queryUserName());

		return SUCCESS;
	}

	public List<MaterialActivityItemVO> getMaterialActivityItems() {
		return materialActivityItems;
	}

	public void setMaterialActivityItems(List<MaterialActivityItemVO> materialActivityItems) {
		this.materialActivityItems = materialActivityItems;
	}

	public Object getMaterialActivitys() {
		return materialActivitys;
	}

	public void setMaterialActivitys(Object materialActivitys) {
		this.materialActivitys = materialActivitys;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public MaterialVO getMaterial() {
		return material;
	}

	public void setMaterial(MaterialVO material) {
		this.material = material;
	}

	public MaterialActivityItemVO getMaterialActivityItem() {
		return materialActivityItem;
	}

	public void setMaterialActivityItem(MaterialActivityItemVO materialActivityItem) {
		this.materialActivityItem = materialActivityItem;
	}

}
