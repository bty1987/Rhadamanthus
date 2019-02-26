package com.fanglin.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.material.po.MaterialActivityItemPO;

public interface MaterialActivityDao extends Dao<MaterialActivityItemPO> {
	
	public List<MaterialActivityItemPO> queryMaterialActivityItem(String orderId);

}
