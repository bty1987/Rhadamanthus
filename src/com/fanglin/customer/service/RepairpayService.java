package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.vo.RepairpayVO;

public interface RepairpayService {

	public List<RepairpayVO> queryRepairpay(RepairpayVO repairpayVO);
	
	public int addRepairpay(RepairpayVO repairpayVO, String userId) throws FLException;
	
	public int deleteRepairpay(RepairpayVO repairpayVO) throws FLException;
	
}
