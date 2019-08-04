package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.ExtensionItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;

public interface ExtensionItemDao extends Dao<ExtensionItemPO> {

	public List<ExtensionItemPO> queryExtensionItemByEid(Long eId);

	public List<ExtensionItemPO> queryExtensionItemByEids(List<Long> extensionItemIDs);

	public long countExtensionItemForFunctionArea(long qfaid);

	public long countExtensionItemForFunctionArea(List<QuotationFunctionAreaPO> quotationFunctionAreas);

	public int deleteExtensionItem(long eid);

}
