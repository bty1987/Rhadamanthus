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

@ParentPackage("common")
@Namespace("/")
@Controller
public class CouponAction extends BaseListAction{

	private static final long serialVersionUID = -7522581921856243974L;
	
	@Autowired
	private CouponService couponService;
	
	private CouponVO coupon;
	
	@Action(value="pageCoupon", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageCoupon(){
	
		couponService.pageCoupon (getPaging(), getFilters());

		return SUCCESS;	
	}
	
	@Action(value="queryCouponByCid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryCouponByCid(){
	
		coupon = couponService.queryCouponByCid (coupon);

		return SUCCESS;	
	}
	
	@Action(value="addCoupon", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addCoupon() throws FLException{
	
		couponService.addCoupon (coupon);

		return SUCCESS;	
	}
	
	@Action(value="updateCoupon", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateCoupon(){
	
		couponService.updateCoupon (coupon);

		return SUCCESS;	
	}
	
	@Action(value="updateCouponForStatus", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateCouponForStatus(){
	
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
