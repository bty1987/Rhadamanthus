package com.fanglin.inventory.service;

import java.util.List;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.vo.PurchaseVO;
import com.fanglin.inventory.vo.PurchaseItemVO;

public interface PurchaseItemService {

	public int addPurchaseItem(PurchaseVO purchaseVO,PurchaseItemVO purchaseItemVOs) throws FLException;
	
	public int updatePurchaseItem(PurchaseVO purchaseVO,PurchaseItemVO purchaseItemVOs) throws FLException;
	
	public int updatePurchaseItemSurplus(PurchaseVO purchaseVO, List<PurchaseItemVO> purchaseItemVOs) throws FLException;
	
	public int deletePurchaseItem(PurchaseVO purchaseVO,PurchaseItemVO purchaseItemVOs) throws FLException;
	
	public List<PurchaseItemVO> queryPurchaseItemByPid(PurchaseVO purchaseVO);
	
	public List<PurchaseItemVO> queryPurchaseItemByPids(List<Long> pids);
	
	public List<PurchaseItemVO> queryPurchaseItemBySiid(PurchaseItemVO purchaseItemVO);
	
	public List<PurchaseItemVO> queryPurchaseItemBySiids(List<Long> siids);
	
}
