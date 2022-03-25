package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.ReceiptTypeItemPO;
import com.fanglin.core.dao.Dao;

public interface ReceiptTypeItemDao extends Dao<ReceiptTypeItemPO> {

	public List<ReceiptTypeItemPO> queryReceiptTypeItem(Long rtid);

	public ReceiptTypeItemPO queryReceiptTypeItemByBustype(Long rtid, Short type, Short paytype);

}
