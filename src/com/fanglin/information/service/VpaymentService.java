package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.VpaymentVO;
import com.fanglin.information.vo.VreceiptVO;
import com.fanglin.utils.Paging;


public interface VpaymentService {

	public void pageVpayment(Paging paging, List<Filter> filters, VpaymentVO vpaymentVO);
	
	public List<?> countVpayment();
	
	public int createVpayment(VpaymentVO vpaymentVO,String usreId);
	
	public int deleteVpaymentId(VpaymentVO vpaymentVO);
	
	public int collectVpayment(List<VpaymentVO> vpayments,VreceiptVO vreceiptVO,String userId) throws FLException;
	
	public List<VpaymentVO> queryVpaymentByNo(VpaymentVO vpaymentVO);
	
	public List<VpaymentVO> queryVpaymentByVrid(VpaymentVO vpaymentVO);
	
}
