package com.fanglin.store.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.service.AddressService;
import com.fanglin.store.vo.AddressVO;

@ParentPackage("login")
@Namespace("/")
@Controller
public class AddressAction extends BaseListAction {

	private static final long serialVersionUID = 8177482425136856239L;
	
	@Autowired
	private AddressService addressService;

	private AddressVO address;

	private List<AddressVO> addresss;

	@Action(value = "queryAddressByUid", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String queryAddressByUid() {

		addresss = addressService.queryAddressByUid(address);

		return SUCCESS;
	}

	@Action(value = "addAddress", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String addAddress() throws FLException {

		addressService.addAddress(address);

		return SUCCESS;
	}

	@Action(value = "updateAddress", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String updateAddress() throws FLException {

		addressService.updateAddress(address);

		return SUCCESS;
	}
	
	@Action(value = "updateAddressForStatus", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String updateAddressForStatus() throws FLException {
		
		addressService.updateAddressForStatus(address);

		return SUCCESS;
	}

	@Action(value = "deleteAddress", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String deleteAddress() throws FLException {

		addressService.deleteAddress(address);

		return SUCCESS;
	}

	public AddressVO getAddress() {
		return address;
	}

	public void setAddress(AddressVO address) {
		this.address = address;
	}

	public List<AddressVO> getAddresss() {
		return addresss;
	}

	public void setAddresss(List<AddressVO> addresss) {
		this.addresss = addresss;
	}

}
