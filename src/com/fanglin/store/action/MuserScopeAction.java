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
import com.fanglin.store.service.MorderService;
import com.fanglin.store.service.MuserService;
import com.fanglin.store.vo.AddressVO;
import com.fanglin.store.vo.MorderItemVO;
import com.fanglin.store.vo.MorderVO;
import com.fanglin.store.vo.MuserVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class MuserScopeAction extends BaseListAction {

	private static final long serialVersionUID = 9221973082829442999L;

	@Autowired
	private MuserService muserService;

	@Autowired
	private AddressService addressService;

	@Autowired
	private MorderService morderService;

	private MuserVO muser;

	private List<MuserVO> musers;

	private AddressVO address;

	private List<AddressVO> addresses;

	private List<MorderVO> morders;

	private MorderVO morder;

	private List<MorderItemVO> morderItem;

	private List<Long> cids;

	@Action(value = "queryMuserByUnionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMuserByUnionId() {

		muser = muserService.queryMuserByUnionId(muser);

		return SUCCESS;
	}

	@Action(value = "saveMuser", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String saveMuser() {

		muserService.saveMuser(muser);

		return SUCCESS;
	}

	@Action(value = "queryAddress", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAddress() {

		addresses = addressService.queryAddress(muser, address);

		return SUCCESS;
	}

	@Action(value = "addAddress", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAddress() throws FLException {

		addressService.addAddress(address, muser);

		return SUCCESS;
	}

	@Action(value = "updateAddress", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAddress() throws FLException {

		addressService.updateAddress(address, muser);

		return SUCCESS;
	}

	@Action(value = "updateAddressForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAddressForStatus() throws FLException {

		addressService.updateAddressForStatus(address, muser);

		return SUCCESS;
	}

	@Action(value = "queryMorderByUnionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMorderByUnionId() throws FLException {

		morderService.pageMorder(getPaging(), getFilters(), true);

		return SUCCESS;
	}

	@Action(value = "addMorder", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addMorder() throws FLException {

		morderService.addMorder(morder, morderItem, cids);

		return SUCCESS;
	}

	@Action(value = "updateMorderForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMorderForStatus() throws FLException {

		morderService.updateMorderForStatus(morder);

		return SUCCESS;
	}

	public MuserVO getMuser() {
		return muser;
	}

	public void setMuser(MuserVO muser) {
		this.muser = muser;
	}

	public List<MuserVO> getMusers() {
		return musers;
	}

	public void setMusers(List<MuserVO> musers) {
		this.musers = musers;
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

	public List<MorderVO> getMorders() {
		return morders;
	}

	public void setMorders(List<MorderVO> morders) {
		this.morders = morders;
	}

	public MorderVO getMorder() {
		return morder;
	}

	public void setMorder(MorderVO morder) {
		this.morder = morder;
	}

	public List<MorderItemVO> getMorderItem() {
		return morderItem;
	}

	public void setMorderItem(List<MorderItemVO> morderItem) {
		this.morderItem = morderItem;
	}

	public List<Long> getCids() {
		return cids;
	}

	public void setCids(List<Long> cids) {
		this.cids = cids;
	}

}
