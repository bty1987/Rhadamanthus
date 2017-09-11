package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.ExtensionPO;
import com.fanglin.utils.Paging;

public interface ExtensionDao extends Dao<ExtensionPO>{

	public List<ExtensionPO> pageExtensionByOrderId(Paging paging, List<Filter> filters);
	
	public List<ExtensionPO> queryExtensionByOrderId(String  orderId);
	
	public float sumExtensionByOrderId(String orderId,short type);
	
}
