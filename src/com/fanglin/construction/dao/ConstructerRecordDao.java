package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.ConstructerRecordPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface ConstructerRecordDao extends Dao<ConstructerRecordPO> {

	public List<ConstructerRecordPO> pageConstructerRecord(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<ConstructerRecordPO> queryConstructerRecord(long cid);

}
