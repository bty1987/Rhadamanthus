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


@ParentPackage("login")
@Namespace("/")
@Controller
public class CartAction extends BaseListAction{

	private static final long serialVersionUID = 6229076481070106047L;

	@Autowired
	private CartService cartService;
	
	private CartVO cart;
	
	private List<CartVO> carts;
	
	@Action(value="queryCartByUid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryCartByUid(){
		
		carts = cartService.queryCartByUid(cart);
		
		return SUCCESS;
		
	}
	
	@Action(value="queryCartByUnion", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryCartByUnion(){
		
		carts = cartService.queryCartByUnion(cart);
		
		return SUCCESS;
		
	}
	
	@Action(value="addOrUpdateCart", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addOrUpdateCart() throws FLException{
		
		cartService.addOrUpdateCart(cart);
		
		return SUCCESS;
		
	}
	
	@Action(value="updateCart", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateCart() throws FLException{
		
		cartService.updateCart(cart);
		
		return SUCCESS;
		
	}
	
	@Action(value="deleteCartByCid", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteCartByCid() throws FLException{
		
		cartService.deleteCartByCid(cart);
		
		return SUCCESS;
		
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
	
}
