package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotetionPO;

public interface QuotetionDao extends Dao<QuotetionPO> {

	public List<QuotetionPO> queryQuotetionByCuid(long cuid);

	public int countQuotetionByCuid(long cuid);

	public QuotetionPO queryQuotetionByNo(String no);

}
