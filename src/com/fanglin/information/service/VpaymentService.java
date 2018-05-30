package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.VpaymentVO;
import com.fanglin.utils.Paging;


public interface VpaymentService {

	public void pageVpayment(Paging paging, List<Filter> filters);
	
	public List<?> countVpayment();
	
	public int createVpayment(VpaymentVO vpaymentVO,String userId);
	
	public int deleteVpaymentId(VpaymentVO vpaymentVO);
}
