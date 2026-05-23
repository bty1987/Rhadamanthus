package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.RuotationItemPO;

public interface RuotationItemDao extends Dao<RuotationItemPO> {

	public List<RuotationItemPO> queryRuotationItem(long qrid, long qfaId);

	public long updateRuotationItemForIndex(long qriid, int index);

}
