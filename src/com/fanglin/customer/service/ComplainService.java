package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.ComplainVO;
import com.fanglin.customer.vo.ComplaintVO;
import com.fanglin.customer.vo.ConsultionVO;
import com.fanglin.utils.Paging;

public interface ComplainService {
	
	public void pageComplain(Paging paging, List<Filter> filters, int company);
	
	public List<ComplainVO> queryComplain(ComplainVO complain);
	
	public List<ComplainVO> queryComplainByOrderId(ComplainVO complain);
	
	public int addComplain(ConsultionVO consultion, ComplainVO complain, List<ComplaintVO> complaints, String UserId, int company) throws FLException;
	
	public int finishComplain(ComplainVO complain, String UserId) throws FLException;
	
	public int closeComplain(ComplainVO complain, String UserId) throws FLException;

}
