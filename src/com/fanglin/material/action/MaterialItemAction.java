/**
 * @File Name		: MaterialItemAction.java
 * @Package   	: com.fanglin.action.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.material.service.MaterialItemService;
import com.fanglin.material.vo.MaterialItemVO;
import com.fanglin.material.vo.MaterialVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialItemAction extends BaseListAction {

	private static final long serialVersionUID = -5642202978260012376L;

	@Autowired
	private MaterialItemService materialItemService;

	private MaterialVO material;

	private MaterialItemVO materialItem;

	private List<MaterialItemVO> materialItems;

	private Float num;

	private List<Long> miids;

	private long mid;

	@Action(value = "queryMaterialItemByMid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMaterialItemByMid() {

		materialItems = materialItemService.queryMaterialItemByMid(materialItem);

		return SUCCESS;
	}

	@Action(value = "queryMaterialItemByMiid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMaterialItemByMiid() {

		materialItem = materialItemService.queryMaterialItemByMiid(materialItem);

		return SUCCESS;
	}

	@Action(value = "queryMaterialItemForNameByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMaterialItemForNameByName() {

		materialItems = materialItemService.queryMaterialItemForNameByName(materialItem);

		return SUCCESS;
	}

	@Action(value = "queryMaterialItemForNameByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMaterialItemForNameByNo() {

		materialItems = materialItemService.queryMaterialItemForNameByNo(materialItem);

		return SUCCESS;
	}

	@Action(value = "addMaterialItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addMaterialItem() throws FLException {

		materialItemService.addMaterialItem(material, materialItems);

		return SUCCESS;
	}

	@Action(value = "updateMaterialItemForModel", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMaterialItemForModel() throws FLException {

		materialItemService.updateMaterialItemForModel(material, materialItem);

		return SUCCESS;
	}

	@Action(value = "updateMaterialItemForPackage", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMaterialItemForPackage() throws FLException {

		materialItemService.updateMaterialItemForPackage(material, materialItems);

		return SUCCESS;
	}

	@Action(value = "updateMaterialItemForPrePT", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMaterialItemForPrePT() {

		materialItemService.updateMaterialItemForPrePT(miids, materialItem);

		return SUCCESS;
	}

	@Action(value = "changeMaterialItemForCaclType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeMaterialItemForCaclType() throws FLException {

		materialItemService.changeMaterialItemForCaclType(materialItem, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deleteMaterialItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteMaterialItem() throws FLException {

		materialItemService.deleteMaterialItem(miids, mid);

		return SUCCESS;
	}

	public MaterialVO getMaterial() {
		return material;
	}

	public void setMaterial(MaterialVO material) {
		this.material = material;
	}

	public MaterialItemVO getMaterialItem() {
		return materialItem;
	}

	public void setMaterialItem(MaterialItemVO materialItem) {
		this.materialItem = materialItem;
	}

	public List<MaterialItemVO> getMaterialItems() {
		return materialItems;
	}

	public void setMaterialItems(List<MaterialItemVO> materialItems) {
		this.materialItems = materialItems;
	}

	public List<Long> getMiids() {
		return miids;
	}

	public void setMiids(List<Long> miids) {
		this.miids = miids;
	}

	public long getMid() {
		return mid;
	}

	public void setMid(long mid) {
		this.mid = mid;
	}

	public Float getNum() {
		return num;
	}

	public void setNum(Float num) {
		this.num = num;
	}

}
