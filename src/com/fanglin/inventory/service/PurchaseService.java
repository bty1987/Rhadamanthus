package com.fanglin.inventory.service;

import java.util.List;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.vo.PurchaseItemVO;
import com.fanglin.inventory.vo.PurchaseVO;
import com.fanglin.sales.vo.SalesVO;
import com.fanglin.utils.Paging;

public interface PurchaseService {
	
	public void pagePurchase(Paging paging, List<Filter> filters,int company);
	
	public PurchaseVO queryPurchaseByPid(PurchaseVO purchaseVO);
	
	public List<PurchaseVO> queryPurchaseBySid(SalesVO salesVO);
	
	public int addPurchase(PurchaseVO purchaseVO, List<Long> sids,List<PurchaseItemVO> purchaseItemVOs, String userId,int company) throws FLException;
	
	public int updatePurchaseForStatus(PurchaseVO purchaseVO) throws FLException;
	
	public int updatePurchaseForBalanceStatus(PurchaseVO purchaseVO) throws FLException;
	
	public int updatePurchase(PurchaseVO purchaseVO) throws FLException;
	
	public int updatePurchaseStatus(PurchaseVO purchaseVO) throws FLException;
	
}
