package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.DecorationVO;
import com.fanglin.utils.Paging;

public interface DecorationService {
	
	public void queryCusDecorationUser(Paging paging,List<Filter> filters,DecorationVO decorationVO,String unionId);
	
	public Object queryCusDecoration(DecorationVO decorationVO,String unionId);
	
	public DecorationVO queryCusDecorationByOrderId(DecorationVO decorationVO);
	
	public DecorationVO queryCusDecorationForDefault(String unionId) throws FLException;
	
	public int bindingCusDecoration(DecorationVO decorationVO,String unionId,String securityCode,String verifyCode) throws FLException;
	
	public int updateCusDecorationForDefault(DecorationVO decorationVO,String unionId) throws FLException;

}
