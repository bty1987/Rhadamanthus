package com.fanglin.production.dao;

import java.util.List;
import com.fanglin.core.dao.Dao;
import com.fanglin.production.po.OutsourceItemPO;

public interface OutsourceItemDao extends Dao<OutsourceItemPO>{

	public List<OutsourceItemPO> queyOutsourceItemByoid (Long oid);

}
