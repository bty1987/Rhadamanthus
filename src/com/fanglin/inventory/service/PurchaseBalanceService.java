package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.vo.PurchaseBalanceVO;


public interface PurchaseBalanceService {
	
	public List<PurchaseBalanceVO> queryPurchaseBalanceByPid(PurchaseBalanceVO purchaseBalanceVO);
	
	public int addPurchaseBalance(PurchaseBalanceVO purchaseBalanceVO, String userId) throws FLException;
	
	public int updatePurchaseBalance(PurchaseBalanceVO purchaseBalanceVO) throws FLException;
	
	public int updatePurchaseBalanceForStatus(PurchaseBalanceVO purchaseBalanceVO) throws FLException;
	
}
