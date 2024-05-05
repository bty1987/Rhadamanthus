package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.data.po.DecorationMeasureItemPO;
import com.fanglin.data.po.DecorationMeasurePO;

public interface DecorationMeasureDao extends Dao<DecorationMeasurePO> {

	public List<DecorationMeasurePO> queryDecorationMeasure();

	public List<DecorationMeasureItemPO> queryDecorationMeasure(int company);

}
