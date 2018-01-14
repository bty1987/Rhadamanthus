package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.ExtensionItemPO;

public interface ExtensionItemDao extends Dao< ExtensionItemPO> {
	
	public List<ExtensionItemPO> queryExtensionItemByEid(Long eId);
	
	public List<ExtensionItemPO> queryExtensionItemByEids(List<Long> extensionItemIDs);
	
	public List<Integer> queryQuotationFunctionAreaIdByEids(List<Long> extensionItemIDs);

}
