package com.fanglin.store.action;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.service.CouponService;
import com.fanglin.store.vo.CouponVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CouponScopeAction extends BaseListAction{

	private static final long serialVersionUID = 4291165559593033552L;

	@Autowired
	private CouponService couponService;
	
	private CouponVO coupon;
	
	@Action(value="pageCouponScope", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageCouponScope(){
	
		couponService.pageCoupon (getPaging(), getFilters());

		return SUCCESS;	
	}
	
	@Action(value="queryCouponScopeByCid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryCouponScopeByCid(){
	
		coupon = couponService.queryCouponByCid (coupon);

		return SUCCESS;	
	}
	
	@Action(value="addCouponScope", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addCouponScope() throws FLException{
	
		couponService.addCoupon (coupon);

		return SUCCESS;	
	}
	
	@Action(value="updateCouponScope", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateCouponScope(){
	
		couponService.updateCoupon (coupon);

		return SUCCESS;	
	}
	
	@Action(value="updateCouponScopeForStatus", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateCouponScopeForStatus(){
	
		couponService.updateCouponForStatus (coupon);

		return SUCCESS;	
	}
	
	public CouponVO getCoupon() {
		return coupon;
	}

	public void setCoupon(CouponVO coupon) {
		this.coupon = coupon;
	}

}
