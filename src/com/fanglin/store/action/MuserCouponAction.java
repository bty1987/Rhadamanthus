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
import com.fanglin.store.service.MuserCouponService;
import com.fanglin.store.vo.MuserCouponVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class MuserCouponAction extends BaseListAction{

	private static final long serialVersionUID = 4021446808430184641L;
	
	@Autowired
	private MuserCouponService muserCouponService;
	
	private MuserCouponVO muserCoupon;
	
	private List<MuserCouponVO> muserCoupons;
	
	@Action(value="pageMuserCoupon", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMuserCoupon(){
	
		muserCouponService.pageMuserCoupon (getPaging(), getFilters());

		return SUCCESS;	
	}
	
	@Action(value="queryMuserCouponByUnionId", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMuserCouponByUnionId(){
	
		muserCoupons = muserCouponService.queryMuserCouponByUnionId (muserCoupon);

		return SUCCESS;	
	}
	
	@Action(value="addMuserCoupon", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMuserCoupon() throws FLException{
	
		muserCouponService.addMuserCoupon (muserCoupon);

		return SUCCESS;	
	}

	public MuserCouponVO getMuserCoupon() {
		return muserCoupon;
	}

	public void setMuserCoupon(MuserCouponVO muserCoupon) {
		this.muserCoupon = muserCoupon;
	}

	public List<MuserCouponVO> getMuserCoupons() {
		return muserCoupons;
	}

	public void setMuserCoupons(List<MuserCouponVO> muserCoupons) {
		this.muserCoupons = muserCoupons;
	}
	
}
