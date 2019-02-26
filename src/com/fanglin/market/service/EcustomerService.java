package com.fanglin.market.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.market.vo.EcustomerVO;
import com.fanglin.utils.Paging;

public interface EcustomerService {

	public void pageEcustomer(Paging paging, List<Filter> filters);
	
	public void addEcustomer(EcustomerVO ecustomerVO, String securityCode, String verifyCode) throws FLException;
}
