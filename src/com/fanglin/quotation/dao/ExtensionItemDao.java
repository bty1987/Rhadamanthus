package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.ExtensionItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;

public interface ExtensionItemDao extends Dao<ExtensionItemPO> {

	public List<ExtensionItemPO> queryExtensionItem(Long eId);

	public List<ExtensionItemPO> queryExtensionItem(List<Long> eids);

	public long countExtensionItem(long qfaid);

	public long countExtensionItem(List<QuotationFunctionAreaPO> quotationFunctionAreas);

	public int deleteExtensionItem(String orderId);

	public int deleteExtensionItem(long eid);

}
