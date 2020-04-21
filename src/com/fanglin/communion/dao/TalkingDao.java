package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.TalkingPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface TalkingDao extends Dao<TalkingPO> {

	public List<TalkingPO> pageTalking(Paging paging, List<Filter> filters, int company);
	
	public List<TalkingPO> queryTalking(List<Short> type, int company);

}
