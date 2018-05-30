package com.fanglin.store.service;

import java.util.List;


import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.vo.CartVO;

public interface CartService {

	public List<CartVO> queryCartByUid(CartVO cartVO);
	
	public List<CartVO> queryCartByUnion(CartVO cartVO);
	
	public int addOrUpdateCart(CartVO cartVO) throws FLException;
	
	public int updateCart(CartVO cartVO) throws FLException;
	
	public int deleteCartByCid(CartVO cartVO) throws FLException;
}
