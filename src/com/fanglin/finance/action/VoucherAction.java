/**
 * @File Name		: VoucherAction.java
 * @Package   	: com.fanglin.finance.action
 * @Version		: 1.0
 * @Date			: 2015-12-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.finance.service.VoucherService;
import com.fanglin.finance.vo.VoucherVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class VoucherAction extends BaseListAction {

	private static final long serialVersionUID = 599739041704579591L;
	
	@Autowired
	private VoucherService voucherService;
	
	private VoucherVO voucher;
	
	private List<Long> vids;
	
	private List<Long> atIds;
	
	private List<Long> uatIds;
	
	private List<Long> datIds;
	
	@Action(value = "pageVoucher", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String pageVoucher(){
		
		voucherService.pageVoucher(getPaging(), getFilters(), getCondition());
		
		return SUCCESS;
	}
	
	@Action(value = "queryVoucherByVId", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String queryVoucherByVId() throws FLException{
		
		voucher = voucherService.queryVoucherByVId(voucher);
		
		return SUCCESS;
	}
	
	@Action(value = "addVoucher", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String addVoucher() throws FLException{
		
		voucherService.addVoucher(voucher, atIds, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "updateVoucher", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String updateVoucher() throws FLException{
		
		voucherService.updateVoucher(voucher, atIds, uatIds, datIds);
		
		return SUCCESS;
	}
	
	@Action(value = "postVoucher", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String postVoucher() throws FLException{
		
		voucherService.postVoucher(voucher, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "postVouchers", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String postVouchers() throws FLException{
		
		voucherService.postVouchers(vids, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "inpostVoucher", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String inpostVoucher() throws FLException{
		
		voucherService.inpostVoucher(voucher, queryUserId());
		
		return SUCCESS;
	}

	public VoucherVO getVoucher() {
		return voucher;
	}

	public void setVoucher(VoucherVO voucher) {
		this.voucher = voucher;
	}

	public List<Long> getVids() {
		return vids;
	}

	public void setVids(List<Long> vids) {
		this.vids = vids;
	}

	public List<Long> getAtIds() {
		return atIds;
	}

	public void setAtIds(List<Long> atIds) {
		this.atIds = atIds;
	}

	public List<Long> getUatIds() {
		return uatIds;
	}

	public void setUatIds(List<Long> uatIds) {
		this.uatIds = uatIds;
	}

	public List<Long> getDatIds() {
		return datIds;
	}

	public void setDatIds(List<Long> datIds) {
		this.datIds = datIds;
	}

}
