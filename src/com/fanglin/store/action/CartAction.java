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
import com.fanglin.store.service.CartService;
import com.fanglin.store.vo.CartVO;
import com.fanglin.store.vo.MuserVO;


@ParentPackage("common")
@Namespace("/")
@Controller
public class CartAction extends BaseListAction{

	private static final long serialVersionUID = 6229076481070106047L;

	@Autowired
	private CartService cartService;
	
	private MuserVO muser;
	
	private CartVO cart;
	
	private List<CartVO> carts;
	
	private List<Long> cids;
	
	@Action(value="pageCart", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageCart() throws FLException{
		
		 cartService.pageCart(getPaging(), getFilters(), muser);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryCartByUnionId", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryCartByUnionId() throws FLException{
		
		carts = cartService.queryCartByUnionId(muser);
		
		return SUCCESS;
		
	}
	
	@Action(value="addCart", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addCart() throws FLException{
		
		cartService.addCart(muser, cart);
		
		return SUCCESS;
		
	}
	
	@Action(value="updateCart", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateCart() throws FLException{
		
		cartService.updateCart(muser, cart);
		
		return SUCCESS;
		
	}
	
	@Action(value="clearCart", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String clearCart() throws FLException{
		
		cartService.clearCart(muser, cids);
		
		return SUCCESS;
		
	}
	
	public MuserVO getMuser() {
		return muser;
	}

	public void setMuser(MuserVO muser) {
		this.muser = muser;
	}

	public CartVO getCart() {
		return cart;
	}

	public void setCart(CartVO cart) {
		this.cart = cart;
	}

	public List<CartVO> getCarts() {
		return carts;
	}

	public void setCarts(List<CartVO> carts) {
		this.carts = carts;
	}

	public List<Long> getCids() {
		return cids;
	}

	public void setCids(List<Long> cids) {
		this.cids = cids;
	}
	
}
