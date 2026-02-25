package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.po.QuotetionFunctionAreaItemPO;
import com.fanglin.quotation.vo.QuotetionFunctionAreaItemVO;

public interface QuotetionFunctionAreaItemDao extends Dao<QuotetionFunctionAreaItemPO> {

	public QuotetionFunctionAreaItemPO queryQuotetionFunctionAreaItemByQfaiId(Class<?> clazz, long qfaiId);

	public QuotetionFunctionAreaItemPO queryQuotetionFunctionAreaItemForTypeByQuotetionFunctionAreaId(Class<?> clazz, Long quotetionFunctionAreaId, Short type);

	public List<QuotetionFunctionAreaItemPO> queryQuotetionFunctionAreaItemByFunctionAreaId(Class<?> clazz, long qfaid);

	public int updateQuotetionFunctionAreaItemForIndex(String table, QuotetionFunctionAreaItemVO quotetionFunctionAreaItemVO) throws FLException;

	public int deleteQuotetionFunctionAreaItemByQfaiIds(String table, List<Long> qfaiIds);

	public int deleteQuotetionFunctionAreaItemByFunctionAreaId(String clazz, long functionAreaId);

	public int copyQuotetionFunctionAreaItem(String table, long sqfaid, long tqfaid);

}
