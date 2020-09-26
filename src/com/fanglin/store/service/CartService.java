package com.fanglin.store.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.vo.CartVO;
import com.fanglin.store.vo.MuserVO;
import com.fanglin.utils.Paging;

public interface CartService {

	public void pageCart(Paging paging, List<Filter> filters, MuserVO muserVO);

	public List<CartVO> queryCartByUnionId(MuserVO muserVO) throws FLException;

	public int addCart(MuserVO muserVO, CartVO cartVO) throws FLException;

	public int updateCart(MuserVO muserVO, CartVO cartVO) throws FLException;

	public int clearCart(MuserVO muserVO, List<Long> cids) throws FLException;

}
