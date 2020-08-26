package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.ComplaintVO;

public interface ComplaintService {
	
	public List<ComplaintVO> queryComplaint(ComplaintVO complaint);
	
	public int addComplaint(ComplaintVO complaint, String UserId) throws FLException;
	
	public int finishComplaint(ComplaintVO complaint, String UserId) throws FLException;
	
	public int closeComplaint(ComplaintVO complaint, String UserId) throws FLException;

}
