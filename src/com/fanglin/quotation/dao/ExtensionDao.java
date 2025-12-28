package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.ExtensionDO;
import com.fanglin.quotation.po.ExtensionPO;
import com.fanglin.utils.Paging;

public interface ExtensionDao extends Dao<ExtensionPO> {

	public List<ExtensionDO> pageExtension(Paging paging, List<Filter> filters, Integer company);

	public List<ExtensionPO> pageExtensionByOrderId(Paging paging, List<Filter> filters);

	public List<ExtensionPO> queryExtensionByOrderId(String orderId);

	public List<ExtensionPO> queryAllExtensionByOrderId(String orderId);

	public List<ExtensionPO> queryExtensionForTypeByOrderId(String orderId, Short type);

	public ExtensionPO queryExtension(long qid, short type, short atttype);

	public int deleteExtension(String orderId);

}
