package com.fanglin.decoration.dao;

import java.sql.Timestamp;
import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationMeasurePO;
import com.fanglin.utils.Paging;

public interface DecorationMeasureDao extends Dao<DecorationMeasurePO> {
	
	public List<DecorationMeasurePO> pageDecorationMeasure(Paging paging,List<Filter> filters, int company) throws FLException;
	
	public int countDecorationMeasure(String orderId);
	
	public DecorationMeasurePO queryDecorationMeasure(String orderId);
	
	public int countDecorationMeasure(Timestamp startTime, Timestamp endTime, int company);

    public List<DecorationMeasurePO> queryDecorationMeasure(List<Filter> filters, int company) throws FLException;
}
