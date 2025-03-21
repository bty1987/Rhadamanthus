package com.fanglin.data.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.RemeasureFormatPO;

public interface RemeasureFormatDao extends Dao<RemeasureFormatPO> {

	public List<RemeasureFormatPO> queryRemeasureFormatByBid(Long bid);

}
