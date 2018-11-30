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
import com.fanglin.store.vo.MuserVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class AddressAction extends BaseListAction {

	private static final long serialVersionUID = 8177482425136856239L;
	
	@Autowired
	private AddressService addressService;

	private AddressVO address;
	
	private List<AddressVO> addresses;
	
	private MuserVO muser;
	
	@Action(value = "queryAddressByUid", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String queryAddressByUid(){
		
		addresses = addressService.queryAddressByUid(address);

		return SUCCESS;
	}
	
	@Action(value = "updateBaseAddress", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String updateBaseAddress() throws FLException {

		addressService.updateAddress(address, muser);

		return SUCCESS;
	}
	
	@Action(value = "updateAddressByAid", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType","text/html" })
	public String updateAddressByAid() throws FLException {
		
		addressService.updateAddressByAid(address);

		return SUCCESS;
	}

	public AddressVO getAddress() {
		return address;
	}

	public void setAddress(AddressVO address) {
		this.address = address;
	}

	public List<AddressVO> getAddresses() {
		return addresses;
	}

	public void setAddresses(List<AddressVO> addresses) {
		this.addresses = addresses;
	}

	public MuserVO getMuser() {
		return muser;
	}

	public void setMuser(MuserVO muser) {
		this.muser = muser;
	}

}
