package com.fanglin.kingdee.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.kingdee.vo.KingdeeRecordVO;
import com.fanglin.utils.Paging;

public interface KingdeeRecordService {

	public void pageKingdeeRecord(Paging paging, List<Filter> filters);

	public void addKingdeeRecord(KingdeeRecordVO kingdeeRecord) throws FLException;
	
}
