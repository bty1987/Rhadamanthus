package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.ReceiptTypeItemPO;

public interface ReceiptTypeItemDao extends Dao<ReceiptTypeItemPO> {

	public List<ReceiptTypeItemPO> queryReceiptTypeItem(Long rtid);

	public ReceiptTypeItemPO queryReceiptTypeItemByBustype(Long rtid, Short type, Short paytype);

}
