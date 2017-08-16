package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.po.PurchasePO;
import com.fanglin.utils.Paging;

public interface PurchaseDao extends Dao<PurchasePO> {

	public List<PurchasePO> pagePurchase(Paging paging, List<Filter> filters,int company);
	
	public PurchasePO queryPurchaseByPid(long pid);
	
}
